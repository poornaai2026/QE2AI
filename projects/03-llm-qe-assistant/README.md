# Project 03: LLM API-Based QE Assistant

> **Track 03 — LLM Engineering**  
> **Difficulty**: Intermediate  
> **Repository Path**: `projects/03-llm-qe-assistant`

Failure log analyzer and root-cause analysis assistant utilizing strict Pydantic V2 schema validation and Instructor for guaranteed structured JSON responses.

---

## 🏗️ Architecture

```text
Test Failure Log / Stack Trace
   │
   ▼
Instructor + Pydantic Response Schema
   │
   ▼
LLM Function Calling (Query Jira / Logs)
   │
   ▼
Typed Root Cause Analysis (RCA) & Target Automated Test Recommendation
```

---

## 🛠️ Quickstart

```bash
cd projects/03-llm-qe-assistant
python -m venv venv
source venv/bin/activate

pip install -r requirements.txt
export OPENAI_API_KEY="your_api_key"

python assistant.py --log sample_error.log
```
