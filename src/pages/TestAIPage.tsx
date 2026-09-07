import React from 'react';
import { 
  CheckCircle2, 
  ExternalLink
} from 'lucide-react';
import { GithubIcon } from '../components/common/Icons';
import { RagTroubleshooter } from '../components/interactive/RagTroubleshooter';

export const TestAIPage: React.FC = () => {
  const qePillars = [
    {
      category: "ai-testing",
      title: "1. AI-Powered Test Automation",
      badge: "Testing AI",
      items: [
        {
          name: "AI-Generated Test Cases",
          description: "Ingesting user stories, PRDs, and Jira tickets to generate comprehensive positive, negative, boundary, and edge test scenarios."
        },
        {
          name: "AI-Generated Test Data",
          description: "Synthesizing deterministic and edge-case test datasets that mirror production distributions without PII/compliance risks."
        },
        {
          name: "AI UI Testing & Playwright",
          description: "Using multimodal vision models and DOM semantic trees to navigate complex web apps and verify UI states."
        },
        {
          name: "AI API Contract Testing",
          description: "Automated analysis of OpenAPI/Swagger specs to test boundary limits, schema deviations, and auth states."
        },
        {
          name: "Self-Healing Automation",
          description: "Dynamic runtime selector repairs when DOM attributes, CSS classes, or element hierarchies change during deployments."
        },
        {
          name: "Failure & Root-Cause Analysis",
          description: "Automated stack trace and log clustering using vector embeddings to pinpoint why and where tests broke."
        }
      ]
    },
    {
      category: "llm-eval",
      title: "2. LLM & Generative AI Quality Engineering",
      badge: "Testing GenAI",
      items: [
        {
          name: "LLM Evaluation (Ragas & DeepEval)",
          description: "Replacing subjective manual prompt reviews with automated, quantitative metrics in CI/CD pipelines."
        },
        {
          name: "The RAG Triad Evaluation",
          description: "Measuring Faithfulness (groundedness), Answer Relevance (query match), and Context Precision (retrieval quality)."
        },
        {
          name: "Hallucination Testing",
          description: "Benchmarking models against ground-truth golden datasets to catch factual drift and invented responses."
        },
        {
          name: "Prompt Injection & Security Red-Teaming",
          description: "Adversarial testing targeting direct prompt injections, jailbreaks, and system prompt exfiltration."
        },
        {
          name: "Safety, Toxicity & Bias Audits",
          description: "Automated guardrail verification ensuring models adhere to enterprise compliance, privacy, and safety rules."
        },
        {
          name: "Automated Regression Gates",
          description: "Blocking GitHub pull requests whenever prompt updates, chunking modifications, or model changes degrade accuracy."
        }
      ]
    },
    {
      category: "agentic-qe",
      title: "3. Agentic & Autonomous Quality Systems",
      badge: "Autonomous QE",
      items: [
        {
          name: "AI Test Agents (LangGraph)",
          description: "Stateful agents that autonomously plan, write, execute, inspect, and fix test suites in sandboxed environments."
        },
        {
          name: "Model Context Protocol (MCP) in QE",
          description: "Exposing test execution environments, CI logs, and test database states to LLMs via standardized MCP tool servers."
        },
        {
          name: "Test Maintenance & Optimization",
          description: "Pruning redundant test cases and identifying flaky test suites automatically using semantic telemetry."
        }
      ]
    }
  ];

  return (
    <div className="animate-fade-in" style={{ padding: '3.5rem 0 5rem' }}>
      <div className="container">
        {/* Header */}
        <div style={{ maxWidth: '840px', marginBottom: '3rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span className="badge badge-inverted">SIGNATURE DOMAIN</span>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>The Destination for Quality Engineers</span>
          </div>
          <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, marginBottom: '0.75rem' }}>
            AI Quality Engineering
          </h1>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            This is what makes <strong>QE2AI</strong> distinct. Instead of treating Quality Engineering only as the starting point, we establish <strong>AI-Powered Quality Engineering</strong> as one of the most vital, high-value destinations in the software industry.
          </p>
        </div>

        {/* Evaluation Metrics Deep Dive Callout */}
        <div className="card" style={{
          padding: '2rem',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-default)',
          marginBottom: '3rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <span className="badge badge-outline" style={{ marginBottom: '0.35rem' }}>The Core Superpower</span>
              <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, color: 'var(--text-primary)' }}>
                Traditional Assertions vs AI Evaluation Gates
              </h2>
            </div>
            <a
              href="https://github.com/poornaai2026/QE2AI/tree/main/projects/07-ai-powered-qe-eval-agent"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <GithubIcon size={14} />
              <span>Explore Project 07 Eval Pipeline</span>
              <ExternalLink size={12} style={{ opacity: 0.6 }} />
            </a>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            <div style={{ padding: '1.25rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: 'var(--text-xs)', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                Deterministic Testing (Traditional QA)
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-primary)', background: 'var(--bg-code)', padding: '0.6rem', borderRadius: 'var(--radius-xs)', marginBottom: '0.6rem' }}>
                assert actual_status == 200<br />
                assert actual_text == "Expected"
              </div>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Binary pass/fail checks against static code. Breaks completely when outputs are non-deterministic natural language.
              </p>
            </div>

            <div style={{ padding: '1.25rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: 'var(--text-xs)', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                Probabilistic AI Evaluation (AI QE)
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-primary)', background: 'var(--bg-code)', padding: '0.6rem', borderRadius: 'var(--radius-xs)', marginBottom: '0.6rem' }}>
                assert ragas.faithfulness &gt;= 0.88<br />
                assert deepeval.hallucination == 0.0
              </div>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Statistical quality benchmarks measuring semantic faithfulness, context relevance, prompt injection resistance, and hallucination scores.
              </p>
            </div>
          </div>
        </div>

        {/* Interactive RAG Quality Troubleshooter */}
        <div style={{ marginBottom: '3.5rem' }}>
          <RagTroubleshooter />
        </div>

        {/* 3 Pillars Breakdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {qePillars.map((section, idx) => (
            <div key={idx}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {section.title}
                </h2>
                <span className="badge badge-outline">{section.badge}</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
                {section.items.map((item, itemIdx) => (
                  <div
                    key={itemIdx}
                    className="card"
                    style={{
                      padding: '1.5rem',
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-subtle)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <CheckCircle2 size={16} style={{ color: 'var(--text-primary)' }} />
                      <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {item.name}
                      </h3>
                    </div>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
