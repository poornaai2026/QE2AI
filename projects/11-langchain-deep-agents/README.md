# 🧠 Project 11: LangChain Deep Agents for Autonomous QA & Test Reasoning

> **Hierarchical multi-agent reasoning architecture with LangGraph, plan-and-solve reflection loops, dynamic tool calling, and automated root-cause diagnosis.**

[![Python 3.11+](https://img.shields.io/badge/Python-3.11+-3776AB?style=flat&logo=python&logoColor=white)](https://www.python.org/)
[![LangChain](https://img.shields.io/badge/LangChain-0.3+-blue?style=flat)](https://python.langchain.com/)
[![LangGraph](https://img.shields.io/badge/LangGraph-StateGraph-FF6B6B?style=flat)](https://langchain-ai.github.io/langgraph/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 📺 Featured YouTube Resource

[![LangGraph Deep Agents Masterclass](https://img.shields.io/badge/YouTube-Watch_LangGraph_Deep_Agents_Masterclass-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://www.youtube.com/watch?v=hvAPnpSfSGo)

- **Title**: *LangGraph Deep Agents & Hierarchical Multi-Agent Systems Masterclass*
- **Author**: Harrison Chase & Lance Martin (LangChain Official)
- **Link**: [https://www.youtube.com/watch?v=hvAPnpSfSGo](https://www.youtube.com/watch?v=hvAPnpSfSGo)
- **Why Watch**: The definitive guide to building multi-agent reasoning systems, dynamic task planners, state graphs, and self-evaluating reflection loops.

---

## 🏗️ Architecture Flow

```text
Complex PRD / Bug Stack Trace
              │
              ▼
    [1. Planner Node] ─────────▶ Decomposes task into ordered sub-steps
              │
              ▼
    [2. Worker & Tool Node] ───▶ Executes API probing, DOM inspection & AST syntax checks
              │
              ▼
    [3. Reflection Judge] ────▶ Evaluates acceptance criteria coverage (Positive, Negative, Auth, Bounds)
              │
              ├──▶ If confidence < 0.90 ──▶ Loops back to Planner Node with feedback (Cyclic Graph)
              │
              └──▶ If confidence >= 0.90 ──▶ Synthesizes verified, executable Pytest suite
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Run the Deep Agent
```bash
python agent.py
```

---

## 🎯 What You Master
1. **Hierarchical Multi-Agent Supervision**: Structuring Supervisor and Sub-Agent workers with LangGraph `StateGraph`.
2. **Plan-and-Solve Loops**: Breaking non-deterministic tasks into verifiable atomic operations.
3. **Dynamic Tool Calling**: Equipping agents with AST parsers, API probes, and DOM inspectors.
4. **Self-Correction & Reflection**: Automatically catching hallucinated endpoints before code hits version control.
