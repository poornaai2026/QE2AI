"""Interactive Web Dashboard for SlingShot QE Agent powered by Streamlit.
Provides a modern visual interface for triggering runs, HITL approvals, and defect inspection.
"""

import os
import uuid
import streamlit as st
from langgraph.checkpoint.memory import MemorySaver
from langgraph.types import Command

from slingshot_qe_agents.graph.workflow import create_qe_graph
from slingshot_qe_agents.graph.state import QEAgentState
from slingshot_qe_agents.tools.workspace_tools import WorkspaceContextTool

st.set_page_config(
    page_title="SlingShot QE Agent Platform",
    page_icon="🎯",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom Styling
st.markdown("""
<style>
    .main-title { font-size: 2.2rem; font-weight: 700; color: #38bdf8; margin-bottom: 0.2rem; }
    .subtitle { font-size: 1.05rem; color: #94a3b8; margin-bottom: 1.5rem; }
    .metric-card { background-color: #1e293b; border-radius: 8px; padding: 16px; border: 1px solid #334155; }
    .hitl-box { background-color: #451a03; border: 1px solid #f59e0b; border-radius: 8px; padding: 16px; }
</style>
""", unsafe_allow_html=True)

# Title Header
st.markdown('<div class="main-title">🎯 SlingShot QE Autonomous Multi-Agent Platform</div>', unsafe_allow_html=True)
st.markdown('<div class="subtitle">Autonomous API & UI Quality Engineering with LangGraph, HITL Governance, and Self-Healing</div>', unsafe_allow_html=True)

# Sidebar Configuration
with st.sidebar:
    st.header("⚙️ Configuration")
    task_type = st.radio("Target Testing Type", ["API (Karate DSL)", "UI (Playwright)"], index=0)
    task_key = "api" if "API" in task_type else "ui"
    
    source = st.selectbox(
        "Requirement Source",
        ["Swagger / OpenAPI", "Jira User Story", "Confluence Doc", "Natural Language Prompt"],
        index=0
    )
    source_map = {
        "Swagger / OpenAPI": "swagger",
        "Jira User Story": "jira",
        "Confluence Doc": "confluence",
        "Natural Language Prompt": "nlp"
    }
    source_key = source_map[source]

    max_healing = st.slider("Max Self-Healing Attempts", min_value=1, max_value=5, value=3)
    auto_approve = st.checkbox("Automated CI/CD Mode (Auto-Approve HITL)", value=False)
    
    st.divider()
    if os.path.exists("docs/images/slingshot_qe_architecture.jpg"):
        st.image("docs/images/slingshot_qe_architecture.jpg", caption="System Architecture", use_container_width=True)

# Session State Initialization
if "thread_id" not in st.session_state:
    st.session_state.thread_id = str(uuid.uuid4())
if "graph" not in st.session_state:
    st.session_state.checkpointer = MemorySaver()
    st.session_state.graph = create_qe_graph(enable_hitl=True, checkpointer=st.session_state.checkpointer)
if "run_active" not in st.session_state:
    st.session_state.run_active = False
if "current_result" not in st.session_state:
    st.session_state.current_result = None

# Input Panel
col_input, col_action = st.columns([4, 1])

default_inputs = {
    "swagger": "examples/sample_swagger.json",
    "jira": "SLING-101",
    "confluence": "Checkout-Payment-Spec-V2",
    "nlp": "Test user authentication and customer order creation flow"
}

with col_input:
    user_input = st.text_input(
        f"Input Target / Specification for {source}",
        value=default_inputs.get(source_key, "")
    )

with col_action:
    st.write("")
    st.write("")
    start_btn = st.button("🚀 Start QE Run", type="primary", use_container_width=True)

# Run Trigger
if start_btn and user_input:
    st.session_state.thread_id = str(uuid.uuid4())
    st.session_state.run_active = True
    config = {"configurable": {"thread_id": st.session_state.thread_id}}

    initial_state: QEAgentState = {
        "task_type": task_key,
        "requirement_source": source_key,
        "raw_input": user_input,
        "parsed_spec": {},
        "workspace_context": {},
        "is_new_requirement": True,
        "manual_scenarios": [],
        "suggested_changes": None,
        "generated_code_files": {},
        "execution_result": None,
        "defect_report": None,
        "healing_attempts": 0,
        "max_healing_attempts": max_healing,
        "healed_code_files": {},
        "hitl_checkpoint": None,
        "human_feedback": None,
        "approval_status": "pending",
        "messages": []
    }

    with st.spinner("LangGraph multi-agent pipeline executing..."):
        if auto_approve:
            # Headless run to completion
            res = st.session_state.graph.invoke(initial_state, config=config)
            st.session_state.current_result = res
            st.session_state.run_active = False
        else:
            # Step until first interrupt
            res = st.session_state.graph.invoke(initial_state, config=config)
            st.session_state.current_result = res

# Display Current State & HITL Gate
if st.session_state.current_result:
    config = {"configurable": {"thread_id": st.session_state.thread_id}}
    state_snap = st.session_state.graph.get_state(config)
    state_vals = state_snap.values or {}

    # Check for Active HITL Interrupt
    interrupt_task = state_snap.tasks[0] if state_snap.tasks else None
    has_interrupt = interrupt_task and interrupt_task.interrupts

    if has_interrupt:
        payload = interrupt_task.interrupts[0].value
        ckpt = payload.get("checkpoint", "Review Gate")
        
        st.warning(f"⏸ **Human-In-The-Loop Checkpoint Reached: {ckpt.upper()}**")
        
        if ckpt == "scenario_approval":
            st.subheader("📋 Review Generated Test Scenarios")
            scenarios = payload.get("data", [])
            st.dataframe(scenarios, use_container_width=True)
            
            c1, c2, c3 = st.columns([1, 1, 2])
            with c1:
                if st.button("✅ Approve Scenarios", type="primary"):
                    with st.spinner("Resuming graph execution..."):
                        res = st.session_state.graph.invoke(Command(resume={"status": "approved"}), config=config)
                        st.session_state.current_result = res
                        st.rerun()
            with c2:
                if st.button("❌ Reject"):
                    st.session_state.graph.invoke(Command(resume={"status": "rejected"}), config=config)
                    st.error("Run halted by reviewer.")
                    st.rerun()

        elif ckpt == "code_approval":
            st.subheader("💻 Review Synthesized Test Code")
            code_files = payload.get("data", {})
            for fname, code in code_files.items():
                lang = "gherkin" if fname.endswith(".feature") else "python"
                st.code(code, language=lang)
            
            c1, c2 = st.columns([1, 1])
            with c1:
                if st.button("✅ Approve & Execute Tests", type="primary"):
                    with st.spinner("Executing tests in sandboxed runner..."):
                        res = st.session_state.graph.invoke(Command(resume={"status": "approved"}), config=config)
                        st.session_state.current_result = res
                        st.rerun()
            with c2:
                if st.button("❌ Reject Code"):
                    st.session_state.graph.invoke(Command(resume={"status": "rejected"}), config=config)
                    st.error("Execution aborted by reviewer.")
                    st.rerun()

        elif ckpt == "healing_approval":
            st.subheader("🛠️ Review Self-Healed Code Patch")
            healed = payload.get("data", {})
            for fname, code in healed.items():
                st.code(code, language="gherkin" if fname.endswith(".feature") else "python")
            
            if st.button("✅ Approve Patch & Re-Execute", type="primary"):
                with st.spinner("Re-executing healed tests..."):
                    res = st.session_state.graph.invoke(Command(resume={"status": "approved"}), config=config)
                    st.session_state.current_result = res
                    st.rerun()

    # If Finished / Display Results
    if not state_snap.next:
        st.success("🎉 LangGraph Pipeline Completed Successfully!")
        
        exec_res = state_vals.get("execution_result") or {}
        defect_rep = state_vals.get("defect_report") or {}
        
        # Metrics Row
        m1, m2, m3, m4 = st.columns(4)
        status_color = "normal" if exec_res.get("success") else "off"
        m1.metric("Status", "PASSED" if exec_res.get("success") else "FAILED")
        m2.metric("Passed Scenarios", exec_res.get("passed_count", 0))
        m3.metric("Failed Scenarios", exec_res.get("failed_count", 0))
        m4.metric("Self-Healing Passes", state_vals.get("healing_attempts", 0))

        # Tabs for Artifacts
        tab_code, tab_report, tab_logs = st.tabs(["📄 Generated Tests", "🔍 Defect & RCA Report", "📜 Execution Logs"])
        
        with tab_code:
            code_files = state_vals.get("generated_code_files", {})
            for fname, content in code_files.items():
                st.markdown(f"**Workspace File:** `{fname}`")
                st.code(content, language="gherkin" if fname.endswith(".feature") else "python")
        
        with tab_report:
            if defect_rep:
                st.markdown(f"### Defect Status: `{defect_rep.get('status')}`")
                st.info(defect_rep.get("summary"))
                st.markdown(f"**Root Cause Analysis:**\n```\n{defect_rep.get('root_cause')}\n```")
                st.markdown(f"**Recommendation:** {defect_rep.get('recommended_fix')}")
                if "jira_ticket" in defect_rep:
                    st.warning(f"📌 Logged Jira Bug Ticket: `{defect_rep['jira_ticket'].get('key')}`")
            else:
                st.success("Clean execution! All tests validated successfully.")

        with tab_logs:
            st.text(exec_res.get("stdout", "No stdout captured"))
