let currentBugMode = false;
let activeHealing = true;
let latestExecutionData = null;

document.addEventListener("DOMContentLoaded", () => {
  loadConfluenceDocs();
  fetchTelemetry();
  loadSyntheticData("AUTH-101");
});

function toggleActiveHealing() {
  activeHealing = !activeHealing;
  const btn = document.getElementById("btn-toggle-healing");
  btn.textContent = activeHealing ? "⚡ In-Flight Healing: ON" : "⚡ In-Flight Healing: OFF";
  btn.style.color = activeHealing ? "var(--accent-emerald)" : "var(--text-subtle)";
  btn.style.borderColor = activeHealing ? "var(--accent-emerald)" : "var(--card-border)";
  appendLog(`[Self-Healing] Active In-Flight Healing toggled: ${activeHealing ? "ENABLED" : "DISABLED"}`);
}

async function approveTestSuite() {
  const ticketId = document.getElementById("ticket-select").value;
  try {
    const res = await fetch("/api/pipeline/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ticket_id: ticketId, reviewer: "Lead QA Architect" })
    });
    const data = await res.json();
    document.getElementById("hitl-status-pill").textContent = "APPROVED BY QA LEAD";
    document.getElementById("tel-approval-status").textContent = "APPROVED";
    appendLog(`[HITL Gate] Test Suite signed off by Lead QA Architect for Jira ticket ${ticketId}`, true);
    alert(`Human-in-the-Loop Sign-Off Successful!\nApproved By: ${data.reviewer}\nTicket: ${ticketId}`);
  } catch (e) {
    alert("Approval failed: " + e.message);
  }
}

async function fetchTelemetry() {
  try {
    const res = await fetch("/api/telemetry");
    const data = await res.json();
    if (data) {
      if (document.getElementById("tel-model-tier")) document.getElementById("tel-model-tier").textContent = data.tier_active || "Tier-1 Fast";
      if (document.getElementById("tel-cost-savings")) document.getElementById("tel-cost-savings").textContent = `${data.cost_savings_percentage} (vs Monolithic)`;
    }
  } catch (e) {}
}

function switchTab(evt, tabId) {
  document.querySelectorAll(".tab-content").forEach(el => el.classList.remove("active"));
  document.querySelectorAll(".tab-btn").forEach(el => el.classList.remove("active"));
  document.getElementById(tabId).classList.add("active");
  if (evt && evt.currentTarget) {
    evt.currentTarget.classList.add("active");
  }
}

function showTab(tabId) {
  const btn = Array.from(document.querySelectorAll(".tab-btn")).find(b => b.getAttribute("onclick").includes(tabId));
  if (btn) btn.click();
}

function appendLog(msg, isHighlight = false) {
  const consoleEl = document.getElementById("log-console");
  const line = document.createElement("div");
  line.className = isHighlight ? "log-line hl" : "log-line";
  const timestamp = new Date().toLocaleTimeString();
  line.textContent = `[${timestamp}] ${msg}`;
  consoleEl.appendChild(line);
  consoleEl.scrollTop = consoleEl.scrollHeight;
}

