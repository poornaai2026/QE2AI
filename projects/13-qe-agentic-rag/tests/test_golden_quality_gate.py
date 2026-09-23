"""Tests for Golden Benchmark Dataset and Golden Quality Gate Evaluation."""

import json
from pathlib import Path
import pytest
from app.config import settings
from app.agents.ragas_evaluator import load_golden_benchmark, evaluate_ragas_metrics_node

def test_golden_dataset_file_structure():
    """Verifies that golden_dataset.json contains valid benchmarks and targets."""
    golden_path = settings.DATA_DIR / "golden_dataset.json"
    assert golden_path.exists()
    
    with open(golden_path, "r", encoding="utf-8") as f:
        data = json.load(f)
        
    assert "benchmarks" in data
    assert len(data["benchmarks"]) >= 2
    
    auth_bm = next((b for b in data["benchmarks"] if b["ticket_id"] == "AUTH-101"), None)
    assert auth_bm is not None
    assert len(auth_bm["ground_truth_context"]) >= 3
    assert len(auth_bm["ground_truth_test_cases"]) >= 6
    assert auth_bm["golden_ragas_targets"]["quality_gate_threshold"] == 0.85

def test_load_golden_benchmark():
    """Verifies load_golden_benchmark helper function."""
    auth_bm = load_golden_benchmark("AUTH-101")
    assert auth_bm is not None
    assert auth_bm["ticket_id"] == "AUTH-101"
    
    checkout_bm = load_golden_benchmark("CHECKOUT-204")
    assert checkout_bm is not None
    assert checkout_bm["ticket_id"] == "CHECKOUT-204"
    
    unknown_bm = load_golden_benchmark("NONEXISTENT-999")
    assert unknown_bm is None

def test_evaluate_ragas_metrics_against_golden_dataset():
    """Verifies that evaluation node calibrates metrics against the Golden Dataset."""
    mock_state = {
        "ticket_id": "AUTH-101",
        "acceptance_criteria": [
            "AC1: Valid credentials login",
            "AC6: Account locks after 5 attempts"
        ],
        "retrieved_context": [
            {"source": "auth_security_policy.md", "content": "Security rules"},
            {"source": "account_lockout_rules.md", "content": "5 attempts lockout"}
        ],
        "test_cases": [
            {"id": "TC001", "title": "Valid login"},
            {"id": "TC006", "title": "Account lockout after 5 attempts"}
        ],
        "validation": {
            "passed": True,
            "coverage_score": 1.0,
            "hallucination_detected": False
        },
        "regeneration_count": 0,
        "agent_logs": []
    }
    
    result = evaluate_ragas_metrics_node(mock_state)
    metrics = result["ragas_metrics"]
    
    # Assert metrics pass threshold
    assert metrics["faithfulness"] >= 0.85
    assert metrics["answer_relevance"] >= 0.85
    assert metrics["context_precision"] >= 0.85
    assert metrics["context_recall"] >= 0.85
    assert metrics["gate_passed"] is True
    assert result["quality_gate_passed"] is True
    
    # Verify golden dataset calibration log
    logs_str = " ".join(result["agent_logs"])
    assert "[GoldenDataset]" in logs_str

def test_golden_quality_gate_fails_on_hallucination():
    """Verifies that Golden Quality Gate correctly halts on ungrounded/hallucinated generation."""
    mock_failing_state = {
        "ticket_id": "AUTH-101",
        "acceptance_criteria": ["AC6: Account locks after 5 attempts"],
        "retrieved_context": [{"source": "account_lockout_rules.md", "content": "5 attempts"}],
        "test_cases": [{"id": "TC006", "title": "Account lockout after 3 attempts"}],
        "validation": {
            "passed": False,
            "coverage_score": 0.6,
            "hallucination_detected": True
        },
        "regeneration_count": 0,
        "agent_logs": []
    }
    
    result = evaluate_ragas_metrics_node(mock_failing_state)
    metrics = result["ragas_metrics"]
    
    assert metrics["gate_passed"] is False
    assert result["quality_gate_passed"] is False
    assert metrics["faithfulness"] < 0.85
