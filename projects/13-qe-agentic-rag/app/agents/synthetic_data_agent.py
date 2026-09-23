"""Synthetic Test Data Generator & Boundary Fuzzer:
Generates PII-safe fixtures, boundary values, security fuzz payloads, and edge cases
derived from Jira Acceptance Criteria and domain schemas.
"""

import re
import json
import hashlib
from typing import Dict, Any, List, Optional
from app.config import settings
from app.agents.model_cascade import ModelCascadeRouter

def _extract_field_heuristics(ac_list: List[str], summary: str = "") -> List[str]:
    """Infers data field types from requirement text."""
    combined = (summary + " " + " ".join(ac_list)).lower()
    fields = []
    if "email" in combined:
        fields.append("email")
    if "password" in combined:
        fields.append("password")
    if "promo" in combined or "coupon" in combined or "code" in combined:
        fields.append("coupon_code")
    if "amount" in combined or "price" in combined or "total" in combined:
        fields.append("amount")
    if "phone" in combined:
        fields.append("phone")
    if not fields:
        fields = ["input_text"]
    return fields

def _generate_deterministic_fixtures(ticket_id: str, fields: List[str]) -> Dict[str, Any]:
    """Generates deterministic, PII-safe synthetic test data fixtures across 4 tiers."""
    is_auth = ("AUTH" in ticket_id.upper() or "email" in fields or "password" in fields)
    is_checkout = ("CHECKOUT" in ticket_id.upper() or "coupon_code" in fields)

    valid_fixtures = []
    boundary_fixtures = []
    security_fuzz_fixtures = []
    pii_metadata = {
        "compliance": "GDPR / HIPAA Pseudonymized",
        "data_classification": "SYNTHETIC_TEST_ONLY",
        "isolation_id": f"iso_{hashlib.md5(ticket_id.encode()).hexdigest()[:8]}"
    }

    if is_auth:
        valid_fixtures.extend([
            {
                "id": "SYNTH_AUTH_VALID_01",
                "label": "Standard Enterprise User",
                "email": "qa.engineer@enterprise-domain.local",
                "password": "ValidPassword2026!",
                "expected_role": "StandardUser",
                "purpose": "Positive happy-path login verification"
            },
            {
                "id": "SYNTH_AUTH_VALID_02",
                "label": "Admin Privileged User",
                "email": "security.admin@enterprise-domain.local",
                "password": "SuperAdminSecret99#",
                "expected_role": "SystemAdmin",
                "purpose": "Role-based authorization checks"
            }
        ])

        boundary_fixtures.extend([
            {
                "id": "SYNTH_AUTH_BOUND_01",
                "field": "email",
                "condition": "Empty String",
                "payload": "",
                "expected_error": "Email is required"
            },
            {
                "id": "SYNTH_AUTH_BOUND_02",
                "field": "password",
                "condition": "Empty String",
                "payload": "",
                "expected_error": "Password is required"
            },
            {
                "id": "SYNTH_AUTH_BOUND_03",
                "field": "email",
                "condition": "Invalid Format (missing domain)",
                "payload": "user-without-domain@",
                "expected_error": "Please enter a valid email address"
            },
            {
                "id": "SYNTH_AUTH_BOUND_04",
                "field": "email",
                "condition": "Internationalized / Emoji Subaddress",
                "payload": "qa.test+🚀login@enterprise.local",
                "expected_valid": True,
                "notes": "Validates RFC 5322 compliance"
            },
            {
                "id": "SYNTH_AUTH_BOUND_05",
                "field": "password",
                "condition": "Max Boundary Length (256 chars)",
                "payload": "P@" + ("a" * 250) + "9!",
                "expected_valid": True,
                "notes": "Buffer overflow / truncation check"
            },
            {
                "id": "SYNTH_AUTH_BOUND_06",
                "field": "lockout_attempts",
                "counter": 5,
                "expected_status": "LOCKED",
                "expected_error": "Account locked due to 5 failed attempts. Please contact support."
            }
        ])

        security_fuzz_fixtures.extend([
            {
                "id": "SYNTH_AUTH_SEC_01",
                "attack_vector": "SQL Injection (Authentication Bypass)",
                "field": "email",
                "payload": "admin' OR '1'='1' --",
                "expected_behavior": "Rejected with generic 401 Unauthorized"
            },
            {
                "id": "SYNTH_AUTH_SEC_02",
                "attack_vector": "Cross-Site Scripting (Reflected XSS)",
                "field": "email",
                "payload": "<script>alert('XSS_PAYLOAD')</script>@test.com",
                "expected_behavior": "HTML entity encoded, script never executed"
            },
            {
                "id": "SYNTH_AUTH_SEC_03",
                "attack_vector": "User Enumeration Probe",
                "field": "email",
                "payload": "nonexistent.executive.account@enterprise.com",
                "expected_behavior": "Error message identical to bad password"
            }
        ])

    elif is_checkout:
        valid_fixtures.extend([
            {
                "id": "SYNTH_CHK_VALID_01",
                "label": "20% Discount Promo",
                "coupon_code": "SAVE20",
                "cart_subtotal": 100.00,
                "expected_discount": 20.00,
                "expected_total": 80.00
            }
        ])

        boundary_fixtures.extend([
            {
                "id": "SYNTH_CHK_BOUND_01",
                "field": "coupon_code",
                "condition": "Empty Coupon Code",
                "payload": "",
                "expected_error": "Please enter a coupon code"
            },
            {
                "id": "SYNTH_CHK_BOUND_02",
                "field": "coupon_code",
                "condition": "Expired Coupon",
                "payload": "EXPIRED10",
                "expected_error": "Coupon code has expired"
            },
            {
                "id": "SYNTH_CHK_BOUND_03",
                "field": "coupon_code",
                "condition": "Case Insensitivity & Whitespace Padding",
                "payload": "   save20   ",
                "expected_behavior": "Trimmed and applied successfully"
            }
        ])

        security_fuzz_fixtures.extend([
            {
                "id": "SYNTH_CHK_SEC_01",
                "attack_vector": "Race Condition / Double Apply",
                "field": "coupon_code",
                "payload": ["SAVE20", "SAVE20"],
                "expected_behavior": "Only one promo code allowed per order"
            },
            {
                "id": "SYNTH_CHK_SEC_02",
                "attack_vector": "Negative Discount Injection",
                "field": "coupon_code",
                "payload": "DISCOUNT_-100",
                "expected_behavior": "Cart subtotal cannot increase or accept malformed discounts"
            }
        ])
    else:
        valid_fixtures.append({
            "id": "SYNTH_GEN_01",
            "field": "input_text",
            "payload": "Sample Valid Test Input Value"
        })
        boundary_fixtures.append({
            "id": "SYNTH_GEN_BOUND_01",
            "field": "input_text",
            "condition": "Null Byte / Max Size",
            "payload": "\x00" * 10
        })
        security_fuzz_fixtures.append({
            "id": "SYNTH_GEN_SEC_01",
            "attack_vector": "Command Injection",
            "payload": "; ls -la; rm -rf /"
        })

    return {
        "ticket_id": ticket_id,
        "fields_detected": fields,
        "pii_compliance": pii_metadata,
        "valid_fixtures": valid_fixtures,
        "boundary_fixtures": boundary_fixtures,
        "security_fuzz_fixtures": security_fuzz_fixtures,
        "total_fixtures": len(valid_fixtures) + len(boundary_fixtures) + len(security_fuzz_fixtures)
    }

def generate_synthetic_fixtures(
    ticket_id: str,
    acceptance_criteria: Optional[List[str]] = None,
    summary: str = ""
) -> Dict[str, Any]:
    """Public entry point: Generates synthetic test dataset with boundary & fuzz vectors."""
    if acceptance_criteria is None:
        acceptance_criteria = []

    fields = _extract_field_heuristics(acceptance_criteria, summary)
    return _generate_deterministic_fixtures(ticket_id, fields)
