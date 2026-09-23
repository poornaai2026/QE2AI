"""Unit tests for AI Failure Analysis and Root Cause Classification."""

import pytest
from app.agents.failure_analyzer_agent import analyze_failure

def test_locator_drift_classification():
    """Verify locator drift diagnosis and suggested selector fix."""
    error = (
        "playwright._impl._errors.TimeoutError: Locator('button[type=submit]') was not found.\n"
        "Call log:\n"
        "  - waiting for locator(\"button[type='submit']\")\n"
        "  - locator resolved to 0 elements."
    )
    report = analyze_failure(
        test_file="test_auth_101.py",
        test_case="test_tc001_login_valid_credentials",
        error_message=error
    )
    assert report.category == "LOCATOR_DRIFT"
    assert "data-testid='button-login'" in report.suggested_fix
    assert "button" in report.failed_locator and "submit" in report.failed_locator

def test_application_defect_classification():
    """Verify business rule violation diagnosis when lockout fails prematurely."""
    error = "AssertionError: Expected account lockout on attempt 5, but account locked after attempt 3."
    report = analyze_failure(
        test_file="test_auth_101.py",
        test_case="test_tc006_account_lockout",
        error_message=error
    )
    assert report.category == "APPLICATION_DEFECT"
    assert "prematurely" in report.root_cause
    assert "5" in report.suggested_fix

def test_environment_issue_classification():
    """Verify connection refused is diagnosed as an environment issue."""
    error = "urllib3.exceptions.MaxRetryError: ConnectionRefusedError(10061, 'No connection could be made because the target machine actively refused it')"
    report = analyze_failure(
        test_file="test_auth_101.py",
        test_case="test_tc001",
        error_message=error
    )
    assert report.category == "ENVIRONMENT_ISSUE"
    assert "8080" in report.suggested_fix