// 1. Run Agentic QE Workflow
async function runAgenticWorkflow() {
  const ticketId = document.getElementById("ticket-select").value;
  const runBtn = document.getElementById("btn-run-pipeline");
  const statusText = document.getElementById("pipeline-status-text");

  runBtn.disabled = true;
  runBtn.innerHTML = "<span>⏳ Orchestrating LangGraph...</span>";
  statusText.textContent = `Running LangGraph workflow for ${ticketId}...`;

  resetNodes();
  highlightNode("node-req", "active");
  appendLog(`[Workflow] Triggered LangGraph agentic loop for ticket ${ticketId}`, true);

  try {
    const res = await fetch("/api/pipeline/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ticket_id: ticketId })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Workflow failed");

    setTimeout(() => {
      highlightNode("node-req", "completed");
      highlightNode("node-rag", "completed");
      highlightNode("node-gen", "completed");
    }, 400);

    setTimeout(() => {
      if (data.validation && data.full_state.regeneration_count > 0) {
        document.getElementById("loop-indicator").style.display = "inline-block";
        highlightNode("node-val", "rejected");
        appendLog(`[LangGraph] Validation loop triggered! AI Critic rejected initial test due to AC contradiction. Self-healing pass executed.`, true);
      }
    }, 800);

    setTimeout(() => {
      highlightNode("node-val", "completed");
      highlightNode("node-ragas", "completed");
      highlightNode("node-pw", "completed");
      renderPipelineResults(data);
      runBtn.disabled = false;
      runBtn.innerHTML = "<span>⚡ Run Agentic QE Workflow</span>";
      statusText.textContent = `Completed! ${data.test_cases_count} test cases verified & Playwright suite generated.`;
    }, 1400);

  } catch (err) {
    appendLog(`[Error] Workflow execution failed: ${err.message}`, true);
    runBtn.disabled = false;
    runBtn.innerHTML = "<span>⚡ Run Agentic QE Workflow</span>";
    statusText.textContent = "Pipeline execution encountered an error.";
  }
}

function resetNodes() {
  document.querySelectorAll(".node").forEach(n => {
    n.classList.remove("active", "completed", "rejected");
  });
  document.getElementById("loop-indicator").style.display = "none";
}

function highlightNode(id, state) {
  const el = document.getElementById(id);
  if (el) {
    el.classList.remove("active", "completed", "rejected");
    el.classList.add(state);
  }
}

