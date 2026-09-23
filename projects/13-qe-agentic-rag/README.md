# AI-Powered Agentic Quality Engineering (QE) Platform

[![Python 3.13](https://img.shields.io/badge/Python-3.13-blue.svg)](https://www.python.org/)
[![LangGraph](https://img.shields.io/badge/Orchestrator-LangGraph-orange.svg)](https://github.com/langchain-ai/langgraph)
[![LangChain RAG](https://img.shields.io/badge/RAG-LangChain%20%2B%20Pinecone-green.svg)](https://www.langchain.com/)
[![FastMCP](https://img.shields.io/badge/Tool_Protocol-FastMCP-purple.svg)](https://github.com/jlowin/fastmcp)
[![Ragas Gate](https://img.shields.io/badge/AI_Quality_Gate-Ragas%20(%E2%89%A50.85)-brightgreen.svg)](https://github.com/explodinggradients/ragas)
[![Playwright](https://img.shields.io/badge/Browser_Automation-Playwright-red.svg)](https://playwright.dev/)
[![Docker](https://img.shields.io/badge/Container-Docker-blue.svg)](https://www.docker.com/)

> An enterprise-grade **Agentic AI Quality Engineering Platform** that autonomously converts Jira requirements and Confluence business domain knowledge into validated, traceable Playwright test automation suites, complete with self-healing feedback loops, Ragas AI quality gates, FastMCP standardized tool protocols, and automated failure root-cause analysis.

---

## Architecture Overview

```
                    ┌──────────────────────────────┐
                    │       Jira & Confluence      │
                    │   Requirements & Knowledge   │
                    └──────────────┬───────────────┘
                                   │
                    ┌──────────────▼───────────────┐
                    │         RAG Pipeline         │
                    │   LangChain + Pinecone/FAISS │
                    └──────────────┬───────────────┘
                                   │
                    ┌──────────────▼───────────────┐
                    │      LangGraph Orchestrator  │
                    │   Stateful Agentic Workflow  │
                    └──────────────┬───────────────┘
                                   │
        ┌──────────────────────────┼──────────────────────────┐
        │                          │                          │
        ▼                          ▼                          ▼
 ┌───────────────┐        ┌──────────────────┐       ┌─────────────────┐
 │  Requirement  │───────►│  Test Generator  │◄─────►│  AI Validation  │
 │     Agent     │        │      Agent       │ (Loop)│     Agent       │
 └───────────────┘        └────────┬─────────┘       └─────────────────┘
                                   │ (Validation PASS)
                          ┌────────▼─────────┐
                          │ Ragas Evaluation │
                          │ & AI Quality Gate│
                          └────────┬─────────┘
                                   │ (Score >= 0.85)
                          ┌────────▼─────────┐
                          │  MCP Tool Layer  │
                          │   (FastMCP API)  │
                          └────────┬─────────┘
                                   │
                          ┌────────▼─────────┐
                          │ Playwright Pytest│
                          │ Test Automation  │
                          └────────┬─────────┘
                                   │
                          ┌────────▼─────────┐
                          │AI Failure & Root │
                          │Cause Analyzer    │
                          └────────┬─────────┘
                                   │
                          ┌────────▼─────────┐
                          │ Quality Report & │
                          │ Live Dashboard   │
                          └──────────────────┘
```

---

## Key Features

1. **Jira & Confluence Ingestion via Hybrid RAG (BM25 + Dense + RRF)**:
   - Ingests Jira user stories and acceptance criteria.
   - Pairs **Okapi BM25 Sparse Indexing** with **Dense Semantic Vector Search** (Pinecone/FAISS) fused via **Reciprocal Rank Fusion (RRF)** ($k=60$) to guarantee exact error code, regex, and DOM selector retrieval without semantic degradation.
2. **LangGraph Stateful Orchestration with Durable Checkpointing & HITL**:
   - Directed acyclic and cyclic state machine modeling the complete quality engineering lifecycle.
   - Preserves execution state across sessions with **`MemorySaver` checkpointer**.
   - Includes optional **Human-in-the-Loop (HITL) QA Sign-off Gate** before advancing to test execution.
3. **AI Validation Agent with Self-Healing Feedback Loop**:
   - Validates test cases against acceptance criteria.
   - Audits for hallucinations and contradictions (e.g. catches a test attempting 3 lockout attempts when AC mandates 5).
   - Dynamically rejects faulty tests and re-routes back to the generator with targeted critique for automated self-correction.
4. **Ragas AI Quality Gate & Multi-Tier Model Cascading**:
   - Computes Faithfulness, Answer Relevance, Context Precision, and Context Recall.
   - Enforces a hard quality threshold ($\ge 0.85$) blocking ungrounded tests from automated code execution.
   - Routes requests dynamically between **Tier 1 (Fast / Cost-Efficient)** and **Tier 2 (Advanced Frontier)** models, tracking tokens, latency, and dollar cost in real time.
5. **Standardized Model Context Protocol (FastMCP)**:
   - Exposes tools: `get_requirement`, `search_knowledge`, `create_test_case`, `generate_playwright_test`, `execute_test`, `create_defect`.
   - Decouples AI reasoning from testing and enterprise tooling.
6. **Playwright Automation with Active In-Flight Self-Healing**:
   - Generates production-ready Python Playwright (`pytest-playwright`) test suites using standardized `data-testid` locators.
   - **Active In-Flight Healer (`SelfHealingLocator`)**: Intercepts `TimeoutError` exceptions live during browser execution, extracts candidate DOM elements, scores them via multi-vector heuristics, and heals locators on the fly.
7. **AI Failure Analysis & Root Cause Diagnosis**:
   - Ingests test code, pytest stack traces, locator failures, and DOM snapshots.
   - Classifies failures into `LOCATOR_DRIFT`, `APPLICATION_DEFECT`, `AUTOMATION_DEFECT`, `TEST_DATA_ISSUE`, or `ENVIRONMENT_ISSUE`.
   - Produces suggested code diffs and files structured Jira defect tickets via MCP.
8. **Interactive High-Aesthetics UI Dashboard**:
   - Modern dark mode with glassmorphic cards, live LangGraph flow status, Ragas gauges, real-time Telemetry Bar, In-Flight Healing toggle, and embedded target app preview.

---

## Technology Stack

| Layer | Technology |
|---|---|
| **Language** | Python 3.13 |
| **API Backend** | FastAPI, Uvicorn |
| **Agent Orchestration** | LangGraph (StateGraph with conditional loops) |
| **LLM Integration** | LangChain Core (Dual Provider: OpenAI / Gemini with local fallback) |
| **Vector DB / RAG** | Pinecone & FAISS (In-Memory Fallback) |
| **Tool Protocol** | FastMCP (Model Context Protocol) |
| **LLM / RAG Evaluation** | Ragas (Faithfulness, Relevance, Precision, Recall) |
| **Test Automation** | Python Playwright, Pytest, Pytest-Playwright |
| **Containerization** | Docker, Docker Compose |
| **CI/CD** | GitHub Actions Workflow with Quality Gates |

---

## Quickstart Guide

### 1. Run with Python (Local Virtual Environment)
```bash
# Activate virtual environment
.\.venv\Scripts\Activate.ps1

# Launch Platform & Target Application
python run.py
```
Open **`http://localhost:8000`** in your browser to view the interactive dashboard!

### 2. Run with Docker Compose
```bash
docker-compose up --build
```

### 3. Run Automated Test Suite
```bash
pytest -v
```

---

## Interview & Resume Documentation
- [High-Level Understanding: RAG vs Agents](docs/HIGH_LEVEL_UNDERSTANDING.md)
- [Architecture Deep Dive](docs/ARCHITECTURE.md)
- [Senior GenAI QE Interview Cheatsheet & Talking Points](docs/INTERVIEW_CHEATSHEET.md)
- [Platform User Guide](docs/USER_GUIDE.md)
- [Complete Project Walkthrough & Verification](docs/WALKTHROUGH.md)

