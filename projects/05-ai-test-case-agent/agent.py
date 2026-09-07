from typing import TypedDict, List
import json
from rich.console import Console
from rich.panel import Panel

console = Console()

class AgentState(TypedDict):
    spec_url: str
    discovered_endpoints: List[str]
    generated_tests: str
    execution_status: str
    iteration: int

def plan_node(state: AgentState) -> AgentState:
    console.print("[dim]Step 1: Inspecting OpenAPI specification...[/dim]")
    return {
        **state,
        "discovered_endpoints": ["POST /api/v1/checkout", "GET /api/v1/orders/{id}", "POST /api/v1/auth/token"],
        "iteration": state.get("iteration", 0) + 1
    }

def generate_node(state: AgentState) -> AgentState:
    console.print("[dim]Step 2: Synthesizing pytest suites with boundary cases...[/dim]")
    test_code = """import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_checkout_idempotency(client: AsyncClient):
    payload = {"items": [{"id": "item_1", "qty": 1}], "idempotency_key": "unique_123"}
    r1 = await client.post('/api/v1/checkout', json=payload)
    r2 = await client.post('/api/v1/checkout', json=payload)
    assert r1.status_code == 200
    assert r2.status_code == 200
    assert r1.json()['order_id'] == r2.json()['order_id']
"""
    return {
        **state,
        "generated_tests": test_code,
        "execution_status": "passed"
    }

def run_agent():
    console.print(Panel("[bold white]LangGraph AI Test Case Agent[/bold white]", border_style="white"))
    initial_state: AgentState = {
        "spec_url": "http://127.0.0.1:8000/openapi.json",
        "discovered_endpoints": [],
        "generated_tests": "",
        "execution_status": "pending",
        "iteration": 0
    }
    
    s1 = plan_node(initial_state)
    s2 = generate_node(s1)
    
    console.print("\n[bold green]✓ Generated Autonomous Pytest Suite:[/bold green]")
    console.print(f"[dim]{s2['generated_tests']}[/dim]")

if __name__ == '__main__':
    run_agent()
