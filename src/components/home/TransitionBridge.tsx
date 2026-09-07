import React from 'react';
import { CheckCircle, Cpu, ShieldCheck, Sparkles, Terminal } from 'lucide-react';

export const TransitionBridge: React.FC = () => {
  const stages = [
    {
      title: "1. QA Automation Foundation",
      role: "Your Current Core",
      color: "cyan",
      icon: Terminal,
      skills: [
        "Playwright / Pytest / Selenium",
        "API Testing & Microservices",
        "CI/CD Pipelines & Quality Gates",
        "Edge-Case Discovery & Failure Analysis"
      ]
    },
    {
      title: "2. The AI Engineering Pivot",
      role: "Modern Technical Stack",
      color: "purple",
      icon: Cpu,
      skills: [
        "Python Async & Pydantic V2",
        "LLMs, Prompting & Structured JSON",
        "RAG, Chunking & Vector DBs (Chroma/Qdrant)",
        "LangGraph Cyclic Agents & MCP Protocol"
      ]
    },
    {
      title: "3. AI Quality Engineering",
      role: "Your Unfair Advantage",
      color: "emerald",
      icon: ShieldCheck,
      skills: [
        "Ragas & DeepEval Evaluation Frameworks",
        "Faithfulness & Hallucination Metrics",
        "Synthetic Test Generation & Red Teaming",
        "Statistical CI/CD Regression Gates"
      ]
    },
    {
      title: "4. Full-Stack AI Engineer",
      role: "The Destination",
      color: "amber",
      icon: Sparkles,
      skills: [
        "AI System Design & Gateway Routing",
        "Multi-Agent Enterprise Orchestration",
        "Production Tracing (LangSmith / Langfuse)",
        "High-Impact Engineering Leadership"
      ]
    }
  ];

  return (
    <section className="section-padding" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.25rem 0.75rem', background: 'var(--accent-purple-subtle)', borderRadius: 'var(--radius-full)', border: '1px solid rgba(139, 92, 246, 0.3)', marginBottom: '1rem', fontSize: '0.75rem', color: 'var(--accent-purple)', fontWeight: 600 }}>
            <span>THE STRATEGIC SHIFT</span>
          </div>
          <h2 style={{ marginBottom: '1rem' }}>
            The <span className="gradient-accent-text">QA → AI</span> Evolutionary Bridge
          </h2>
          <p style={{ maxWidth: '650px', margin: '0 auto', fontSize: 'var(--text-base)' }}>
            Why start from scratch when 60% of your software testing and automation skills directly map to AI system design and evaluation?
          </p>
        </div>

        {/* 4-Stage Connected Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.5rem',
          position: 'relative'
        }}>
          {stages.map((stage) => {
            const Icon = stage.icon;
            return (
              <div
                key={stage.title}
                className="card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  borderTop: `3px solid var(--accent-${stage.color})`,
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                  <div style={{
                    width: '2.5rem',
                    height: '2.5rem',
                    borderRadius: 'var(--radius-md)',
                    background: `var(--accent-${stage.color}-subtle)`,
                    color: `var(--accent-${stage.color})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Icon size={20} />
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: `var(--accent-${stage.color})`, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {stage.role}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem' }}>{stage.title}</h3>

                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem', marginTop: 'auto' }}>
                  {stage.skills.map((skill) => (
                    <li key={skill} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                      <CheckCircle size={15} style={{ color: `var(--accent-${stage.color})`, flexShrink: 0, marginTop: '0.2rem' }} />
                      <span>{skill}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
