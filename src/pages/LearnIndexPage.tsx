import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  ExternalLink, 
  CheckCircle2,
  Copy,
  Check
} from 'lucide-react';
import { QE2AI_TRACKS } from '../content/qe2aiBlueprintData';
import { GithubIcon } from '../components/common/Icons';

export const LearnIndexPage: React.FC = () => {
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  const handleCopy = (code: string, slug: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  return (
    <div className="animate-fade-in" style={{ padding: '3.5rem 0 5rem' }}>
      <div className="container">
        {/* Header */}
        <div style={{ maxWidth: '820px', marginBottom: '3rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span className="badge badge-inverted">CURRICULUM</span>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>10 Practical Tracks</span>
          </div>
          <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, marginBottom: '0.75rem' }}>
            Learning — 10 Suggested Tracks
          </h1>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            A structured, concept-by-concept learning curriculum translating complex AI engineering and evaluation into a language and progression that experienced Quality Engineers can understand and immediately build upon.
          </p>
        </div>

        {/* Tracks List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {QE2AI_TRACKS.map(track => (
            <div
              key={track.id}
              id={track.id}
              className="card"
              style={{
                padding: '2.25rem',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-default)'
              }}
            >
              {/* Track Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-strong)',
                      padding: '0.2rem 0.6rem',
                      borderRadius: 'var(--radius-xs)',
                      color: 'var(--text-primary)'
                    }}>
                      TRACK {track.number}
                    </span>
                    <span className="badge badge-outline">{track.suggestedProject.difficulty}</span>
                  </div>
                  <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {track.number} — {track.title}
                  </h2>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                    {track.tagline}
                  </p>
                </div>

                {/* GitHub Permalink Button */}
                <a
                  href={track.suggestedProject.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <GithubIcon size={14} />
                  <span>View Code on GitHub</span>
                  <ExternalLink size={12} style={{ opacity: 0.6 }} />
                </a>
              </div>

              {/* Grid: Topics & Key Takeaways */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                {/* Topics Covered */}
                <div style={{
                  background: 'var(--bg-tertiary)',
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)'
                }}>
                  <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>
                    Core Topics Covered
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {track.topics.map((t, idx) => (
                      <li key={idx} style={{ fontSize: 'var(--text-xs)', color: 'var(--text-primary)', display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>•</span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Key Takeaways */}
                <div style={{
                  background: 'var(--bg-tertiary)',
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)'
                }}>
                  <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>
                    QE Takeaways
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {track.keyTakeaways.map((takeaway, idx) => (
                      <li key={idx} style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                        <CheckCircle2 size={14} style={{ color: 'var(--text-primary)', flexShrink: 0, marginTop: '2px' }} />
                        <span>{takeaway}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Sample Code Snippet if present */}
              {track.sampleCodeSnippet && (
                <div className="code-block-wrapper" style={{ marginTop: '1rem', marginBottom: '1.25rem' }}>
                  <div className="code-header">
                    <span className="code-lang-tag">{track.sampleCodeSnippet.filename}</span>
                    <button
                      onClick={() => handleCopy(track.sampleCodeSnippet!.code, track.id)}
                      className="copy-btn"
                    >
                      {copiedSlug === track.id ? <Check size={12} /> : <Copy size={12} />}
                      <span>{copiedSlug === track.id ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre className="code-content">
                    <code>{track.sampleCodeSnippet.code}</code>
                  </pre>
                </div>
              )}

              {/* Mini Project Callout */}
              <div style={{
                padding: '1rem 1.25rem',
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-strong)',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem'
              }}>
                <div>
                  <div style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
                    Suggested Mini Project
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--text-primary)', marginTop: '0.1rem' }}>
                    {track.suggestedProject.title}
                  </div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                    {track.suggestedProject.description}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Link
                    to={`/projects/${track.suggestedProject.slug}`}
                    className="btn btn-primary btn-sm"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    <span>View Project Specs</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
