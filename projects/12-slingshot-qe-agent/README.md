# SlingShot QE Agent

An autonomous Quality Engineering (QE) Multi-Agent framework for API and UI testing powered by **LangGraph**, **LangChain**, and Python.

![SlingShot QE Agent Architecture](docs/images/slingshot_qe_architecture.jpg)

> [!NOTE]
> For the complete architectural deep-dive, design rationale, and test verification reports, see **[WALKTHROUGH.md](WALKTHROUGH.md)**.

---

## Key Highlights

- **Hierarchical Multi-Agent Graph ("Deep Agents")**: Implemented using LangGraph `StateGraph` with specialized nodes:
  - `RequirementAgent`: Ingestion & New vs. Existing test classification.
  - `ScenarioAgent`: BDD/Gherkin manual test scenario synthesis.
  - `CodeGenAgent`: Test automation writer (Karate DSL for API, Playwright for UI).
  - `RCAAgent`: Root Cause Analysis engine (separates application defects from script bugs).
  - `HealingAgent`: Self-healing code patcher for broken assertions and locators.
- **Human-In-The-Loop (HITL)**: Built-in state pauses using LangGraph `interrupt()` at scenario approval, code review, and self-healing review.
- **Autonomous Self-Healing Loop**: Automatically patches broken test code and re-executes up to configurable retry limits.
- **Dual Execution Engines**:
  - **API**: Karate DSL runner (supports system Maven/Karate CLI and built-in Python runner).
  - **UI**: Headless Playwright Python with Chromium browser automation.

---

## Execution Flow at a Glance

```text
[Requirement Source] ──> [Ingest & Classify]
                              │
                              ├── New Feature? ──────────────> [Generate Scenarios] ──> [HITL 1] ──> [Generate Code] ──> [HITL 2] ──┐
                              └── Existing Suite Update? ────> [Suggest Changes] ──────────────────────────────────────> [HITL 2] ──┤
                                                                                                                                    ▼
                                                                                                                          [Execute Tests]
                                                                                                                                │
                                            [Self-Heal Loop] <── Yes (Attempts < Max) <── Failure Due to Script? <── Failed ───┤
                                            (Heal ──> HITL 3 ──> Re-execute)                                                   │
                                                                                          [Jira Bug Ticket] <── App Bug ───────┤
                                                                                                                               ▼
                                                                                                                         [Passed / Done]
```
For the comprehensive deep dive, see **[WALKTHROUGH.md](WALKTHROUGH.md)**.

---

## Quickstart

### 1. Environment Setup
```bash
# Clone and navigate to project
cd slingshot_qe_agents

# Activate virtual environment
.venv\Scripts\activate

# Configure API keys (optional - deterministic fallback provided)
cp .env.example .env
```

### 2. Choose How to Run

#### Option A: Interactive Web UI Dashboard (Recommended)
```bash
streamlit run dashboard.py
```
*Opens an interactive graphical interface at `http://localhost:8501` with scenario review tables, code viewers, and one-click HITL approvals.*

#### Option B: Terminal Interactive CLI
```bash
# Interactive API test generation (with HITL prompts):
python cli.py --type api --source swagger --input examples/sample_swagger.json

# Interactive UI test generation (with HITL prompts):
python cli.py --type ui --source nlp --input "Test web navigation and heading visibility"

# Headless CI/CD mode:
python cli.py --type api --source swagger --input examples/sample_swagger.json --auto-approve
```

#### Option C: Production REST API Microservice
```bash
python api_server.py
# Swagger UI available at: http://localhost:8000/docs
```

### 3. Run Test Suite
```bash
python -m pytest -v
```

---

## Documentation
- **[WALKTHROUGH.md](WALKTHROUGH.md)**: Deep Agent vs. Normal Agent comparison, state graph diagram, and test results.
- **[INTERVIEW_QUESTIONS.md](INTERVIEW_QUESTIONS.md)**: Real-time scenario-based interview questions & comprehensive answers (Basic to Advanced).
- **[docs/PRODUCTION_GUIDE.md](docs/PRODUCTION_GUIDE.md)**: Enterprise production blueprint (FastAPI microservice, PostgreSQL checkpointer, Slack/Jira HITL webhooks, Docker, and sandboxed execution).


