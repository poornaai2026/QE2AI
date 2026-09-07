import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass, CheckCircle2 } from 'lucide-react';
import { roadmapPhases } from '../../content/roadmapData';
import { Badge } from '../common/Badge';

export const RoadmapPreview: React.FC = () => {
  return (
    <section className="section-padding" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '3rem', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.25rem 0.75rem', background: 'var(--accent-cyan-subtle)', borderRadius: 'var(--radius-full)', border: '1px solid rgba(6, 182, 212, 0.3)', marginBottom: '0.75rem', fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>
              <Compass size={13} />
              <span>STRUCTURED CURRICULUM</span>
            </div>
            <h2>The 10-Phase Learning Roadmap</h2>
            <p style={{ maxWidth: '600px', fontSize: 'var(--text-base)', marginTop: '0.5rem' }}>
              Step-by-step progression from Python async fundamentals to Agentic state machines and AI Quality Engineering.
            </p>
          </div>

          <Link to="/roadmap" className="btn btn-primary">
            <span>View Complete Roadmap</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* 10 Phases Grid / Timeline */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.25rem'
        }}>
          {roadmapPhases.map((phase) => (
            <Link
              key={phase.id}
              to={`/roadmap#phase-${phase.id}`}
              className="card card-interactive"
              style={{ display: 'flex', flexDirection: 'column', padding: '1.5rem' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                  PHASE {phase.id < 10 ? `0${phase.id}` : phase.id}
                </span>
                <Badge variant={phase.id <= 3 ? 'cyan' : phase.id <= 7 ? 'purple' : 'emerald'}>
                  {phase.duration}
                </Badge>
              </div>

              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
                {phase.title.replace(/^\d+\.\s*/, '')}
              </h3>

              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: '1rem', flex: 1 }}>
                {phase.tagline}
              </p>

              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <CheckCircle2 size={13} style={{ color: 'var(--accent-cyan)' }} />
                  {phase.keyConcepts.length} Key Concepts
                </span>
                <span style={{ color: 'var(--accent-cyan)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                  Explore <ArrowRight size={12} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
