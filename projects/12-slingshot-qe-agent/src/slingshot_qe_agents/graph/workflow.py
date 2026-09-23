"""LangGraph Workflow for SlingShot QE Agent with HITL Checkpoints and Self-Healing Loop."""

import os
from typing import Any, Dict, Literal, Optional
from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import MemorySaver
from langgraph.types import interrupt, Command
from langchain_core.messages import HumanMessage

from slingshot_qe_agents.graph.state import QEAgentState
from slingshot_qe_agents.agents.requirement_agent import RequirementAgent
from slingshot_qe_agents.agents.scenario_agent import ScenarioAgent
from slingshot_qe_agents.agents.code_gen_agent import CodeGenAgent
from slingshot_qe_agents.agents.rca_agent import RCAAgent
from slingshot_qe_agents.agents.healing_agent import HealingAgent
from slingshot_qe_agents.tools.workspace_tools import WorkspaceContextTool
from slingshot_qe_agents.tools.karate_runner import KarateRunnerTool
from slingshot_qe_agents.tools.playwright_runner import PlaywrightRunnerTool


def create_qe_graph(
    workspace_tool: Optional[WorkspaceContextTool] = None,
    enable_hitl: bool = True,
    checkpointer: Optional[Any] = None
):
    """Build and compile the SlingShot QE StateGraph."""
    ws_tool = workspace_tool or WorkspaceContextTool()
    req_agent = RequirementAgent(ws_tool)
    scenario_agent = ScenarioAgent()
    code_agent = CodeGenAgent(ws_tool)
    rca_agent = RCAAgent(ws_tool)
    healing_agent = HealingAgent(ws_tool)

    karate_runner = KarateRunnerTool(ws_tool.workspace_root)
    playwright_runner = PlaywrightRunnerTool(ws_tool.workspace_root)

    # ----------------- NODE DEFINITIONS -----------------

    def ingest_node(state: QEAgentState) -> Dict[str, Any]:
        """Node 1: Ingest requirement from Jira/Confluence/Swagger/NLP/Workspace."""
        return req_agent.process(state)

    def scenario_node(state: QEAgentState) -> Dict[str, Any]:
        """Node 2: Generate manual test scenarios."""
        if state.get("manual_scenarios"):
            return {
                "manual_scenarios": state["manual_scenarios"],
                "hitl_checkpoint": "scenario_approval",
                "approval_status": "pending",
                "messages": [HumanMessage(content=f"Using {len(state['manual_scenarios'])} pre-provided test scenarios.")]
            }
        return scenario_agent.process(state)

    def hitl_scenario_approval_node(state: QEAgentState) -> Dict[str, Any]:
        """Node 3 (HITL): Human reviews and approves test scenarios."""
        if not enable_hitl:
            return {"approval_status": "approved", "hitl_checkpoint": None}

        # Interrupt execution and wait for human review
        feedback_data = interrupt({
            "checkpoint": "scenario_approval",
            "prompt": "Review generated manual test scenarios. Approve or specify adjustments.",
            "data": state.get("manual_scenarios", [])
        })

        status = "approved"
        feedback = None
        if isinstance(feedback_data, dict):
            status = feedback_data.get("status", "approved")
            feedback = feedback_data.get("feedback")
        elif isinstance(feedback_data, str):
            status = "approved" if "approve" in feedback_data.lower() else "modified"
            feedback = feedback_data

        return {
            "approval_status": status,
            "human_feedback": feedback,
            "hitl_checkpoint": None,
            "messages": [HumanMessage(content=f"HITL Scenario Approval: {status}")]
        }

    def code_gen_node(state: QEAgentState) -> Dict[str, Any]:
        """Node 4: Synthesize test code and persist in workspace."""
        if state.get("generated_code_files"):
            for fname, content in state["generated_code_files"].items():
                ws_tool.write_file(fname, content)
            return {
                "generated_code_files": state["generated_code_files"],
                "hitl_checkpoint": "code_approval",
                "approval_status": "pending",
                "messages": [HumanMessage(content=f"Loaded {len(state['generated_code_files'])} test file(s) in workspace.")]
            }
        return code_agent.generate_new_code(state)

    def suggest_changes_node(state: QEAgentState) -> Dict[str, Any]:
        """Node 5: Suggest changes to existing test file in workspace."""
        return code_agent.modify_existing_code(state)

    def hitl_code_approval_node(state: QEAgentState) -> Dict[str, Any]:
        """Node 6 (HITL): Human reviews generated/updated test code."""
        if not enable_hitl:
            return {"approval_status": "approved", "hitl_checkpoint": None}

        feedback_data = interrupt({
            "checkpoint": "code_approval",
            "prompt": "Review generated test code before execution in workspace.",
            "data": state.get("generated_code_files", {})
        })

        status = "approved"
        feedback = None
        if isinstance(feedback_data, dict):
            status = feedback_data.get("status", "approved")
            feedback = feedback_data.get("feedback")
        elif isinstance(feedback_data, str):
            status = "approved" if "approve" in feedback_data.lower() else "modified"
            feedback = feedback_data

        return {
            "approval_status": status,
            "human_feedback": feedback,
            "hitl_checkpoint": None,
            "messages": [HumanMessage(content=f"HITL Code Approval: {status}")]
        }

    def execute_tests_node(state: QEAgentState) -> Dict[str, Any]:
        """Node 7: Run tests via Karate (API) or Playwright (UI)."""
        task_type = state.get("task_type", "api")
        code_files = state.get("generated_code_files", {})

        if not code_files:
            return {
                "execution_result": {
                    "runner": "karate" if task_type == "api" else "playwright",
                    "success": False,
                    "stderr": "No test files found in workspace to execute.",
                    "passed_count": 0,
                    "failed_count": 1
                }
            }

        target_file = list(code_files.keys())[0]

        if task_type == "api":
            result = karate_runner.run_tests(target_file)
        else:
            result = playwright_runner.run_tests(target_file)

        return {
            "execution_result": result.model_dump(),
            "messages": [HumanMessage(content=f"Test Execution Finished. Success: {result.success}, Passed: {result.passed_count}, Failed: {result.failed_count}")]
        }

    def defect_analysis_node(state: QEAgentState) -> Dict[str, Any]:
        """Node 8: Root Cause Analysis and Defect Classification."""
        return rca_agent.process(state)

    def self_healing_node(state: QEAgentState) -> Dict[str, Any]:
        """Node 9: Self-heal test code in workspace."""
        return healing_agent.process(state)

    def hitl_healing_approval_node(state: QEAgentState) -> Dict[str, Any]:
        """Node 10 (HITL): Human reviews self-healed test code."""
        if not enable_hitl:
            return {"approval_status": "approved", "hitl_checkpoint": None}

        feedback_data = interrupt({
            "checkpoint": "healing_approval",
            "prompt": "Review self-healed code changes before re-executing tests.",
            "data": state.get("healed_code_files", {})
        })

        status = "approved"
        feedback = None
        if isinstance(feedback_data, dict):
            status = feedback_data.get("status", "approved")
            feedback = feedback_data.get("feedback")
        elif isinstance(feedback_data, str):
            status = "approved" if "approve" in feedback_data.lower() else "modified"
            feedback = feedback_data

        return {
            "approval_status": status,
            "human_feedback": feedback,
            "hitl_checkpoint": None,
            "messages": [HumanMessage(content=f"HITL Healing Approval: {status}")]
        }

    # ----------------- CONDITIONAL ROUTING -----------------

    def route_after_ingestion(state: QEAgentState) -> str:
        """Route to scenario generation if new requirement, else modify existing test."""
        if state.get("is_new_requirement", True):
            return "generate_scenarios"
        return "suggest_changes"

    def route_after_scenario_approval(state: QEAgentState) -> str:
        """Proceed to code gen if approved, else stop."""
        if state.get("approval_status") == "rejected":
            return END
        return "generate_code"

    def route_after_code_approval(state: QEAgentState) -> str:
        """Proceed to test execution if approved, else stop."""
        if state.get("approval_status") == "rejected":
            return END
        return "execute_tests"

    def route_after_execution(state: QEAgentState) -> str:
        """If tests passed, finish. If failed, analyze defect."""
        exec_res = state.get("execution_result") or {}
        if exec_res.get("success", False):
            return END
        return "analyze_defect"

    def route_after_defect_analysis(state: QEAgentState) -> str:
        """If failure is due to automation code and under max attempts, route to self-healing."""
        defect = state.get("defect_report") or {}
        attempts = state.get("healing_attempts", 0)
        max_attempts = state.get("max_healing_attempts", 3)

        if defect.get("status") == "FAILED_AUTOMATION_SCRIPT" and attempts < max_attempts:
            return "self_heal_code"
        return END

    def route_after_healing_approval(state: QEAgentState) -> str:
        """If healed code approved, re-execute tests in loop, else end."""
        if state.get("approval_status") == "rejected":
            return END
        return "execute_tests"

    # ----------------- GRAPH COMPILATION -----------------

    builder = StateGraph(QEAgentState)

    # Add Nodes
    builder.add_node("ingest_requirements", ingest_node)
    builder.add_node("generate_scenarios", scenario_node)
    builder.add_node("hitl_scenario_approval", hitl_scenario_approval_node)
    builder.add_node("generate_code", code_gen_node)
    builder.add_node("suggest_changes", suggest_changes_node)
    builder.add_node("hitl_code_approval", hitl_code_approval_node)
    builder.add_node("execute_tests", execute_tests_node)
    builder.add_node("analyze_defect", defect_analysis_node)
    builder.add_node("self_heal_code", self_healing_node)
    builder.add_node("hitl_healing_approval", hitl_healing_approval_node)

    # Add Edges
    builder.add_edge(START, "ingest_requirements")
    builder.add_conditional_edges(
        "ingest_requirements",
        route_after_ingestion,
        {"generate_scenarios": "generate_scenarios", "suggest_changes": "suggest_changes"}
    )

    # New requirement flow
    builder.add_edge("generate_scenarios", "hitl_scenario_approval")
    builder.add_conditional_edges(
        "hitl_scenario_approval",
        route_after_scenario_approval,
        {"generate_code": "generate_code", END: END}
    )
    builder.add_edge("generate_code", "hitl_code_approval")

    # Existing requirement flow
    builder.add_edge("suggest_changes", "hitl_code_approval")

    # Code approval -> Execution
    builder.add_conditional_edges(
        "hitl_code_approval",
        route_after_code_approval,
        {"execute_tests": "execute_tests", END: END}
    )

    # Execution -> Defect Analysis or End
    builder.add_conditional_edges(
        "execute_tests",
        route_after_execution,
        {"analyze_defect": "analyze_defect", END: END}
    )

    # Defect Analysis -> Self-Healing or End
    builder.add_conditional_edges(
        "analyze_defect",
        route_after_defect_analysis,
        {"self_heal_code": "self_heal_code", END: END}
    )

    # Self-Healing -> HITL Approval -> Loop back to Execution
    builder.add_edge("self_heal_code", "hitl_healing_approval")
    builder.add_conditional_edges(
        "hitl_healing_approval",
        route_after_healing_approval,
        {"execute_tests": "execute_tests", END: END}
    )

    # Compile with checkpointer
    saver = checkpointer if checkpointer is not None else MemorySaver()
    return builder.compile(checkpointer=saver)
