import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { AUTHOR_JOURNEY_STORY } from '../content/qe2aiBlueprintData';
import { GithubIcon } from '../components/common/Icons';

export const AboutPage: React.FC = () => {
  return (
    <div className="animate-fade-in" style={{ padding: '3.5rem 0 5rem' }}>
      <div className="container doc-container">
        {/* Top Badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <span className="badge badge-inverted">ABOUT THE CREATOR</span>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>The QE → AI Evolution</span>
        </div>

        {/* Header */}
        <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
          {AUTHOR_JOURNEY_STORY.name}
        </h1>
        <p style={{ fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          {AUTHOR_JOURNEY_STORY.title} • {AUTHOR_JOURNEY_STORY.tagline}
        </p>

        {/* Narrative */}
        <div className="card" style={{
          padding: '2rem',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-default)',
          marginBottom: '2.5rem'
        }}>
          <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)' }}>
            From Automation Architect to GenAI Engineering
          </h2>
          <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p>
              I spent the first decade of my engineering career deep in the trenches of traditional Quality Engineering—architecting enterprise test automation frameworks across Java, Selenium, Appium, and REST APIs. I specialized in building multi-platform regression suites, scaling CI/CD pipelines, and establishing rigorous quality gates for high-throughput enterprise systems.
            </p>
            <p>
              When the Generative AI wave arrived, like many Quality Engineers, I realized our discipline was at a turning point. Instead of starting over from scratch, I leveraged the core engineering strengths that QEs already possess—<strong>system architecture, edge-case analysis, contract verification, CI/CD automation, and debugging</strong>—to transition directly into AI and GenAI Engineering.
            </p>
            <p>
              Today, my work centers on building RAG pipelines, autonomous AI agents with LangGraph, Model Context Protocol (MCP) tool servers, and automated LLM evaluation gates with Ragas.
            </p>
          </div>
        </div>

        {/* Visual Timeline of Technical Phases */}
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, marginBottom: '1.25rem', color: 'var(--text-primary)' }}>
            The 4-Phase Technical Journey
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {AUTHOR_JOURNEY_STORY.phases.map((phase, idx) => (
              <div
                key={idx}
                className="card"
                style={{
                  padding: '1.5rem',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <span className="badge badge-outline">{phase.period}</span>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Step {idx + 1}</span>
                </div>
                <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                  {phase.title}
                </h3>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                  {phase.skills}
                </div>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {phase.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Why QE2AI Was Created Callout */}
        <div style={{
          padding: '2rem',
          background: 'var(--bg-tertiary)',
          border: '1px solid var(--border-strong)',
          borderRadius: 'var(--radius-md)',
          marginBottom: '2.5rem'
        }}>
          <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            Why QE2AI Was Created
          </h3>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
            <em>"Quality Engineers don't need to start from zero to master AI. You already know how systems break, how APIs communicate, and how software scales. AI Engineering is simply the next evolution of your problem-solving toolkit."</em>
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link to="/roadmap" className="btn btn-primary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              <span>Start the Roadmap</span>
              <ArrowRight size={14} />
            </Link>
            <a
              href="https://github.com/poornaai2026/QE2AI"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <GithubIcon size={14} />
              <span>Contribute on GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
