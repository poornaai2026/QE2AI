"""Root Cause Analysis (RCA) and Defect Triage Agent for SlingShot QE Agent."""

import json
from datetime import datetime
from typing import Any, Dict
from langchain_core.messages import SystemMessage, HumanMessage

from slingshot_qe_agents.agents.llm_factory import get_chat_model
from slingshot_qe_agents.graph.state import QEAgentState
from slingshot_qe_agents.tools.atlassian_tools import AtlassianTool
from slingshot_qe_agents.tools.workspace_tools import WorkspaceContextTool


class RCAAgent:
    """Agent that performs Root Cause Analysis on test execution failures and classifies defects."""

    def __init__(self, workspace_tool: WorkspaceContextTool):
        self.workspace_tool = workspace_tool
        self.atlassian_tool = AtlassianTool()
        self.llm = get_chat_model()

    def process(self, state: QEAgentState) -> Dict[str, Any]:
        """Analyze test execution output and generate Defect Analysis Report."""
        exec_res = state.get("execution_result") or {}
        success = exec_res.get("success", False)
        stdout = exec_res.get("stdout", "")
        stderr = exec_res.get("stderr", "")

        if success:
            report_data = {
                "summary": "All automated test scenarios executed and passed successfully.",
                "status": "PASSED",
                "total_tests": exec_res.get("passed_count", 1),
                "passed_tests": exec_res.get("passed_count", 1),
                "failed_tests": 0,
                "root_cause": "N/A - Clean execution",
                "affected_components": [],
                "recommended_fix": None,
                "stack_trace_snippet": None
            }
        else:
            # Analyze whether failure is due to automation script vs AUT defect
            is_script_defect = self._is_script_defect(stdout, stderr)
            status = "FAILED_AUTOMATION_SCRIPT" if is_script_defect else "FAILED_APPLICATION_DEFECT"

            summary = (
                "Test failure classified as Automation Script Defect (e.g. outdated assertion, selector or syntax issue)."
                if is_script_defect else
                "Test failure classified as Application Under Test (AUT) Defect (e.g. 500 Internal Server Error or unexpected regression)."
            )

            root_cause = stderr or stdout[-500:] if (stderr or stdout) else "Unknown failure during execution"
            recommended_fix = (
                "Trigger self-healing agent to update assertion, selector, or request payload schema."
                if is_script_defect else
                "Log Jira bug ticket and notify developer team of unexpected application behavior."
            )

            report_data = {
                "summary": summary,
                "status": status,
                "total_tests": exec_res.get("passed_count", 0) + exec_res.get("failed_count", 1),
                "passed_tests": exec_res.get("passed_count", 0),
                "failed_tests": exec_res.get("failed_count", 1),
                "root_cause": root_cause[:600],
                "affected_components": ["API Endpoint" if state.get("task_type") == "api" else "UI DOM Component"],
                "recommended_fix": recommended_fix,
                "stack_trace_snippet": (stderr[:500] if stderr else stdout[:500])
            }

            # If application bug, log defect ticket
            if status == "FAILED_APPLICATION_DEFECT":
                jira_ticket = self.atlassian_tool.create_defect_ticket(
                    summary=f"[AUT Bug] Automated test failure in {state.get('task_type', 'API').upper()}",
                    description=f"Automated test failed with root cause:\n{root_cause}\n\nStack trace:\n{report_data['stack_trace_snippet']}"
                )
                report_data["jira_ticket"] = jira_ticket

        # Save formatted markdown report in workspace
        ts = datetime.now().strftime("%Y%m%d_%H%M%S")
        report_md = self._generate_markdown_report(report_data, state)
        report_path = self.workspace_tool.save_report(f"defect_analysis_report_{ts}.md", report_md)

        return {
            "defect_report": report_data,
            "messages": [HumanMessage(content=f"Defect analysis completed: {report_data['status']}. Report saved to {report_path}")]
        }

    def _is_script_defect(self, stdout: str, stderr: str) -> bool:
        """Classify if failure is due to automation script bug vs application bug."""
        combined = (stdout + "\n" + stderr).lower()

        # Indicators of automation script bugs:
        script_indicators = [
            "assertion failed",
            "assertionerror",
            "syntaxerror",
            "nameerror",
            "keyerror",
            "locator not found",
            "waiting for locator",
            "timed out 30000ms waiting for",
            "simulated failure",
            "match response",
            "cannot find element",
            "unexpected token"
        ]

        # Indicators of AUT backend/server bugs:
        app_indicators = [
            "500 internal server error",
            "502 bad gateway",
            "503 service unavailable",
            "504 gateway timeout",
            "database connection error",
            "nullpointerexception",
            "panic: runtime error"
        ]

        if any(ind in combined for ind in app_indicators):
            return False

        if any(ind in combined for ind in script_indicators):
            return True

        return True  # default to script defect to allow self-healing attempt

    def _generate_markdown_report(self, report: dict, state: QEAgentState) -> str:
        """Generate formatted Markdown Defect Analysis Report."""
        return (
            f"# SlingShot QE Agent - Automation & Defect Analysis Report\n\n"
            f"**Execution Date**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}  \n"
            f"**Task Type**: {state.get('task_type', 'api').upper()}  \n"
            f"**Status**: **{report['status']}**  \n\n"
            f"## Summary\n"
            f"{report['summary']}\n\n"
            f"## Metrics\n"
            f"- **Total Tests**: {report['total_tests']}\n"
            f"- **Passed Tests**: {report['passed_tests']}\n"
            f"- **Failed Tests**: {report['failed_tests']}\n\n"
            f"## Root Cause Analysis (RCA)\n"
            f"```text\n{report['root_cause']}\n```\n\n"
            f"## Recommended Action\n"
            f"{report['recommended_fix']}\n\n"
            f"## Stack Trace / Error Details\n"
            f"```text\n{report.get('stack_trace_snippet', 'None')}\n```\n"
        )
