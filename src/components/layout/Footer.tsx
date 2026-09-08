import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { GithubIcon } from '../common/Icons';

export const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Col 1: Brand & Tagline */}
          <div>
            <Link to="/" className="footer-brand" style={{ textDecoration: 'none' }}>
              <div style={{
                width: '1.6rem',
                height: '1.6rem',
                borderRadius: 'var(--radius-xs)',
                background: 'var(--accent-primary)',
                color: 'var(--accent-primary-text)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: '0.75rem',
                transition: 'transform var(--transition-bounce)'
              }}>
                QE
              </div>
              <span style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                QE2AI
              </span>
            </Link>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', maxWidth: '380px', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              From Quality Engineering to AI Engineering. A practical, build-first learning platform for test engineers transitioning into AI systems and evaluation.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <a
                href="https://github.com/poornaai2026/QE2AI"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <GithubIcon size={14} />
                <span>GitHub Repository</span>
                <ArrowUpRight size={12} style={{ opacity: 0.6 }} />
              </a>
            </div>
          </div>

          {/* Col 2: Learning */}
          <div>
            <h4 className="footer-col-title">Learning</h4>
            <ul className="footer-links">
              <li><Link to="/roadmap">QE → AI Roadmap</Link></li>
              <li><Link to="/tracks">10 Learning Tracks</Link></li>
              <li><Link to="/ai-qe">AI Quality Engineering</Link></li>
              <li><Link to="/interview-prep">Interview Prep Q&A</Link></li>
              <li><Link to="/tracker">Progress Tracker</Link></li>
            </ul>
          </div>

          {/* Col 3: Practical Builds */}
          <div>
            <h4 className="footer-col-title">Projects</h4>
            <ul className="footer-links">
              <li><Link to="/projects">10 Hands-on Projects</Link></li>
              <li><a href="https://github.com/poornaai2026/QE2AI/tree/main/projects/01-fastapi-test-management" target="_blank" rel="noopener noreferrer">FastAPI Test API</a></li>
              <li><a href="https://github.com/poornaai2026/QE2AI/tree/main/projects/04-pdf-rag-knowledge-assistant" target="_blank" rel="noopener noreferrer">PDF RAG Assistant</a></li>
              <li><a href="https://github.com/poornaai2026/QE2AI/tree/main/projects/06-qe-mcp-server" target="_blank" rel="noopener noreferrer">QE MCP Server</a></li>
              <li><a href="https://github.com/poornaai2026/QE2AI/tree/main/projects/07-ai-powered-qe-eval-agent" target="_blank" rel="noopener noreferrer">AI Evaluation Agent</a></li>
            </ul>
          </div>

          {/* Col 4: Platform & Author */}
          <div>
            <h4 className="footer-col-title">Resources & Info</h4>
            <ul className="footer-links">
              <li><Link to="/resources">Free LLM Providers</Link></li>
              <li><Link to="/resources">Curated YouTube Hub</Link></li>
              <li><Link to="/about">About Author</Link></li>
              <li><a href="https://github.com/poornaai2026/QE2AI/blob/main/README.md" target="_blank" rel="noopener noreferrer">Monorepo Guide</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            <span>© {new Date().getFullYear()} QE2AI • Poorna Chandra Rao J. All rights reserved.</span>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.72rem',
              fontWeight: 600,
              padding: '0.15rem 0.5rem',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '9999px',
              color: 'var(--text-secondary)'
            }}>
              <span style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#10b981',
                boxShadow: '0 0 8px #10b981',
                display: 'inline-block'
              }} />
              Live Vercel Analytics Active
            </span>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <span>Clean Monochrome Studio</span>
            <a 
              href="https://github.com/poornaai2026/QE2AI" 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}
            >
              Open Source on GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
