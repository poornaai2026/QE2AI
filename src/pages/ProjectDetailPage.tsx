import React, { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ExternalLink, 
  CheckCircle2, 
  ArrowRight,
  Copy,
  Check
} from 'lucide-react';
import { QE2AI_PROJECTS } from '../content/qe2aiBlueprintData';
import { GithubIcon } from '../components/common/Icons';

export const ProjectDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const project = QE2AI_PROJECTS.find(p => p.slug === slug);

  if (!project) {
    return <Navigate to="/projects" replace />;
  }

  const handleCopyCommand = (command: string, idx: number) => {
    navigator.clipboard.writeText(command);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="animate-fade-in" style={{ padding: '3.5rem 0 5rem' }}>
      <div className="container doc-container">
        {/* Back Link */}
        <Link to="/projects" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontSize: 'var(--text-xs)',
          color: 'var(--text-muted)',
          marginBottom: '1.5rem'
        }}>
          <ArrowLeft size={14} />
          <span>Back to All Projects</span>
        </Link>

        {/* Project Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              fontWeight: 800,
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-strong)',
              padding: '0.2rem 0.5rem',
              borderRadius: 'var(--radius-xs)'
            }}>
              PROJECT {project.number}
            </span>
            <span className="badge badge-inverted">{project.difficulty}</span>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{project.trackName}</span>
          </div>

          <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
            {project.title}
          </h1>
          <p style={{ fontSize: 'var(--text-lg)', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
            {project.tagline}
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-md"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <GithubIcon size={16} />
              <span>Clone from GitHub</span>
              <ExternalLink size={14} style={{ opacity: 0.6 }} />
            </a>
            <Link
              to="/tracker"
              className="btn btn-secondary btn-md"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <span>Track in Progress</span>
            </Link>
          </div>
        </div>

        {/* 1. Prerequisites & What You Learn */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>
              Prerequisites
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {project.prerequisites.map((req, i) => (
                <li key={i} style={{ fontSize: 'var(--text-xs)', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>•</span>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>
              What You'll Learn
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {project.whatYouLearn.map((skill, i) => (
                <li key={i} style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                  <CheckCircle2 size={14} style={{ color: 'var(--text-primary)', flexShrink: 0, marginTop: '2px' }} />
                  <span>{skill}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 2. Architecture Diagram & Flow */}
        <div className="card" style={{ padding: '1.75rem', marginBottom: '2.5rem' }}>
          <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
            Architecture Flow
          </h3>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Data and execution sequence from input request to output artifact:
          </p>
          <div style={{
            padding: '1.25rem',
            background: 'var(--bg-code)',
            border: '1px solid var(--border-strong)',
            borderRadius: 'var(--radius-xs)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8rem',
            color: 'var(--text-primary)',
            lineHeight: 1.6,
            overflowX: 'auto'
          }}>
            {project.architectureFlow}
          </div>
        </div>

        {/* 3. Setup Guide */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, marginBottom: '1.25rem', color: 'var(--text-primary)' }}>
            Setup & Execution Steps
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {project.setupSteps.map((step, idx) => (
              <div
                key={idx}
                className="card"
                style={{
                  padding: '1.25rem',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <span style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                    {step.step}
                  </span>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Step {idx + 1}</span>
                </div>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: step.command ? '0.75rem' : '0' }}>
                  {step.description}
                </p>
                {step.command && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'var(--bg-code)',
                    border: '1px solid var(--border-strong)',
                    padding: '0.5rem 0.75rem',
                    borderRadius: 'var(--radius-xs)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.78rem',
                    color: 'var(--text-primary)'
                  }}>
                    <code>{step.command}</code>
                    <button
                      onClick={() => handleCopyCommand(step.command!, idx)}
                      className="copy-btn"
                      aria-label="Copy Command"
                    >
                      {copiedIndex === idx ? <Check size={12} /> : <Copy size={12} />}
                      <span>{copiedIndex === idx ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 4. Next Step Box */}
        <div style={{
          padding: '1.5rem',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-strong)',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
              Next Step in Learning Path
            </div>
            <div style={{ fontWeight: 800, fontSize: 'var(--text-base)', color: 'var(--text-primary)', marginTop: '0.15rem' }}>
              {project.nextStep.title}
            </div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              {project.nextStep.description}
            </div>
          </div>
          <Link
            to={project.nextStep.link}
            className="btn btn-primary btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <span>Proceed</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};
