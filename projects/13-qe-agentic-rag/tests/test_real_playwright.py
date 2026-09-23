"""End-to-end integration test: Launches target app and executes Playwright tests."""

import time
import threading
import uvicorn
import pytest
from app.config import settings
from app.test_runner.executor import run_test_suite
from app.target_app.server import target_app

def run_server():
    uvicorn.run(target_app, host="127.0.0.1", port=settings.TARGET_APP_PORT, log_level="warning")

def test_e2e_playwright_execution_against_target_app():
    """Starts target app server, generates tests, and runs them with Playwright."""
    # Start target app server in background
    thread = threading.Thread(target=run_server, daemon=True)
    thread.start()
    time.sleep(1.5)

    # Run test suite
    result = run_test_suite(bug_mode=False)
    assert result["total"] == 6
    assert result["passed_count"] == 6
    assert result["passed"] is True

def test_e2e_playwright_failure_analysis_on_bug():
    """Tests bug mode where locator drift occurs and AI failure analyzer diagnoses it."""
    result = run_test_suite(bug_mode=True, enable_active_healing=False)
    assert result["passed"] is False
    assert len(result["failures"]) > 0
    failure = result["failures"][0]
    assert failure["category"] == "LOCATOR_DRIFT"
    assert "data-testid='button-login'" in failure["suggested_fix"]
