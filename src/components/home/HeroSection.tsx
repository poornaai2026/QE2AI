import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass, FolderGit2, Milestone, ShieldCheck, Sparkles, Terminal } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section className="section-padding" style={{ paddingTop: '4.5rem', paddingBottom: '3.5rem', position: 'relative', overflow: 'hidden' }}>
      {/* Background Ambient Glow */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '600px',
        height: '350px',
        background: 'radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, rgba(139, 92, 246, 0.1) 50%, transparent 70%)',
        filter: 'blur(60px)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        {/* Top Tagline Badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 0.9rem', background: 'var(--accent-cyan-subtle)', borderRadius: 'var(--radius-full)', border: '1px solid rgba(6, 182, 212, 0.3)', marginBottom: '1.75rem' }}>
          <Sparkles size={14} style={{ color: 'var(--accent-cyan)' }} />
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent-cyan)' }}>
            The Definitive Bridge: From Quality Engineering to AI Engineering
          </span>
        </div>

        {/* Main Headline */}
        <h1 style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)', fontWeight: 800, lineHeight: 1.15, marginBottom: '1.5rem', maxWidth: '960px', marginLeft: 'auto', marginRight: 'auto' }}>
          From QA Automation to <span className="gradient-text">AI Engineering</span>
        </h1>

        {/* Supporting Subtext */}
        <p style={{ fontSize: 'clamp(1.05rem, 2vw, 1.25rem)', color: 'var(--text-secondary)', maxWidth: '780px', marginLeft: 'auto', marginRight: 'auto', marginBottom: '2.5rem', lineHeight: 1.65 }}>
          You already master automation, API testing, software architecture, CI/CD pipelines, and edge-case discovery. 
          Turn those unfair superpowers into building and evaluating <strong>LLMs, RAG, Agentic AI, LangGraph, and Model Context Protocol (MCP)</strong> systems.
        </p>

        {/* 3 Call to Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '3.5rem' }}>
          <Link to="/roadmap" className="btn btn-primary btn-lg">
            <Compass size={18} />
            <span>Start the Roadmap</span>
            <ArrowRight size={16} />
          </Link>
          <Link to="/projects" className="btn btn-secondary btn-lg">
            <FolderGit2 size={18} />
            <span>Explore Projects</span>
          </Link>
          <Link to="/my-journey" className="btn btn-ghost btn-lg" style={{ border: '1px solid var(--border-subtle)' }}>
            <Milestone size={18} />
            <span>Read My Journey</span>
          </Link>
        </div>

        {/* Key Competency Metric Pills */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          maxWidth: '1000px',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}>
          <div className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ padding: '0.6rem', borderRadius: 'var(--radius-md)', background: 'var(--accent-cyan-subtle)', color: 'var(--accent-cyan)' }}>
              <Compass size={20} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>10 Phases</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Structured QA → AI Roadmap</div>
            </div>
          </div>

          <div className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ padding: '0.6rem', borderRadius: 'var(--radius-md)', background: 'var(--accent-purple-subtle)', color: 'var(--accent-purple)' }}>
              <ShieldCheck size={20} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>AI Quality Eng.</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Ragas, DeepEval, CI Gates</div>
            </div>
          </div>

          <div className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ padding: '0.6rem', borderRadius: 'var(--radius-md)', background: 'var(--accent-emerald-subtle)', color: 'var(--accent-emerald)' }}>
              <Terminal size={20} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>3 Flagships</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Real-world System Architectures</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
