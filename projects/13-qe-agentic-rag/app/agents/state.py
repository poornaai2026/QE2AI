"""Typed state definitions for the LangGraph Agentic QE Workflow."""

from typing import List, Dict, Any, Optional, TypedDict
from pydantic import BaseModel, Field

class TestCase(BaseModel):
    id: str = Field(description="Unique Test Case ID e.g. TC001")
    title: str = Field(description="Descriptive scenario title")
    type: str = Field(description="Category: Positive, Negative, Boundary, Security")
    precondition: str = Field(description="System state required before test execution")
    steps: List[str] = Field(description="Ordered list of execution steps")
    test_data: Dict[str, Any] = Field(default_factory=dict, description="Test input data")
    expected_result: str = Field(description="Expected outcome or assertion")
    ac_traceability: str = Field(description="Associated Acceptance Criteria ID e.g. AC1, AC6")

class ValidationIssue(BaseModel):
    code: str = Field(description="Issue category code e.g. HALLUCINATION, COVERAGE_GAP, CONTRADICTION")
    severity: str = Field(description="CRITICAL, MAJOR, MINOR")
    message: str = Field(description="Specific feedback detailing why the test case failed")
    affected_test_case: Optional[str] = None

class ValidationResult(BaseModel):
    passed: bool
    coverage_score: float = Field(ge=0.0, le=1.0)
    hallucination_detected: bool
    critique: str
    issues: List[ValidationIssue] = Field(default_factory=list)

class RagasEvaluation(BaseModel):
    faithfulness: float = Field(ge=0.0, le=1.0)
    answer_relevance: float = Field(ge=0.0, le=1.0)
    context_precision: float = Field(ge=0.0, le=1.0)
    context_recall: float = Field(ge=0.0, le=1.0)
    average_score: float = Field(ge=0.0, le=1.0)
    gate_passed: bool

class FailureReport(BaseModel):
    test_file: str
    test_case: str
    error_type: str
    error_message: str
    failed_locator: Optional[str] = None
    category: str = Field(description="LOCATOR_DRIFT, APPLICATION_DEFECT, AUTOMATION_DEFECT, TEST_DATA_ISSUE, ENVIRONMENT_ISSUE")
    root_cause: str
    suggested_fix: str
    dom_snippet: Optional[str] = None

class QEWorkflowState(TypedDict):
    ticket_id: str
    requirement_summary: str
    requirement_description: str
    acceptance_criteria: List[str]
    retrieved_context: List[Dict[str, Any]]
    test_cases: List[Dict[str, Any]]
    validation: Optional[Dict[str, Any]]
    regeneration_count: int
    ragas_metrics: Optional[Dict[str, Any]]
    quality_gate_passed: bool
    playwright_code: Optional[str]
    execution_results: Optional[Dict[str, Any]]
    failure_reports: List[Dict[str, Any]]
    approval_status: str
    model_tier_used: str
    telemetry: Optional[Dict[str, Any]]
    synthetic_fixtures: Optional[Dict[str, Any]]
    agent_logs: List[str]
