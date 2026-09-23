"""LangGraph workflow definition for the Agentic QE Platform."""

from typing import Dict, Any, Literal
from langgraph.graph import StateGraph, START, END

from app.agents.state import QEWorkflowState
from app.agents.requirement_agent import analyze_requirements_node
from app.agents.test_gen_agent import generate_test_cases_node
from app.agents.validation_agent import validate_test_cases_node
from app.agents.ragas_evaluator import evaluate_ragas_metrics_node
from app.agents.playwright_gen_agent import generate_playwright_tests_node
from app.config import settings

def validation_router(state: QEWorkflowState) -> Literal["test_generation", "ragas_evaluation"]:
    """Conditional router that directs back to test_generation on validation failure or proceeds."""
    validation = state.get("validation", {})
    regeneration_count = state.get("regeneration_count", 0)
    max_retries = settings.MAX_REGENERATION_ATTEMPTS

    if not validation.get("passed", False) and regeneration_count < max_retries:
        return "test_generation"

    return "ragas_evaluation"


from langgraph.checkpoint.memory import MemorySaver

def build_qe_workflow_graph() -> StateGraph:
    """Constructs the compiled LangGraph state graph for the QE pipeline."""
    workflow = StateGraph(QEWorkflowState)

    # Register Nodes
    workflow.add_node("requirement_analysis", analyze_requirements_node)
    workflow.add_node("test_generation", generate_test_cases_node)
    workflow.add_node("ai_validation", validate_test_cases_node)
    workflow.add_node("ragas_evaluation", evaluate_ragas_metrics_node)
    workflow.add_node("playwright_generation", generate_playwright_tests_node)

    # Establish Edges
    workflow.add_edge(START, "requirement_analysis")
    workflow.add_edge("requirement_analysis", "test_generation")
    workflow.add_edge("test_generation", "ai_validation")

    # Conditional Routing Loop: Validation -> Regenerate if FAIL or -> Ragas if PASS
    workflow.add_conditional_edges(
        "ai_validation",
        validation_router,
        {
            "test_generation": "test_generation",
            "ragas_evaluation": "ragas_evaluation"
        }
    )

    workflow.add_edge("ragas_evaluation", "playwright_generation")
    workflow.add_edge("playwright_generation", END)

    checkpointer = MemorySaver()
    compiled = workflow.compile(checkpointer=checkpointer)
    return CheckpointCompliantGraph(compiled)


class CheckpointCompliantGraph:
    """Wrapper ensuring checkpointer thread_id is automatically assigned if not provided."""
    def __init__(self, graph):
        self._graph = graph

    def invoke(self, state, config=None, **kwargs):
        if config is None:
            config = {}
        if "configurable" not in config:
            config["configurable"] = {"thread_id": f"thread_{state.get('ticket_id', 'default')}"}
        return self._graph.invoke(state, config=config, **kwargs)

    def get_state(self, config):
        return self._graph.get_state(config)

    def __getattr__(self, name):
        return getattr(self._graph, name)


# Singleton instance
qe_graph = build_qe_workflow_graph()
