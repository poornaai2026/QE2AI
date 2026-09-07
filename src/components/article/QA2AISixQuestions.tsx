import React from 'react';
import { 
  HelpCircle, 
  Cpu, 
  Code2, 
  AlertOctagon, 
  ShieldCheck, 
  Server, 
  MessageSquareCode, 
  CheckCircle2 
} from 'lucide-react';
import type { QA2AISixQuestions as SixQuestionsType } from '../../content/types';
import { CodeBlock } from '../common/CodeBlock';
import { Callout } from '../common/Callout';

interface Props {
  data: SixQuestionsType;
}

export const QA2AISixQuestions: React.FC<Props> = ({ data }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem' }}>
      {/* 1. WHAT? */}
      <section id="section-what" style={{ scrollMarginTop: '6rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
          <div style={{ padding: '0.4rem', borderRadius: 'var(--radius-sm)', background: 'var(--accent-cyan-subtle)', color: 'var(--accent-cyan)' }}>
            <HelpCircle size={18} />
          </div>
          <h2 style={{ fontSize: 'var(--text-2xl)' }}>1. WHAT? — Why does this technology exist?</h2>
        </div>
        <p style={{ fontSize: 'var(--text-base)', lineHeight: 1.8, color: 'var(--text-secondary)' }}>
          {data.what}
        </p>
      </section>

      {/* 2. HOW? */}
      <section id="section-how" style={{ scrollMarginTop: '6rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
          <div style={{ padding: '0.4rem', borderRadius: 'var(--radius-sm)', background: 'var(--accent-purple-subtle)', color: 'var(--accent-purple)' }}>
            <Cpu size={18} />
          </div>
          <h2 style={{ fontSize: 'var(--text-2xl)' }}>2. HOW? — How does it work under the hood?</h2>
        </div>
        <p style={{ fontSize: 'var(--text-base)', lineHeight: 1.8, color: 'var(--text-secondary)' }}>
          {data.how}
        </p>
      </section>

      {/* 3. BUILD? */}
      <section id="section-build" style={{ scrollMarginTop: '6rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
          <div style={{ padding: '0.4rem', borderRadius: 'var(--radius-sm)', background: 'var(--accent-emerald-subtle)', color: 'var(--accent-emerald)' }}>
            <Code2 size={18} />
          </div>
          <h2 style={{ fontSize: 'var(--text-2xl)' }}>3. BUILD — Runnable Implementation</h2>
        </div>
        <p style={{ fontSize: 'var(--text-base)', marginBottom: '1.25rem', color: 'var(--text-secondary)' }}>
          {data.build.description}
        </p>
        {data.build.snippets.map((snippet, idx) => (
          <CodeBlock
            key={idx}
            code={snippet.code}
            language={snippet.language}
            filename={snippet.filename}
          />
        ))}
      </section>

      {/* 4. FAIL? */}
      <section id="section-fail" style={{ scrollMarginTop: '6rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
          <div style={{ padding: '0.4rem', borderRadius: 'var(--radius-sm)', background: 'var(--accent-rose-subtle)', color: 'var(--accent-rose)' }}>
            <AlertOctagon size={18} />
          </div>
          <h2 style={{ fontSize: 'var(--text-2xl)' }}>4. FAIL — Failure Modes & Edge Cases</h2>
        </div>
        <Callout type="danger" title="Known Failure Modes in LLM Systems">
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {data.fail.map((failMode, idx) => (
              <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <span style={{ color: 'var(--accent-rose)', fontWeight: 700 }}>✗</span>
                <span>{failMode}</span>
              </li>
            ))}
          </ul>
        </Callout>
      </section>

      {/* 5. TEST? */}
      <section id="section-test" style={{ scrollMarginTop: '6rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
          <div style={{ padding: '0.4rem', borderRadius: 'var(--radius-sm)', background: 'var(--accent-purple-subtle)', color: 'var(--accent-purple)' }}>
            <ShieldCheck size={18} />
          </div>
          <h2 style={{ fontSize: 'var(--text-2xl)' }}>5. TEST — How a QA/QE Engineer Validates It</h2>
        </div>
        <p style={{ fontSize: 'var(--text-base)', marginBottom: '1.25rem', color: 'var(--text-secondary)' }}>
          {data.test.strategy}
        </p>

        <div className="card" style={{ marginBottom: '1.25rem' }}>
          <h4 style={{ fontSize: 'var(--text-base)', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
            Recommended Test Cases:
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {data.test.testCases.map((tc, idx) => (
              <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: 'var(--text-sm)' }}>
                <CheckCircle2 size={16} style={{ color: 'var(--accent-emerald)', flexShrink: 0, marginTop: '0.15rem' }} />
                <span>{tc}</span>
              </li>
            ))}
          </ul>
        </div>

        {data.test.metrics && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            {data.test.metrics.map(metric => (
              <span
                key={metric}
                style={{
                  fontSize: 'var(--text-xs)',
                  fontFamily: 'var(--font-mono)',
                  background: 'var(--accent-cyan-subtle)',
                  color: 'var(--accent-cyan)',
                  border: '1px solid rgba(6, 182, 212, 0.3)',
                  padding: '0.35rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: 600
                }}
              >
                📊 {metric}
              </span>
            ))}
          </div>
        )}
      </section>

      {/* 6. PRODUCTION? */}
      <section id="section-production" style={{ scrollMarginTop: '6rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
          <div style={{ padding: '0.4rem', borderRadius: 'var(--radius-sm)', background: 'var(--accent-amber-subtle)', color: 'var(--accent-amber)' }}>
            <Server size={18} />
          </div>
          <h2 style={{ fontSize: 'var(--text-2xl)' }}>6. PRODUCTION — Scaling & Operational Changes</h2>
        </div>
        <Callout type="warning" title="What changes when moving from a Tutorial to Production?">
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {data.production.map((prodRule, idx) => (
              <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <span style={{ color: 'var(--accent-amber)', fontWeight: 700 }}>⚡</span>
                <span>{prodRule}</span>
              </li>
            ))}
          </ul>
        </Callout>
      </section>

      {/* 7. INTERVIEW? */}
      <section id="section-interview" style={{ scrollMarginTop: '6rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
          <div style={{ padding: '0.4rem', borderRadius: 'var(--radius-sm)', background: 'var(--accent-cyan-subtle)', color: 'var(--accent-cyan)' }}>
            <MessageSquareCode size={18} />
          </div>
          <h2 style={{ fontSize: 'var(--text-2xl)' }}>7. INTERVIEW — Top Questions & Answers</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {data.interview.map((item, idx) => (
            <div key={idx} className="card" style={{ padding: '1.5rem' }}>
              <div style={{ fontWeight: 700, fontSize: 'var(--text-base)', color: 'var(--text-primary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <span style={{ color: 'var(--accent-cyan)' }}>Q:</span>
                <span>{item.question}</span>
              </div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.7, paddingLeft: '1.5rem', borderLeft: '2px solid var(--accent-cyan)' }}>
                {item.answer}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
