# Agentic Quality Engineering (QE) Platform Architecture

## Executive Architecture Summary
The **Agentic Quality Engineering Platform** is an enterprise-grade AI system that autonomously transforms product requirements into validated, executable Playwright test automation suites with automated failure root-cause analysis.

```
                    ┌──────────────────────────────┐
                    │      Jira / Confluence       │
                    │   Requirements & Knowledge   │
                    └──────────────┬───────────────┘
                                   │
                    ┌──────────────▼───────────────┐
                    │         RAG Pipeline         │
                    │   LangChain + Pinecone/FAISS │
                    └──────────────┬───────────────┘
                                   │
                    ┌──────────────▼───────────────┐
                    │      LangGraph Orchestrator  │
                    │   Stateful Agentic Workflow  │
                    └──────────────┬───────────────┘
                                   │
        ┌──────────────────────────┼──────────────────────────┐
        │                          │                          │
        ▼                          ▼                          ▼
 ┌───────────────┐        ┌──────────────────┐       ┌─────────────────┐
 │  Requirement  │───────►│  Test Generator  │◄─────►│  AI Validation  │
 │     Agent     │        │      Agent       │ (Loop)│     Agent       │
 └───────────────┘        └────────┬─────────┘       └─────────────────┘
                                   │ (Validation PASS)
                          ┌────────▼─────────┐
                          │ Ragas Evaluation │
                          │ & AI Quality Gate│
                          └────────┬─────────┘
                                   │ (Score >= 0.85)
                          ┌────────▼─────────┐
                          │  MCP Tool Layer  │
                          │   (FastMCP API)  │
                          └────────┬─────────┘
                                   │
                          ┌────────▼─────────┐
                          │ Playwright Pytest│
                          │ Test Automation  │
                          └────────┬─────────┘
                                   │
                          ┌────────▼─────────┐
                          │AI Failure & Root │
                          │Cause Analyzer    │
                          └────────┬─────────┘
                                   │
                          ┌────────▼─────────┐
                          │ Quality Report & │
                          │ Live Dashboard   │
                          └──────────────────┘
```

---

## Core System Layers

### 1. Ingestion & RAG Knowledge Retrieval Layer
- **Source Artifacts**: Jira Stories with Acceptance Criteria (ACs) + Confluence Technical & Security Policies.
- **Chunking Strategy**: `RecursiveCharacterTextSplitter` with header boundaries (`## `, `### `), preserving section context and metadata tags (`source`, `title`, `chunk_index`).
- **Hybrid Vector Store**: Connects to cloud **Pinecone** index when API keys are configured, and gracefully defaults to an in-memory **FAISS** vector store using deterministic token-hash embeddings for offline zero-friction execution.

### 2. LangGraph Stateful Agentic Orchestrator
Unlike rigid linear chains, the platform models quality engineering as a stateful, cyclic directed graph:

1. **`requirement_analysis` Node**:
   - Parses Jira user stories.
   - Formulates targeted semantic queries across security rules, UI standards, and edge cases.
2. **`test_generation` Node**:
   - Synthesizes structured test cases categorizing scenarios into `Positive`, `Negative`, `Boundary`, and `Security`.
   - Incorporates feedback from prior validation failures if in a self-healing iteration.
3. **`ai_validation` Node (The Critic)**:
   - Evaluates requirement coverage ($Coverage = \frac{|AC_{covered}|}{|AC_{total}|}$).
   - Conducts contradiction audits (e.g. flagging if a test asserts 3 lockout attempts when AC6 mandates 5).
4. **Conditional Router (`validation_router`)**:
   - If validation is `FAIL` and `regeneration_count < MAX_RETRIES`: routes back to `test_generation` with specific critique for self-correction.
   - If `PASS`: advances to Ragas evaluation and automation gate.
5. **`ragas_evaluation` Node**:
   - Measures Faithfulness, Answer Relevance, Context Precision, and Context Recall.
   - Evaluates against the Quality Gate threshold ($\ge 0.85$). If breached, automated execution is blocked.
