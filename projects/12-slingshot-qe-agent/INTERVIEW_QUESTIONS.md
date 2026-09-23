# SlingShot QE Agent: Real-Time Scenario & Interview Questions Guide

This comprehensive guide is designed for **GenAI, LLM Systems, and AI Agent Engineer** interview preparation based specifically on the **SlingShot QE Autonomous Multi-Agent Framework**.

It covers questions from **Basic to Advanced Level**, organized into 6 core technical pillars with in-depth answers, real-time scenarios, architectural justifications, and code references.

---

## Table of Contents
1. [Core Architecture & Multi-Agent Design](#1-core-architecture--multi-agent-design)
2. [LangGraph State Machine & Checkpointing](#2-langgraph-state-machine--checkpointing)
3. [Human-In-The-Loop (HITL) Implementation](#3-human-in-the-loop-hitl-implementation)
4. [Autonomous Execution & Self-Healing Loops](#4-autonomous-execution--self-healing-loops)
5. [Tooling, Enterprise Integrations & Sandboxing](#5-tooling-enterprise-integrations--sandboxing)
6. [Production Deployment, Scale & Reliability](#6-production-deployment-scale--reliability)

---

## 1. Core Architecture & Multi-Agent Design

### Q1.1: Why did you choose LangGraph instead of a single ReAct agent or standard LangChain AgentExecutor?
**Answer:**
A Quality Engineering (QE) pipeline is a **long-horizon, stateful, cyclical workflow**, not a simple conversational Q&A loop.
- **Why a flat ReAct Agent fails:** A single agent trying to ingest Jira, parse Swagger, write code, run CLI commands, and self-heal will suffer from *context window bloat*, *tool hallucination*, and loss of focus. It cannot reliably enforce strict human review gates across multi-day lifecycles.
- **Why LangGraph succeeds:**
  1. **Deterministic Branching:** We use conditional edges to route between brand new test suites (`generate_scenarios`) and existing test modifications (`suggest_changes`).
  2. **Cyclic Control:** We model the self-healing cycle (`Execute -> RCA -> Heal -> Review -> Re-execute`) with a strict loop condition (`healing_attempts < max_healing_attempts`).
  3. **State Persistence:** LangGraph saves snapshot states at every node, enabling seamless pauses for human approval.

### Q1.2: Would you describe this as "Deep Agents" or "Flat Agents"? Why?
**Answer:**
This is a **Hierarchical Multi-Agent System (often termed "Deep Agents")**.
Instead of one prompt having access to all tools:
- Each node acts as a **specialist agent** with an isolated responsibility:
  - `RequirementAgent`: Ingestion and workspace diffing.
  - `ScenarioAgent`: BDD/Gherkin edge-case design.
  - `CodeGenAgent`: Synthesizing syntax-valid Karate DSL or Playwright code.
  - `RCAAgent`: Diagnostic triage analyzing exit codes and stack traces.
  - `HealingAgent`: Targeted code patcher.
- Each specialist receives only the exact slice of state it needs, preventing context pollution and reducing token costs.

### Q1.3: How does the system determine whether a requirement is "New" or a "Modification to Existing Tests"?
**Answer:**
Refer to [`RequirementAgent.process()`](src/slingshot_qe_agents/agents/requirement_agent.py):
1. **Workspace Context Extraction:** The `WorkspaceContextTool` scans `workspace/tests/` for existing test suites filtering by target technology (`.feature` for API, `.py` for UI).
2. **Deterministic Heuristic Filtering:** Filters out stopwords (`test`, `verify`, `check`, `spec`) and matches domain keywords from the user prompt against existing file names and test headers.
3. **LLM Fallback Classification:** If ambiguous, the agent sends the requirement summary and the existing test files to the LLM with a strict JSON schema:
   `{"is_new": bool, "reason": str, "suggested_file": str}`.

### Q1.4: Walk me through the exact step-by-step execution flow of this project from start to finish as if onboarding a new engineer.
**Answer:**
Here is the step-by-step lifecycle of every execution:
1. **Trigger & State Initialization:**
   The user or CI triggers `python cli.py --type api --source swagger -i examples/sample_swagger.json`. An initial `QEAgentState` is created with a unique `thread_id`.
2. **Node 1 (`ingest_requirements`):**
   `RequirementAgent` parses the Swagger spec into clean endpoints, inspects `workspace/tests/` to see if related test files exist, and sets `is_new_requirement: bool`.
3. **Routing Decision 1:**
   A conditional edge checks `is_new_requirement`:
   - If `True`: routes to `generate_scenarios`.
   - If `False`: routes to `suggest_changes` (which appends scenarios to the existing test file).
4. **Node 2 (`generate_scenarios`):**
   `ScenarioAgent` synthesizes structured Positive, Negative, and Security scenarios.
5. **HITL Checkpoint 1 (`hitl_scenario_approval`):**
   LangGraph halts execution using `interrupt()`. The terminal displays a table of scenarios. The human reviewer enters `approve`, `modify`, or `reject`. When approved, execution resumes via `Command(resume=...)`.
6. **Node 3 (`generate_code`):**
   `CodeGenAgent` writes Karate DSL (`.feature`) or Playwright Python (`test_*.py`) directly to `workspace/tests/`.
7. **HITL Checkpoint 2 (`hitl_code_approval`):**
   The graph halts again via `interrupt()`, displaying syntax-highlighted code. The engineer approves the code before execution.
8. **Node 4 (`execute_tests`):**
   The sandboxed runner (Karate runner for API, Playwright Chromium for UI) executes the tests, capturing stdout, stderr, and exit codes.
9. **Routing Decision 2:**
   - If all tests pass (`exit_code == 0`), execution routes to `END` and displays a success summary.
   - If any test fails (`exit_code != 0`), execution routes to `analyze_defect`.
10. **Node 5 (`analyze_defect` - Root Cause Analysis):**
    `RCAAgent` parses the stack trace:
    - **AUT Bug (500, DB crash):** Logs a Jira bug ticket and stops.
    - **Script Bug (broken locator, mismatched assertion):** Sets `FAILED_AUTOMATION_SCRIPT` and routes to `self_heal_code`.
11. **Node 6 (`self_heal_code` - Self-Healing Loop):**
    `HealingAgent` modifies the broken code in `workspace/tests/`, increments `healing_attempts += 1`, and passes to `hitl_healing_approval` (HITL Gate 3).
12. **Loop Back:**
    Once the engineer approves the patch, the graph loops back to Step 8 (`execute_tests`) until tests pass or the max healing threshold is reached.

---

## 2. LangGraph State Machine & Checkpointing

### Q2.1: Explain the structure and lifecycle of `QEAgentState`.
**Answer:**
Refer to [`src/slingshot_qe_agents/graph/state.py`](src/slingshot_qe_agents/graph/state.py):
`QEAgentState` is defined as a `TypedDict` containing:
- **Metadata:** `task_type` ("api" | "ui"), `requirement_source` ("jira" | "swagger" | "nlp").
- **Ingestion Context:** `parsed_spec`, `workspace_context`, `is_new_requirement`.
- **Artifacts:** `manual_scenarios` (List of `TestScenario` Pydantic models), `generated_code_files` (Dict of filename -> code).
- **Execution & Triage:** `execution_result` (`ExecutionResult`), `defect_report` (`DefectAnalysisReport`).
- **Loop Counters:** `healing_attempts: int`, `max_healing_attempts: int`.
- **HITL Control:** `hitl_checkpoint: Optional[str]`, `approval_status: Literal["pending", "approved", "rejected", "modified"]`.
- **Message Stream:** `Annotated[List[BaseMessage], add_messages]` for conversation history.

### Q2.2: How does state immutability work in LangGraph nodes?
**Answer:**
In LangGraph, nodes do not mutate the previous state object directly; they return a dictionary containing **state updates**. LangGraph merges these updates into the current state channel.
For example, in `healing_agent.process()`:
```python
return {
    "generated_code_files": healed_files,
    "healed_code_files": healed_files,
    "healing_attempts": attempts,
    "approval_status": "pending"
}
```
Only the keys specified in the return dictionary are updated; the rest of `QEAgentState` remains preserved across the thread.

---

## 3. Human-In-The-Loop (HITL) Implementation

### Q3.1: How does `interrupt()` work in LangGraph, and how did you use it?
**Answer:**
LangGraph (v0.2+) introduced native `interrupt()` from `langgraph.types`:
1. When `interrupt(value)` is called inside a node (e.g. `hitl_scenario_approval_node`):
   - The graph halts execution immediately.
   - The checkpointer persists the entire thread state to storage.
   - The graph invocation returns the interrupt payload to the client.
2. In `cli.py`, the client inspects `state_snapshot.tasks[0].interrupts[0].value`, renders the scenarios or code diff to the user, and waits for human input.
3. The client resumes execution using:
   ```python
   graph.invoke(Command(resume={"status": "approved", "feedback": feedback}), config=config)
   ```
4. Execution resumes *inside* the node directly after the `interrupt()` line, receiving the resumed dictionary.

### Q3.2: Real-Time Scenario: A QA Lead rejects the generated Karate code during code review. How does the graph react?
**Answer:**
In `workflow.py`, conditional edge `route_after_code_approval`:
```python
def route_after_code_approval(state: QEAgentState) -> str:
    if state.get("approval_status") == "rejected":
        return END
    return "execute_tests"
```
If the user selects `reject`, the status is updated to `rejected`, and the graph terminates safely without executing unapproved code in the workspace or staging environment. If the user selects `modify` with feedback, the graph routes back to `generate_code` to incorporate the feedback.

---

## 4. Autonomous Execution & Self-Healing Loops

### Q4.1: How does your RCA Agent distinguish between an Application Under Test (AUT) Defect and an Automation Script Defect?
**Answer:**
This is one of the most critical enterprise questions.
Refer to [`RCAAgent._is_script_defect()`](src/slingshot_qe_agents/agents/rca_agent.py):
1. **Server/AUT Failure Indicators:**
   - HTTP `500 Internal Server Error`, `502 Bad Gateway`, `503 Service Unavailable`, `504 Gateway Timeout`.
   - Backend database connection timeouts, backend null pointer exceptions, panics.
   - **Action:** Classified as `FAILED_APPLICATION_DEFECT`. The agent automatically formats an RCA report and invokes `AtlassianTool.create_defect_ticket()` to log a Jira bug for developers. **It does NOT attempt self-healing**, because the code isn't broken—the app is!
2. **Script Defect Indicators:**
   - Locator timeout (`waiting for locator "..."`), `AssertionError`, schema type mismatches, syntax errors, element not interactable.
   - **Action:** Classified as `FAILED_AUTOMATION_SCRIPT`. Routed to the `HealingAgent`.

### Q4.2: How do you prevent infinite self-healing loops or worsening patches?
**Answer:**
1. **Iteration Caps:** `healing_attempts` is incremented on every pass. If `healing_attempts >= max_healing_attempts` (default 3), the conditional edge aborts the cycle and terminates.
2. **HITL Gate Before Re-Run:** Even when self-healing patches code, it enters `hitl_healing_approval` where the human reviewer sees the patch diff before the runner touches the browser or API again.
3. **Workspace File Backup:** Code before healing is preserved in state so rollbacks are possible.

---

## 5. Tooling, Enterprise Integrations & Sandboxing

### Q5.1: How do you handle large Swagger/OpenAPI specs without exceeding the LLM context window?
**Answer:**
Refer to [`SwaggerParserTool`](src/slingshot_qe_agents/tools/swagger_parser.py):
- Instead of dumping raw 10,000-line JSON/YAML into the prompt, the tool parses the document into an **Endpoints Summary**:
  - Filters paths, HTTP methods, required parameters, and response status codes.
  - Strips verbose descriptions and internal schemas.
  - Matches the user's specific prompt or target domain, feeding only relevant endpoint schemas to the scenario and code generation agents.

### Q5.2: What happens if Jira / Confluence credentials are not configured or the service is temporarily unreachable?
**Answer:**
Refer to [`AtlassianTool`](src/slingshot_qe_agents/tools/atlassian_tools.py):
The tool includes a **graceful degradation pattern**:
- If `JIRA_URL` and `JIRA_API_TOKEN` are missing or return network errors, it switches to sandbox mock fixtures.
- It returns valid mock user stories with acceptance criteria (`SLING-101`) and mock ticket creation receipts.
- This ensures offline development, local unit tests, and CI/CD pipelines run without external network dependencies.

### Q5.3: Why Karate DSL for API and Playwright for UI? How are they executed safely?
**Answer:**
- **Karate DSL for API:** Unifies HTTP calls, JSON schema validation, and BDD syntax in clean `.feature` files that both technical engineers and manual QA can read.
- **Playwright for UI:** Auto-waiting locators, headless execution, multi-browser engine support (Chromium/WebKit/Firefox), and rich failure tracing.
- **Safe Execution:** Subprocesses are run via `subprocess.run(timeout=120)` with explicit working directory sandboxing (`workspace/tests`), capturing both `stdout` and `stderr` to structured execution reports.

---

## 6. Production Deployment, Scale & Reliability

### Q6.1: How would you transition this from local `MemorySaver` to a distributed production architecture?
**Answer:**
1. **Replace Checkpointer:** Swap `MemorySaver` with `PostgresSaver` (`langgraph-checkpoint-postgres`) or Redis. This allows worker pods to restart without losing in-flight HITL approval states.
2. **Thread ID Mapping:** Map each Jira Ticket or Pull Request to a unique `thread_id`. When a QA engineer clicks "Approve" in a Slack bot, Web UI, or Jira webhook, the webhook handler resumes the graph using that `thread_id`.
3. **Container Sandboxing:** Run test executions inside ephemeral Docker containers (e.g. via Kubernetes Jobs) to prevent untrusted test scripts from impacting the host machine.

### Q6.2: How do you monitor and optimize LLM cost across nodes?
**Answer:**
- **Tiered Model Routing:**
  - Fast, cost-efficient models (e.g., `gemini-2.5-flash` or `gpt-4o-mini`) are used for deterministic tasks: requirement ingestion, scenario generation, and initial triage.
  - High-reasoning models (e.g., `gemini-1.5-pro` or `gpt-4o`) are invoked only for complex code synthesis and self-healing patches.
- **Token Efficiency:** Filtering workspace context (e.g., excluding `__pycache__`, `.pyc`, and limiting previews to 15 lines).

---

## Quick Reference Summary Table for Interviews

| Feature | Implementation in SlingShot QE Agent |
| :--- | :--- |
| **Agent Paradigm** | Hierarchical Multi-Agent Graph (LangGraph) |
| **Routing** | Conditional edges (`route_after_ingestion`, `route_after_defect_analysis`) |
| **Persistence** | LangGraph `MemorySaver` (Dev) / `PostgresSaver` (Prod) |
| **HITL Mechanism** | Native `interrupt()` & `Command(resume=...)` |
| **Defect Triage** | Autonomous RCA distinguishing Server Bugs from Script Bugs |
| **API Testing** | Karate DSL `.feature` execution |
| **UI Testing** | Playwright Python headless execution |
| **External Specs** | OpenAPI / Swagger 3.0 parsing + Jira/Confluence integration |
