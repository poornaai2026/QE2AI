"""Integration tests for LangGraph StateGraph workflow and HITL routing."""

import tempfile
import uuid
import pytest
from langgraph.checkpoint.memory import MemorySaver
from langgraph.types import Command

from slingshot_qe_agents.graph.workflow import create_qe_graph
from slingshot_qe_agents.graph.state import QEAgentState
from slingshot_qe_agents.tools.workspace_tools import WorkspaceContextTool


def test_graph_automated_flow():
    """Verify full end-to-end execution when HITL is disabled (automated CI/CD mode)."""
    with tempfile.TemporaryDirectory() as tmp_dir:
        ws_tool = WorkspaceContextTool(workspace_root=tmp_dir)
        checkpointer = MemorySaver()
        graph = create_qe_graph(workspace_tool=ws_tool, enable_hitl=False, checkpointer=checkpointer)

        initial_state: QEAgentState = {
            "task_type": "api",
            "requirement_source": "swagger",
            "raw_input": "examples/sample_swagger.json",
            "parsed_spec": {},
            "workspace_context": {},
            "is_new_requirement": True,
            "manual_scenarios": [],
            "suggested_changes": None,
            "generated_code_files": {},
            "execution_result": None,
            "defect_report": None,
            "healing_attempts": 0,
            "max_healing_attempts": 3,
            "healed_code_files": {},
            "hitl_checkpoint": None,
            "human_feedback": None,
            "approval_status": "pending",
            "messages": []
        }

        config = {"configurable": {"thread_id": str(uuid.uuid4())}}
        final_state = graph.invoke(initial_state, config=config)

        # Assertions
        assert len(final_state["manual_scenarios"]) > 0
        assert len(final_state["generated_code_files"]) > 0
        assert final_state["execution_result"] is not None
        assert final_state["execution_result"]["success"] is True
        assert ws_tool.list_existing_test_files() != []


def test_graph_self_healing_loop():
    """Verify that simulated test failures route through RCA and self-healing loop."""
    with tempfile.TemporaryDirectory() as tmp_dir:
        ws_tool = WorkspaceContextTool(workspace_root=tmp_dir)
        checkpointer = MemorySaver()
        graph = create_qe_graph(workspace_tool=ws_tool, enable_hitl=False, checkpointer=checkpointer)

        initial_state: QEAgentState = {
            "task_type": "api",
            "requirement_source": "nlp",
            "raw_input": "Validate API order with SIMULATE_FAIL",
            "parsed_spec": {},
            "workspace_context": {},
            "is_new_requirement": True,
            "manual_scenarios": [
                {
                    "id": "TC-FAIL-01",
                    "title": "Simulated failure test",
                    "type": "positive",
                    "description": "Step containing SIMULATE_FAIL",
                    "expected_result": "status 200"
                }
            ],
            "suggested_changes": None,
            "generated_code_files": {
                "broken.feature": "Feature: Broken\nScenario: Sim\n  Given path '/test'\n  Then SIMULATE_FAIL\n"
            },
            "execution_result": None,
            "defect_report": None,
            "healing_attempts": 0,
            "max_healing_attempts": 2,
            "healed_code_files": {},
            "hitl_checkpoint": None,
            "human_feedback": None,
            "approval_status": "pending",
            "messages": []
        }

        config = {"configurable": {"thread_id": str(uuid.uuid4())}}
        final_state = graph.invoke(initial_state, config=config)

        # After healing, it should have healed the code and re-executed
        assert final_state["defect_report"] is not None
        assert final_state["healing_attempts"] >= 1
        assert "SIMULATE_FAIL" not in final_state["generated_code_files"]["broken.feature"]


def test_graph_hitl_interrupt_and_resume():
    """Verify that graph halts at HITL checkpoint and resumes with Command(resume=...)."""
    with tempfile.TemporaryDirectory() as tmp_dir:
        ws_tool = WorkspaceContextTool(workspace_root=tmp_dir)
        checkpointer = MemorySaver()
        graph = create_qe_graph(workspace_tool=ws_tool, enable_hitl=True, checkpointer=checkpointer)

        initial_state: QEAgentState = {
            "task_type": "api",
            "requirement_source": "nlp",
            "raw_input": "Verify user authentication",
            "parsed_spec": {},
            "workspace_context": {},
            "is_new_requirement": True,
            "manual_scenarios": [],
            "suggested_changes": None,
            "generated_code_files": {},
            "execution_result": None,
            "defect_report": None,
            "healing_attempts": 0,
            "max_healing_attempts": 2,
            "healed_code_files": {},
            "hitl_checkpoint": None,
            "human_feedback": None,
            "approval_status": "pending",
            "messages": []
        }

        config = {"configurable": {"thread_id": str(uuid.uuid4())}}

        # First run: should halt at hitl_scenario_approval
        graph.invoke(initial_state, config=config)
        state_snap = graph.get_state(config)
        assert len(state_snap.tasks) > 0
        assert len(state_snap.tasks[0].interrupts) > 0
        assert state_snap.tasks[0].interrupts[0].value["checkpoint"] == "scenario_approval"

        # Resume with human approval
        graph.invoke(Command(resume={"status": "approved"}), config=config)

        # Second halt: should halt at hitl_code_approval
        state_snap2 = graph.get_state(config)
        assert len(state_snap2.tasks) > 0
        assert len(state_snap2.tasks[0].interrupts) > 0
        assert state_snap2.tasks[0].interrupts[0].value["checkpoint"] == "code_approval"

        # Resume with code approval
        final_state = graph.invoke(Command(resume={"status": "approved"}), config=config)

        # Should proceed to execution and finish
        assert final_state["execution_result"] is not None
