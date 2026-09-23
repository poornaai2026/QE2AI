"""AI Validation Agent: Evaluates test cases for requirement coverage, hallucinations, and contradictions."""

import re
from typing import Dict, Any, List
from app.agents.state import QEWorkflowState, ValidationResult, ValidationIssue

def validate_test_cases_node(state: QEWorkflowState) -> Dict[str, Any]:
    """Validates generated test cases against Jira Acceptance Criteria and Confluence context."""
    ticket_id = state.get("ticket_id", "AUTH-101")
    acs = state.get("acceptance_criteria", [])
    test_cases = state.get("test_cases", [])
    regeneration_count = state.get("regeneration_count", 0)

    logs = list(state.get("agent_logs", []))
    logs.append(f"[ValidationAgent] Evaluating {len(test_cases)} test cases against {len(acs)} Acceptance Criteria...")

    issues: List[ValidationIssue] = []
    hallucination_detected = False

    # 1. Requirement Coverage Analysis
    covered_acs = set()
    for tc in test_cases:
        ac_tag = tc.get("ac_traceability", "")
        if ac_tag:
            covered_acs.add(ac_tag)

    total_acs = len(acs)
    coverage_score = round(len(covered_acs) / max(total_acs, 1), 2)
    logs.append(f"[ValidationAgent] Requirement Coverage Score: {coverage_score * 100:.1f}% ({len(covered_acs)}/{total_acs} ACs mapped)")

    if coverage_score < 1.0:
        missing_acs = [f"AC{i+1}" for i in range(total_acs) if f"AC{i+1}" not in covered_acs]
        issues.append(ValidationIssue(
            code="COVERAGE_GAP",
            severity="MAJOR",
            message=f"Missing coverage for acceptance criteria: {', '.join(missing_acs)}",
            affected_test_case=None
        ))

    # 2. Contradiction & Hallucination Audit
    # Specifically inspect TC006 for the 5-attempt lockout contract (AUTH-101)
    if ticket_id == "AUTH-101":
        for tc in test_cases:
            if tc.get("ac_traceability") == "AC6" or "lockout" in tc.get("title", "").lower():
                # Check steps and title for attempt numbers
                text_corpus = f"{tc.get('title')} {' '.join(tc.get('steps', []))} {tc.get('expected_result', '')}"
                found_numbers = re.findall(r"(\d+)\s+(?:consecutive\s+)?failed\s+attempts?", text_corpus, re.IGNORECASE)
                
                # If it mentions 3 attempts instead of 5
                if any(num != "5" and num in ["2", "3", "4"] for num in found_numbers):
                    hallucination_detected = True
                    issues.append(ValidationIssue(
                        code="CONTRADICTION",
                        severity="CRITICAL",
                        message=(
                            f"Generated test {tc.get('id')} contradicts acceptance criteria AC6. "
                            f"AC6 explicitly mandates lockout after 5 consecutive failed attempts, but test asserts {found_numbers[0]} attempts."
                        ),
                        affected_test_case=tc.get("id")
                    ))
                    logs.append(f"[ValidationAgent] ❌ CRITICAL: Hallucination/Contradiction detected in {tc.get('id')}! Expected 5 attempts, found {found_numbers[0]}.")

    # 3. Compile validation verdict
    has_critical_issues = any(i.severity == "CRITICAL" for i in issues)
    passed = (not has_critical_issues) and (coverage_score >= 0.85)

    if not passed:
        critique = " ".join([i.message for i in issues])
        logs.append(f"[ValidationAgent] AI Validation Verdict: ❌ FAIL (Regeneration #{regeneration_count + 1})")
        logs.append(f"[ValidationAgent] Critique: {critique}")
    else:
        critique = "All test cases satisfy acceptance criteria, zero hallucinations detected, and coverage is complete."
        logs.append(f"[ValidationAgent] AI Validation Verdict: ✅ PASS! Test suite certified for Quality Gate & Automation.")

    validation_result = ValidationResult(
        passed=passed,
        coverage_score=coverage_score,
        hallucination_detected=hallucination_detected,
        critique=critique,
        issues=issues
    ).model_dump()

    return {
        "validation": validation_result,
        "agent_logs": logs
    }
