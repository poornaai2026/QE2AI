import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Trophy, Sparkles } from 'lucide-react';
import { roadmapPhases } from '../../content/roadmapData';

export const RoadmapTracker: React.FC = () => {
  const [completedPhases, setCompletedPhases] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('qa2ai-completed-phases');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('qa2ai-completed-phases', JSON.stringify(completedPhases));
  }, [completedPhases]);

  const togglePhase = (id: number) => {
    setCompletedPhases(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const progressPercent = Math.round((completedPhases.length / roadmapPhases.length) * 100);

  return (
    <div className="card" style={{ padding: '1.75rem', marginBottom: '2.5rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-default)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <Trophy size={18} style={{ color: 'var(--accent-amber)' }} />
            <h3 style={{ fontSize: 'var(--text-lg)', color: 'var(--text-primary)' }}>
              Your Roadmap Learning Progress
            </h3>
          </div>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
            Track your progress as you master each phase. Progress is saved automatically in your browser.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.25rem', fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--accent-cyan)' }}>
              {progressPercent}%
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              {completedPhases.length} of {roadmapPhases.length} Completed
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ width: '100%', height: '8px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)', overflow: 'hidden', marginBottom: '1.5rem' }}>
        <div 
          style={{ 
            width: `${progressPercent}%`, 
            height: '100%', 
            background: 'var(--grad-accent)', 
            transition: 'width 0.4s ease-out' 
          }} 
        />
      </div>

      {/* Interactive Checkbox Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.65rem' }}>
        {roadmapPhases.map(phase => {
          const isDone = completedPhases.includes(phase.id);
          return (
            <button
              key={phase.id}
              onClick={() => togglePhase(phase.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.6rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                background: isDone ? 'var(--accent-emerald-subtle)' : 'var(--bg-primary)',
                border: isDone ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border-subtle)',
                color: isDone ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontSize: 'var(--text-xs)',
                fontWeight: isDone ? 600 : 400,
                textAlign: 'left',
                transition: 'all var(--transition-fast)'
              }}
            >
              {isDone ? (
                <CheckCircle2 size={16} style={{ color: 'var(--accent-emerald)', flexShrink: 0 }} />
              ) : (
                <Circle size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
              )}
              <span style={{ textDecoration: isDone ? 'line-through' : 'none', opacity: isDone ? 0.9 : 1 }}>
                Phase {phase.id}: {phase.title.replace(/^\d+\.\s*/, '')}
              </span>
            </button>
          );
        })}
      </div>

      {progressPercent === 100 && (
        <div style={{ marginTop: '1.25rem', padding: '0.85rem', background: 'var(--accent-cyan-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
          <Sparkles size={18} style={{ color: 'var(--accent-cyan)' }} />
          <span><strong>Incredible milestone!</strong> You have completed all 10 phases. You are ready for AI Quality Engineering interviews!</span>
        </div>
      )}
    </div>
  );
};