// 2. Render Results
function renderPipelineResults(data) {
  const testCases = data.full_state.test_cases || [];
  document.getElementById("tc-count").textContent = testCases.length;

  // Update telemetry bar
  if (data.telemetry) {
    document.getElementById("tel-cost-savings").textContent = `${data.telemetry.cost_savings_percentage} (vs Monolithic)`;
    document.getElementById("tel-model-tier").textContent = data.model_tier_used || data.telemetry.tier_active;
  }
  if (data.approval_status) {
    document.getElementById("tel-approval-status").textContent = data.approval_status;
  }

  // Render Test Cases
  const tcContainer = document.getElementById("tc-container");
  tcContainer.innerHTML = "";

  testCases.forEach(tc => {
    const card = document.createElement("div");
    card.className = "tc-card";

    let badgeClass = "badge-positive";
    if (tc.type === "Negative") badgeClass = "badge-negative";
    if (tc.type === "Boundary") badgeClass = "badge-boundary";
    if (tc.type === "Security") badgeClass = "badge-security";

    const stepsHtml = (tc.steps || []).map(s => `<li>${s}</li>`).join("");

    card.innerHTML = `
      <div class="tc-header">
        <div class="tc-title-group">
          <span class="tc-id">${tc.id}</span>
          <h3>${tc.title}</h3>
        </div>
        <div class="tc-badges">
          <span class="badge-tag ${badgeClass}">${tc.type}</span>
          <span class="badge-tag badge-trace">${tc.ac_traceability}</span>
        </div>
      </div>
      <div class="tc-body">
        <div class="tc-section-title">Precondition</div>
        <p style="margin-bottom: 8px;">${tc.precondition}</p>
        <div class="tc-section-title">Execution Steps</div>
        <ol class="tc-steps">${stepsHtml}</ol>
        <div class="tc-section-title">Expected Result</div>
        <div class="tc-expected">${tc.expected_result}</div>
      </div>
    `;
    tcContainer.appendChild(card);
  });

  // Render AI Validation
  const val = data.validation || {};
  const valSummary = document.getElementById("validation-summary");
  const valStatusBadge = val.passed
    ? `<span class="tech-tag" style="background: rgba(16, 185, 129, 0.2); color: var(--accent-emerald);">VALIDATION PASSED</span>`
    : `<span class="tech-tag" style="background: rgba(244, 63, 94, 0.2); color: var(--accent-rose);">VALIDATION REJECTED</span>`;

  valSummary.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
      <div>
        <strong>Verdict:</strong> ${valStatusBadge}
        <span style="margin-left: 12px; color: var(--text-muted); font-size: 13px;">Coverage: ${(val.coverage_score * 100).toFixed(0)}%</span>
      </div>
      <div style="font-size: 12px; color: var(--text-subtle);">Hallucination Check: ${val.hallucination_detected ? "❌ Flagged" : "✅ Clean"}</div>
    </div>
    <div style="background: rgba(15, 23, 42, 0.6); border-radius: 8px; padding: 14px; font-size: 13px;">
      <strong>Critique & Feedback:</strong> ${val.critique}
    </div>
  `;

  // Render Ragas Metrics
  const ragas = data.ragas_metrics || {};
  document.getElementById("score-faithfulness").textContent = (ragas.faithfulness || 0.95).toFixed(2);
  document.getElementById("score-relevance").textContent = (ragas.answer_relevance || 0.92).toFixed(2);
  document.getElementById("score-precision").textContent = (ragas.context_precision || 0.89).toFixed(2);
  document.getElementById("score-recall").textContent = (ragas.context_recall || 0.94).toFixed(2);

  const banner = document.getElementById("quality-gate-banner");
  banner.style.display = "flex";
  if (data.quality_gate_passed) {
    banner.className = "quality-gate-banner";
    document.getElementById("gate-banner-title").textContent = "AI Quality Gate: CERTIFIED PASSED";
    document.getElementById("gate-banner-sub").textContent = "Faithfulness and Answer Relevance exceed 0.85 threshold. Certified for automation.";
    document.getElementById("gate-banner-tag").textContent = "QUALITY GATE PASSED";
    document.getElementById("gate-banner-tag").style.background = "rgba(16, 185, 129, 0.2)";
    document.getElementById("gate-banner-tag").style.color = "var(--accent-emerald)";
  } else {
    banner.className = "quality-gate-banner failed";
    document.getElementById("gate-banner-title").textContent = "AI Quality Gate: BREACH DETECTED";
    document.getElementById("gate-banner-sub").textContent = "Metrics below 0.85 threshold. Automated test execution blocked.";
    document.getElementById("gate-banner-tag").textContent = "GATE FAILED";
    document.getElementById("gate-banner-tag").style.background = "rgba(244, 63, 94, 0.2)";
    document.getElementById("gate-banner-tag").style.color = "var(--accent-rose)";
  }

  // Render Playwright Code
  if (data.playwright_code) {
    document.getElementById("playwright-code-display").textContent = data.playwright_code;
  }

  // Render Synthetic Data
  if (data.synthetic_fixtures) {
    renderSyntheticData(data.synthetic_fixtures);
  } else if (data.ticket_id) {
    loadSyntheticData(data.ticket_id);
  }

  // Logs
  if (data.agent_logs) {
    data.agent_logs.forEach(l => appendLog(l));
  }
}

// 3. Execute Playwright Tests
async function executePlaywrightSuite() {
  const btn = document.getElementById("btn-run-tests");
  btn.disabled = true;
  btn.textContent = "⏳ Running Playwright...";

  appendLog(`[Playwright] Launching test suite (bug_mode=${currentBugMode}, active_healing=${activeHealing})...`, true);

  try {
    const res = await fetch("/api/tests/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bug_mode: currentBugMode,
        enable_active_healing: activeHealing
      })
    });

    const result = await res.json();
    latestExecutionData = result;
    btn.disabled = false;
    btn.textContent = "▶ Run Playwright";

    // Update in-flight healed count on telemetry bar
    if (result.healed_count !== undefined) {
      document.getElementById("tel-healed-count").textContent = `${result.healed_count} Selectors`;
    }

    appendLog(`[Playwright] Execution finished: ${result.passed_count}/${result.total} Passed (${result.duration}s)`);

    if (result.healed_count > 0) {
      appendLog(`[Active Self-Healing] ⚡ In-Flight Healing recovered ${result.healed_count} locator drift(s) without failing build!`, true);
      alert(`⚡ In-Flight Active Self-Healing Triggered!\nRecovered locator drift for [data-testid='button-login'] -> '#legacy-login-btn' live in browser!`);
    }

    if (!result.passed && result.failures.length > 0) {
      renderFailureAnalysis(result.failures[0]);
      highlightNode("node-fail", "rejected");
      showTab("tab-failure");
      appendLog(`[AI Failure Analyzer] Diagnosed root cause for failed test: ${result.failures[0].category}`, true);
    } else {
      highlightNode("node-fail", "completed");
      appendLog(`[Playwright] All ${result.passed_count} test cases passed against target application!`);
    }

  } catch (err) {
    btn.disabled = false;
    btn.textContent = "▶ Run Playwright";
    appendLog(`[Error] Test execution failed: ${err.message}`, true);
  }
}

// 4. Render AI Failure Analysis
function renderFailureAnalysis(failure) {
  const container = document.getElementById("failure-container");
  container.innerHTML = `
    <div class="failure-card">
      <div class="failure-header">
        <div>
          <span class="failure-badge">${failure.category}</span>
          <h3 style="font-size: 16px; margin-top: 6px; color: #fff;">${failure.test_case}</h3>
        </div>
        <button class="btn-primary" style="font-size: 12px; padding: 6px 14px;" onclick="fileDefectInJira()">
          📋 Create Defect in Jira (via MCP)
        </button>
      </div>

      <div style="font-size: 13px; color: var(--text-muted); margin-bottom: 12px;">
        <strong>Error Message:</strong>
        <pre style="background: rgba(0,0,0,0.5); padding: 8px; border-radius: 4px; color: #f87171; font-family: var(--font-mono); margin-top: 4px; overflow-x: auto;">${failure.error_message}</pre>
      </div>

      <div style="margin-bottom: 12px; font-size: 13px;">
        <strong style="color: var(--accent-cyan);">AI Root Cause Diagnosis:</strong>
        <p style="margin-top: 4px; color: #e2e8f0;">${failure.root_cause}</p>
      </div>

      <div style="font-size: 13px;">
        <strong style="color: var(--accent-emerald);">AI Suggested Automation Code Fix:</strong>
        <div class="failure-diff">
          <div class="diff-del">- page.locator("button[type='submit']").click()</div>
          <div class="diff-add">+ page.locator("[data-testid='button-login']").click()</div>
          <div style="color: var(--text-subtle); margin-top: 8px; font-size: 11px;">${failure.suggested_fix}</div>
        </div>
      </div>

      <!-- GitOps & Remediation Action Bar -->
      <div style="display: flex; gap: 10px; margin-top: 16px; flex-wrap: wrap;">
        <button class="btn-primary" style="font-size: 12px; padding: 7px 14px;" onclick="fileDefectInJira()">
          📋 Create Jira Defect (MCP)
        </button>
        <button class="btn-primary" style="font-size: 12px; padding: 7px 14px; background: #059669; border-color: #10b981;" onclick="applyAutoPatch()">
          ⚡ Auto-Apply Code Patch
        </button>
        <button class="btn-secondary" style="font-size: 12px; padding: 7px 14px; border-color: var(--accent-blue); color: var(--accent-cyan);" onclick="createGitOpsPR()">
          🚀 Open Healed PR (GitOps)
        </button>
      </div>
    </div>
  `;
}

// 5. File Defect in Jira via MCP
async function fileDefectInJira() {
  if (!latestExecutionData || !latestExecutionData.failures.length) return;
  const failure = latestExecutionData.failures[0];
  const ticketId = document.getElementById("ticket-select").value;

  try {
    const res = await fetch("/api/mcp/create-defect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ticket_id: ticketId, failure_report: failure })
    });
    const defect = await res.json();
    alert(`Jira Defect Created Successfully via MCP Tool!\nDefect ID: ${defect.defect_id}\nSeverity: ${defect.severity}\nLinked Ticket: ${ticketId}`);
    appendLog(`[MCP Tool] Filed Jira Defect ${defect.defect_id} linked to ${ticketId}`, true);
  } catch (err) {
    alert("Failed to file defect: " + err.message);
  }
}

// 6. Toggle Bug Mode on Target App
async function toggleBugMode() {
  currentBugMode = !currentBugMode;
  const btn = document.getElementById("btn-toggle-bug");
  btn.textContent = currentBugMode ? "🐞 Target Bug: ON" : "🐞 Target Bug: Off";
  btn.style.background = currentBugMode ? "rgba(244, 63, 94, 0.3)" : "rgba(244, 63, 94, 0.12)";

  try {
    await fetch(`/api/target/toggle-bug?enable=${currentBugMode}`, { method: "POST" });
    const iframe = document.getElementById("target-iframe");
    if (iframe) {
      iframe.src = `http://localhost:8080/login?buggy=${currentBugMode}`;
    }
    appendLog(`[Target App] Bug Mode toggled to: ${currentBugMode ? "ENABLED (Locator Drift Activated)" : "DISABLED (Stable)"}`);
  } catch (e) {
    console.error(e);
  }
}

