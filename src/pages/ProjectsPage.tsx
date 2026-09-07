import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  ExternalLink, 
  Search
} from 'lucide-react';
import { QE2AI_PROJECTS } from '../content/qe2aiBlueprintData';
import { GithubIcon } from '../components/common/Icons';

export const ProjectsPage: React.FC = () => {
  const [filterDifficulty, setFilterDifficulty] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredProjects = QE2AI_PROJECTS.filter(project => {
    const matchesDiff = filterDifficulty === 'All' || project.difficulty === filterDifficulty;
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          project.trackName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          project.coreTech.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesDiff && matchesSearch;
  });

  return (
    <div className="animate-fade-in" style={{ padding: '3.5rem 0 5rem' }}>
      <div className="container">
        {/* Header */}
        <div style={{ maxWidth: '820px', marginBottom: '2.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span className="badge badge-inverted">PRACTICAL BUILDS</span>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>10 Mini Projects</span>
          </div>
          <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, marginBottom: '0.75rem' }}>
            Hands-on AI & QE Projects
          </h1>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            Projects are the primary differentiator of QE2AI. Every important concept has a practical build path rather than just an article. Every project is open source and ready to clone.
          </p>
        </div>

        {/* Filters & Search */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2rem',
          padding: '1rem',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-sm)'
        }}>
          {/* Difficulty Tabs */}
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            {['All', 'Beginner', 'Intermediate', 'Advanced'].map(diff => (
              <button
                key={diff}
                onClick={() => setFilterDifficulty(diff)}
                className={`btn btn-sm ${filterDifficulty === diff ? 'btn-primary' : 'btn-ghost'}`}
              >
                {diff}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div style={{ position: 'relative', minWidth: '240px' }}>
            <Search size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search projects or tech..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.4rem 0.75rem 0.4rem 2.25rem',
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-xs)',
                color: 'var(--text-primary)',
                fontSize: 'var(--text-xs)',
                outline: 'none'
              }}
            />
          </div>
        </div>

        {/* Projects Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.75rem' }}>
          {filteredProjects.map(project => (
            <div
              key={project.slug}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-default)'
              }}
            >
              <div>
                {/* Card Top */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    color: 'var(--text-muted)'
                  }}>
                    PROJECT {project.number}
                  </span>
                  <span className="badge badge-outline">{project.difficulty}</span>
                </div>

                <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 800, marginBottom: '0.35rem', color: 'var(--text-primary)' }}>
                  {project.title}
                </h2>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                  {project.trackName}
                </div>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                  {project.tagline}
                </p>

                {/* Tech Stack Pills */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1.25rem' }}>
                  {project.coreTech.map(t => (
                    <span key={t} style={{
                      fontSize: '0.65rem',
                      fontFamily: 'var(--font-mono)',
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-subtle)',
                      padding: '0.15rem 0.4rem',
                      borderRadius: 'var(--radius-xs)',
                      color: 'var(--text-secondary)'
                    }}>
                      {t}
                    </span>
                  ))}
                </div>

                {/* Architecture Snippet */}
                <div style={{
                  padding: '0.75rem',
                  background: 'var(--bg-tertiary)',
                  borderRadius: 'var(--radius-xs)',
                  border: '1px solid var(--border-subtle)',
                  marginBottom: '1.25rem'
                }}>
                  <div style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.25rem', letterSpacing: '0.05em' }}>
                    Architecture Flow
                  </div>
                  <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', lineHeight: 1.4 }}>
                    {project.architectureFlow}
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div style={{
                paddingTop: '1rem',
                borderTop: '1px solid var(--border-subtle)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <Link
                  to={`/projects/${project.slug}`}
                  className="btn btn-secondary btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <span>Detailed Specs</span>
                  <ArrowRight size={12} />
                </Link>

                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <GithubIcon size={13} />
                  <span>GitHub</span>
                  <ExternalLink size={11} style={{ opacity: 0.6 }} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