6. **`playwright_generation` Node**:
   - Generates production-ready Python Playwright code utilizing standardized `data-testid` locators and robust assertion timeouts.

### 3. Model Context Protocol (MCP) Standardized Tool Interface
The platform leverages the **Model Context Protocol (FastMCP)** to decouple agent reasoning from testing and enterprise infrastructure. Exposed tools include:
- `get_requirement(ticket_id)`
- `search_knowledge(query, top_k)`
- `create_test_case(ticket_id, test_case_data)`
- `generate_playwright_test(ticket_id)`
- `execute_test(test_file)`
- `get_test_result(execution_id)`
- `create_defect(ticket_id, failure_report)`

### 4. AI Failure Analysis & Root Cause Diagnosis
When Playwright encounters errors during test execution, the failure analyzer ingests:
- Pytest stack trace & error message
- Targeted selector / locator
- Page DOM snapshot

It classifies the defect into one of five categories:
- **`LOCATOR_DRIFT`**: DOM element selector modified (suggests automated code diff).
- **`APPLICATION_DEFECT`**: Assertion mismatch against business logic (identifies backend service parameter).
- **`AUTOMATION_DEFECT`**: Flaky wait or test logic error.
- **`TEST_DATA_ISSUE`**: Expired user or bad credentials.
- **`ENVIRONMENT_ISSUE`**: Unreachable target host or network timeout.

---

## Enterprise Production Capabilities

### 5. Hybrid Retrieval with Reciprocal Rank Fusion (RRF)
Enterprise QE documentation frequently contains exact error codes (e.g. `ERR_AUTH_LOCKOUT_503`), regular expressions, and CSS selector specifications that dense vector embeddings dilute due to semantic smoothing. 

The platform deploys a dual-retriever architecture:
1. **Okapi BM25 Sparse Index**: Indexes token frequencies, computing document length normalization ($k_1=1.5, b=0.75$) for exact keyword and identifier precision.
2. **Dense Semantic Embeddings**: Captures conceptual similarity (e.g., matching "password reset rule" to "credential rotation policies").
3. **Reciprocal Rank Fusion (RRF)**:
   $$RRF(d) = \sum_{r \in \text{retrievers}} \frac{1}{k + \text{rank}_r(d)} \quad (k = 60)$$
   Combines and re-ranks sparse and dense search candidates without needing delicate score normalization across heterogeneous scoring functions.

### 6. Playwright In-Flight Active Self-Healing Engine
Traditional self-healing is *post-mortem*: a test fails, the test suite aborts, and an agent analyzes the failure after the fact. 

Our **Active In-Flight Self-Healer (`SelfHealingLocator`)** intercepts locator failures *live during browser execution*:
1. **DOM Candidate Extraction**: Upon encountering a Playwright `TimeoutError`, it parses the active browser DOM page for interactive elements (`input`, `button`, `a`, `select`).
2. **Multi-Vector Scoring**:
   - `testid_score`: Exact and fuzzy match on `data-testid`, `name`, `id`.
   - `text_score`: Text similarity across button labels and inner text.
   - `attr_score`: Proximity of CSS classes and role attributes.
3. **In-Session Healing**: If candidate confidence surpasses threshold ($\ge 0.45$), it swaps the locator live, performs the action, logs a healed event telemetry record, and allows the test to pass without manual intervention.

### 7. LangGraph Durable State Checkpointing & Human-in-the-Loop (HITL) Gate
In regulated enterprise environments (financial services, healthcare), fully autonomous test generation and execution requires human oversight before executing against production or high-cost staging environments.

1. **Durable Persistence (`MemorySaver`)**:
   - The LangGraph workflow compiles with a persistent checkpointer, preserving full graph state across `thread_id` sessions.
2. **Checkpoint Compliant Runner**:
   - Every execution thread preserves state across steps.
3. **Human Approval Gate (`/api/pipeline/approve`)**:
   - Generates test cases, critiques them with AI critic, validates quality score with Ragas, and halts execution in `AWAITING_APPROVAL` status if desired.
   - Authorized QA Leads can inspect the generated test plan, click "QA Sign-Off", and resume the pipeline into execution.

