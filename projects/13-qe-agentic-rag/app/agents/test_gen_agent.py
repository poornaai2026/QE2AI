"""Test Case Generation Agent: Synthesizes structured test cases using Jira ACs and Confluence RAG."""

import json
from typing import Dict, Any, List
from app.agents.state import QEWorkflowState, TestCase
from app.config import settings

def generate_test_cases_node(state: QEWorkflowState) -> Dict[str, Any]:
    """Generates structured test cases covering positive, negative, boundary, and edge scenarios."""
    ticket_id = state.get("ticket_id", "AUTH-101")
    acs = state.get("acceptance_criteria", [])
    context = state.get("retrieved_context", [])
    regeneration_count = state.get("regeneration_count", 0)
    validation = state.get("validation")

    logs = list(state.get("agent_logs", []))
    logs.append(f"[TestGenAgent] Initiating test case generation (Iteration #{regeneration_count + 1})...")

    # If there is critique from a previous validation failure, log it
    if validation and not validation.get("passed"):
        critique_msg = validation.get("critique", "Self-healing revision needed.")
        logs.append(f"[TestGenAgent] Received AI Validator feedback: {critique_msg}")
        logs.append(f"[TestGenAgent] Self-healing enabled: Regenerating test cases with corrected parameters.")

    test_cases: List[Dict[str, Any]] = []

    # Check for live LLM execution
    llm_used = False
    if settings.OPENAI_API_KEY or settings.GEMINI_API_KEY:
        try:
            test_cases = _generate_with_live_llm(ticket_id, acs, context, validation, regeneration_count)
            llm_used = True
            logs.append(f"[TestGenAgent] Generated {len(test_cases)} test cases using live LLM.")
        except Exception as e:
            logs.append(f"[TestGenAgent] Live LLM call failed ({e}); falling back to deterministic synthesis.")

    if not llm_used:
        test_cases = _generate_deterministic_suite(ticket_id, acs, context, regeneration_count)
        logs.append(f"[TestGenAgent] Synthesized {len(test_cases)} structured test cases across Positive, Negative, Boundary, and Security categories.")

    new_regeneration_count = regeneration_count + 1 if (validation and not validation.get("passed")) else (regeneration_count if regeneration_count > 0 else 0)
    # If this was the first generation and validation will run, start at 0; when re-generated, it becomes 1
    if validation and not validation.get("passed"):
        new_regeneration_count = max(regeneration_count + 1, 1)

    return {
        "test_cases": test_cases,
        "regeneration_count": new_regeneration_count,
        "agent_logs": logs
    }


