"""Unit tests for State definitions and Pydantic models."""

import pytest
from slingshot_qe_agents.graph.state import (
    TestScenario,
    DefectAnalysisReport,
    ExecutionResult
)


def test_test_scenario_validation():
    scenario = TestScenario(
        id="TC-001",
        title="Valid order creation",
        type="positive",
        description="Submit order with valid items",
        expected_result="201 Created"
    )
    assert scenario.id == "TC-001"
    assert scenario.type == "positive"
    assert scenario.expected_result == "201 Created"


def test_defect_analysis_report():
    report = DefectAnalysisReport(
        summary="Selector failed to resolve in time",
        status="FAILED_AUTOMATION_SCRIPT",
        total_tests=5,
        passed_tests=4,
        failed_tests=1,
        root_cause="Timed out waiting for #submit-btn",
        recommended_fix="Update locator"
    )
    assert report.status == "FAILED_AUTOMATION_SCRIPT"
    assert report.failed_tests == 1


def test_execution_result():
    res = ExecutionResult(
        runner="karate",
        success=True,
        passed_count=3,
        failed_count=0,
        stdout="All scenarios passed"
    )
    assert res.success is True
    assert res.runner == "karate"
