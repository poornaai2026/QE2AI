# Walkthrough: AI-Powered Agentic Quality Engineering (QE) Platform

## Project Overview
We have designed, architected, and fully implemented the **Enterprise-Grade AI-Powered Agentic Quality Engineering (QE) Platform** in `d:/GEN_AI_Learning/Gen_Ai_job_prep/RAG/QE_Agentic_RAG`.

The platform automates the end-to-end QE lifecycle:
1. **Jira Requirements Ingestion & Confluence Domain Knowledge RAG**:
   - Hybrid search pairing **Okapi BM25 Sparse Indexing** and **Dense Semantic Embeddings** (Pinecone / FAISS) fused via **Reciprocal Rank Fusion (RRF)** ($k=60$) for exact error code, regex, and selector precision.
2. **LangGraph Stateful Agentic Workflow with Durable Checkpointing**:
   - Compiles with **`MemorySaver` checkpointer** to enable session persistence and Human-in-the-Loop (HITL) pause/resume.
   - **Requirement Analysis Agent**: Deconstructs Jira acceptance criteria.
   - **Test Case Generation Agent**: Synthesizes Positive, Negative, Boundary, and Security scenarios.
   - **AI Validation Agent (The Critic)**: Evaluates coverage, audits contradictions/hallucinations, and enforces a **Self-Healing Loop** ($\text{Generate} \rightarrow \text{Validate} \rightarrow \text{Reject} \rightarrow \text{Regenerate} \rightarrow \text{Pass}$).
3. **Ragas AI Quality Gate & Multi-Tier Model Cascading**:
   - Enforces $\ge 0.85$ threshold across Faithfulness, Answer Relevance, Context Precision, and Context Recall.
   - Dynamic model tier routing: **Tier 1 (Fast / Cost-Efficient)** for high-volume categorization vs **Tier 2 (Advanced Frontier)** for complex reasoning, with token economics and cost tracking.
4. **FastMCP Standardized Tool Interface**: Standardized tool endpoints for Jira, RAG, Playwright test generation, execution, and defect creation.
5. **Playwright Test Automation with Active In-Flight Self-Healing**:
   - Generates clean Python Playwright scripts with standardized locators.
   - **`SelfHealingLocator`**: Intercepts `TimeoutError` in real-time browser sessions, extracts candidate DOM elements, scores them via multi-vector heuristics, heals locators live, and continues execution.
6. **Synthetic Test Data Generator & Boundary Fuzzer (`SyntheticDataAgent`)**:
   - Synthesizes PII-safe test fixtures across 4 tiers (Valid Happy Path, Boundary Conditions, Security Fuzz Payloads, and PII Masking/Pseudonymization).
7. **GitOps Self-Healing Auto-PR & Code Patch Engine (`GitOpsEngine`)**:
   - Directly applies verified locator code diffs to test scripts with AST syntax validation and backup creation (`apply_locator_patch`).
   - Automatically generates structured GitHub Pull Requests (`create_pull_request`) complete with unified diffs, branch naming, and Jira cross-links.
8. **Golden Evaluation Benchmark Dataset (`golden_dataset.json`)**:
   - Curated ground-truth test cases and policy mappings for empirical Ragas Precision, Recall, and Faithfulness calibration.
9. **Built-in Target Demo Web Application**: Enterprise login portal with toggleable Bug Mode to simulate real browser locator drift and premature lockout.
10. **AI Failure Analysis & Root Cause Classifier**: Diagnoses locator drift, business rule violations, and environment issues from browser execution traces, outputting automated code diffs and filing defects in Jira.
11. **Modern Interactive Dashboard**: Sleek dark-mode dashboard with real-time LangGraph pipeline visualization, Ragas metric gauges, live Telemetry Bar (Tokens, Cost, Latency), QA Sign-Off Gate, In-Flight Healing toggle, Synthetic Test Data Inspector, and GitOps PR preview modal.
12. **CI/CD & Containerization**: Dockerfile, `docker-compose.yml`, and GitHub Actions workflow.

---

## Architectural Verification & Test Results

All **27 automated tests** across RAG, Hybrid RRF, LangGraph loops & checkpointing, FastMCP tools, Playwright browser automation, Active In-Flight Self-Healing, AI Failure Analysis, Synthetic Test Data, GitOps PR creation, and Golden Quality Gate benchmarks pass with **100% success**:

