"""Playwright UI Test Execution Tool for SlingShot QE Agent."""

import os
import subprocess
import sys
from pathlib import Path
from typing import Any, Dict, Optional

from slingshot_qe_agents.graph.state import ExecutionResult


class PlaywrightRunnerTool:
    """Tool to execute UI tests via Playwright Python."""

    def __init__(self, workspace_root: Optional[str] = None):
        self.workspace_root = Path(workspace_root or os.getenv("TEST_WORKSPACE_DIR", "workspace/tests")).resolve()
        self.reports_root = Path(os.getenv("REPORT_WORKSPACE_DIR", "workspace/reports")).resolve()
        self.reports_root.mkdir(parents=True, exist_ok=True)

    def run_tests(self, test_file_path: str) -> ExecutionResult:
        """Execute Playwright Python test file using pytest or direct python runner."""
        target_file = self.workspace_root / test_file_path
        if not target_file.exists():
            return ExecutionResult(
                runner="playwright",
                success=False,
                exit_code=1,
                stderr=f"Test file not found: {target_file}",
                failed_count=1
            )

        # Run with pytest using current python environment
        cmd = [sys.executable, "-m", "pytest", str(target_file), "-v", "--tb=short"]
        try:
            res = subprocess.run(
                cmd,
                cwd=str(self.workspace_root),
                capture_output=True,
                text=True,
                timeout=120
            )

            report_file = self.reports_root / f"playwright_report_{target_file.stem}.txt"
            combined_output = f"STDOUT:\n{res.stdout}\n\nSTDERR:\n{res.stderr}"
            report_file.write_text(combined_output, encoding="utf-8")

            success = (res.returncode == 0)
            passed = 1 if success else 0
            failed = 0 if success else 1

            return ExecutionResult(
                runner="playwright",
                success=success,
                exit_code=res.returncode,
                stdout=res.stdout,
                stderr=res.stderr,
                passed_count=passed,
                failed_count=failed,
                report_file_path=str(report_file),
                details={"exit_code": res.returncode}
            )
        except Exception as e:
            return ExecutionResult(
                runner="playwright",
                success=False,
                exit_code=1,
                stderr=f"Error executing Playwright test: {str(e)}",
                failed_count=1
            )
