# Master Documentation: QE2AI

> **From Quality Engineering to AI Engineering.**  
> A practical, build-first learning platform and repository for Quality Engineers and SDETs transitioning into Generative AI, LLM Engineering, RAG, Agentic AI, Model Context Protocol (MCP), and AI Quality Evaluation.

---

## 🏛️ Monorepo Structure

```text
QE2AI/
├── src/                                    # QE2AI Interactive Web Application (Modern Monochrome)
├── projects/                               # 10 Hands-on Practical Projects
│   ├── 01-fastapi-test-management/         # Track 01: FastAPI Test Management API
│   ├── 02-llm-testcase-generator/          # Track 02: LLM-powered test-case generator
│   ├── 03-llm-qe-assistant/                # Track 03: LLM API-based QE assistant
│   ├── 04-pdf-rag-knowledge-assistant/     # Track 04: PDF RAG / QE Knowledge Assistant
│   ├── 05-ai-test-case-agent/              # Track 05: LangGraph AI Test Case Agent
│   ├── 06-qe-mcp-server/                   # Track 06: Model Context Protocol (MCP) Server for QE
│   ├── 07-ai-powered-qe-eval-agent/        # Track 07: AI QE Agent & Ragas Evaluation Pipeline
│   ├── 08-playwright-ai-workflow/          # Track 08: Playwright + AI Self-Healing Automation
│   ├── 09-deploy-ai-qe-app/                # Track 09: Containerized Docker + GitHub Actions CI/CD
│   ├── 10-production-ai-qe-platform/       # Track 10: Production-Ready AI QE Platform (Guardrails + Observability)
│   └── 11-langchain-deep-agents/           # Track 11: LangChain Deep Agents (Hierarchical Reasoning & QA)
└── README.md                               # Repository Overview
```

---

## 🚀 11 Hands-on Projects Overview

| # | Project | Track | Difficulty | Description |
|---|---|---|---|---|
| **01** | [01-fastapi-test-management](file:///projects/01-fastapi-test-management) | Python for AI | Beginner | High-performance async REST API with Pydantic V2 & SQLite |
| **02** | [02-llm-testcase-generator](file:///projects/02-llm-testcase-generator) | AI Fundamentals | Beginner | CLI tool converting PRDs into positive, negative, and edge test cases |
| **03** | [03-llm-qe-assistant](file:///projects/03-llm-qe-assistant) | LLM Engineering | Intermediate | Stack trace analyzer with Instructor structured JSON outputs |
| **04** | [04-pdf-rag-knowledge-assistant](file:///projects/04-pdf-rag-knowledge-assistant) | RAG | Intermediate | Local ChromaDB vector assistant querying complex software PDFs |
| **05** | [05-ai-test-case-agent](file:///projects/05-ai-test-case-agent) | AI Agents | Advanced | LangGraph cyclic reflection agent testing API specs |
| **06** | [06-qe-mcp-server](file:///projects/06-qe-mcp-server) | MCP | Intermediate | Anthropic MCP server exposing test runners and database queries |
| **07** | [07-ai-powered-qe-eval-agent](file:///projects/07-ai-powered-qe-eval-agent) | AI Quality Engineering | Advanced | Automated CI/CD evaluation gate using Ragas & Faithfulness benchmarks |
| **08** | [08-playwright-ai-workflow](file:///projects/08-playwright-ai-workflow) | Automation | Intermediate | Playwright test suite with dynamic AI self-healing locators |
| **09** | [09-deploy-ai-qe-app](file:///projects/09-deploy-ai-qe-app) | Deployment | Intermediate | Multi-stage Docker container deployed to Google Cloud Run via GitHub Actions |
| **10** | [10-production-ai-qe-platform](file:///projects/10-production-ai-qe-platform) | Production AI | Advanced | Redis semantic caching, LangSmith tracing, and safety guardrails gateway |
| **11** | [11-langchain-deep-agents](file:///projects/11-langchain-deep-agents) | Deep Reasoning | Advanced | Hierarchical multi-agent reasoning architecture with reflection loops & QA |

---

## ⚡ Quickstart (Running the Web App Locally)

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Build production bundle
npm run build
```

---

## 👤 Author & Architecture
- **Creator**: Poorna Chandra Rao J (Senior Quality Engineer & GenAI Practitioner)
- **Design Philosophy**: Pure modern black and white / monochrome aesthetic, high contrast, zero generic AI neon gradients.
