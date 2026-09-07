# Project 02: LLM-Powered Test-Case Generator

> **Track 02 — AI Fundamentals**  
> **Difficulty**: Beginner  
> **Repository Path**: `projects/02-llm-testcase-generator`

A CLI utility converting raw product requirements and user stories into comprehensive positive, negative, boundary, and edge test scenarios using LLM prompt engineering.

---

## 🏗️ Architecture

```text
Requirement Specification (.txt / .md)
   │
   ▼
Prompt Template & Context Injector
   │
   ▼
LLM API (Gemini Flash / OpenAI / Groq)
   │
   ▼
JSON / Markdown Test Matrix Output
```

---

## 🛠️ Setup & Execution

```bash
cd projects/02-llm-testcase-generator
python -m venv venv
source venv/bin/activate

pip install -r requirements.txt

export GEMINI_API_KEY="your_api_key_here"  # Or OPENAI_API_KEY
python generate_tests.py --input sample_requirement.txt --output test_matrix.json
```
