"""Tests for Synthetic Test Data Generation and GitOps Auto-Patch & PR Engine."""

import os
import ast
import tempfile
from pathlib import Path
import pytest
from app.agents.synthetic_data_agent import generate_synthetic_fixtures
from app.gitops.patch_engine import apply_locator_patch, create_pull_request, list_pull_requests
from app.mcp.server import generate_synthetic_test_data, apply_healed_patch, create_github_pull_request

def test_synthetic_data_generation_auth():
    """Validates generation of valid, boundary, security fuzz, and PII-masked fixtures for AUTH-101."""
    acs = [
        "AC1: Valid credentials should login successfully",
        "AC5: Invalid email format should display validation message",
        "AC6: Account should lock after 5 consecutive failed attempts"
    ]
    fixtures = generate_synthetic_fixtures("AUTH-101", acs, summary="Customer Authentication")
    
    assert fixtures["ticket_id"] == "AUTH-101"
    assert "email" in fixtures["fields_detected"]
    assert fixtures["total_fixtures"] >= 8
    
    # Check valid fixtures
    valid = fixtures["valid_fixtures"]
    assert len(valid) >= 2
    assert any("qa.engineer" in f.get("email", "") for f in valid)
    
    # Check boundaries
    bounds = fixtures["boundary_fixtures"]
    assert any(b.get("condition") == "Empty String" for b in bounds)
    assert any("🚀" in str(b.get("payload")) for b in bounds)  # Unicode/emoji subaddress
    
    # Check security fuzz payloads
    sec = fixtures["security_fuzz_fixtures"]
    assert any("SQL Injection" in s.get("attack_vector", "") for s in sec)
    assert any("XSS" in s.get("attack_vector", "") for s in sec)

def test_synthetic_data_generation_checkout():
    """Validates generation of boundary and race condition fuzz payloads for promo codes."""
    acs = [
        "AC1: Valid promo code SAVE20 should deduct 20%",
        "AC2: Expired promo code EXPIRED10 should display error"
    ]
    fixtures = generate_synthetic_fixtures("CHECKOUT-204", acs, summary="Checkout promo code")
    
    assert fixtures["ticket_id"] == "CHECKOUT-204"
    assert "coupon_code" in fixtures["fields_detected"]
    
    # Verify fuzz against double apply and negative discount injection
    sec = fixtures["security_fuzz_fixtures"]
    assert any("Double Apply" in s.get("attack_vector", "") for s in sec)
    assert any("Negative Discount" in s.get("attack_vector", "") for s in sec)

def test_gitops_patch_application(tmp_path):
    """Verifies that the GitOps engine cleanly patches target script and validates Python syntax."""
    test_file = tmp_path / "test_sample.py"
    original_code = (
        "def test_login(page):\n"
        "    page.goto('http://localhost:8080/login')\n"
        "    page.locator(\"button[type='submit']\").click()\n"
    )
    test_file.write_text(original_code, encoding="utf-8")
    
    # Apply patch
    res = apply_locator_patch(
        file_path=str(test_file),
        old_locator="button[type='submit']",
        new_locator="[data-testid='button-login']"
    )
    
    assert res["status"] == "PATCH_APPLIED"
    assert res["replacements_count"] == 1
    assert Path(res["backup_file"]).exists()
    
    # Verify updated content & AST syntax
    patched_code = test_file.read_text(encoding="utf-8")
    assert "[data-testid='button-login']" in patched_code
    assert "button[type='submit']" not in patched_code
    ast.parse(patched_code)  # Validates syntax

def test_gitops_pull_request_creation():
    """Verifies generation of structured GitOps PR with branch naming and unified diff."""
    pr = create_pull_request(
        ticket_id="AUTH-101",
        file_path="app/test_runner/generated_tests/test_auth_101.py",
        old_locator="button[type='submit']",
        new_locator="[data-testid='button-login']",
        root_cause="LOCATOR_DRIFT"
    )
    
    assert pr["pr_number"] > 0
    assert "fix/self-healed-locator-auth_101" in pr["branch_name"]
    assert pr["status"] == "OPEN"
    assert pr["mergeable"] is True
    assert "- page.locator(\"button[type='submit']\").click()" in pr["diff"]
    assert "+ page.locator(\"[data-testid='button-login']\").click()" in pr["diff"]
    assert pr in list_pull_requests()

def test_mcp_tools_synthetic_and_gitops(tmp_path):
    """Verifies FastMCP tools for synthetic data, code patch, and PR creation."""
    # 1. MCP Synthetic data tool
    data = generate_synthetic_test_data("AUTH-101")
    assert data["ticket_id"] == "AUTH-101"
    assert len(data["valid_fixtures"]) > 0
    
    # 2. MCP GitOps Patch tool
    test_file = tmp_path / "test_mcp_sample.py"
    test_file.write_text("page.locator(\"old-button\").click()", encoding="utf-8")
    patch_res = apply_healed_patch(str(test_file), "old-button", "new-button")
    assert patch_res["status"] == "PATCH_APPLIED"
    
    # 3. MCP GitOps PR tool
    pr_res = create_github_pull_request(
        ticket_id="AUTH-101",
        file_path=str(test_file),
        old_locator="old-button",
        new_locator="new-button"
    )
    assert pr_res["status"] == "OPEN"
    assert pr_res["pr_number"] > 0
