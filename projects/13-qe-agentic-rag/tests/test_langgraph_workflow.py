"""Unit tests for LangGraph state machine, AI validation self-healing loop, and quality gates."""

import pytest
from app.agents.graph import qe_graph
from app.agents.state import QEWorkflowState

def test_langgraph_full_workflow_execution():
    """Verify that the LangGraph workflow executes end-to-end and resolves self-healing loop."""
    initial_state: QEWorkflowState = {
        "ticket_id": "AUTH-101",
        "requirement_summary": "Customer Authentication & Account Security Lockout",
        "requirement_description": "As a customer, I want to login using my email and password.",
        "acceptance_criteria": [
            "AC1: Valid credentials should login successfully and redirect to dashboard.",
            "AC2: Invalid password should display an error message: 'Invalid email or password'.",
            "AC3: Empty email should display validation message: 'Email is required'.",
            "AC4: Empty password should display validation message: 'Password is required'.",
            "AC5: Invalid email format should display validation message: 'Please enter a valid email address'.",
            "AC6: Account should lock after 5 consecutive failed attempts with message: 'Account locked due to 5 failed attempts. Please contact support.'"
        ],
        "retrieved_context": [],
        "test_cases": [],
        "validation": None,
        "regeneration_count": 0,
        "ragas_metrics": None,
        "quality_gate_passed": False,
        "playwright_code": None,
        "execution_results": None,
        "failure_reports": [],
        "agent_logs": []
    }

    final_state = qe_graph.invoke(initial_state)

    # 1. Test cases generated
    assert len(final_state["test_cases"]) == 6, "Expected 6 test cases for AUTH-101"

    # 2. Validation passed after self-healing loop
    assert final_state["validation"] is not None
    assert final_state["validation"]["passed"] is True, "Expected final validation to be PASS"
    assert final_state["validation"]["coverage_score"] == 1.0, "Expected 100% requirement coverage"

    # 3. Verify self-healing loop was traversed
    assert final_state["regeneration_count"] > 0, "Expected regeneration loop to have executed"

    # 4. Ragas metrics and quality gate passed
    assert final_state["ragas_metrics"] is not None
    assert final_state["ragas_metrics"]["faithfulness"] >= 0.85
    assert final_state["ragas_metrics"]["answer_relevance"] >= 0.85
    assert final_state["quality_gate_passed"] is True

    # 5. Playwright code generated
    assert final_state["playwright_code"] is not None
    assert "test_tc001_login_valid_credentials" in final_state["playwright_code"]
    assert "test_tc006_account_lockout" in final_state["playwright_code"]

    # 6. Enterprise Telemetry & Approval Status
    assert final_state.get("approval_status") == "APPROVED"
    assert "Tier" in final_state.get("model_tier_used", "")
    assert final_state.get("telemetry") is not None
    assert "cost_savings_percentage" in final_state["telemetry"]
