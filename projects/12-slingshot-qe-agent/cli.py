"""Interactive CLI Harness for SlingShot QE Agent with Rich Terminal UI."""

import os
import sys
import uuid
from typing import Any, Dict
import typer
from rich.console import Console
from rich.panel import Panel
from rich.table import Table
from rich.syntax import Syntax
from rich.prompt import Prompt, Confirm
from langgraph.types import Command
from langgraph.checkpoint.memory import MemorySaver

from slingshot_qe_agents.graph.workflow import create_qe_graph
from slingshot_qe_agents.graph.state import QEAgentState

app = typer.Typer(help="SlingShot QE Autonomous Agent CLI")

# Reconfigure stdout/stderr for UTF-8 on Windows if supported
if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

console = Console(safe_box=True)


@app.command()
def run(
    task_type: str = typer.Option("api", "--type", "-t", help="Target test type: 'api' or 'ui'"),
    source: str = typer.Option("swagger", "--source", "-s", help="Requirement source: 'swagger', 'jira', 'confluence', 'nlp'"),
    input_val: str = typer.Option("", "--input", "-i", help="Raw input, ticket key, or file path"),
    auto_approve: bool = typer.Option(False, "--auto-approve", help="Run without pausing for HITL prompts (automated mode)"),
    max_healing: int = typer.Option(3, "--max-healing", help="Max self-healing loop attempts")
):
    """Execute SlingShot QE Agent with LangGraph state machine & HITL governance."""
    console.print(Panel.fit(
        "[bold cyan]SlingShot Autonomous Quality Engineering Agent[/bold cyan]\n"
        "[dim]API & UI Test Generation, Execution, RCA & Self-Healing[/dim]",
        border_style="cyan"
    ))

    # Determine input value defaults
    if not input_val:
        if source == "swagger":
            input_val = "examples/sample_swagger.json"
        elif source == "jira":
            input_val = "SLING-101"
        elif source == "confluence":
            input_val = "Checkout-Payment-Spec-V2"
        else:
            input_val = "Validate customer order creation endpoint with valid and invalid payloads"

    console.print(f"[bold green]> Task Type:[/bold green] {task_type.upper()}")
    console.print(f"[bold green]> Requirement Source:[/bold green] {source.upper()}")
    console.print(f"[bold green]> Input / Target:[/bold green] {input_val}\n")

    # Initial state
    initial_state: QEAgentState = {
        "task_type": task_type.lower(),
        "requirement_source": source.lower(),
        "raw_input": input_val,
        "parsed_spec": {},
        "workspace_context": {},
        "is_new_requirement": True,
        "manual_scenarios": [],
        "suggested_changes": None,
        "generated_code_files": {},
        "execution_result": None,
        "defect_report": None,
        "healing_attempts": 0,
        "max_healing_attempts": max_healing,
        "healed_code_files": {},
        "hitl_checkpoint": None,
        "human_feedback": None,
        "approval_status": "pending",
        "messages": []
    }

    # Setup graph with memory checkpointer
    checkpointer = MemorySaver()
    graph = create_qe_graph(enable_hitl=not auto_approve, checkpointer=checkpointer)
    thread_id = str(uuid.uuid4())
    config = {"configurable": {"thread_id": thread_id}}

    console.print("[dim]Starting LangGraph execution pipeline...[/dim]")
    
    # Run loop to process graph until termination or interrupt
    current_input = initial_state

    while True:
        # Run step until interrupt or completion
        result = graph.invoke(current_input, config=config)

        # Check if graph paused on interrupt
        state_snapshot = graph.get_state(config)

        if not state_snapshot.next:
            # Workflow completed!
            console.print("\n[bold green][OK] LangGraph Pipeline Completed Successfully![/bold green]")
            _render_final_summary(result)
            break

        # If there are tasks awaiting resume (interrupt)
        interrupt_task = state_snapshot.tasks[0] if state_snapshot.tasks else None
        if interrupt_task and interrupt_task.interrupts:
            interrupt_payload = interrupt_task.interrupts[0].value
            checkpoint_name = interrupt_payload.get("checkpoint", "unknown")
            console.print(f"\n[bold yellow][HITL] Checkpoint Reached: {checkpoint_name.upper()}[/bold yellow]")

            if checkpoint_name == "scenario_approval":
                scenarios = interrupt_payload.get("data", [])
                _display_scenarios(scenarios)
                action = Prompt.ask("Choose action", choices=["approve", "modify", "reject"], default="approve")
                feedback = None
                if action == "modify":
                    feedback = Prompt.ask("Enter feedback or modifications")

                # Resume graph execution with human response
                current_input = Command(resume={"status": action, "feedback": feedback})

            elif checkpoint_name == "code_approval":
                code_files = interrupt_payload.get("data", {})
                _display_code(code_files, task_type)
                action = Prompt.ask("Approve code for execution?", choices=["approve", "reject"], default="approve")
                current_input = Command(resume={"status": action})

            elif checkpoint_name == "healing_approval":
                healed_files = interrupt_payload.get("data", {})
                _display_healed_code(healed_files, task_type)
                action = Prompt.ask("Approve self-healed patch to re-run?", choices=["approve", "reject"], default="approve")
                current_input = Command(resume={"status": action})

            else:
                action = Prompt.ask(f"Approve {checkpoint_name}?", choices=["approve", "reject"], default="approve")
                current_input = Command(resume={"status": action})
        else:
            # No interrupt pending
            break