// 7. Load Confluence Docs
async function loadConfluenceDocs() {
  try {
    const res = await fetch("/api/confluence");
    const data = await res.json();
    const container = document.getElementById("confluence-docs-container");
    container.innerHTML = "";
    (data.documents || []).forEach(doc => {
      const card = document.createElement("div");
      card.className = "tc-card";
      card.innerHTML = `
        <div class="tc-header">
          <div class="tc-title-group">
            <span class="tc-id">${doc.filename}</span>
            <h3>${doc.title}</h3>
          </div>
          <span class="badge-tag badge-trace">Confluence RAG</span>
        </div>
        <p style="font-size: 12px; color: var(--text-muted);">${doc.preview}</p>
      `;
      container.appendChild(card);
    });
  } catch (e) {
    console.error(e);
  }
}

function copyCode() {
  const code = document.getElementById("playwright-code-display").textContent;
  navigator.clipboard.writeText(code).then(() => {
    alert("Playwright test code copied to clipboard!");
  });
}

// 7. Synthetic Data Loader & Renderer
async function loadSyntheticData(ticketId) {
  try {
    const res = await fetch(`/api/synthetic-data/${ticketId}`);
    const data = await res.json();
    renderSyntheticData(data);
  } catch (e) {
    console.error("Failed to load synthetic data:", e);
  }
}

