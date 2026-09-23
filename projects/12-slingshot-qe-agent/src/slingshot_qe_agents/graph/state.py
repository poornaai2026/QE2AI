"""Central State Definition for SlingShot QE Agent."""

from typing import Annotated, Any, Dict, List, Literal, Optional
from pydantic import BaseModel, Field
from typing_extensions import TypedDict
from langchain_core.messages import BaseMessage
from langgraph.graph.message import add_messages


class TestScenario(BaseModel):
    """Structured Manual Test Scenario."""
    __test__ = False  # Inform pytest this is a data model, not a test suite
    id: str = Field(description="Unique scenario ID, e.g. TC-001")
    title: str = Field(description="Scenario summary")
    type: Literal["positive", "negative", "boundary", "security", "edge_case"] = "positive"
    description: str = Field(description="Detailed objective")
    preconditions: List[str] = Field(default_factory=list)
    steps: List[str] = Field(default_factory=list)
    expected_result: str = Field(description="Expected outcome or HTTP status code/UI state")
    tags: List[str] = Field(default_factory=list)


class DefectAnalysisReport(BaseModel):
    """Report generated after automated test execution."""
    summary: str = Field(description="Executive summary of execution and analysis")
    status: Literal["PASSED", "FAILED_AUTOMATION_SCRIPT", "FAILED_APPLICATION_DEFECT"] = "PASSED"
    total_tests: int = 0
    passed_tests: int = 0
    failed_tests: int = 0
    root_cause: Optional[str] = None
    affected_components: List[str] = Field(default_factory=list)
    recommended_fix: Optional[str] = None
    stack_trace_snippet: Optional[str] = None


class ExecutionResult(BaseModel):
    """Raw result of test execution."""
    runner: Literal["karate", "playwright", "mock_http"]
    success: bool
    exit_code: int = 0
    stdout: str = ""
    stderr: str = ""
    passed_count: int = 0
    failed_count: int = 0
    report_file_path: Optional[str] = None
    details: Dict[str, Any] = Field(default_factory=dict)


class QEAgentState(TypedDict):
    """Full state object passed across LangGraph nodes."""
    # Task metadata
    task_type: Literal["api", "ui"]
    requirement_source: Literal["jira", "confluence", "swagger", "nlp", "workspace"]
    raw_input: str
    
    # Ingestion & Context
    parsed_spec: Dict[str, Any]
    workspace_context: Dict[str, Any]
    is_new_requirement: bool
    
    # Test Generation
    manual_scenarios: List[Dict[str, Any]]
    suggested_changes: Optional[str]
    generated_code_files: Dict[str, str]  # relative_path -> code_content
    
    # Execution & Triage
    execution_result: Optional[Dict[str, Any]]
    defect_report: Optional[Dict[str, Any]]
    
    # Healing Loop
    healing_attempts: int
    max_healing_attempts: int
    healed_code_files: Dict[str, str]
    
    # HITL Governance
    hitl_checkpoint: Optional[str]
    human_feedback: Optional[str]
    approval_status: Literal["pending", "approved", "rejected", "modified"]
    
    # LangGraph message history
    messages: Annotated[List[BaseMessage], add_messages]