### 8. Multi-Tier Model Cascading & Token Cost Economics
Running frontier models (e.g. Claude 3.5 Sonnet, GPT-4o) on every repetitive unit test run is economically unsustainable for enterprise CI/CD pipelines running thousands of commits daily.

The platform implements **Dynamic Model Cascading**:
- **Tier 1 (Fast & Cost-Efficient)**: Lightweight models (e.g. `gpt-4o-mini`, `gemini-1.5-flash`, `claude-3-haiku` / deterministic rule fallback) handle high-volume structured tasks (test categorization, basic formatting, initial smoke tests). Cost: ~$0.00015 / 1K tokens.
- **Tier 2 (Advanced Frontier)**: Flagship models (e.g. `gpt-4o`, `claude-3-5-sonnet`, `gemini-1.5-pro`) are selectively invoked for complex failure root-cause analysis, security contradiction resolution, and multi-step self-healing. Cost: ~$0.005 / 1K tokens.
- **Telemetry & Cost Tracking**:
   - Computes input tokens, output tokens, total execution duration, and estimated dollar cost per run.
   - Real-time dashboard telemetry strip displays live latency and cost metrics.

### 9. Synthetic Test Data Generator & Boundary Fuzzer (`SyntheticDataAgent`)
Testing in enterprise environments cannot rely on static or real customer credentials due to strict regulatory compliance (GDPR, HIPAA, PCI-DSS) and test account burn/lockout.

The platform includes an automated synthetic test fixture engine generating four tiers of datasets:
1. **Valid Happy-Path Fixtures**: Compliant with all regex and business logic rules (e.g. `qa.engineer@enterprise-domain.local`).
2. **Boundary Fixtures**: Minimum/maximum field lengths, empty strings, multi-byte Unicode and emoji characters, edge integer counters.
3. **Security / Fuzz Payloads**: SQL injection payloads (`admin' OR '1'='1' --`), Cross-Site Scripting (`<script>alert()</script>`), and user enumeration probes.
4. **PII Pseudonymization**: Generates masked identifiers and dummy PCI tokens with isolated session IDs.

### 10. GitOps Self-Healing Auto-PR & Code Patch Engine (`GitOpsEngine`)
Diagnosing failure root cause is only half the battle. To achieve true continuous quality engineering, the platform provides automated remediation workflows:
1. **Ast-Verified Code Patching (`apply_locator_patch`)**:
   - Creates a timestamped `.bak` backup copy.
   - Replaces drifted selectors (e.g. `button[type='submit']` $\rightarrow$ `[data-testid='button-login']`).
   - Validates Python syntax using Python's Abstract Syntax Tree (`ast.parse`) before writing to disk, rolling back if syntax is broken.
2. **Automated Pull Request Generation (`create_pull_request`)**:
   - Synthesizes a Git branch (`fix/self-healed-locator-{ticket_id}-{timestamp}`).
   - Formats a comprehensive unified diff, execution proof, and Jira cross-link.
   - Ready for human review or automated CI/CD branch merge.

### 11. Golden Evaluation Benchmark & Ground-Truth Ragas Quality Gate
In production RAG systems, computing metrics without ground truth leads to "hallucination evaluating hallucination".

The platform integrates a curated **Golden Evaluation Benchmark Dataset (`app/data/golden_dataset.json`)**:
1. **Ground-Truth Policy Annotations**: Pre-vetted mappings between Jira user stories and required Confluence policy documents.
2. **Ground-Truth Test Cases**: Gold-standard test cases, step progressions, and required assertions.
3. **Empirical Ragas Metrics Calibration**:
   - **Context Precision**: Compares retrieved chunks against gold-standard policy documents.
   - **Context Recall**: Verifies all required business rules are present in the retrieval context.
   - **Faithfulness**: Measures whether generated assertions match the golden ground truth (e.g. flagging a 3-attempt lockout assertion against the golden 5-attempt rule).
   - **The AI Quality Gate ($\ge 0.85$)**: Blocks automated code generation if empirical metrics fall below threshold.



