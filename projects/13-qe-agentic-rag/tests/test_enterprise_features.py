"""Unit tests for enterprise architectural features: Hybrid RAG, Active In-Flight Healing, and Model Cascading."""

import pytest
from app.rag.hybrid_search import BM25Retriever, HybridRetriever
from app.rag.vector_store import get_vector_store
from app.agents.model_cascade import ModelCascadeRouter
from app.test_runner.executor import run_test_suite

def test_bm25_exact_token_retrieval():
    """Verify BM25 sparse search reliably retrieves exact technical error codes."""
    docs = [
        {"content": "Standard login guidelines and general password input forms.", "title": "Doc 1"},
        {"content": "Security spec: Returns AUTH_423_LOCKED when account exceeds 5 failed attempts.", "title": "Doc 2"},
        {"content": "Checkout coupon codes and discount calculations.", "title": "Doc 3"}
    ]
    bm25 = BM25Retriever()
    bm25.fit(docs)
    results = bm25.search("AUTH_423_LOCKED", top_k=1)
    assert len(results) == 1
    assert "AUTH_423_LOCKED" in results[0][0]["content"]
    assert results[0][1] > 0.0

def test_hybrid_rrf_fusion():
    """Verify Reciprocal Rank Fusion combines sparse and dense rankings effectively."""
    hybrid = HybridRetriever(rrf_k=60)
    dense_results = [
        {"content": "Authentication overview and session cookies.", "title": "Doc A"},
        {"content": "Lockout policy and security rules.", "title": "Doc B"}
    ]
    sparse_results = [
        ({"content": "Lockout policy and security rules.", "title": "Doc B"}, 2.5),
        ({"content": "General portal terms.", "title": "Doc C"}, 0.5)
    ]
    fused = hybrid.fuse(dense_results, sparse_results, top_k=2)
    assert len(fused) == 2
    # Doc B appeared in both lists, so its RRF score must be highest!
    assert "Doc B" in fused[0]["title"]
    assert fused[0]["rrf_score"] > fused[1]["rrf_score"]
    assert fused[0]["dense_rank"] is not None
    assert fused[0]["bm25_rank"] is not None

def test_model_cascade_telemetry():
    """Verify model cascade routing and cost economics calculation."""
    tier_fast, model_fast = ModelCascadeRouter.get_tier_for_phase("drafting", retry_count=0)
    assert "Tier-1" in tier_fast

    tier_adv, model_adv = ModelCascadeRouter.get_tier_for_phase("self_healing_revision", retry_count=1)
    assert "Tier-2" in tier_adv

    telemetry = ModelCascadeRouter.compute_telemetry(test_case_count=6, retry_count=1, hybrid_matches=4)
    assert "cost_savings_percentage" in telemetry
    assert "monolithic_cost_usd" in telemetry
    assert "cascaded_cost_usd" in telemetry
    assert float(telemetry["cost_savings_percentage"].replace("%", "")) >= 75.0

def test_active_in_flight_self_healing_executor():
    """Verify executor active in-flight self-healing mode successfully resolves locator drift."""
    res = run_test_suite(bug_mode=True, enable_active_healing=True)
    assert res["passed"] is True
    assert res["healed_count"] > 0
    assert len(res["healed_events"]) > 0
    healed = res["healed_events"][0]
    assert healed["status"] == "HEALED_IN_FLIGHT"
    assert "button-login" in healed["original_selector"]
    assert "legacy-login-btn" in healed["healed_selector"]
