"""FastMCP Server providing standardized Tool Integration for Agentic QE workflows."""

import json
from pathlib import Path
from typing import Dict, Any, List, Optional
from fastmcp import FastMCP

from app.config import settings
from app.rag.vector_store import get_vector_store
from app.test_runner.executor import run_test_suite
from app.agents.failure_analyzer_agent import analyze_failure

mcp_server = FastMCP(
    name="Agentic-QE-ToolServer"
)

# Mock in-memory test case and defect store
_TEST_CASE_STORE: Dict[str, List[Dict[str, Any]]] = {}
_DEFECT_STORE: List[Dict[str, Any]] = []

@mcp_server.tool()
def get_requirement(ticket_id: str) -> Dict[str, Any]:
    """Retrieves requirement details, priority, and acceptance criteria from Jira."""
    jira_file = settings.DATA_DIR / "jira_sample.json"
    if not jira_file.exists():
        return {"error": "Jira database not found", "ticket_id": ticket_id}

    with open(jira_file, "r", encoding="utf-8") as f:
        data = json.load(f)

    for ticket in data.get("tickets", []):
        if ticket["id"].upper() == ticket_id.upper():
            return {
                "ticket_id": ticket["id"],
                "summary": ticket["summary"],
                "description": ticket["description"],
                "acceptance_criteria": ticket["acceptance_criteria"],
                "component": ticket.get("component"),
                "status": ticket.get("status")
            }
    return {"error": f"Ticket '{ticket_id}' not found in Jira repository."}


@mcp_server.tool()
def search_knowledge(query: str, top_k: int = 3) -> List[Dict[str, Any]]:
    """Performs semantic search across Confluence enterprise documentation and policies via RAG."""
    vector_store = get_vector_store()
    results = vector_store.similarity_search(query, k=top_k)
    return [
        {
            "content": r["content"],
            "source": r.get("source"),
            "title": r.get("metadata", {}).get("title")
        }
        for r in results
    ]


@mcp_server.tool()
def create_test_case(ticket_id: str, test_case_data: Dict[str, Any]) -> Dict[str, Any]:
    """Registers a validated test case under the specified Jira requirement."""
    if ticket_id not in _TEST_CASE_STORE:
        _TEST_CASE_STORE[ticket_id] = []
    _TEST_CASE_STORE[ticket_id].append(test_case_data)
    return {
        "status": "CREATED",
        "ticket_id": ticket_id,
        "test_case_id": test_case_data.get("id"),
        "total_cases_for_ticket": len(_TEST_CASE_STORE[ticket_id])
    }


@mcp_server.tool()
def generate_playwright_test(ticket_id: str) -> Dict[str, Any]:
    """Generates Playwright test automation script from stored test cases."""
    from app.agents.playwright_gen_agent import _render_playwright_script
    test_cases = _TEST_CASE_STORE.get(ticket_id, [])
    if not test_cases:
        # Load default suite if not yet in store
        from app.agents.test_gen_agent import _generate_deterministic_suite
        test_cases = _generate_deterministic_suite(ticket_id, [], [], regeneration_count=1)

    code = _render_playwright_script(ticket_id, test_cases)
    target_path = settings.TESTS_DIR / f"test_{ticket_id.lower().replace('-', '_')}.py"
    with open(target_path, "w", encoding="utf-8") as f:
        f.write(code)

    return {
        "status": "GENERATED",
        "file_path": str(target_path),
        "code_snippet": code[:400] + "\n..."
    }


@mcp_server.tool()
def execute_test(test_file: str) -> Dict[str, Any]:
    """Executes the Playwright test suite using pytest and captures execution metrics."""
    return run_test_suite(test_file)


@mcp_server.tool()
def get_test_result(execution_id: str) -> Dict[str, Any]:
    """Retrieves test execution results, logs, and failure status by execution ID."""
    report_file = settings.REPORTS_DIR / f"{execution_id}.json"
    if report_file.exists():
        with open(report_file, "r", encoding="utf-8") as f:
            return json.load(f)
    return {"error": f"Execution report '{execution_id}' not found."}


@mcp_server.tool()
def create_defect(ticket_id: str, failure_report: Dict[str, Any]) -> Dict[str, Any]:
    """Automatically files an enterprise defect in Jira with root-cause analysis and DOM context."""
    defect_id = f"BUG-{1000 + len(_DEFECT_STORE) + 1}"
    defect_record = {
        "defect_id": defect_id,
        "linked_requirement": ticket_id,
        "summary": f"[AI Root Cause] {failure_report.get('error_type')}: {failure_report.get('test_case')}",
        "category": failure_report.get("category"),
        "root_cause": failure_report.get("root_cause"),
        "suggested_fix": failure_report.get("suggested_fix"),
        "failed_locator": failure_report.get("failed_locator"),
        "severity": "Critical" if failure_report.get("category") == "APPLICATION_DEFECT" else "Medium",
        "status": "Open",
        "created_by": "Agentic-QE-FailureAnalyzer"
    }
    _DEFECT_STORE.append(defect_record)
    return defect_record


@mcp_server.tool()
def generate_synthetic_test_data(ticket_id: str) -> Dict[str, Any]:
    """Generates PII-safe synthetic test fixtures, boundary values, and security fuzz payloads."""
    from app.agents.synthetic_data_agent import generate_synthetic_fixtures
    jira_data = get_requirement(ticket_id)
    acs = jira_data.get("acceptance_criteria", []) if isinstance(jira_data, dict) else []
    summary = jira_data.get("summary", "") if isinstance(jira_data, dict) else ""
    return generate_synthetic_fixtures(ticket_id, acs, summary)


@mcp_server.tool()
def apply_healed_patch(file_path: str, old_locator: str, new_locator: str) -> Dict[str, Any]:
    """Applies a verified locator code patch directly to the target Playwright script."""
    from app.gitops.patch_engine import apply_locator_patch
    return apply_locator_patch(file_path, old_locator, new_locator)


@mcp_server.tool()
def create_github_pull_request(
    ticket_id: str,
    file_path: str,
    old_locator: str,
    new_locator: str,
    root_cause: str = "LOCATOR_DRIFT"
) -> Dict[str, Any]:
    """Generates an enterprise GitOps Pull Request specification ready for merge into trunk/main."""
    from app.gitops.patch_engine import create_pull_request
    return create_pull_request(ticket_id, file_path, old_locator, new_locator, root_cause)


if __name__ == "__main__":
    print(f"Starting MCP Server on port {settings.MCP_SERVER_PORT}...")
    mcp_server.run(transport="sse")

