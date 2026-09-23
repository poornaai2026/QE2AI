"""Requirement Analysis Agent: Deconstructs Jira requirements and formulates RAG search queries."""

from typing import Dict, Any, List
from app.agents.state import QEWorkflowState
from app.rag.vector_store import get_vector_store

def analyze_requirements_node(state: QEWorkflowState) -> Dict[str, Any]:
    """Analyzes Jira ticket acceptance criteria and retrieves relevant Confluence context."""
    ticket_id = state.get("ticket_id", "AUTH-101")
    summary = state.get("requirement_summary", "")
    description = state.get("requirement_description", "")
    acs = state.get("acceptance_criteria", [])

    logs = list(state.get("agent_logs", []))
    logs.append(f"[RequirementAgent] Analyzing Ticket {ticket_id}: '{summary}'")
    logs.append(f"[RequirementAgent] Identified {len(acs)} Acceptance Criteria for validation.")

    # Formulate domain search queries for RAG
    vector_store = get_vector_store()
    search_queries = [
        f"{summary} security policy",
        f"account lockout threshold brute force {ticket_id}",
        "ui automation locator standards data-testid",
        "error message disclosure and credentials validation"
    ]

    retrieved_chunks = []
    seen_contents = set()
    for query in search_queries:
        results = vector_store.similarity_search(query, k=2)
        for r in results:
            content_snippet = r["content"][:200]
            if content_snippet not in seen_contents:
                seen_contents.add(content_snippet)
                retrieved_chunks.append({
                    "content": r["content"],
                    "source": r.get("source", "Confluence"),
                    "title": r.get("metadata", {}).get("title", "Spec")
                })

    logs.append(f"[RAGPipeline] Retrieved {len(retrieved_chunks)} relevant Confluence business context chunks.")

    # Generate Synthetic Test Data Fixtures across 4 tiers
    from app.agents.synthetic_data_agent import generate_synthetic_fixtures
    synthetic_fixtures = generate_synthetic_fixtures(ticket_id, acs, summary)
    logs.append(f"[SyntheticDataAgent] Synthesized {synthetic_fixtures.get('total_fixtures', 0)} PII-safe test fixtures across 4 tiers (Valid, Boundary, Fuzz, PII Masking).")

    return {
        "retrieved_context": retrieved_chunks,
        "synthetic_fixtures": synthetic_fixtures,
        "agent_logs": logs
    }