```bash
platform win32 -- Python 3.13.12, pytest-9.1.1, playwright-0.9.0
configfile: pytest.ini
testpaths: tests

tests/test_enterprise_features.py::test_bm25_exact_token_retrieval PASSED       [  3%]
tests/test_enterprise_features.py::test_hybrid_rrf_fusion PASSED               [  7%]
tests/test_enterprise_features.py::test_model_cascade_telemetry PASSED         [ 11%]
tests/test_enterprise_features.py::test_active_in_flight_self_healing_executor PASSED [ 14%]
tests/test_failure_analysis.py::test_locator_drift_classification PASSED       [ 18%]
tests/test_failure_analysis.py::test_application_defect_classification PASSED  [ 22%]
tests/test_failure_analysis.py::test_environment_issue_classification PASSED   [ 25%]
tests/test_golden_quality_gate.py::test_golden_dataset_file_structure PASSED   [ 29%]
tests/test_golden_quality_gate.py::test_load_golden_benchmark PASSED           [ 33%]
tests/test_golden_quality_gate.py::test_evaluate_ragas_metrics_against_golden_dataset PASSED [ 37%]
tests/test_golden_quality_gate.py::test_golden_quality_gate_fails_on_hallucination PASSED [ 40%]
tests/test_langgraph_workflow.py::test_langgraph_full_workflow_execution PASSED [ 44%]
tests/test_mcp_tools.py::test_mcp_get_requirement PASSED                       [ 48%]
tests/test_mcp_tools.py::test_mcp_search_knowledge PASSED                      [ 51%]
tests/test_mcp_tools.py::test_mcp_create_test_case PASSED                      [ 55%]
tests/test_mcp_tools.py::test_mcp_generate_playwright_test PASSED              [ 59%]
tests/test_mcp_tools.py::test_mcp_create_defect PASSED                         [ 62%]
tests/test_rag_pipeline.py::test_confluence_document_loading PASSED            [ 66%]
tests/test_rag_pipeline.py::test_document_chunking PASSED                      [ 70%]
tests/test_rag_pipeline.py::test_vector_store_similarity_search PASSED         [ 74%]
tests/test_real_playwright.py::test_e2e_playwright_execution_against_target_app PASSED [ 77%]
tests/test_real_playwright.py::test_e2e_playwright_failure_analysis_on_bug PASSED [ 81%]
tests/test_synthetic_and_gitops.py::test_synthetic_data_generation_auth PASSED [ 85%]
tests/test_synthetic_and_gitops.py::test_synthetic_data_generation_checkout PASSED [ 88%]
tests/test_synthetic_and_gitops.py::test_gitops_patch_application PASSED       [ 92%]
tests/test_synthetic_and_gitops.py::test_gitops_pull_request_creation PASSED   [ 96%]
tests/test_synthetic_and_gitops.py::test_mcp_tools_synthetic_and_gitops PASSED [100%]

============================= 27 passed in 16.97s =============================
```

---

## Key Files & Repository Layout

- **`run.py`**: Master launcher starting both the Target Demo Web App (`:8080`) and Agentic QE Platform (`:8000`).
- **`app/config.py`**: Pydantic Settings supporting OpenAI, Gemini, Pinecone, and offline fallbacks.
- **`app/data/jira_sample.json`**: Enterprise user stories (`AUTH-101`, `CHECKOUT-204`) with granular Acceptance Criteria.
- **`app/data/confluence_docs/`**: Markdown policies covering authentication security, account lockout thresholds, and UI locator standards.
- **`app/rag/`**:
  - `chunker.py`: Document chunking with markdown header boundaries.
  - `embeddings.py`: Deterministic fallback and provider embeddings.
  - `hybrid_search.py`: Okapi BM25 sparse keyword retriever and Reciprocal Rank Fusion (RRF).
  - `vector_store.py`: Hybrid dense + sparse vector index.
- **`app/agents/`**:
  - `state.py`: TypedDict & Pydantic models.
  - `requirement_agent.py`: Requirement analyzer & RAG search query formulator.
  - `synthetic_data_agent.py`: PII-safe synthetic test data & fuzzing generator.
  - `test_gen_agent.py`: Test case generator with self-healing feedback consumer.
  - `validation_agent.py`: Critic auditing requirement coverage and contradiction/hallucinations.
  - `ragas_evaluator.py`: Ragas metrics calculator (Faithfulness, Relevance, Precision, Recall).
  - `model_cascade.py`: Tier 1 vs Tier 2 routing and token economics telemetry.
  - `playwright_gen_agent.py`: Playwright script generator.
  - `failure_analyzer_agent.py`: AI failure classifier & code diff suggester.
  - `graph.py`: Compiled LangGraph state machine with conditional loopback & `MemorySaver` checkpointer.
- **`app/gitops/`**:
  - `patch_engine.py`: AST-verified locator code patcher and GitOps PR synthesizer.
- **`app/data/golden_dataset.json`**: Enterprise Golden Ground-Truth Evaluation Benchmark Dataset with vetted policy annotations, test cases, and quality gate targets.
- **`app/agents/ragas_evaluator.py`**: Ragas Quality Gate evaluator calibrating empirical Context Precision, Recall, Faithfulness, and Answer Relevance against `golden_dataset.json`.
- **`tests/test_golden_quality_gate.py`**: Automated test suite validating Golden Dataset structure, benchmark retrieval, metric calibration, and anti-hallucination halts.
- **`app/mcp/server.py`**: FastMCP server exposing standardized QA tools.
- **`app/target_app/`**: Enterprise authentication web app with toggleable Bug Mode.
- **`app/test_runner/`**:
  - `executor.py`: Subprocess pytest executor & failure reporter.
  - `self_healer.py`: Live in-flight Playwright DOM candidate discovery and healing.
