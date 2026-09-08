import React, { useState, useEffect, useRef } from 'react';
import { Search, X, BookOpen, Layers, ShieldCheck, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { technicalArticles } from '../../content/articlesData';
import { roadmapPhases } from '../../content/roadmapData';
import { flagshipProjects } from '../../content/projectsData';
import { INTERVIEW_QUESTIONS } from '../../content/interviewData';
import { HelpCircle } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        isOpen ? onClose() : undefined;
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const normalizedQuery = query.toLowerCase().trim();

  const filteredArticles = technicalArticles.filter(
    art =>
      art.title.toLowerCase().includes(normalizedQuery) ||
      art.summary.toLowerCase().includes(normalizedQuery) ||
      art.tags.some(t => t.toLowerCase().includes(normalizedQuery)) ||
      art.category.toLowerCase().includes(normalizedQuery)
  );

  const filteredPhases = roadmapPhases.filter(
    phase =>
      phase.title.toLowerCase().includes(normalizedQuery) ||
      phase.description.toLowerCase().includes(normalizedQuery) ||
      phase.keyConcepts.some(c => c.toLowerCase().includes(normalizedQuery))
  );

  const filteredProjects = flagshipProjects.filter(
    proj =>
      proj.title.toLowerCase().includes(normalizedQuery) ||
      proj.problemStatement.toLowerCase().includes(normalizedQuery) ||
      proj.techStack.some(t => t.toLowerCase().includes(normalizedQuery))
  );

  const filteredInterview = INTERVIEW_QUESTIONS.filter(
    q =>
      q.question.toLowerCase().includes(normalizedQuery) ||
      q.shortAnswer.toLowerCase().includes(normalizedQuery) ||
      q.keyTerms.some(t => t.toLowerCase().includes(normalizedQuery)) ||
      q.category.toLowerCase().includes(normalizedQuery)
  );

  const handleSelect = (url: string) => {
    navigate(url);
    onClose();
  };

  const totalResults = filteredArticles.length + filteredPhases.length + filteredProjects.length + filteredInterview.length;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="search-modal" onClick={e => e.stopPropagation()}>
        <div className="search-modal-header">
          <Search size={18} style={{ color: 'var(--text-muted)' }} />
          <input
            ref={inputRef}
            type="text"
            className="search-input"
            placeholder="Search concepts, articles, roadmap, failure modes..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <button onClick={onClose} className="icon-btn" style={{ width: '1.8rem', height: '1.8rem' }}>
            <X size={15} />
          </button>
        </div>

        <div className="search-results-list">
          {query.trim() === '' ? (
            <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
              Type a keyword like <strong style={{ color: 'var(--accent-cyan)' }}>RAG</strong>, <strong style={{ color: 'var(--accent-purple)' }}>LangGraph</strong>, <strong style={{ color: 'var(--accent-emerald)' }}>DeepEval</strong>, or <strong style={{ color: 'var(--accent-amber)' }}>Pydantic</strong>...
            </div>
          ) : totalResults === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
              No matching resources found for "{query}".
            </div>
          ) : (
            <>
              {filteredArticles.length > 0 && (
                <div style={{ marginBottom: '0.75rem' }}>
                  <div style={{ padding: '0.35rem 0.75rem', fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent-cyan)', textTransform: 'uppercase' }}>
                    Articles & Deep Dives ({filteredArticles.length})
                  </div>
                  {filteredArticles.map(art => (
                    <li
                      key={art.slug}
                      className="search-result-item"
                      onClick={() => handleSelect(`/learn/${art.slug}`)}
                    >
                      <div className="search-result-title">
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <BookOpen size={14} style={{ color: 'var(--accent-cyan)' }} />
                          {art.title}
                        </span>
                        <ArrowRight size={13} style={{ color: 'var(--text-muted)' }} />
                      </div>
                      <div className="search-result-desc">{art.summary}</div>
                    </li>
                  ))}
                </div>
              )}

              {filteredPhases.length > 0 && (
                <div style={{ marginBottom: '0.75rem' }}>
                  <div style={{ padding: '0.35rem 0.75rem', fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent-purple)', textTransform: 'uppercase' }}>
                    Roadmap Phases ({filteredPhases.length})
                  </div>
                  {filteredPhases.map(phase => (
                    <li
                      key={phase.id}
                      className="search-result-item"
                      onClick={() => handleSelect(`/roadmap#phase-${phase.id}`)}
                    >
                      <div className="search-result-title">
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Layers size={14} style={{ color: 'var(--accent-purple)' }} />
                          {phase.title}
                        </span>
                        <ArrowRight size={13} style={{ color: 'var(--text-muted)' }} />
                      </div>
                      <div className="search-result-desc">{phase.description}</div>
                    </li>
                  ))}
                </div>
              )}

              {filteredProjects.length > 0 && (
                <div>
                  <div style={{ padding: '0.35rem 0.75rem', fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent-emerald)', textTransform: 'uppercase' }}>
                    Flagship Projects ({filteredProjects.length})
                  </div>
                  {filteredProjects.map(proj => (
                    <li
                      key={proj.slug}
                      className="search-result-item"
                      onClick={() => handleSelect(`/projects/${proj.slug}`)}
                    >
                      <div className="search-result-title">
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <ShieldCheck size={14} style={{ color: 'var(--accent-emerald)' }} />
                          {proj.title}
                        </span>
                        <ArrowRight size={13} style={{ color: 'var(--text-muted)' }} />
                      </div>
                      <div className="search-result-desc">{proj.tagline}</div>
                    </li>
                  ))}
                </div>
              )}

              {filteredInterview.length > 0 && (
                <div style={{ marginTop: '0.75rem' }}>
                  <div style={{ padding: '0.35rem 0.75rem', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase' }}>
                    Interview Prep Q&A ({filteredInterview.length})
                  </div>
                  {filteredInterview.map(q => (
                    <li
                      key={q.id}
                      className="search-result-item"
                      onClick={() => handleSelect(`/interview-prep`)}
                    >
                      <div className="search-result-title">
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <HelpCircle size={14} style={{ color: 'var(--text-primary)' }} />
                          {q.question}
                        </span>
                        <ArrowRight size={13} style={{ color: 'var(--text-muted)' }} />
                      </div>
                      <div className="search-result-desc">{q.shortAnswer}</div>
                    </li>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