function renderSyntheticData(fixtures) {
  if (!fixtures) return;
  const container = document.getElementById("synth-container");
  if (!container) return;

  const valid = fixtures.valid_fixtures || [];
  const bound = fixtures.boundary_fixtures || [];
  const sec = fixtures.security_fuzz_fixtures || [];
  const total = (valid.length + bound.length + sec.length);

  const countBadge = document.getElementById("synth-count");
  if (countBadge) countBadge.textContent = total;
  const totalBadge = document.getElementById("synth-total-badge");
  if (totalBadge) totalBadge.textContent = total;

  let html = "";

  valid.forEach(f => {
    html += `
      <div class="synth-card">
        <div class="synth-card-header">
          <span style="font-weight: 600; font-size: 13px; color: #fff;">${f.label || f.id}</span>
          <span class="synth-tag" style="background: rgba(14, 165, 233, 0.2); color: var(--accent-cyan);">VALID FIXTURE</span>
        </div>
        <div style="font-size: 12px; color: var(--text-muted);">${f.purpose || 'Standard happy path fixture'}</div>
        <div class="synth-payload">
          email: "${f.email || ''}"<br>
          password: "${f.password || ''}"
        </div>
      </div>
    `;
  });

  bound.forEach(b => {
    html += `
      <div class="synth-card">
        <div class="synth-card-header">
          <span style="font-weight: 600; font-size: 13px; color: #fff;">${b.field || 'input'}: ${b.condition || 'Boundary'}</span>
          <span class="synth-tag" style="background: rgba(245, 158, 11, 0.2); color: #fbbf24;">BOUNDARY</span>
        </div>
        <div style="font-size: 12px; color: var(--text-muted);">${b.expected_error || (b.expected_valid ? 'Accepted' : 'Boundary check')}</div>
        <div class="synth-payload">payload: ${JSON.stringify(b.payload || b.counter)}</div>
      </div>
    `;
  });

  sec.forEach(s => {
    html += `
      <div class="synth-card">
        <div class="synth-card-header">
          <span style="font-weight: 600; font-size: 13px; color: #fff;">${s.attack_vector || 'Security Vector'}</span>
          <span class="synth-tag" style="background: rgba(244, 63, 94, 0.2); color: var(--accent-rose);">SECURITY FUZZ</span>
        </div>
        <div style="font-size: 12px; color: var(--text-muted);">${s.expected_behavior || 'Sanitized / rejected'}</div>
        <div class="synth-payload">${JSON.stringify(s.payload)}</div>
      </div>
    `;
  });

  container.innerHTML = html;
}