def _display_scenarios(scenarios: list):
    """Render scenarios table in console."""
    table = Table(title="Generated Manual Test Scenarios", show_header=True, header_style="bold magenta")
    table.add_column("ID", style="cyan", width=12)
    table.add_column("Title", style="bold white", width=36)
    table.add_column("Type", style="yellow", width=12)
    table.add_column("Expected Result", style="green")

    for sc in scenarios:
        table.add_row(
            sc.get("id", "TC"),
            sc.get("title", ""),
            sc.get("type", "positive"),
            sc.get("expected_result", "")
        )
    console.print(table)


def _display_code(code_files: dict, task_type: str):
    """Render generated code files."""
    for filename, content in code_files.items():
        lang = "gherkin" if filename.endswith(".feature") else "python"
        console.print(Panel(
            Syntax(content, lang, theme="monokai", line_numbers=True),
            title=f"[bold green]Saved to Workspace: {filename}[/bold green]"
        ))


def _display_healed_code(code_files: dict, task_type: str):
    """Render self-healed code files."""
    for filename, content in code_files.items():
        lang = "gherkin" if filename.endswith(".feature") else "python"
        console.print(Panel(
            Syntax(content, lang, theme="monokai", line_numbers=True),
            title=f"[bold yellow]Self-Healed Patch for: {filename}[/bold yellow]"
        ))


def _render_final_summary(result: dict):
    """Display final execution status and defect report."""
    exec_res = result.get("execution_result") or {}
    defect_rep = result.get("defect_report") or {}
    healing_attempts = result.get("healing_attempts", 0)

    summary_table = Table(title="Execution Summary", show_header=True, header_style="bold cyan")
    summary_table.add_column("Metric", style="bold white")
    summary_table.add_column("Value", style="bold green")

    summary_table.add_row("Execution Status", "PASSED" if exec_res.get("success") else "FAILED")
    summary_table.add_row("Passed Scenarios", str(exec_res.get("passed_count", 0)))
    summary_table.add_row("Failed Scenarios", str(exec_res.get("failed_count", 0)))
    summary_table.add_row("Self-Healing Attempts", str(healing_attempts))

    if defect_rep:
        summary_table.add_row("Defect Classification", defect_rep.get("status", "N/A"))
        if "jira_ticket" in defect_rep:
            summary_table.add_row("Jira Defect Logged", defect_rep["jira_ticket"].get("key", "N/A"))

    console.print(summary_table)


if __name__ == "__main__":
    app()
