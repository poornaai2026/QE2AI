import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Search, 
  X, 
  BookOpen, 
  Layers, 
  ShieldCheck, 
  ArrowRight, 
  HelpCircle,
  Sparkles,
  CornerDownLeft,
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { technicalArticles } from '../../content/articlesData';
import { roadmapPhases } from '../../content/roadmapData';
import { flagshipProjects } from '../../content/projectsData';
import { INTERVIEW_QUESTIONS } from '../../content/interviewData';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SearchCategory = 'all' | 'interview' | 'projects' | 'roadmap' | 'articles';

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<SearchCategory>('all');
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Popular search suggestions
  const popularKeywords = [
    { label: '⚡ Real-Time Scenarios', query: 'scenario' },
    { label: 'LangGraph Deep Agents', query: 'langgraph' },
    { label: 'Ragas & Evals', query: 'ragas' },
    { label: 'FastMCP Server', query: 'mcp' },
    { label: 'Self-Healing UI', query: 'healing' },
    { label: 'Redis Semantic Cache', query: 'redis' },
    { label: 'Rate Limiting 429', query: '429' },
    { label: 'Prompt Drift', query: 'drift' }
  ];

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    } else {
      setQuery('');
      setActiveTab('all');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Handle ESC and keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Search results calculation
  const searchResults = useMemo(() => {
    const rawQuery = query.toLowerCase().trim();
    if (!rawQuery) {
      return { articles: [], phases: [], projects: [], interview: [], total: 0, flattened: [] };
    }

    const tokens = rawQuery.split(/\s+/).filter(Boolean);

    const matchesTokens = (text: string, tags: string[] = []): boolean => {
      const lowerText = (text + ' ' + tags.join(' ')).toLowerCase();
      // Match if all tokens appear or the full phrase appears
      return lowerText.includes(rawQuery) || tokens.every(t => lowerText.includes(t)) || tokens.some(t => lowerText.includes(t));
    };

    const articles = technicalArticles.filter(art => 
      matchesTokens(`${art.title} ${art.summary} ${art.category}`, art.tags)
    );

    const phases = roadmapPhases.filter(phase => 
      matchesTokens(`${phase.title} ${phase.description}`, phase.keyConcepts)
    );

    const projects = flagshipProjects.filter(proj => 
      matchesTokens(`${proj.title} ${proj.tagline} ${proj.problemStatement} ${proj.badge}`, proj.techStack)
    );

    const interview = INTERVIEW_QUESTIONS.filter(q => 
      matchesTokens(`${q.question} ${q.shortAnswer} ${q.detailedAnswer} ${q.category}`, q.keyTerms)
    );

    // Flatten for keyboard navigation based on active tab
    type FlattenedItem = {
      id: string;
      title: string;
      desc: string;
      categoryType: 'article' | 'phase' | 'project' | 'interview';
      url: string;
      badge: string;
    };

    const flattened: FlattenedItem[] = [];

    if (activeTab === 'all' || activeTab === 'interview') {
      interview.forEach(q => {
        flattened.push({
          id: `int-${q.id}`,
          title: q.question,
          desc: q.shortAnswer,
          categoryType: 'interview',
          url: `/interview-prep?id=${q.id}&q=${encodeURIComponent(query.trim())}`,
          badge: q.category
        });
      });
    }

    if (activeTab === 'all' || activeTab === 'projects') {
      projects.forEach(p => {
        flattened.push({
          id: `proj-${p.slug}`,
          title: p.title,
          desc: p.tagline,
          categoryType: 'project',
          url: `/projects/${p.slug}`,
          badge: p.badge
        });
      });
    }

    if (activeTab === 'all' || activeTab === 'articles') {
      articles.forEach(a => {
        flattened.push({
          id: `art-${a.slug}`,
          title: a.title,
          desc: a.summary,
          categoryType: 'article',
          url: `/learn/${a.slug}`,
          badge: a.category
        });
      });
    }

    if (activeTab === 'all' || activeTab === 'roadmap') {
      phases.forEach(ph => {
        flattened.push({
          id: `phase-${ph.id}`,
          title: ph.title,
          desc: ph.description,
          categoryType: 'phase',
          url: `/roadmap#phase-${ph.id}`,
          badge: `Phase ${ph.id}`
        });
      });
    }

    const total = articles.length + phases.length + projects.length + interview.length;

    return { articles, phases, projects, interview, total, flattened };
  }, [query, activeTab]);

  // Arrow key navigation inside flattened list
  const handleKeyDownInInput = (e: React.KeyboardEvent) => {
    if (searchResults.flattened.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % searchResults.flattened.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + searchResults.flattened.length) % searchResults.flattened.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const selectedItem = searchResults.flattened[selectedIndex];
      if (selectedItem) {
        handleSelect(selectedItem.url);
      }
    }
  };

  const handleSelect = (url: string) => {
    navigate(url);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="search-modal" 
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '680px',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-strong)',
          borderRadius: 'var(--radius-sm)',
          boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.75)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '82vh'
        }}
      >
        {/* Header / Input Field */}
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '1rem 1.25rem',
            borderBottom: '1px solid var(--border-subtle)',
            background: 'var(--bg-primary)'
          }}
        >
          <Search size={18} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          <input
            ref={inputRef}
            type="text"
            className="search-input"
            placeholder="Search questions, scenarios, projects, tools, articles..."
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDownInInput}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: 'var(--text-base)',
              color: 'var(--text-primary)',
              fontFamily: 'inherit'
            }}
          />
          {query && (
            <button 
              onClick={() => { setQuery(''); inputRef.current?.focus(); }}
              className="icon-btn"
              style={{ width: '1.6rem', height: '1.6rem', padding: 0 }}
              title="Clear search"
            >
              <X size={14} />
            </button>
          )}
          <button 
            onClick={onClose} 
            className="icon-btn" 
            style={{ width: '1.8rem', height: '1.8rem', padding: 0 }}
            title="Close (Esc)"
          >
            <span style={{ fontSize: '0.7rem', fontWeight: 600, padding: '0.15rem 0.35rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-subtle)' }}>ESC</span>
          </button>
        </div>

        {/* Filter Category Tabs (Visible when query is present) */}
        {query.trim() && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.5rem 1.25rem',
            borderBottom: '1px solid var(--border-subtle)',
            background: 'var(--bg-secondary)',
            overflowX: 'auto'
          }}>
            <button
              onClick={() => { setActiveTab('all'); setSelectedIndex(0); }}
              style={{
                padding: '0.25rem 0.6rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                borderRadius: 'var(--radius-xs)',
                border: '1px solid',
                borderColor: activeTab === 'all' ? 'var(--border-strong)' : 'transparent',
                background: activeTab === 'all' ? 'var(--bg-primary)' : 'transparent',
                color: activeTab === 'all' ? 'var(--text-primary)' : 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              All ({searchResults.total})
            </button>
            <button
              onClick={() => { setActiveTab('interview'); setSelectedIndex(0); }}
              style={{
                padding: '0.25rem 0.6rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                borderRadius: 'var(--radius-xs)',
                border: '1px solid',
                borderColor: activeTab === 'interview' ? 'var(--border-strong)' : 'transparent',
                background: activeTab === 'interview' ? 'var(--bg-primary)' : 'transparent',
                color: activeTab === 'interview' ? 'var(--text-primary)' : 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              Interview Q&A ({searchResults.interview.length})
            </button>
            <button
              onClick={() => { setActiveTab('projects'); setSelectedIndex(0); }}
              style={{
                padding: '0.25rem 0.6rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                borderRadius: 'var(--radius-xs)',
                border: '1px solid',
                borderColor: activeTab === 'projects' ? 'var(--border-strong)' : 'transparent',
                background: activeTab === 'projects' ? 'var(--bg-primary)' : 'transparent',
                color: activeTab === 'projects' ? 'var(--text-primary)' : 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              Projects ({searchResults.projects.length})
            </button>
            <button
              onClick={() => { setActiveTab('articles'); setSelectedIndex(0); }}
              style={{
                padding: '0.25rem 0.6rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                borderRadius: 'var(--radius-xs)',
                border: '1px solid',
                borderColor: activeTab === 'articles' ? 'var(--border-strong)' : 'transparent',
                background: activeTab === 'articles' ? 'var(--bg-primary)' : 'transparent',
                color: activeTab === 'articles' ? 'var(--text-primary)' : 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              Articles ({searchResults.articles.length})
            </button>
            <button
              onClick={() => { setActiveTab('roadmap'); setSelectedIndex(0); }}
              style={{
                padding: '0.25rem 0.6rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                borderRadius: 'var(--radius-xs)',
                border: '1px solid',
                borderColor: activeTab === 'roadmap' ? 'var(--border-strong)' : 'transparent',
                background: activeTab === 'roadmap' ? 'var(--bg-primary)' : 'transparent',
                color: activeTab === 'roadmap' ? 'var(--text-primary)' : 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              Roadmap ({searchResults.phases.length})
            </button>
          </div>
        )}

        {/* Results Container */}
        <div 
          ref={resultsContainerRef}
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '0.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.4rem'
          }}
        >
          {query.trim() === '' ? (
            <div style={{ padding: '1.25rem 0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
                <Sparkles size={13} style={{ color: 'var(--accent-amber)' }} />
                Popular Quick Searches
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {popularKeywords.map(chip => (
                  <button
                    key={chip.query}
                    onClick={() => {
                      setQuery(chip.query);
                      inputRef.current?.focus();
                    }}
                    style={{
                      padding: '0.4rem 0.75rem',
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--text-primary)',
                      fontSize: '0.8rem',
                      fontWeight: 500,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = 'var(--border-strong)';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'var(--border-subtle)';
                      e.currentTarget.style.transform = 'none';
                    }}
                  >
                    <span>{chip.label}</span>
                    <ChevronRight size={12} style={{ opacity: 0.5 }} />
                  </button>
                ))}
              </div>

              <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>💡 Search Tips:</div>
                <div>• Type <code style={{ color: 'var(--text-primary)' }}>scenario</code> to see all 15 real-time production failure scenarios.</div>
                <div>• Type <code style={{ color: 'var(--text-primary)' }}>langgraph</code> or <code style={{ color: 'var(--text-primary)' }}>mcp</code> to find hands-on projects & test harness code.</div>
                <div>• Type <code style={{ color: 'var(--text-primary)' }}>eval</code> to find Ragas, DeepEval, and CI/CD quality gate questions.</div>
              </div>
            </div>
          ) : searchResults.flattened.length === 0 ? (
            <div style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🔍</div>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>No matching results found</div>
              <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                No resources matched "<strong style={{ color: 'var(--text-primary)' }}>{query}</strong>". Try a broader keyword like "rag", "agents", "python", or "playwright".
              </div>
            </div>
          ) : (
            searchResults.flattened.map((item, index) => {
              const isSelected = index === selectedIndex;
              const Icon = item.categoryType === 'interview' ? HelpCircle :
                           item.categoryType === 'project' ? ShieldCheck :
                           item.categoryType === 'article' ? BookOpen : Layers;
              
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item.url)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-xs)',
                    background: isSelected ? 'var(--accent-subtle)' : 'transparent',
                    border: '1px solid',
                    borderColor: isSelected ? 'var(--border-strong)' : 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.25rem',
                    transition: 'background 0.1s ease, border-color 0.1s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                      <Icon size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                      <span style={{ lineHeight: 1.3 }}>{item.title}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
                      <span style={{ 
                        fontSize: '0.65rem', 
                        fontWeight: 600, 
                        padding: '0.15rem 0.4rem', 
                        borderRadius: 'var(--radius-xs)', 
                        background: 'var(--bg-tertiary)', 
                        color: 'var(--text-secondary)',
                        border: '1px solid var(--border-subtle)'
                      }}>
                        {item.badge}
                      </span>
                      {isSelected ? (
                        <CornerDownLeft size={13} style={{ color: 'var(--text-primary)' }} />
                      ) : (
                        <ArrowRight size={13} style={{ color: 'var(--text-muted)' }} />
                      )}
                    </div>
                  </div>
                  <div style={{ 
                    fontSize: '0.75rem', 
                    color: 'var(--text-secondary)', 
                    paddingLeft: '1.4rem',
                    lineHeight: 1.4,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {item.desc}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div style={{
          padding: '0.6rem 1.25rem',
          borderTop: '1px solid var(--border-subtle)',
          background: 'var(--bg-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.7rem',
          color: 'var(--text-muted)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <span><strong style={{ color: 'var(--text-secondary)' }}>↑↓</strong> Navigate</span>
            <span><strong style={{ color: 'var(--text-secondary)' }}>↵</strong> Select</span>
            <span><strong style={{ color: 'var(--text-secondary)' }}>ESC</strong> Close</span>
          </div>
          <div>
            <span>QE2AI Search Engine</span>
          </div>
        </div>
      </div>
    </div>
  );
};
