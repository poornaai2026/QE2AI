"""Workspace context and file system tools for SlingShot QE Agent."""

import os
from pathlib import Path
from typing import Any, Dict, List, Optional


class WorkspaceContextTool:
    """Tool for reading, writing, and inspecting test files and reports in workspace."""

    def __init__(self, workspace_root: Optional[str] = None):
        self.workspace_root = Path(workspace_root or os.getenv("TEST_WORKSPACE_DIR", "workspace/tests")).resolve()
        self.reports_root = Path(os.getenv("REPORT_WORKSPACE_DIR", "workspace/reports")).resolve()
        self.workspace_root.mkdir(parents=True, exist_ok=True)
        self.reports_root.mkdir(parents=True, exist_ok=True)

    def list_existing_test_files(self) -> List[str]:
        """List all test files (Karate .feature, Python test_*.py) in workspace."""
        if not self.workspace_root.exists():
            return []
        
        test_files = []
        for path in self.workspace_root.rglob("*"):
            if "__pycache__" in path.parts or path.suffix in [".pyc", ".pyo"]:
                continue
            if path.is_file() and path.suffix in [".feature", ".py"]:
                rel_path = path.relative_to(self.workspace_root).as_posix()
                test_files.append(rel_path)
        return sorted(test_files)

    def read_file(self, relative_path: str) -> Optional[str]:
        """Read content of a test file in the workspace."""
        file_path = self.workspace_root / relative_path
        if file_path.exists() and file_path.is_file():
            try:
                return file_path.read_text(encoding="utf-8", errors="replace")
            except Exception:
                return None
        return None

    def write_file(self, relative_path: str, content: str) -> str:
        """Write or overwrite a test file in the workspace."""
        file_path = self.workspace_root / relative_path
        file_path.parent.mkdir(parents=True, exist_ok=True)
        file_path.write_text(content, encoding="utf-8")
        return file_path.as_posix()

    def save_report(self, report_filename: str, content: str) -> str:
        """Save defect or execution report in reports directory."""
        file_path = self.reports_root / report_filename
        file_path.parent.mkdir(parents=True, exist_ok=True)
        file_path.write_text(content, encoding="utf-8")
        return file_path.as_posix()

    def get_workspace_context(self) -> Dict[str, Any]:
        """Get summary of existing tests, libraries, and test structure."""
        files = self.list_existing_test_files()
        file_previews = {}
        for f in files[:10]:  # limit to top 10 files for context efficiency
            content = self.read_file(f)
            if content:
                # Include first 15 lines as preview
                lines = content.splitlines()[:15]
                file_previews[f] = "\n".join(lines)
        
        return {
            "workspace_path": self.workspace_root.as_posix(),
            "total_test_files": len(files),
            "test_files": files,
            "previews": file_previews
        }
