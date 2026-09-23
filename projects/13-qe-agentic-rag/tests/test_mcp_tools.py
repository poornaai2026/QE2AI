"""Unit tests for standardized FastMCP tool endpoints."""

import pytest
from app.mcp.server import (
    get_requirement,
    search_knowledge,
    create_test_case,
    generate_playwright_test,
    create_defect
)

def test_mcp_get_requirement():
    """Verify get_requirement retrieves Jira ticket details."""
    res = get_requirement("AUTH-101")
    assert "ticket_id" in res
    assert res["ticket_id"] == "AUTH-101"
    assert len(res["acceptance_criteria"]) >= 5

def test_mcp_search_knowledge():
    """Verify search_knowledge performs RAG semantic search."""
    results = search_knowledge("authentication error codes OWASP", top_k=2)
    assert isinstance(results, list)
    assert len(results) > 0

def test_mcp_create_test_case():
    """Verify create_test_case stores a test case."""
    payload = {
        "id": "TC_MCP_01",
        "title": "MCP Tool Automated Test",
        "type": "Positive",
        "precondition": "Target active",
        "steps": ["Step 1", "Step 2"],
        "expected_result": "Success"
    }
    res = create_test_case("AUTH-101", payload)
    assert res["status"] == "CREATED"
    assert res["test_case_id"] == "TC_MCP_01"

def test_mcp_generate_playwright_test():
    """Verify generate_playwright_test renders test automation code."""
    res = generate_playwright_test("AUTH-101")
    assert res["status"] == "GENERATED"
    assert "test_auth_101.py" in res["file_path"]

def test_mcp_create_defect():
    """Verify create_defect registers an enterprise defect with root cause analysis."""
    failure = {
        "error_type": "TimeoutError",
        "test_case": "test_tc001",
        "category": "LOCATOR_DRIFT",
        "root_cause": "Button selector changed from button[type=submit] to data-testid.",
        "suggested_fix": "Update locator to [data-testid='button-login']",
        "failed_locator": "button[type='submit']"
    }
    defect = create_defect("AUTH-101", failure)
    assert "defect_id" in defect
    assert defect["linked_requirement"] == "AUTH-101"
    assert defect["category"] == "LOCATOR_DRIFT"
    assert defect["status"] == "Open"