def _generate_deterministic_suite(ticket_id: str, acs: List[str], context: List[Dict[str, Any]], regeneration_count: int) -> List[Dict[str, Any]]:
    """Generates a high-quality test suite showcasing the Agentic QE self-healing workflow."""
    if ticket_id == "AUTH-101":
        # On first iteration, generate an intentional contradiction on TC006 to showcase the AI Validation & Self-Healing Loop
        lockout_attempts = 3 if regeneration_count == 0 else 5
        lockout_expected = (
            "Account should lock after 3 failed attempts."
            if regeneration_count == 0
            else "Account locks after 5 consecutive failed attempts with message: 'Account locked due to 5 failed attempts. Please contact support.'"
        )

        return [
            TestCase(
                id="TC001",
                title="Login with valid customer credentials",
                type="Positive",
                precondition="User account is registered, active, and verified.",
                steps=[
                    "Navigate to login page (http://localhost:8080/login)",
                    "Enter registered email 'customer@enterprise.io' into [data-testid='input-email']",
                    "Enter valid password 'SecurePass123!' into [data-testid='input-password']",
                    "Click [data-testid='button-login']",
                    "Verify redirection to /dashboard and assert [data-testid='user-greeting'] is visible"
                ],
                test_data={"email": "customer@enterprise.io", "password": "SecurePass123!"},
                expected_result="User should successfully authenticate and redirect to /dashboard.",
                ac_traceability="AC1"
            ).model_dump(),
            TestCase(
                id="TC002",
                title="Login with invalid password",
                type="Negative",
                precondition="User account is registered.",
                steps=[
                    "Navigate to login page",
                    "Enter registered email 'customer@enterprise.io'",
                    "Enter incorrect password 'WrongPassword999!'",
                    "Click [data-testid='button-login']",
                    "Verify [data-testid='alert-error'] displays 'Invalid email or password'"
                ],
                test_data={"email": "customer@enterprise.io", "password": "WrongPassword999!"},
                expected_result="System displays error: 'Invalid email or password' without revealing password specifics.",
                ac_traceability="AC2"
            ).model_dump(),
            TestCase(
                id="TC003",
                title="Validation when email field is submitted blank",
                type="Negative",
                precondition="Login page is loaded.",
                steps=[
                    "Navigate to login page",
                    "Leave email input empty",
                    "Enter valid password 'SecurePass123!'",
                    "Click [data-testid='button-login']",
                    "Assert [data-testid='error-email-validation'] displays 'Email is required'"
                ],
                test_data={"email": "", "password": "SecurePass123!"},
                expected_result="Validation error 'Email is required' is shown.",
                ac_traceability="AC3"
            ).model_dump(),
            TestCase(
                id="TC004",
                title="Validation when password field is submitted blank",
                type="Negative",
                precondition="Login page is loaded.",
                steps=[
                    "Navigate to login page",
                    "Enter registered email 'customer@enterprise.io'",
                    "Leave password input empty",
                    "Click [data-testid='button-login']",
                    "Assert [data-testid='error-password-validation'] displays 'Password is required'"
                ],
                test_data={"email": "customer@enterprise.io", "password": ""},
                expected_result="Validation error 'Password is required' is shown.",
                ac_traceability="AC4"
            ).model_dump(),
            TestCase(
                id="TC005",
                title="Validation for malformed email syntax",
                type="Boundary",
                precondition="Login page is loaded.",
                steps=[
                    "Navigate to login page",
                    "Enter malformed email 'customer_at_invalid'",
                    "Enter valid password 'SecurePass123!'",
                    "Click [data-testid='button-login']",
                    "Assert [data-testid='error-email-validation'] displays 'Please enter a valid email address'"
                ],
                test_data={"email": "customer_at_invalid", "password": "SecurePass123!"},
                expected_result="System displays 'Please enter a valid email address'.",
                ac_traceability="AC5"
            ).model_dump(),
            TestCase(
                id="TC006",
                title=f"Account security lockout threshold verification ({lockout_attempts} attempts)",
                type="Security",
                precondition="User account is registered and not currently locked.",
                steps=[
                    "Navigate to login page",
                    f"Perform {lockout_attempts} consecutive failed login attempts with bad credentials",
                    "On final attempt, verify response message and form state",
                    "Verify [data-testid='alert-lockout'] is visible with text: 'Account locked due to 5 failed attempts. Please contact support.'",
                    "Assert [data-testid='button-login'] is disabled"
                ],
                test_data={"email": "customer@enterprise.io", "attempts": lockout_attempts},
                expected_result=lockout_expected,
                ac_traceability="AC6"
            ).model_dump(),
        ]
    else:
        # Generic test suite generation for other tickets
        return [
            TestCase(
                id=f"TC00{i+1}",
                title=f"Test Scenario for {ac[:40]}...",
                type="Positive" if i == 0 else "Negative",
                precondition="System is running with baseline test data.",
                steps=["Open target page", f"Execute action corresponding to {ac}", "Assert expected outcome"],
                test_data={"scenario_index": i},
                expected_result=f"Complies with {ac}",
                ac_traceability=f"AC{i+1}"
            ).model_dump()
            for i, ac in enumerate(acs)
        ]


def _generate_with_live_llm(ticket_id: str, acs: List[str], context: List[Dict[str, Any]], validation: Any, retry_count: int) -> List[Dict[str, Any]]:
    """Invokes OpenAI or Gemini via LangChain for live generation."""
    from langchain_core.messages import SystemMessage, HumanMessage

    llm = None
    if settings.OPENAI_API_KEY:
        from langchain_openai import ChatOpenAI
        llm = ChatOpenAI(api_key=settings.OPENAI_API_KEY, model=settings.OPENAI_MODEL, temperature=0.1)
    elif settings.GEMINI_API_KEY:
        from langchain_google_genai import ChatGoogleGenAI
        llm = ChatGoogleGenAI(api_key=settings.GEMINI_API_KEY, model=settings.GEMINI_MODEL, temperature=0.1)

    if not llm:
        raise ValueError("No LLM configured")

    context_str = "\n".join([f"- {c.get('title')}: {c.get('content')[:300]}" for c in context])
    acs_str = "\n".join(acs)

    feedback_prompt = ""
    if validation and not validation.get("passed"):
        feedback_prompt = f"\nCRITICAL: Previous generation failed AI Validation with critique: {validation.get('critique')}. Fix all issues!"

    prompt = f"""You are a Lead QA Automation Engineer.
Generate comprehensive, production-grade test cases for Jira Ticket {ticket_id}.

Acceptance Criteria:
{acs_str}

Confluence Technical Context:
{context_str}
{feedback_prompt}

Output ONLY a JSON array of test case objects with fields:
id (e.g. TC001), title, type (Positive/Negative/Boundary/Security), precondition, steps (list of strings), test_data (json object), expected_result, ac_traceability (e.g. AC1).
"""
    response = llm.invoke([SystemMessage(content="You are an expert QA Test Architect."), HumanMessage(content=prompt)])
    content = response.content.strip()
    if content.startswith("```json"):
        content = content[7:-3].strip()
    elif content.startswith("```"):
        content = content[3:-3].strip()

    data = json.loads(content)
    return [TestCase(**item).model_dump() for item in data]
