"""Production FastAPI Service for SlingShot QE Agent.
Provides REST and WebSocket endpoints for distributed CI/CD and Webhook integration.
"""

import os
import uuid
from typing import Any, Dict, Literal, Optional
from pydantic import BaseModel, Field
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from langgraph.checkpoint.memory import MemorySaver
from langgraph.types import Command

from slingshot_qe_agents.graph.workflow import create_qe_graph
from slingshot_qe_agents.graph.state import QEAgentState

app = FastAPI(
    title="SlingShot QE Agent Platform API",
    version="1.0.0",
    description="Enterprise API to trigger, monitor, and resume autonomous QE Agent runs"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In production, swap MemorySaver with PostgresSaver.from_conn_string(os.getenv("DATABASE_URL"))
shared_checkpointer = MemorySaver()
qe_graph = create_qe_graph(enable_hitl=True, checkpointer=shared_checkpointer)


class StartRunRequest(BaseModel):
    task_type: Literal["api", "ui"] = "api"
    source: Literal["swagger", "jira", "confluence", "nlp"] = "swagger"
    input_value: str = Field(description="Swagger file/URL, Jira Issue Key, or prompt")
    max_healing_attempts: int = 3
    metadata: Dict[str, Any] = Field(default_factory=dict)


class ResumeRunRequest(BaseModel):
    action: Literal["approve", "reject", "modify"] = "approve"
    feedback: Optional[str] = None


class RunStatusResponse(BaseModel):
    thread_id: str
    status: Literal["RUNNING", "WAITING_FOR_HITL", "COMPLETED", "FAILED"]
    active_checkpoint: Optional[str] = None
    checkpoint_data: Optional[Any] = None
    execution_result: Optional[Dict[str, Any]] = None
    defect_report: Optional[Dict[str, Any]] = None
    healing_attempts: int = 0


@app.post("/api/v1/runs", response_model=RunStatusResponse)
async def start_run(req: StartRunRequest):
    """Trigger a new autonomous QE run."""
    thread_id = str(uuid.uuid4())
    config = {"configurable": {"thread_id": thread_id}}

    initial_state: QEAgentState = {
        "task_type": req.task_type,
        "requirement_source": req.source,
        "raw_input": req.input_value,
        "parsed_spec": {},
        "workspace_context": {},
        "is_new_requirement": True,
        "manual_scenarios": [],
        "suggested_changes": None,
        "generated_code_files": {},
        "execution_result": None,
        "defect_report": None,
        "healing_attempts": 0,
        "max_healing_attempts": req.max_healing_attempts,
        "healed_code_files": {},
        "hitl_checkpoint": None,
        "human_feedback": None,
        "approval_status": "pending",
        "messages": []
    }

    # Execute graph until first interrupt or completion
    qe_graph.invoke(initial_state, config=config)
    return _build_status_response(thread_id, config)


@app.get("/api/v1/runs/{thread_id}", response_model=RunStatusResponse)
async def get_run_status(thread_id: str):
    """Check current state, pending approvals, and test results for a run."""
    config = {"configurable": {"thread_id": thread_id}}
    return _build_status_response(thread_id, config)


@app.post("/api/v1/runs/{thread_id}/resume", response_model=RunStatusResponse)
async def resume_run(thread_id: str, req: ResumeRunRequest):
    """Submit human review decision (approve/reject/modify) to resume execution."""
    config = {"configurable": {"thread_id": thread_id}}
    state_snapshot = qe_graph.get_state(config)

    if not state_snapshot or not state_snapshot.tasks:
        raise HTTPException(status_code=400, detail="No active HITL interrupt awaiting approval for this thread.")

    # Resume graph execution with human response
    qe_graph.invoke(
        Command(resume={"status": req.action, "feedback": req.feedback}),
        config=config
    )

    return _build_status_response(thread_id, config)


def _build_status_response(thread_id: str, config: dict) -> RunStatusResponse:
    """Helper to inspect LangGraph thread snapshot and build standardized response."""
    state_snapshot = qe_graph.get_state(config)
    if not state_snapshot:
        raise HTTPException(status_code=404, detail="Run not found.")

    state_values = state_snapshot.values or {}

    # Check if awaiting interrupt
    interrupt_task = state_snapshot.tasks[0] if state_snapshot.tasks else None
    if interrupt_task and interrupt_task.interrupts:
        interrupt_payload = interrupt_task.interrupts[0].value
        return RunStatusResponse(
            thread_id=thread_id,
            status="WAITING_FOR_HITL",
            active_checkpoint=interrupt_payload.get("checkpoint"),
            checkpoint_data=interrupt_payload.get("data"),
            execution_result=state_values.get("execution_result"),
            defect_report=state_values.get("defect_report"),
            healing_attempts=state_values.get("healing_attempts", 0)
        )

    # Check if completed
    if not state_snapshot.next:
        return RunStatusResponse(
            thread_id=thread_id,
            status="COMPLETED",
            execution_result=state_values.get("execution_result"),
            defect_report=state_values.get("defect_report"),
            healing_attempts=state_values.get("healing_attempts", 0)
        )

    return RunStatusResponse(
        thread_id=thread_id,
        status="RUNNING",
        execution_result=state_values.get("execution_result"),
        defect_report=state_values.get("defect_report"),
        healing_attempts=state_values.get("healing_attempts", 0)
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api_server:app", host="0.0.0.0", port=8000, reload=True)
