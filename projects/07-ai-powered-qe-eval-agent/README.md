# Project 07: AI-Powered QE Evaluation Agent

> **Track 07 — AI Quality Engineering**  
> **Difficulty**: Advanced  
> **Repository Path**: `projects/07-ai-powered-qe-eval-agent`

An automated evaluation pipeline that benchmarks Generative AI applications against version-controlled golden datasets using Ragas and DeepEval, asserting Faithfulness, Context Precision, and blocking pull requests in CI/CD.

---

## 🏗️ Architecture

```text
Git PR / Prompt Modification
   │
   ▼
GitHub Action Trigger
   │
   ▼
Pytest AI Quality Gate (`pytest test_eval_gate.py`)
   ├── Multi-Metric Benchmark (Ragas Faithfulness >= 0.88)
   ├── Context Precision Check (>= 0.85)
   └── Hallucination Rate Verification (< 3%)
   │
   ▼
Pass ──▶ Merge Approved | Fail ──▶ PR Blocked & Annotated with Scorecard
```

---

## 🛠️ Quickstart

```bash
cd projects/07-ai-powered-qe-eval-agent
python -m venv venv
source venv/bin/activate

pip install -r requirements.txt
pytest test_eval_gate.py -v
```
