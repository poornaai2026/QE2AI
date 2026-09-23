# Agentic QE Platform User Guide & Quickstart

## 1. Setup & Installation

### Option A: Local Virtual Environment (Recommended)
```bash
# 1. Activate project virtual environment
.\.venv\Scripts\Activate.ps1

# 2. Run the platform launcher
python run.py
```

### Option B: Docker Compose
```bash
docker-compose up --build
```

---

## 2. Platform Access Endpoints
Once launched, the following services will be accessible:
- **Agentic QE Live Dashboard**: `http://localhost:8000`
- **Target Enterprise Web App**: `http://localhost:8080/login`
- **FastAPI OpenAPI Interactive Docs**: `http://localhost:8000/docs`

---

## 3. Step-by-Step Live Demonstration Walkthrough

### Step 1: Run Agentic QE Workflow
1. Open `http://localhost:8000`.
2. Ensure **Jira: AUTH-101** is selected in the top bar.
3. Click **"⚡ Run Agentic QE Workflow"**.
4. Observe the interactive LangGraph pipeline:
   - Node 1: Analyzes Jira user story & 6 Acceptance Criteria.
   - Node 2: Queries Confluence RAG knowledge base.
   - Node 3: Synthesizes initial test suite.
   - Node 4: AI Validation critic catches subtle contradiction in TC006.
   - Node 5: Triggers **⟲ Self-Healing Loop** and regenerates corrected test suite.
   - Node 6: AI Validation passes, Ragas metrics calculated (>0.85).
   - Node 7: Python Playwright suite is generated and displayed.

### Step 2: Run Automated Playwright Tests
1. Click **"▶ Run Playwright"**.
2. Chromium browser executes all 6 test cases against the live target application.
3. Observe all tests pass with sub-second execution timings.

### Step 3: Demonstrate AI Failure Analysis (Locator Drift)
1. In the top bar, click **"🐞 Target Bug: Off"** to toggle it to **"🐞 Target Bug: ON"**.
2. Notice the target app updates to simulate developer refactoring (removing `data-testid='button-login'` and using a legacy selector).
3. Click **"▶ Run Playwright"**.
4. The test fails with a `TimeoutError`.
5. The platform automatically transitions to the **AI Failure Analysis** tab:
   - Classifies error as: `LOCATOR_DRIFT`.
   - Explains root cause: DOM locator refactored.
   - Displays suggested code diff.
   - Click **"📋 Create Defect in Jira (via MCP)"** to register a formal bug report!

### Step 4: Explore Synthetic Test Data & Boundary Fuzzing
1. Click the **"🧬 Synthetic Test Data"** tab in the dashboard.
2. Review the 4 generated fixture tiers:
   - **Valid Happy Path**: Schema-compliant test user accounts.
   - **Boundary Conditions**: Max lengths, empty fields, Unicode and emoji character strings.
   - **Security / Fuzz Payloads**: SQL injection, reflected XSS, and user enumeration payloads.
   - **PII Compliance**: Cryptographically salted pseudonymous test IDs ensuring GDPR compliance.

### Step 5: GitOps Auto-Patch & Healed Pull Request Workflow
1. When an AI Failure analysis identifies `LOCATOR_DRIFT`, click **"⚡ Auto-Apply Code Patch"**.
2. The platform creates a `.bak` backup and safely updates the Playwright test file using AST validation.
3. Click **"🚀 Open Healed PR"** to review the auto-generated Git branch, unified code diff, and automated test execution verification report.

### Step 6: Verify the Golden Evaluation Dataset & Ragas Quality Gates
1. Inspect the Golden Dataset API endpoint:
   ```bash
   curl http://localhost:8000/api/quality-gate/golden-dataset
   ```
2. View the curated ground-truth policy documents, Acceptance Criteria, and expected assertions in `app/data/golden_dataset.json`.
3. Run the automated Golden Quality Gate test suite:
   ```bash
   python -m pytest -v tests/test_golden_quality_gate.py
   ```
   All 4 tests validate dataset schema, benchmark loading, empirical calibration, and anti-hallucination halts.
