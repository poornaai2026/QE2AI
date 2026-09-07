# Project 01: FastAPI Test Management API

> **Track 01 — Python for AI**  
> **Difficulty**: Beginner  
> **Repository Path**: `projects/01-fastapi-test-management`

A high-performance asynchronous REST API backend for managing test suites, test run results, and execution metrics with async endpoints and strict Pydantic V2 schema validation.

---

## 🏗️ Architecture

```text
HTTP Client (cURL / Swagger / Frontend)
   │
   ▼
FastAPI Async Router
   │
   ▼
Pydantic V2 Schema Validation (Payload Integrity)
   │
   ▼
SQLite In-Memory Store / Execution DB
   │
   ▼
JSON Response & Interactive OpenAPI Swagger Docs (/docs)
```

---

## 🛠️ Quickstart

```bash
# 1. Navigate to project
cd projects/01-fastapi-test-management

# 2. Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Start development server
uvicorn main:app --reload --port 8000

# 5. Open Swagger UI
# Browse to: http://127.0.0.1:8000/docs
```

---

## 🧪 Running Tests

```bash
pytest test_api.py -v
```