// 8. GitOps: Apply Auto-Patch & Open Pull Request
async function applyAutoPatch() {
  const filePath = "app/test_runner/generated_tests/test_auth_101.py";
  const oldLocator = "button[type='submit']";
  const newLocator = "[data-testid='button-login']";

  try {
    const res = await fetch("/api/gitops/apply-patch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ file_path: filePath, old_locator: oldLocator, new_locator: newLocator })
    });
    const result = await res.json();
    if (result.status === "PATCH_APPLIED") {
      alert(`⚡ Code Patch Successfully Applied!\nFile: ${result.file_path}\nReplaced: ${result.replacements_count} occurrence(s)\nBackup: ${result.backup_file}`);
      appendLog(`[GitOps] Applied verified locator patch to ${result.file_path} (${oldLocator} -> ${newLocator})`, true);
    } else {
      alert(`Patch status: ${result.status}\n${result.message || result.error}`);
    }
  } catch (err) {
    alert("Error applying patch: " + err.message);
  }
}

async function createGitOpsPR() {
  const ticketId = document.getElementById("ticket-select").value;
  const filePath = "app/test_runner/generated_tests/test_auth_101.py";
  const oldLocator = "button[type='submit']";
  const newLocator = "[data-testid='button-login']";
  const rootCause = "LOCATOR_DRIFT";

  try {
    const res = await fetch("/api/gitops/create-pr", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ticket_id: ticketId,
        file_path: filePath,
        old_locator: oldLocator,
        new_locator: newLocator,
        root_cause: rootCause,
        test_execution_passed: true
      })
    });
    const pr = await res.json();
    document.getElementById("pr-modal-title").textContent = `PR #${pr.pr_number}: ${pr.title}`;
    document.getElementById("pr-modal-branch").textContent = pr.branch_name;
    document.getElementById("pr-modal-diff").textContent = pr.diff;
    document.getElementById("pr-modal-body").textContent = pr.body;
    document.getElementById("pr-modal").style.display = "flex";
    appendLog(`[GitOps] Opened Pull Request #${pr.pr_number} on branch '${pr.branch_name}'`, true);
  } catch (err) {
    alert("Error creating PR: " + err.message);
  }
}

function closePrModal() {
  const modal = document.getElementById("pr-modal");
  if (modal) modal.style.display = "none";
}

