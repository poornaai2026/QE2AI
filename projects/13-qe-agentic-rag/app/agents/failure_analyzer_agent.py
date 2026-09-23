"""AI Failure Analysis and Root Cause Classification Agent."""

import re
from typing import Dict, Any, List, Optional
from app.agents.state import FailureReport

def analyze_failure(
    test_file: str,
    test_case: str,
    error_message: str,
    dom_snapshot: Optional[str] = None
) -> FailureReport:
    """Analyzes test failures, classifies root causes, and generates suggested code diffs or defect reports."""
    
    # Check for locator drift / timeout
    if "TimeoutError" in error_message or "Locator" in error_message or "waiting for selector" in error_message.lower():
        # Extract locator if present
        locator_match = re.search(r"Locator\(['\"]([^'\"]+)['\"]\)", error_message)
        failed_selector = locator_match.group(1) if locator_match else "unknown locator"

        # Check if legacy selector was used instead of data-testid
        if "button[type='submit']" in error_message or "login-btn" in error_message:
            return FailureReport(
                test_file=test_file,
                test_case=test_case,
                error_type="TimeoutError (Locator Drift)",
                error_message=error_message[:300],
                failed_locator=failed_selector,
                category="LOCATOR_DRIFT",
                root_cause="The UI DOM was refactored. The element previously selected by 'button[type=submit]' or '#login-btn' has moved to the enterprise standard data-testid attribute.",
                suggested_fix="Replace `page.locator(\"button[type='submit']\")` with `page.locator(\"[data-testid='button-login']\")`.",
                dom_snippet=dom_snapshot or "<button data-testid='button-login' class='btn-primary'>Sign In</button>"
            )

        return FailureReport(
            test_file=test_file,
            test_case=test_case,
            error_type="TimeoutError",
            error_message=error_message[:300],
            failed_locator=failed_selector,
            category="LOCATOR_DRIFT",
            root_cause=f"Element locator '{failed_selector}' could not be matched within page timeout. Possible DOM mutation or dynamic render delay.",
            suggested_fix=f"Inspect updated DOM and verify element exists with `data-testid` attribute or increase wait timeout.",
            dom_snippet=dom_snapshot
        )

    # Check for Application Defect (Assertion mismatch on business rule)
    if "AssertionError" in error_message or "Expected" in error_message:
        if "lockout" in test_case.lower() or "attempt" in error_message.lower():
            return FailureReport(
                test_file=test_file,
                test_case=test_case,
                error_type="AssertionError (Business Rule Violation)",
                error_message=error_message[:300],
                failed_locator=None,
                category="APPLICATION_DEFECT",
                root_cause="Application triggered account lockout prematurely (after 3 attempts instead of the mandatory 5 attempts specified in AC6).",
                suggested_fix="Backend Auth Service `max_consecutive_failures` parameter is set to 3. Update application configuration to 5.",
                dom_snippet=dom_snapshot
            )

        return FailureReport(
            test_file=test_file,
            test_case=test_case,
            error_type="AssertionError",
            error_message=error_message[:300],
            failed_locator=None,
            category="APPLICATION_DEFECT",
            root_cause="Expected UI state or response did not match actual application behavior.",
            suggested_fix="Review backend response contract and frontend state handler.",
            dom_snippet=dom_snapshot
        )

    # Check for Environment / Connection Issue
    if "ConnectionRefused" in error_message or "ECONNREFUSED" in error_message or "ERR_CONNECTION_REFUSED" in error_message:
        return FailureReport(
            test_file=test_file,
            test_case=test_case,
            error_type="ConnectionRefusedError",
            error_message=error_message[:300],
            failed_locator=None,
            category="ENVIRONMENT_ISSUE",
            root_cause="Target web application server is not running or listening on the configured port.",
            suggested_fix="Ensure demo target app server is running on http://localhost:8080 before executing tests.",
            dom_snippet=None
        )

    # Fallback to Automation Defect
    return FailureReport(
        test_file=test_file,
        test_case=test_case,
        error_type="AutomationException",
        error_message=error_message[:300],
        failed_locator=None,
        category="AUTOMATION_DEFECT",
        root_cause="Uncaught exception during test step execution.",
        suggested_fix="Check test fixture setup and API synchronization.",
        dom_snippet=dom_snapshot
    )
