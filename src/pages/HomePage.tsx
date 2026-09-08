import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Cpu, 
  Code2, 
  FolderGit2, 
  BookOpen,
  ArrowUpRight
} from 'lucide-react';
import { QE2AI_TRACKS, AUTHOR_JOURNEY_STORY } from '../content/qe2aiBlueprintData';
import { GithubIcon } from '../components/common/Icons';
import { Hero3DNeuralCore } from '../components/3d/Hero3DNeuralCore';
import { Tilt3DCard } from '../components/3d/Tilt3DCard';
import { Isometric3DGateway } from '../components/3d/Isometric3DGateway';

export const HomePage: React.FC = () => {
  const [activeArchIndex, setActiveArchIndex] = useState(0);

  const architectureHighlights = [
    {
      title: "RAG Evaluation Gate",
      subtitle: "Deterministic assertions vs Probabilistic LLM judges",
      flow: "Jira Requirement ──▶ LangChain RAG ──▶ Pytest Eval Runner ──▶ Ragas Faithfulness (0.94) ──▶ PR Pass"
    },
    {
      title: "Playwright AI Self-Healing",
      subtitle: "Runtime DOM analysis and selector recovery",
      flow: "Element Click Fails ──▶ AI DOM Analyzer ──▶ Semantic Candidate Matching ──▶ Auto-Heal & Resume"
    },
    {
      title: "QE Model Context Protocol",
      subtitle: "Universal protocol connecting AI to test infrastructure",
      flow: "AI Assistant (Claude/Cursor) ──▶ FastMCP Server ──▶ Run Playwright Tests ──▶ Fetch Live Logs"
    }
  ];

  return (
    <div className="animate-fade-in">
      {/* 1. HERO SECTION WITH SPOTLIGHT & GRID */}
      <section className="bg-grid-mesh hero-spotlight" style={{
        padding: '5.5rem 0 4.5rem',
        borderBottom: '1px solid var(--border-subtle)',
        background: 'var(--bg-primary)',
        position: 'relative'
      }}>
        <div className="container">
          <div style={{ maxWidth: '840px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
            {/* Top Badge with Live Beacon */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
              <span className="badge badge-inverted" style={{ fontSize: '0.72rem', letterSpacing: '0.06em', padding: '0.25rem 0.65rem' }}>
                <span className="live-beacon" style={{ marginRight: '4px' }}></span>
                QE2AI BLUEPRINT
              </span>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                From Quality Engineering to AI Engineering
              </span>
            </div>

            {/* Headline */}
            <h1 style={{
              fontSize: 'clamp(2.6rem, 5.5vw, 4.25rem)',
              fontWeight: 900,
              lineHeight: 1.08,
              letterSpacing: '-0.04em',
              marginBottom: '1.25rem',
              color: 'var(--text-primary)'
            }}>
              From QE to AI Engineer.
            </h1>

            {/* Supporting Line */}
            <p style={{
              fontSize: 'clamp(1.15rem, 2vw, 1.4rem)',
              color: 'var(--text-primary)',
              fontWeight: 500,
              marginBottom: '1.25rem',
              lineHeight: 1.4
            }}>
              A practical roadmap to learn, build and deploy AI — designed specifically for Quality Engineers.
            </p>

            {/* Core Message Box */}
            <p style={{
              fontSize: 'var(--text-base)',
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
              marginBottom: '1.5rem',
              maxWidth: '720px',
              marginLeft: 'auto',
              marginRight: 'auto'
            }}>
              You're already an engineer. You already understand automation, APIs, debugging, CI/CD and software quality. You don't need to start your engineering journey from scratch to learn AI. <strong>QE2AI</strong> helps you build on your existing QE skills and transition into AI engineering step by step.
            </p>

            {/* Interactive 3D Neural Core & Orbital Tech Nodes */}
            <Hero3DNeuralCore />

            {/* CTAs */}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3rem' }}>
              <Link to="/roadmap" className="btn btn-primary btn-lg" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>Start Your QE → AI Journey</span>
                <ArrowRight size={16} />
              </Link>
              <Link to="/projects" className="btn btn-secondary btn-lg" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <FolderGit2 size={16} />
                <span>Explore 10 Projects</span>
              </Link>
              <a 
                href="https://github.com/poornaai2026/QE2AI" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-ghost btn-lg"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <GithubIcon size={16} />
                <span>GitHub Repo</span>
                <ArrowUpRight size={14} style={{ opacity: 0.6 }} />
              </a>
            </div>

            {/* Interactive Architecture Highlight Preview */}
            <div style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-strong)',
              borderRadius: 'var(--radius-sm)',
              padding: '1.25rem 1.5rem',
              textAlign: 'left',
              boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.5)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', gap: '0.35rem' }}>
                  {architectureHighlights.map((arch, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveArchIndex(i)}
                      style={{
                        padding: '0.25rem 0.6rem',
                        fontSize: '0.72rem',
                        borderRadius: 'var(--radius-xs)',
                        border: `1px solid ${activeArchIndex === i ? 'var(--text-primary)' : 'var(--border-subtle)'}`,
                        background: activeArchIndex === i ? 'var(--bg-tertiary)' : 'transparent',
                        color: activeArchIndex === i ? 'var(--text-primary)' : 'var(--text-muted)',
                        fontWeight: activeArchIndex === i ? 700 : 500,
                        cursor: 'pointer'
                      }}
                    >
                      {arch.title}
                    </button>
                  ))}
                </div>
                <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                  Interactive Architecture
                </span>
              </div>
              <div style={{
                background: 'var(--bg-code)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-xs)',
                padding: '0.85rem 1rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.78rem',
                color: 'var(--text-primary)',
                overflowX: 'auto',
                whiteSpace: 'nowrap'
              }}>
                {architectureHighlights[activeArchIndex].flow}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE THREE CORE PILLARS WITH 3D TILT */}
      <section className="section-padding" style={{ borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="badge badge-outline" style={{ marginBottom: '0.5rem' }}>Core Methodology</span>
            <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800 }}>The 3 Pillars of the Transition</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginTop: '0.4rem' }}>
              The practical learning loop: <code>Learn → Watch → Build → GitHub → Move forward</code>
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {/* Pillar 1: Learn */}
            <Tilt3DCard>
              <div className="card" style={{ height: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                  <div style={{
                    width: '2.5rem',
                    height: '2.5rem',
                    borderRadius: 'var(--radius-xs)',
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-default)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-primary)'
                  }}>
                    <BookOpen size={18} />
                  </div>
                  <span className="badge badge-outline">Pillar 01</span>
                </div>
                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                  Learn
                </h3>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                  AI concepts explained from a QE perspective. Break through the math fog to master LLMs, embeddings, RAG, prompt engineering, and Model Context Protocol.
                </p>
                <Link to="/tracks" style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-primary)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                  Explore 10 Learning Tracks <ArrowRight size={12} />
                </Link>
              </div>
            </Tilt3DCard>

            {/* Pillar 2: Build */}
            <Tilt3DCard>
              <div className="card" style={{ height: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                  <div style={{
                    width: '2.5rem',
                    height: '2.5rem',
                    borderRadius: 'var(--radius-xs)',
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-default)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-primary)'
                  }}>
                    <Code2 size={18} />
                  </div>
                  <span className="badge badge-outline">Pillar 02</span>
                </div>
                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                  Build
                </h3>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                  Mini-projects that turn concepts into practical experience. Every major concept has a dedicated, runnable GitHub repository with setup guides and tests.
                </p>
                <Link to="/projects" style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-primary)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                  View 10 Hands-on Projects <ArrowRight size={12} />
                </Link>
              </div>
            </Tilt3DCard>

            {/* Pillar 3: Deploy */}
            <Tilt3DCard>
              <div className="card" style={{ height: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                  <div style={{
                    width: '2.5rem',
                    height: '2.5rem',
                    borderRadius: 'var(--radius-xs)',
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-default)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-primary)'
                  }}>
                    <Cpu size={18} />
                  </div>
                  <span className="badge badge-outline">Pillar 03</span>
                </div>
                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                  Deploy
                </h3>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                  Learn how to take AI projects from localhost to production. Containerize with Docker, orchestrate CI/CD in GitHub Actions, and deploy to serverless Cloud Run.
                </p>
                <Link to="/tracks#09-deployment" style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-primary)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                  Explore Deployment Track <ArrowRight size={12} />
                </Link>
              </div>
            </Tilt3DCard>
          </div>
        </div>
      </section>

      {/* 3D ISOMETRIC TRANSFORMATION GATEWAY */}
      <section className="section-padding" style={{ borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-primary)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <span className="badge badge-outline" style={{ marginBottom: '0.5rem' }}>3D Architecture Pipeline</span>
            <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800 }}>The 3D Engineering Transition Stack</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginTop: '0.35rem' }}>
              How test automation assets evolve into autonomous, evaluated AI production systems.
            </p>
          </div>
          <Isometric3DGateway />
        </div>
      </section>

      {/* 3. VISUAL ROADMAP OVERVIEW */}
      <section className="section-padding" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="badge badge-outline" style={{ marginBottom: '0.5rem' }}>Complete Progression</span>
              <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800 }}>Start Here — The QE → AI Roadmap</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginTop: '0.35rem' }}>
                A QE coming from Selenium, Java, Appium or traditional automation will immediately know where to begin.
              </p>
            </div>
            <Link to="/roadmap" className="btn btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              <span>Interactive Roadmap</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* Linear Flowchart Visual */}
          <div style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-sm)',
            padding: '2rem',
            overflowX: 'auto'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              minWidth: '980px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              color: 'var(--text-primary)'
            }}>
              {[
                { name: "QE Background", type: "start" },
                { name: "Python", type: "step" },
                { name: "AI Fundamentals", type: "step" },
                { name: "LLM Fundamentals", type: "step" },
                { name: "Prompt Eng", type: "step" },
                { name: "LLM APIs", type: "step" },
                { name: "RAG", type: "step" },
                { name: "Agents", type: "step" },
                { name: "LangGraph", type: "step" },
                { name: "MCP", type: "step" },
                { name: "AI + Playwright", type: "step" },
                { name: "AI Evaluation", type: "step" },
                { name: "Deployment", type: "step" },
                { name: "AI Engineer", type: "goal" }
              ].map((node, i, arr) => (
                <React.Fragment key={node.name}>
                  <div style={{
                    padding: '0.5rem 0.85rem',
                    background: node.type === 'goal' ? 'var(--accent-primary)' : node.type === 'start' ? 'var(--bg-tertiary)' : 'var(--bg-primary)',
                    color: node.type === 'goal' ? 'var(--accent-primary-text)' : 'var(--text-primary)',
                    border: `1px solid ${node.type === 'goal' ? 'var(--accent-primary)' : 'var(--border-strong)'}`,
                    borderRadius: 'var(--radius-xs)',
                    fontWeight: 700,
                    whiteSpace: 'nowrap'
                  }}>
                    {node.name}
                  </div>
                  {i < arr.length - 1 && (
                    <span style={{ color: 'var(--text-muted)', fontWeight: 'bold' }}>→</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. 10 LEARNING TRACKS TEASER */}
      <section className="section-padding" style={{ borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="badge badge-outline" style={{ marginBottom: '0.5rem' }}>Curriculum</span>
              <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800 }}>10 Structured Learning Tracks</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginTop: '0.35rem' }}>
                From Python foundations to Production-grade AI Quality Platforms.
              </p>
            </div>
            <Link to="/tracks" className="btn btn-primary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              <span>View All 10 Tracks</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {QE2AI_TRACKS.slice(0, 6).map(track => (
              <div key={track.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Track {track.number}
                  </span>
                  <span className="badge badge-subtle">{track.suggestedProject.difficulty}</span>
                </div>
                <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                  {track.title}
                </h3>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem', flex: 1 }}>
                  {track.tagline}
                </p>
                <div style={{
                  padding: '0.75rem',
                  background: 'var(--bg-tertiary)',
                  borderRadius: 'var(--radius-xs)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: 'var(--text-xs)'
                }}>
                  <div style={{ color: 'var(--text-muted)', marginBottom: '0.2rem', textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: '0.05em' }}>
                    Mini Project
                  </div>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                    {track.suggestedProject.title}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. ABOUT AUTHOR TEASER */}
      <section className="section-padding">
        <div className="container">
          <div style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-sm)',
            padding: '2.5rem',
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '2rem'
          }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <span className="badge badge-inverted">Creator & Architect</span>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>12+ Years Enterprise Experience</span>
              </div>
              <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                {AUTHOR_JOURNEY_STORY.name}
              </h2>
              <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                {AUTHOR_JOURNEY_STORY.title} • {AUTHOR_JOURNEY_STORY.tagline}
              </p>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem', maxWidth: '820px' }}>
                "I started my career in Quality Engineering and automation. Like many QEs, I started exploring AI without knowing where to begin. I created QE2AI to document that journey and bring together the concepts, resources, projects and practical learning paths that can help other Quality Engineers make the same transition."
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link to="/about" className="btn btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span>Read Full Technical Journey</span>
                  <ArrowRight size={14} />
                </Link>
                <a
                  href="https://github.com/poornaai2026/QE2AI"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <GithubIcon size={14} />
                  <span>GitHub Repository</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
