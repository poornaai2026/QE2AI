# Project 08: AI + Playwright Workflow

> **Track 08 — Automation**  
> **Difficulty**: Intermediate  
> **Repository Path**: `projects/08-playwright-ai-workflow`

An asynchronous, resilient Playwright Python test automation framework equipped with dynamic AI self-healing locators and automated DOM tree recovery.

---

## 🏗️ Architecture

```text
Playwright Test Execution
   │
   ▼
Selector Lookup Fails (NoSuchElementException)
   │
   ▼
AI Self-Healing Hook (Inspects live DOM tree + semantic attributes)
   │
   ▼
Candidate Element Match & Execution Resumption
   │
   ▼
Telemetry Log: Healed selector recorded for review
```

---

## 🛠️ Quickstart

```bash
cd projects/08-playwright-ai-workflow
python -m venv venv
source venv/bin/activate

pip install -r requirements.txt
playwright install chromium

pytest tests/ -v --headed
```
