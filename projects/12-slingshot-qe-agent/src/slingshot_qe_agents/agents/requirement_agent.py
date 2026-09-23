"""Requirement Ingestion and Classification Agent for SlingShot QE Agent."""

import json
from typing import Any, Dict
from langchain_core.messages import SystemMessage, HumanMessage

from slingshot_qe_agents.agents.llm_factory import get_chat_model
from slingshot_qe_agents.graph.state import QEAgentState
from slingshot_qe_agents.tools.atlassian_tools import AtlassianTool
from slingshot_qe_agents.tools.swagger_parser import SwaggerParserTool
from slingshot_qe_agents.tools.workspace_tools import WorkspaceContextTool


class RequirementAgent:
    """Agent to parse requirement sources and classify as new vs existing requirement."""

    def __init__(self, workspace_tool: WorkspaceContextTool):
        self.workspace_tool = workspace_tool
        self.atlassian_tool = AtlassianTool()
        self.llm = get_chat_model()

    def process(self, state: QEAgentState) -> Dict[str, Any]:
        """Ingest requirement and determine if it is a new requirement."""
        source = state.get("requirement_source", "nlp")
        raw_input = state.get("raw_input", "")
        parsed_spec = {}

        # 1. Ingestion based on source type
        if source == "jira":
            issue_data = self.atlassian_tool.read_jira_issue(raw_input.strip())
            parsed_spec = {
                "source": "jira",
                "key": issue_data.get("key"),
                "summary": issue_data.get("summary"),
                "description": issue_data.get("description"),
                "acceptance_criteria": issue_data.get("acceptance_criteria", [])
            }
        elif source == "confluence":
            page_data = self.atlassian_tool.read_confluence_page(raw_input.strip())
            parsed_spec = {
                "source": "confluence",
                "title": page_data.get("title"),
                "content": page_data.get("content")
            }
        elif source == "swagger":
            spec_data = SwaggerParserTool.load_spec(raw_input)
            endpoints = SwaggerParserTool.extract_endpoints_summary(spec_data)
            parsed_spec = {
                "source": "swagger",
                "endpoints_count": len(endpoints),
                "endpoints": endpoints,
                "info": spec_data.get("info", {})
            }
        else:  # NLP or Workspace Context
            parsed_spec = {
                "source": "nlp",
                "prompt": raw_input
            }

        # 2. Check workspace context
        ws_context = self.workspace_tool.get_workspace_context()
        all_existing_files = ws_context.get("test_files", [])
        task_type = state.get("task_type", "api")

        # Filter candidate files by task type (.py for UI, .feature for API)
        expected_ext = ".py" if task_type == "ui" else ".feature"
        existing_files = [f for f in all_existing_files if f.endswith(expected_ext)]

        # 3. Classify: New Requirement vs Existing Test Update
        is_new = True
        suggested_changes = None

        if existing_files:
            stopwords = {"test", "tests", "spec", "check", "verify", "with", "from", "that", "this", "heading"}
            keywords = [w.lower() for w in raw_input.split() if len(w) > 3 and w.lower() not in stopwords]
            matched_files = [f for f in existing_files if any(kw in f.lower() for kw in keywords)]
            
            if matched_files:
                is_new = False
                suggested_changes = f"Update existing test file '{matched_files[0]}' to incorporate new specifications."
            elif self.llm:
                prompt = (
                    f"Given requirement: {json.dumps(parsed_spec)}\n"
                    f"Existing test files in workspace: {existing_files}\n"
                    f"Is this a brand new test requirement or a modification to existing tests? "
                    f"Answer with JSON: {{\"is_new\": bool, \"reason\": str, \"suggested_file\": str}}"
                )
                try:
                    resp = self.llm.invoke([
                        SystemMessage(content="You are a Quality Engineering Architect."),
                        HumanMessage(content=prompt)
                    ])
                    text = resp.content.strip()
                    if "{" in text and "}" in text:
                        cleaned = text[text.find("{"):text.rfind("}") + 1]
                        data = json.loads(cleaned)
                        is_new = data.get("is_new", True)
                        if not is_new:
                            suggested_changes = f"Update '{data.get('suggested_file')}' based on requirement updates."
                except Exception:
                    is_new = True

        return {
            "parsed_spec": parsed_spec,
            "workspace_context": ws_context,
            "is_new_requirement": is_new,
            "suggested_changes": suggested_changes,
            "messages": [HumanMessage(content=f"Requirements ingested from {source}. New requirement: {is_new}")]
        }
