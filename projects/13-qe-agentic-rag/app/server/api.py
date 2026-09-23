"""FastAPI Backend Server orchestrating the Agentic QE Platform."""

import json
from pathlib import Path
from typing import Dict, Any, Optional
from fastapi import FastAPI, Request, BackgroundTasks
from fastapi.responses import HTMLResponse, JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from app.config import settings
from app.agents.graph import qe_graph
from app.agents.state import QEWorkflowState
from app.rag.vector_store import get_vector_store
from app.test_runner.executor import run_test_suite
from app.agents.failure_analyzer_agent import analyze_failure
from app.mcp.server import create_defect

app = FastAPI(
    title="AI-Powered Agentic Quality Engineering Platform",
    description="Enterprise LangGraph + RAG + MCP + Playwright QE Automation Platform",
    version="1.0.0"
)

STATIC_DIR = Path(__file__).parent / "static"
STATIC_DIR.mkdir(parents=True, exist_ok=True)
app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")

# In-memory latest pipeline state
_LATEST_PIPELINE_RUN: Dict[str, Any] = {}

class RunPipelineRequest(BaseModel):
    ticket_id: str = "AUTH-101"
    force_regeneration: bool = True

class ExecuteTestRequest(BaseModel):
    test_file: Optional[str] = None
    bug_mode: bool = False
    enable_active_healing: bool = True

class FailureAnalysisRequest(BaseModel):
    test_file: str
    test_case: str
    error_message: str
    dom_snapshot: Optional[str] = None

class CreateDefectRequest(BaseModel):
    ticket_id: str
    failure_report: Dict[str, Any]

class ApplyPatchRequest(BaseModel):
    file_path: str = "app/test_runner/generated_tests/test_auth_101.py"
    old_locator: str
    new_locator: str

class CreatePullRequestRequest(BaseModel):
    ticket_id: str = "AUTH-101"
    file_path: str = "app/test_runner/generated_tests/test_auth_101.py"
    old_locator: str
    new_locator: str
    root_cause: str = "LOCATOR_DRIFT"
    test_execution_passed: bool = True


class ApprovePipelineRequest(BaseModel):
    ticket_id: str
    reviewer: str = "Lead QA Architect"
    approval_notes: Optional[str] = "Acceptance criteria coverage verified."

@app.get("/", response_class=HTMLResponse)
async def serve_dashboard():
    index_file = STATIC_DIR / "index.html"
    if index_file.exists():
        return FileResponse(index_file)
    return HTMLResponse("<h1>Agentic QE Platform Dashboard is building...</h1>")


@app.get("/api/requirements")
async def list_requirements():
    """Lists available Jira requirements and acceptance criteria."""
    jira_file = settings.DATA_DIR / "jira_sample.json"
    if jira_file.exists():
        with open(jira_file, "r", encoding="utf-8") as f:
            return json.load(f)
    return {"tickets": []}


@app.get("/api/confluence")
async def list_confluence_docs():
    """Lists Confluence domain documentation indexed in RAG."""
    docs = []
    for f in settings.CONFLUENCE_DIR.glob("*.md"):
        with open(f, "r", encoding="utf-8") as file:
            content = file.read()
        docs.append({
            "filename": f.name,
            "title": f.stem.replace("_", " ").title(),
            "preview": content[:300] + "..."
        })
    return {"documents": docs}


@app.post("/api/pipeline/run")
async def run_pipeline(payload: RunPipelineRequest):
    """Executes the full LangGraph Agentic QE workflow with checkpointer and telemetry."""
    global _LATEST_PIPELINE_RUN

    # Load ticket details
    jira_file = settings.DATA_DIR / "jira_sample.json"
    target_ticket = None
    if jira_file.exists():
        with open(jira_file, "r", encoding="utf-8") as f:
            tickets = json.load(f).get("tickets", [])
            for t in tickets:
                if t["id"].upper() == payload.ticket_id.upper():
                    target_ticket = t
                    break

    if not target_ticket:
        return JSONResponse(status_code=404, content={"error": f"Ticket {payload.ticket_id} not found."})

    initial_state: QEWorkflowState = {
        "ticket_id": target_ticket["id"],
        "requirement_summary": target_ticket["summary"],
        "requirement_description": target_ticket["description"],
        "acceptance_criteria": target_ticket["acceptance_criteria"],
        "retrieved_context": [],
        "test_cases": [],
        "validation": None,
        "regeneration_count": 0,
        "ragas_metrics": None,
        "quality_gate_passed": False,
        "playwright_code": None,
        "execution_results": None,
        "failure_reports": [],
        "approval_status": "PENDING_QA_SIGN_OFF" if settings.HITL_ENABLED else "APPROVED",
        "model_tier_used": "Tier-1 Fast (Gemini 2.5 Flash / GPT-4o-mini)",
        "telemetry": None,
        "agent_logs": []
    }

    try:
        final_state = qe_graph.invoke(initial_state)
        _LATEST_PIPELINE_RUN = final_state
        return {
            "status": "COMPLETED",
            "ticket_id": final_state.get("ticket_id"),
            "test_cases_count": len(final_state.get("test_cases", [])),
            "validation": final_state.get("validation"),
            "ragas_metrics": final_state.get("ragas_metrics"),
            "quality_gate_passed": final_state.get("quality_gate_passed"),
            "approval_status": final_state.get("approval_status"),
            "model_tier_used": final_state.get("model_tier_used"),
            "telemetry": final_state.get("telemetry"),
            "playwright_code": final_state.get("playwright_code"),
            "agent_logs": final_state.get("agent_logs", []),
            "full_state": final_state
        }
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": f"Workflow failed: {str(e)}"})


