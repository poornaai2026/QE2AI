import React, { useState } from 'react';
import { X, Copy, Check, Download, FileText } from 'lucide-react';

interface CheatSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CHEAT_SHEET_MARKDOWN = `# ⚡ 2026 QE-to-AI Architecture & Quality Engineering Cheat Sheet
Author: Poorna | Platform: https://qe-2-ai.vercel.app/ | GitHub: https://github.com/poornaai2026/QE2AI

========================================================================================
1. THE RAG TRIAD & EVALUATION FORMULAS
========================================================================================
- Faithfulness (Groundedness):
  Faithfulness = (Claims supported by retrieved context) / (Total claims in answer)
  CI/CD Pass Gate: >= 0.88

- Context Precision:
  Measures if high-signal chunks are ranked at Top-1 and Top-2 positions.
  CI/CD Pass Gate: >= 0.85

- Answer Relevance:
  Semantic alignment between user intent and generated output (penalizing rambling).

- Paired t-test Significance (Prompt Drift):
  t_stat, p_val = scipy.stats.ttest_rel(candidate_scores, baseline_scores)
  Fail PR if: (mean_delta < -0.02) AND (p_val < 0.05)

========================================================================================
2. RESILIENCE & LLMOps FORMULAS
========================================================================================
- Exponential Backoff with Full Jitter (429 Rate Limits):
  Sleep = random.uniform(0, min(max_backoff, base * (2 ** attempt)))

- Redis Semantic Caching:
  Cosine Similarity Threshold: >= 0.95 (Returns cached response in 10ms, cuts 100% LLM cost)

- LangGraph Recursion Guard:
  config = {"recursion_limit": 20}  # Prevents infinite UI action loops

- HNSW Search Optimization:
  ef_search = 64, M = 16 (Sub-15ms vector lookup for 100k+ documents)

========================================================================================
3. MODEL CONTEXT PROTOCOL (MCP) ESSENTIALS
========================================================================================
- Transport Layers:
  * stdio: Standard Input/Output for local child processes (Claude Desktop, Cursor IDE)
  * SSE: Server-Sent Events over HTTP for cloud microservices / Kubernetes

- FastMCP Tool Recipe:
  @mcp.tool()
  async def run_playwright_test(spec_name: str) -> str:
      safe_name = shlex.quote(spec_name)
      return subprocess.run(["npx", "playwright", "test", safe_name], capture_output=True).stdout

========================================================================================
4. THE 11 FLAGSHIP PYTHON PROJECTS MATRIX
========================================================================================
1. AI Test Case & Playwright Generator    | FastAPI, ChromaDB, Playwright, Pydantic V2
2. Self-Healing UI Automation Engine     | Playwright, DOM Extraction, SentenceTransformers
3. MCP Test Harness Server                | FastMCP, stdio, SSE, JSON-RPC 2.0
4. LLM-as-a-Judge Evaluation Framework   | GPT-4o, Claude 3.5, Cohen's Kappa, G-Eval
5. API Fuzzing & Security Red-Teamer      | Prompt Injections, Jailbreak AST, Pytest
6. Enterprise RAG Evaluation with Ragas   | Ragas, ChromaDB, Context Precision, Faithfulness
7. AI Log & Root Cause Analyzer           | OpenTelemetry, LangSmith, Vector Diagnostics
8. Synthetic Test Data Generator          | Pydantic V2, Faker, Negative Edge Cases
9. CI/CD Quality Gate (GitHub Actions)    | Pytest Matrix, Exit Code 1 Blocks, PR Scorecards
10. Semantic Caching & Rate-Limit Proxy   | Redis VSS, Token Bucket, LiteLLM Failover
11. LangChain Deep Agents & Multi-Agents  | StateGraph, Plan-and-Solve, HITL Breakpoints
`;

export const CheatSheetModal: React.FC<CheatSheetModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(CHEAT_SHEET_MARKDOWN);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([CHEAT_SHEET_MARKDOWN], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'QE2AI_Architecture_CheatSheet_2026.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="search-modal"
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '750px',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-strong)',
          borderRadius: 'var(--radius-sm)',
          boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.75)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '85vh'
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1rem 1.25rem',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'var(--bg-primary)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: '1.85rem',
              height: '1.85rem',
              borderRadius: 'var(--radius-xs)',
              background: 'var(--accent-primary)',
              color: 'var(--accent-primary-text)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800
            }}>
              <FileText size={15} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                2026 QE-to-AI Architecture Cheat Sheet
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Formulas, Metrics, Resilience Patterns & Project Reference
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={handleCopy}
              className="btn btn-secondary"
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              {copied ? <Check size={13} style={{ color: '#10b981' }} /> : <Copy size={13} />}
              <span>{copied ? 'Copied!' : 'Copy Markdown'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="btn btn-primary"
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <Download size={13} />
              <span>Download (.md)</span>
            </button>
            <button 
              onClick={onClose} 
              className="icon-btn" 
              style={{ width: '1.8rem', height: '1.8rem', padding: 0 }}
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1.25rem',
          background: 'var(--bg-tertiary)',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.78rem',
          lineHeight: '1.6',
          color: 'var(--text-primary)',
          whiteSpace: 'pre-wrap',
          userSelect: 'text'
        }}>
          {CHEAT_SHEET_MARKDOWN}
        </div>
      </div>
    </div>
  );
};
