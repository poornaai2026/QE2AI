import React from 'react';
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

export const HomePage: React.FC = () => {
  return (
    <div className="animate-fade-in">
      {/* 1. HERO SECTION */}
      <section style={{
        padding: '5rem 0 4rem',
        borderBottom: '1px solid var(--border-subtle)',
        background: 'var(--bg-primary)',
        position: 'relative'
      }}>
        <div className="container">
          <div style={{ maxWidth: '820px', margin: '0 auto', textAlign: 'center' }}>
            {/* Top Pill */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <span className="badge badge-inverted" style={{ fontSize: '0.72rem', letterSpacing: '0.06em' }}>
                QE2AI BLUEPRINT
              </span>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                From Quality Engineering to AI Engineering
              </span>
            </div>

            {/* Headline */}
            <h1 style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-0.04em',
              marginBottom: '1.25rem',
              color: 'var(--text-primary)'
            }}>
              From QE to AI Engineer.
            </h1>

            {/* Supporting Line */}
            <p style={{
              fontSize: 'clamp(1.1rem, 2vw, 1.35rem)',
              color: 'var(--text-primary)',
              fontWeight: 500,
              marginBottom: '1.25rem',
              lineHeight: 1.4
            }}>
              A practical roadmap to learn, build and deploy AI — designed specifically for Quality Engineers.
            </p>

            {/* Message Box */}
            <p style={{
              fontSize: 'var(--text-base)',
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
              marginBottom: '2.25rem',
              maxWidth: '720px',
              marginLeft: 'auto',
              marginRight: 'auto'
            }}>
              You're already an engineer. You already understand automation, APIs, debugging, CI/CD and software quality. You don't need to start your engineering journey from scratch to learn AI. <strong>QE2AI</strong> helps you build on your existing QE skills and transition into AI engineering step by step.
            </p>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
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
          </div>
        </div>
      </section>

      {/* 2. THE THREE CORE PILLARS */}
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
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <div style={{
                  width: '2.5rem',
                  height: '2.5rem',
                  borderRadius: 'var(--radius-sm)',
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
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                Learn
              </h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                AI concepts explained from a QE perspective. Break through the math fog to master LLMs, embeddings, RAG, prompt engineering, and Model Context Protocol.
              </p>
              <Link to="/tracks" style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-primary)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                Explore 10 Learning Tracks <ArrowRight size={12} />
              </Link>
            </div>

            {/* Pillar 2: Build */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <div style={{
                  width: '2.5rem',
                  height: '2.5rem',
                  borderRadius: 'var(--radius-sm)',
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
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                Build
              </h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                Mini-projects that turn concepts into practical experience. Every major concept has a dedicated, runnable GitHub repository with setup guides and tests.
              </p>
              <Link to="/projects" style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-primary)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                View 10 Hands-on Projects <ArrowRight size={12} />
              </Link>
            </div>

            {/* Pillar 3: Deploy */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <div style={{
                  width: '2.5rem',
                  height: '2.5rem',
                  borderRadius: 'var(--radius-sm)',
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
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                Deploy
              </h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                Learn how to take AI projects from localhost to production. Containerize with Docker, orchestrate CI/CD in GitHub Actions, and deploy to serverless Cloud Run.
              </p>
              <Link to="/tracks#09-deployment" style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-primary)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                Explore Deployment Track <ArrowRight size={12} />
              </Link>
            </div>
          </div>
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
            borderRadius: 'var(--radius-md)',
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
            borderRadius: 'var(--radius-md)',
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
