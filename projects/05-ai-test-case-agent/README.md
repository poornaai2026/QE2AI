# Project 05: AI Test Case Agent

> **Track 05 — AI Agents**  
> **Difficulty**: Advanced  
> **Repository Path**: `projects/05-ai-test-case-agent`

An autonomous multi-step reasoning agent built with LangGraph that inspects OpenAPI specs, formulates testing strategies, generates Pytest test files, and verifies execution in a local sandbox.

---

## 🏗️ Architecture

```text
OpenAPI Specification
   │
   ▼
LangGraph State Graph Planner Node
   │
   ▼
Endpoint Inspection Tool Node
   │
   ▼
Pytest Code Synthesis Node
   │
   ▼
Execution Sandbox (Run Pytest) ──▶ Fails? ──▶ Self-Correction Edge ──▶ Loops back
   │
   ▼ Pass
Pull Request / Verified Test Suite
```

---

## 🛠️ Quickstart

```bash
cd projects/05-ai-test-case-agent
python -m venv venv
source venv/bin/activate

pip install -r requirements.txt
python agent.py --spec http://127.0.0.1:8000/openapi.json
```
