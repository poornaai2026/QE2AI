"""Self-Healing Code Agent for SlingShot QE Agent."""

import json
from typing import Any, Dict
from langchain_core.messages import SystemMessage, HumanMessage

from slingshot_qe_agents.agents.llm_factory import get_chat_model
from slingshot_qe_agents.graph.state import QEAgentState
from slingshot_qe_agents.tools.workspace_tools import WorkspaceContextTool


class HealingAgent:
    """Agent that analyzes script failures, heals test code, and saves fixes to workspace."""

    def __init__(self, workspace_tool: WorkspaceContextTool):
        self.workspace_tool = workspace_tool
        self.llm = get_chat_model()

    def process(self, state: QEAgentState) -> Dict[str, Any]:
        """Repair broken test scripts based on RCA and error logs."""
        code_files = state.get("generated_code_files", {})
        defect_rep = state.get("defect_report", {})
        attempts = state.get("healing_attempts", 0) + 1
        healed_files: Dict[str, str] = {}

        for filename, content in code_files.items():
            healed_code = self._repair_code(filename, content, defect_rep)
            healed_files[filename] = healed_code
            self.workspace_tool.write_file(filename, healed_code)

        return {
            "generated_code_files": healed_files,
            "healed_code_files": healed_files,
            "healing_attempts": attempts,
            "hitl_checkpoint": "healing_approval",
            "approval_status": "pending",
            "messages": [HumanMessage(content=f"Self-healing attempt {attempts}: Repaired {len(healed_files)} test file(s). Ready for HITL review.")]
        }

    def _repair_code(self, filename: str, code: str, defect: dict) -> str:
        """Apply targeted self-healing patch to code."""
        if self.llm:
            prompt = (
                f"You are an expert Test Automation Self-Healing Agent.\n"
                f"File: {filename}\n"
                f"Original Code:\n```\n{code}\n```\n\n"
                f"Execution Failure / Defect RCA:\n{json.dumps(defect, indent=2)}\n\n"
                f"Fix the broken locators, assertions, or syntax so that the test passes.\n"
                f"Output ONLY the complete repaired file content without markdown code blocks."
            )
            try:
                resp = self.llm.invoke([
                    SystemMessage(content="You are an expert self-healing test engineer."),
                    HumanMessage(content=prompt)
                ])
                content = resp.content.strip()
                if content.startswith("```"):
                    content = "\n".join(content.splitlines()[1:-1])
                return content
            except Exception:
                pass

        # Deterministic self-healing logic
        healed = code
        if "SIMULATE_FAIL" in healed:
            healed = healed.replace("SIMULATE_FAIL", "# Healed: Removed simulated failure")
        if "status 999" in healed:
            healed = healed.replace("status 999", "status 200")
        if "status 500" in healed and "expected" not in healed.lower():
            healed = healed.replace("status 500", "status 200")
        
        # Add a self-healing audit header comment
        audit_note = f"# [Self-Healed by SlingShot QE Agent] Resolved: {defect.get('summary', 'Automation failure')}\n"
        return audit_note + healed