- **`app/server/`**: FastAPI REST API and modern interactive dashboard (`static/index.html`, `styles.css`, `app.js`).
- **`docs/`**:
  - `ARCHITECTURE.md`: Complete architectural deep dive.
  - `INTERVIEW_CHEATSHEET.md`: Word-for-word pitch and technical interview defense.
  - `USER_GUIDE.md`: Step-by-step user guide and live demonstration script.
  - `WALKTHROUGH.md`: Project walkthrough and verification summary.
- **`Dockerfile` & `docker-compose.yml`**: Production containerization.
- **`.github/workflows/agentic_qe_ci.yml`**: GitHub Actions CI with AI Quality Gate enforcement.

---

## How to Run & Demo the Platform

### 1. Launch Platform
```bash
# In PowerShell:
.\.venv\Scripts\Activate.ps1
python run.py
```

### 2. Live Demo Flow in Browser (`http://localhost:8000`)
1. **Trigger Agentic QE Loop**: Select `AUTH-101` and click **"⚡ Run Agentic QE Workflow"**.
   - Watch the LangGraph state machine progress through nodes in real-time.
   - Observe the **AI Validation Critic** flag a contradiction on TC006, trigger the **⟲ Self-Healing Loop**, and regenerate a verified test suite.
2. **Review Ragas Quality Gate Calibrated Against Golden Benchmark**:
   - Inspect the **Faithfulness (0.96)**, **Answer Relevance (0.93)**, **Context Precision (0.88)**, and **Context Recall (0.92)** cards.
   - Notice the log: `[GoldenDataset] 🎯 Calibrating against Vetted Golden Benchmark for AUTH-101...`
   - Notice the log: `[GoldenDataset] Verified Context Grounding against 3 Golden Policy Documents.`
3. **Execute Real Browser Tests**:
   - Click **"▶ Run Playwright"** to run Chromium browser automation live against `http://localhost:8080/login`.
4. **Demonstrate Active In-Flight Self-Healing**:
   - Leave **"🛠 In-Flight Healing: ON"** active.
   - Click **"🐞 Target Bug: Off"** to activate locator drift on the target app.
   - Click **"▶ Run Playwright"**. The live executor detects the missing selector, searches DOM candidates, heals it in-flight, and allows the test to succeed!
5. **Demonstrate Post-Mortem AI Failure Analysis**:
   - Toggle **"🛠 In-Flight Healing: OFF"**.
   - With Bug Mode ON, click **"▶ Run Playwright"**.
   - The test fails, and the dashboard transitions to the **AI Failure Analysis** tab, showing root cause diagnosis (`LOCATOR_DRIFT`), suggested code diff, and a button to file a defect in Jira via MCP!
6. **Inspect Enterprise Telemetry Bar**:
   - Observe the real-time telemetry strip at the top of the dashboard displaying active **Model Tier** (e.g. `Tier 1: Fast`), **Tokens In/Out**, **Execution Latency**, and **Estimated Cost ($)**.
7. **Inspect Synthetic Test Data & Boundary Fuzzer**:
   - Switch to the **"🧬 Synthetic Test Data"** tab to view generated fixtures: Valid happy-path accounts, boundary values (empty strings, unicode/emojis), and security fuzz vectors (SQLi, XSS, user enumeration probes).
8. **Demonstrate GitOps Auto-Patch & Healed Pull Request**:
   - In the AI Failure Analysis tab, click **"⚡ Auto-Apply Code Patch"** to apply the verified locator patch directly to `test_auth_101.py` with AST syntax validation.
   - Click **"🚀 Open Healed PR (GitOps)"** to preview the GitHub Pull Request modal with branch name, unified diff, and merge-ready status!
9. **Inspect Golden Evaluation Benchmark API**:
   - Access `http://localhost:8000/api/quality-gate/golden-dataset` to review the enterprise ground-truth datasets for `AUTH-101` and `CHECKOUT-204`.

---

## Real-Time Production & Interview Scenarios Covered

The companion interview guide [`docs/INTERVIEW_CHEATSHEET.md`](docs/INTERVIEW_CHEATSHEET.md) includes detailed architectural defenses and verbatim answers for 7 high-stakes production incident scenarios:
1. **Preventing False Positive Self-Healing** (ensuring the in-flight healer doesn't click "Cancel" instead of "Submit").
2. **LLM Outages & 429 Rate Limits** (automatic model cascade fallback to offline deterministic rules and FAISS).
3. **Asynchronous Hydration & Race Conditions** (Playwright auto-waiting contracts vs naive static sleeps).
4. **Test Data Collisions in Parallel CI/CD** (cryptographically salted tenant isolation per runner).
5. **Knowledge Base Drift & Conflicting Specs** (Jira AC single-source-of-truth hierarchy and critic contradiction audits).
6. **Cost Explosion & Infinite Cycles** (recursion bounds and token economics monitoring).
7. **Prompt Injection Defense** (Pydantic structured output typing and execution sandboxing).
8. **Adapting to Existing Frameworks (Page Object Model, pytest-bdd / Gherkin, Custom Fixtures)** (ingesting corporate base classes and step definitions via RAG and few-shot template conditioning).



