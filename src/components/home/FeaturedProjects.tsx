import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FolderGit2, ExternalLink } from 'lucide-react';
import { flagshipProjects } from '../../content/projectsData';
import type { FlagshipProject } from '../../content/types';
import { Badge } from '../common/Badge';

export const FeaturedProjects: React.FC = () => {
  return (
    <section className="section-padding">
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '3rem', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.25rem 0.75rem', background: 'var(--accent-purple-subtle)', borderRadius: 'var(--radius-full)', border: '1px solid rgba(139, 92, 246, 0.3)', marginBottom: '0.75rem', fontSize: '0.75rem', color: 'var(--accent-purple)', fontWeight: 600 }}>
              <FolderGit2 size={13} />
              <span>PRODUCTION BLUEPRINTS</span>
            </div>
            <h2>Flagship Engineering Projects</h2>
            <p style={{ maxWidth: '600px', fontSize: 'var(--text-base)', marginTop: '0.5rem' }}>
              Full-scale architectural implementations proving end-to-end AI engineering and automated quality verification.
            </p>
          </div>

          <Link to="/projects" className="btn btn-secondary">
            <span>Explore All Architectures</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '1.75rem'
        }}>
          {flagshipProjects.map((proj: FlagshipProject) => (
            <div
              key={proj.slug}
              className="card"
              style={{ display: 'flex', flexDirection: 'column' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <Badge variant={proj.slug.includes('generator') ? 'cyan' : proj.slug.includes('agent') ? 'purple' : 'emerald'}>
                  {proj.badge}
                </Badge>
                <a
                  href={proj.repositoryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="icon-btn"
                  style={{ width: '1.8rem', height: '1.8rem' }}
                  aria-label="GitHub Repository"
                >
                  <ExternalLink size={13} />
                </a>
              </div>

              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                {proj.title}
              </h3>

              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: '1.25rem', flex: 1 }}>
                {proj.tagline}
              </p>

              {/* Tech Stack Pills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.5rem' }}>
                {proj.techStack.slice(0, 5).map((tech: string) => (
                  <span
                    key={tech}
                    style={{
                      fontSize: '0.7rem',
                      fontFamily: 'var(--font-mono)',
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-subtle)',
                      padding: '0.2rem 0.5rem',
                      borderRadius: 'var(--radius-xs)',
                      color: 'var(--text-secondary)'
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Evaluation Highlights */}
              <div style={{ background: 'var(--bg-secondary)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: '1.25rem', fontSize: 'var(--text-xs)' }}>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                  Quality Gate Metrics:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', color: 'var(--text-secondary)' }}>
                  {proj.evaluationMetrics.slice(0, 2).map((m) => (
                    <div key={m.name} style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>{m.name}:</span>
                      <strong style={{ color: 'var(--accent-cyan)' }}>{m.threshold}</strong>
                    </div>
                  ))}
                </div>
              </div>

              <Link to={`/projects/${proj.slug}`} className="btn btn-primary" style={{ width: '100%' }}>
                <span>View Full System Architecture</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
