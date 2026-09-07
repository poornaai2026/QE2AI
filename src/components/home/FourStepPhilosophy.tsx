import React from 'react';
import { BookOpen, Hammer, Rocket, ShieldCheck } from 'lucide-react';

export const FourStepPhilosophy: React.FC = () => {
  const steps = [
    {
      number: "01",
      title: "LEARN",
      tagline: "First-Principles AI Foundations",
      description: "Understand the core architecture: Tokens, Vector Embeddings, Transformer Attention, Context Windows, and Prompt Semantics without mathematical fog.",
      icon: BookOpen,
      color: "cyan"
    },
    {
      number: "02",
      title: "BUILD",
      tagline: "Practical Code Blueprints",
      description: "Write real software: Pydantic structured outputs, ChromaDB RAG retrieval pipelines, LangGraph cyclic state machines, and Model Context Protocol (MCP) servers.",
      icon: Hammer,
      color: "purple"
    },
    {
      number: "03",
      title: "TEST AI",
      tagline: "Automated AI Quality Gates",
      description: "Benchmark probabilistic models with Ragas & DeepEval: measure Faithfulness, Hallucination, Context Precision, and adversarial security in CI/CD.",
      icon: ShieldCheck,
      color: "emerald"
    },
    {
      number: "04",
      title: "DEPLOY",
      tagline: "Resilient Production Gateways",
      description: "Scale applications with Redis semantic caching, prompt compression, LangSmith / OpenTelemetry observability, token rate limiting, and fallback cascades.",
      icon: Rocket,
      color: "amber"
    }
  ];

  return (
    <section className="section-padding">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.25rem 0.75rem', background: 'var(--accent-cyan-subtle)', borderRadius: 'var(--radius-full)', border: '1px solid rgba(6, 182, 212, 0.3)', marginBottom: '1rem', fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>
            <span>THE QA2AI METHODOLOGY</span>
          </div>
          <h2 style={{ marginBottom: '1rem' }}>
            Learn → Build → Test → Deploy
          </h2>
          <p style={{ maxWidth: '650px', margin: '0 auto', fontSize: 'var(--text-base)' }}>
            We reject shallow toy prompts. Every concept is taken through four rigorous engineering stages to prepare you for production reality.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.5rem'
        }}>
          {steps.map(step => {
            const Icon = step.icon;
            return (
              <div key={step.number} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.75rem', fontWeight: 800, color: `var(--accent-${step.color})`, opacity: 0.6 }}>
                    {step.number}
                  </span>
                  <div style={{
                    width: '2.5rem',
                    height: '2.5rem',
                    borderRadius: 'var(--radius-md)',
                    background: `var(--accent-${step.color}-subtle)`,
                    color: `var(--accent-${step.color})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Icon size={20} />
                  </div>
                </div>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '0.35rem', color: 'var(--text-primary)' }}>{step.title}</h3>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: `var(--accent-${step.color})`, marginBottom: '0.85rem' }}>
                  {step.tagline}
                </div>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
