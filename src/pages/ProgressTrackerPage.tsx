import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckSquare, 
  Square, 
  RotateCcw, 
  ArrowRight
} from 'lucide-react';
import { QE2AI_TRACKS, QE2AI_PROJECTS } from '../content/qe2aiBlueprintData';

export const ProgressTrackerPage: React.FC = () => {
  const [completedTracks, setCompletedTracks] = useState<string[]>(() => {
    const saved = localStorage.getItem('qe2ai_completed_tracks');
    return saved ? JSON.parse(saved) : [];
  });

  const [completedProjects, setCompletedProjects] = useState<string[]>(() => {
    const saved = localStorage.getItem('qe2ai_completed_projects');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('qe2ai_completed_tracks', JSON.stringify(completedTracks));
  }, [completedTracks]);

  useEffect(() => {
    localStorage.setItem('qe2ai_completed_projects', JSON.stringify(completedProjects));
  }, [completedProjects]);

  const toggleTrack = (id: string) => {
    if (completedTracks.includes(id)) {
      setCompletedTracks(completedTracks.filter(t => t !== id));
    } else {
      setCompletedTracks([...completedTracks, id]);
    }
  };

  const toggleProject = (slug: string) => {
    if (completedProjects.includes(slug)) {
      setCompletedProjects(completedProjects.filter(p => p !== slug));
    } else {
      setCompletedProjects([...completedProjects, slug]);
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset all your local progress?')) {
      setCompletedTracks([]);
      setCompletedProjects([]);
    }
  };

  const totalItems = QE2AI_TRACKS.length + QE2AI_PROJECTS.length;
  const totalCompleted = completedTracks.length + completedProjects.length;
  const progressPercent = Math.round((totalCompleted / totalItems) * 100);

  return (
    <div className="animate-fade-in" style={{ padding: '3.5rem 0 5rem' }}>
      <div className="container doc-container">
        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span className="badge badge-inverted">LOCAL PROGRESS</span>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Saved in Browser (localStorage)</span>
          </div>
          <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, marginBottom: '0.75rem' }}>
            QE → AI Progress Tracker
          </h1>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            Track your personal progression across the 10 learning tracks and 10 mini projects. All progress is stored locally on your device with zero registration or database requirements.
          </p>
        </div>

        {/* Progress Bar Banner */}
        <div className="card" style={{
          padding: '1.75rem',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-default)',
          marginBottom: '2.5rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
                Overall Completion
              </div>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 900, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                {progressPercent}% Complete
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                {totalCompleted} of {totalItems} completed
              </span>
              <button
                onClick={handleReset}
                className="btn btn-ghost btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)' }}
              >
                <RotateCcw size={13} />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Bar */}
          <div style={{
            width: '100%',
            height: '8px',
            background: 'var(--bg-tertiary)',
            borderRadius: 'var(--radius-full)',
            overflow: 'hidden',
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{
              width: `${progressPercent}%`,
              height: '100%',
              background: 'var(--accent-primary)',
              transition: 'width 300ms ease'
            }} />
          </div>
        </div>

        {/* Section 1: 10 Learning Tracks Checklist */}
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, color: 'var(--text-primary)' }}>
              10 Learning Tracks Checklist
            </h2>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
              {completedTracks.length} / {QE2AI_TRACKS.length} Done
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {QE2AI_TRACKS.map(track => {
              const isChecked = completedTracks.includes(track.id);
              return (
                <div
                  key={track.id}
                  onClick={() => toggleTrack(track.id)}
                  className="card card-interactive"
                  style={{
                    padding: '0.85rem 1.25rem',
                    background: isChecked ? 'var(--bg-tertiary)' : 'var(--bg-secondary)',
                    border: `1px solid ${isChecked ? 'var(--text-primary)' : 'var(--border-subtle)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {isChecked ? (
                      <CheckSquare size={18} style={{ color: 'var(--text-primary)' }} />
                    ) : (
                      <Square size={18} style={{ color: 'var(--text-muted)' }} />
                    )}
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--text-primary)', textDecoration: isChecked ? 'line-through' : 'none' }}>
                        Track {track.number}: {track.title}
                      </div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                        {track.tagline}
                      </div>
                    </div>
                  </div>

                  <Link
                    to={`/tracks#${track.id}`}
                    onClick={(e) => e.stopPropagation()}
                    style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
                  >
                    <span>View Track</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 2: 10 Mini Projects Checklist */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, color: 'var(--text-primary)' }}>
              10 Hands-on Projects Checklist
            </h2>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
              {completedProjects.length} / {QE2AI_PROJECTS.length} Built
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {QE2AI_PROJECTS.map(project => {
              const isChecked = completedProjects.includes(project.slug);
              return (
                <div
                  key={project.slug}
                  onClick={() => toggleProject(project.slug)}
                  className="card card-interactive"
                  style={{
                    padding: '0.85rem 1.25rem',
                    background: isChecked ? 'var(--bg-tertiary)' : 'var(--bg-secondary)',
                    border: `1px solid ${isChecked ? 'var(--text-primary)' : 'var(--border-subtle)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {isChecked ? (
                      <CheckSquare size={18} style={{ color: 'var(--text-primary)' }} />
                    ) : (
                      <Square size={18} style={{ color: 'var(--text-muted)' }} />
                    )}
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--text-primary)', textDecoration: isChecked ? 'line-through' : 'none' }}>
                        Project {project.number}: {project.title}
                      </div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                        {project.trackName} • {project.difficulty}
                      </div>
                    </div>
                  </div>

                  <Link
                    to={`/projects/${project.slug}`}
                    onClick={(e) => e.stopPropagation()}
                    style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
                  >
                    <span>View Project</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
