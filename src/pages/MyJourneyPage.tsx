import React from 'react';
import { Link } from 'react-router-dom';
import { Milestone, ArrowRight } from 'lucide-react';
import { journeyMilestones } from '../content/journeyData';
import type { JourneyMilestone } from '../content/types';
import { Badge } from '../components/common/Badge';

export const MyJourneyPage: React.FC = () => {
  return (
    <div className="animate-fade-in section-padding" style={{ paddingTop: '2.5rem' }}>
      <div className="container" style={{ maxWidth: '860px' }}>
        {/* Header */}
        <div style={{ marginBottom: '3.5rem', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.25rem 0.75rem', background: 'var(--accent-cyan-subtle)', borderRadius: 'var(--radius-full)', border: '1px solid rgba(6, 182, 212, 0.3)', marginBottom: '1rem', fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>
            <Milestone size={14} />
            <span>PERSONAL ENGINEERING JOURNEY</span>
          </div>
          <h1 style={{ marginBottom: '1rem' }}>
            From QA Lead to <span className="gradient-text">AI Platform Engineer</span>
          </h1>
          <p style={{ fontSize: 'var(--text-lg)', color: 'var(--text-secondary)' }}>
            The honest, unvarnished story of transitioning from test automation suites to building, evaluating, and deploying autonomous AI systems.
          </p>
        </div>

        {/* Narrative Intro */}
        <div className="card" style={{ padding: '2rem', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: 'var(--text-xl)', marginBottom: '1rem', color: 'var(--text-primary)' }}>
            Why I Built QA2AI
          </h2>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1.25rem' }}>
            When Generative AI exploded, I found myself in a strange position. Every tutorial on the internet was either:
          </p>
          <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem', color: 'var(--text-secondary)' }}>
            <li>A simplistic marketing blog showing naive chat prompts like <em>"Ask ChatGPT to write a poem"</em>, or</li>
            <li>A dense academic paper loaded with differential calculus that skipped production engineering realities entirely.</li>
          </ul>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
            Neither of those helped me build software. What I needed was an engineering blueprint: <strong>How do I handle non-determinism? How do I stop JSON parsing crashes? How do I build automated evaluation in CI/CD?</strong> 
            This website is the complete documentation of that journey.
          </p>
        </div>

        {/* Timeline Stages */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', position: 'relative' }}>
          {journeyMilestones.map((milestone: JourneyMilestone, idx: number) => (
            <div key={idx} className="card" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <Badge variant={idx === 0 ? 'cyan' : idx === 1 ? 'rose' : idx === 2 ? 'purple' : 'emerald'}>
                  {milestone.year} • {milestone.role}
                </Badge>
              </div>

              <h3 style={{ fontSize: 'var(--text-xl)', marginBottom: '1rem', color: 'var(--text-primary)' }}>
                {milestone.title}
              </h3>

              <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
                {milestone.description}
              </p>

              <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: '1rem' }}>
                <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--accent-cyan)', marginBottom: '0.25rem' }}>
                  The Critical Shift:
                </div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                  {milestone.keyShift}
                </div>
              </div>

              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                Takeaway: "{milestone.takeaway}"
              </div>
            </div>
          ))}
        </div>

        {/* Next Steps CTA */}
        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
          <h3 style={{ fontSize: 'var(--text-xl)', marginBottom: '1rem' }}>
            Ready to Begin Your Own Transformation?
          </h3>
          <Link to="/roadmap" className="btn btn-primary btn-lg">
            <span>Start Phase 1 of the Roadmap</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
};
