# Project 06: QE Model Context Protocol (MCP) Server

> **Track 06 — Model Context Protocol (MCP)**  
> **Difficulty**: Intermediate  
> **Repository Path**: `projects/06-qe-mcp-server`

A custom Model Context Protocol (MCP) server that exposes test runner execution, DOM tree inspection, database queries, and test logs directly to AI coding assistants (Claude Desktop, Cursor, Antigravity IDE).

---

## 🏗️ Architecture

```text
AI Host (Claude Desktop / Cursor / Antigravity IDE)
   │
   ▼
MCP Client (JSON-RPC over STDIO / SSE)
   │
   ▼
QE FastMCP Server
   ├── Tools: `run_test_suite`, `inspect_dom_element`, `query_test_logs`
   ├── Resources: `test://logs/latest`, `test://reports/html`
   └── Prompts: `generate_playwright_test`, `debug_flaky_failure`
```

---

## 🛠️ Quickstart

```bash
cd projects/06-qe-mcp-server
python -m venv venv
source venv/bin/activate

pip install -r requirements.txt

# Run FastMCP in development / Inspector mode
fastmcp dev server.py
```
