"""Unit tests for SlingShot QE Agent tools."""

import tempfile
from pathlib import Path
import pytest

from slingshot_qe_agents.tools.swagger_parser import SwaggerParserTool
from slingshot_qe_agents.tools.workspace_tools import WorkspaceContextTool
from slingshot_qe_agents.tools.atlassian_tools import AtlassianTool
from slingshot_qe_agents.tools.karate_runner import KarateRunnerTool


def test_swagger_parser():
    spec_path = Path("examples/sample_swagger.json")
    spec_data = SwaggerParserTool.load_spec(str(spec_path))
    assert "paths" in spec_data
    
    endpoints = SwaggerParserTool.extract_endpoints_summary(spec_data)
    assert len(endpoints) >= 2
    paths = [ep["path"] for ep in endpoints]
    assert "/post" in paths


def test_workspace_context_tool():
    with tempfile.TemporaryDirectory() as tmp_dir:
        ws = WorkspaceContextTool(workspace_root=tmp_dir)
        written_path = ws.write_file("auth/test_login.feature", "Feature: Login")
        assert Path(written_path).exists()
        
        content = ws.read_file("auth/test_login.feature")
        assert content == "Feature: Login"
        
        files = ws.list_existing_test_files()
        assert "auth/test_login.feature" in files
        
        context = ws.get_workspace_context()
        assert context["total_test_files"] == 1


def test_atlassian_mock_tool():
    tool = AtlassianTool()
    issue = tool.read_jira_issue("SLING-200")
    assert issue["key"] == "SLING-200"
    assert "acceptance_criteria" in issue
    
    page = tool.read_confluence_page("Spec-1")
    assert "content" in page
    
    bug = tool.create_defect_ticket("API Crash", "Received 500")
    assert bug["created"] is True


def test_karate_runner_success():
    with tempfile.TemporaryDirectory() as tmp_dir:
        ws = WorkspaceContextTool(workspace_root=tmp_dir)
        feature_content = (
            "Feature: Sample\n"
            "Scenario: Valid GET\n"
            "  Given path '/get'\n"
            "  When method get\n"
            "  Then status 200\n"
        )
        ws.write_file("sample.feature", feature_content)
        
        runner = KarateRunnerTool(workspace_root=tmp_dir)
        result = runner.run_tests("sample.feature")
        assert result.success is True
        assert result.passed_count == 1
        assert result.failed_count == 0


def test_karate_runner_failure_simulation():
    with tempfile.TemporaryDirectory() as tmp_dir:
        ws = WorkspaceContextTool(workspace_root=tmp_dir)
        feature_content = (
            "Feature: Sample\n"
            "Scenario: Broken scenario\n"
            "  Given path '/get'\n"
            "  When method get\n"
            "  Then status 999\n"
        )
        ws.write_file("broken.feature", feature_content)
        
        runner = KarateRunnerTool(workspace_root=tmp_dir)
        result = runner.run_tests("broken.feature")
        assert result.success is False
        assert result.failed_count == 1


def test_data_generator_tool():
    from slingshot_qe_agents.tools.data_generator import DataGeneratorTool
    
    email = DataGeneratorTool.generate_email("qa")
    assert "@example.com" in email
    assert email.startswith("qa_")
    
    order = DataGeneratorTool.generate_order_payload(item_id="ITEM-101")
    assert order["item_id"] == "ITEM-101"
    assert "amount" in order
    assert order["currency"] == "USD"
    
    user = DataGeneratorTool.generate_user_profile()
    assert "email" in user
    assert "password" in user
    assert "phone" in user