@app.post("/api/pipeline/approve")
async def approve_pipeline(payload: ApprovePipelineRequest):
    """Human-in-the-Loop: QA Lead signs off on test suite, transitioning to automation."""
    global _LATEST_PIPELINE_RUN
    if not _LATEST_PIPELINE_RUN:
        return JSONResponse(status_code=400, content={"error": "No active pipeline execution to approve."})

    _LATEST_PIPELINE_RUN["approval_status"] = "APPROVED"
    logs = list(_LATEST_PIPELINE_RUN.get("agent_logs", []))
    logs.append(f"[HITL Gate] ✅ Test suite signed off by {payload.reviewer}. Notes: '{payload.approval_notes}'")
    _LATEST_PIPELINE_RUN["agent_logs"] = logs

    return {
        "status": "APPROVED",
        "ticket_id": payload.ticket_id,
        "reviewer": payload.reviewer,
        "approval_notes": payload.approval_notes
    }


@app.get("/api/pipeline/latest")
async def get_latest_pipeline():
    """Retrieves the latest execution state of the pipeline."""
    return _LATEST_PIPELINE_RUN if _LATEST_PIPELINE_RUN else {"status": "NO_RUN_YET"}


@app.get("/api/telemetry")
async def get_telemetry():
    """Retrieves model cascading economics and retrieval performance telemetry."""
    if _LATEST_PIPELINE_RUN and _LATEST_PIPELINE_RUN.get("telemetry"):
        return _LATEST_PIPELINE_RUN["telemetry"]
    from app.agents.model_cascade import ModelCascadeRouter
    return ModelCascadeRouter.compute_telemetry(test_case_count=6, retry_count=1, hybrid_matches=4)


@app.post("/api/tests/execute")
async def execute_playwright_tests(payload: ExecuteTestRequest):
    """Executes the Playwright test suite with optional active self-healing."""
    result = run_test_suite(
        test_file=payload.test_file,
        bug_mode=payload.bug_mode,
        enable_active_healing=payload.enable_active_healing
    )
    if _LATEST_PIPELINE_RUN:
        _LATEST_PIPELINE_RUN["execution_results"] = result
        _LATEST_PIPELINE_RUN["failure_reports"] = result.get("failures", [])
    return result


@app.post("/api/failure-analysis/analyze")
async def run_failure_analysis(payload: FailureAnalysisRequest):
    """Invokes AI Failure Analysis agent directly on arbitrary error logs."""
    report = analyze_failure(
        test_file=payload.test_file,
        test_case=payload.test_case,
        error_message=payload.error_message,
        dom_snapshot=payload.dom_snapshot
    )
    return report.model_dump()


@app.post("/api/mcp/create-defect")
async def api_create_defect(payload: CreateDefectRequest):
    """Files a Jira defect using the FastMCP tool implementation."""
    defect = create_defect(ticket_id=payload.ticket_id, failure_report=payload.failure_report)
    return defect


@app.get("/api/synthetic-data/{ticket_id}")
async def get_synthetic_data(ticket_id: str):
    """Retrieves synthetic test fixtures, boundary conditions, and fuzz payloads."""
    from app.agents.synthetic_data_agent import generate_synthetic_fixtures
    jira_file = settings.DATA_DIR / "jira_sample.json"
    acs = []
    summary = ""
    if jira_file.exists():
        with open(jira_file, "r", encoding="utf-8") as f:
            data = json.load(f)
            for t in data.get("tickets", []):
                if t["id"].upper() == ticket_id.upper():
                    acs = t.get("acceptance_criteria", [])
                    summary = t.get("summary", "")
                    break
    fixtures = generate_synthetic_fixtures(ticket_id, acs, summary)
    return fixtures


@app.post("/api/gitops/apply-patch")
async def api_apply_patch(payload: ApplyPatchRequest):
    """Applies a verified code fix directly to the Playwright test file."""
    from app.gitops.patch_engine import apply_locator_patch
    return apply_locator_patch(payload.file_path, payload.old_locator, payload.new_locator)


@app.post("/api/gitops/create-pr")
async def api_create_pull_request(payload: CreatePullRequestRequest):
    """Generates an enterprise GitOps Pull Request specification."""
    from app.gitops.patch_engine import create_pull_request
    return create_pull_request(
        ticket_id=payload.ticket_id,
        file_path=payload.file_path,
        old_locator=payload.old_locator,
        new_locator=payload.new_locator,
        root_cause=payload.root_cause,
        test_execution_passed=payload.test_execution_passed
    )


@app.get("/api/gitops/pull-requests")
async def api_list_pull_requests():
    """Lists all created GitOps pull requests."""
    from app.gitops.patch_engine import list_pull_requests
    return list_pull_requests()


@app.get("/api/quality-gate/golden-dataset")
async def get_golden_dataset():
    """Retrieves the curated golden evaluation benchmark dataset."""
    golden_file = settings.DATA_DIR / "golden_dataset.json"
    if golden_file.exists():
        with open(golden_file, "r", encoding="utf-8") as f:
            return json.load(f)
    return {"error": "Golden dataset not found."}


