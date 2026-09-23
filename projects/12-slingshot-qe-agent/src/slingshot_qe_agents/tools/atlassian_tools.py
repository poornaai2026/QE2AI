"""Atlassian Jira and Confluence Integration Tools for SlingShot QE Agent."""

import os
from typing import Any, Dict, Optional
import httpx


class AtlassianTool:
    """Tool for reading user stories/specs from Jira/Confluence and logging defect tickets."""

    def __init__(self):
        self.jira_url = os.getenv("JIRA_URL")
        self.jira_username = os.getenv("JIRA_USERNAME")
        self.jira_token = os.getenv("JIRA_API_TOKEN")
        self.confluence_url = os.getenv("CONFLUENCE_URL")
        self.is_configured = bool(self.jira_url and self.jira_token)

    def read_jira_issue(self, issue_key: str) -> Dict[str, Any]:
        """Fetch Jira ticket summary, description, and acceptance criteria."""
        if not self.is_configured:
            # Fallback mock fixture for offline / demo mode
            return {
                "key": issue_key,
                "summary": f"[Mock Jira] {issue_key}: Implement and Test Order Processing API",
                "issue_type": "Story",
                "status": "In Progress",
                "description": (
                    "As an authenticated user, I should be able to place an order via POST /orders "
                    "with a valid item_id, quantity, and customer_id. The endpoint should validate inventory, "
                    "deduct stock, and return 201 Created with an order ID. Invalid payloads should return 400 Bad Request."
                ),
                "acceptance_criteria": [
                    "AC1: POST /orders with valid payload returns 201 Created and JSON containing order_id and status 'CONFIRMED'.",
                    "AC2: POST /orders with missing customer_id or quantity <= 0 returns 400 Bad Request with error message.",
                    "AC3: GET /orders/{order_id} returns order details.",
                    "AC4: Unauthorized request returns 401 Unauthorized."
                ]
            }

        headers = {
            "Accept": "application/json",
            "Authorization": f"Basic {self.jira_token}"
        }
        with httpx.Client(timeout=10.0) as client:
            resp = client.get(f"{self.jira_url}/rest/api/3/issue/{issue_key}", headers=headers)
            resp.raise_for_status()
            data = resp.json()
            fields = data.get("fields", {})
            return {
                "key": issue_key,
                "summary": fields.get("summary", ""),
                "issue_type": fields.get("issuetype", {}).get("name", "Story"),
                "status": fields.get("status", {}).get("name", ""),
                "description": fields.get("description", ""),
                "raw_fields": fields
            }

    def read_confluence_page(self, page_id_or_title: str) -> Dict[str, Any]:
        """Fetch requirement or specification document from Confluence."""
        if not self.is_configured or not self.confluence_url:
            return {
                "title": f"Requirements Spec: {page_id_or_title}",
                "page_id": page_id_or_title,
                "content": (
                    "## Feature Specification\n"
                    "The checkout flow requires a 2-step verification for payments over $500.\n"
                    "Headers required: Authorization: Bearer <token>, X-Client-Version: 2.4.0\n"
                    "Rate limiting: Maximum 100 requests per minute per IP."
                )
            }

        headers = {
            "Accept": "application/json",
            "Authorization": f"Basic {self.jira_token}"
        }
        with httpx.Client(timeout=10.0) as client:
            resp = client.get(
                f"{self.confluence_url}/rest/api/content/{page_id_or_title}?expand=body.storage",
                headers=headers
            )
            resp.raise_for_status()
            data = resp.json()
            return {
                "title": data.get("title", ""),
                "page_id": data.get("id", page_id_or_title),
                "content": data.get("body", {}).get("storage", {}).get("value", "")
            }

    def create_defect_ticket(self, summary: str, description: str, priority: str = "High") -> Dict[str, Any]:
        """Create a bug ticket in Jira for detected application defects."""
        if not self.is_configured:
            return {
                "created": True,
                "key": "SLING-BUG-101",
                "summary": summary,
                "status": "Logged (Sandbox Mock)",
                "priority": priority,
                "url": f"https://mock-jira.company.internal/browse/SLING-BUG-101"
            }

        payload = {
            "fields": {
                "summary": summary,
                "description": description,
                "issuetype": {"name": "Bug"},
                "priority": {"name": priority}
            }
        }
        headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": f"Basic {self.jira_token}"
        }
        with httpx.Client(timeout=10.0) as client:
            resp = client.post(f"{self.jira_url}/rest/api/3/issue", json=payload, headers=headers)
            resp.raise_for_status()
            data = resp.json()
            return {
                "created": True,
                "key": data.get("key"),
                "url": f"{self.jira_url}/browse/{data.get('key')}"
            }
