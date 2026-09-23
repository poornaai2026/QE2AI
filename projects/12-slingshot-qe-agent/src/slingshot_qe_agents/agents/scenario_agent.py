"""Scenario Generation Agent for SlingShot QE Agent."""

import json
from typing import Any, Dict, List
from langchain_core.messages import SystemMessage, HumanMessage

from slingshot_qe_agents.agents.llm_factory import get_chat_model
from slingshot_qe_agents.graph.state import QEAgentState, TestScenario


class ScenarioAgent:
    """Agent that generates manual test scenarios from parsed requirements."""

    def __init__(self):
        self.llm = get_chat_model()

    def process(self, state: QEAgentState) -> Dict[str, Any]:
        """Generate structured manual test scenarios."""
        task_type = state.get("task_type", "api")
        parsed_spec = state.get("parsed_spec", {})
        raw_input = state.get("raw_input", "")

        scenarios: List[Dict[str, Any]] = []

        if self.llm:
            prompt = (
                f"You are a Senior Quality Engineer designing comprehensive test scenarios for {task_type.upper()}.\n"
                f"Requirements Specification:\n{json.dumps(parsed_spec, indent=2)}\n\n"
                f"Generate a JSON array of comprehensive test scenarios covering positive, negative, boundary, and edge cases.\n"
                f"Each scenario must have keys: id, title, type (positive|negative|boundary|security|edge_case), description, preconditions, steps, expected_result, tags."
            )
            try:
                resp = self.llm.invoke([
                    SystemMessage(content="You are an expert QA Test Designer. Output ONLY valid JSON list."),
                    HumanMessage(content=prompt)
                ])
                text = resp.content.strip()
                if "[" in text and "]" in text:
                    cleaned = text[text.find("["):text.rfind("]") + 1]
                    scenarios = json.loads(cleaned)
            except Exception:
                scenarios = self._generate_fallback_scenarios(task_type, parsed_spec, raw_input)
        else:
            scenarios = self._generate_fallback_scenarios(task_type, parsed_spec, raw_input)

        return {
            "manual_scenarios": scenarios,
            "hitl_checkpoint": "scenario_approval",
            "approval_status": "pending",
            "messages": [HumanMessage(content=f"Generated {len(scenarios)} manual test scenarios for review.")]
        }

    def _generate_fallback_scenarios(self, task_type: str, spec: Dict[str, Any], raw_input: str) -> List[Dict[str, Any]]:
        """Generate deterministic fallback scenarios when offline or during tests."""
        if task_type == "api":
            return [
                {
                    "id": "TC-API-001",
                    "title": "Positive: Create resource with valid payload",
                    "type": "positive",
                    "description": "Send POST request with valid schema and authentication headers.",
                    "preconditions": ["API service is running", "Valid authorization token"],
                    "steps": [
                        "Prepare valid JSON request body",
                        "Send POST to target endpoint with Bearer auth",
                        "Verify HTTP status code is 200 or 201"
                    ],
                    "expected_result": "Status 201 Created and response body contains ID and confirmation",
                    "tags": ["smoke", "api", "p1"]
                },
                {
                    "id": "TC-API-002",
                    "title": "Negative: Submit request with missing mandatory fields",
                    "type": "negative",
                    "description": "Verify API validation handles missing required attributes.",
                    "preconditions": ["API service is running"],
                    "steps": [
                        "Omit mandatory field 'id' or 'customer_id' from payload",
                        "Send POST request",
                        "Inspect response code and error message"
                    ],
                    "expected_result": "HTTP 400 Bad Request with descriptive validation error",
                    "tags": ["negative", "api", "validation"]
                },
                {
                    "id": "TC-API-003",
                    "title": "Security: Unauthorized request without bearer token",
                    "type": "security",
                    "description": "Verify endpoint is protected from unauthenticated access.",
                    "preconditions": ["No authorization header"],
                    "steps": [
                        "Send GET/POST request without Authorization header",
                        "Assert response status"
                    ],
                    "expected_result": "HTTP 401 Unauthorized",
                    "tags": ["security", "auth"]
                }
            ]
        else:  # UI
            return [
                {
                    "id": "TC-UI-001",
                    "title": "Positive: End-to-end user navigation and submission",
                    "type": "positive",
                    "description": "User opens target page, fills required inputs, and submits successfully.",
                    "preconditions": ["Web application is accessible in browser"],
                    "steps": [
                        "Navigate to application URL",
                        "Fill in credentials / input fields",
                        "Click 'Submit' button",
                        "Wait for dashboard / success element to appear"
                    ],
                    "expected_result": "Success confirmation or landing dashboard is visible",
                    "tags": ["ui", "smoke", "playwright"]
                },
                {
                    "id": "TC-UI-002",
                    "title": "Negative: Form submission with empty required fields",
                    "type": "negative",
                    "description": "Verify inline validation errors appear when required inputs are blank.",
                    "preconditions": ["Page is loaded"],
                    "steps": [
                        "Leave required input fields empty",
                        "Click submit button",
                        "Assert error tooltip/message presence"
                    ],
                    "expected_result": "Validation error message displayed, form submission blocked",
                    "tags": ["ui", "validation"]
                }
            ]
