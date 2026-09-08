import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, 
  Sparkles, 
  CheckCircle2, 
  Circle, 
  ChevronDown, 
  ChevronUp, 
  BookOpen, 
  Layers, 
  Copy, 
  Check, 
  Zap, 
  BrainCircuit,
  Filter,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { INTERVIEW_CATEGORIES, INTERVIEW_QUESTIONS, type InterviewQuestion } from '../content/interviewData';

export const InterviewPrepPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialId = searchParams.get('id') || null;

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);
  const [mode, setMode] = useState<'study' | 'flashcard'>('study');
  const [expandedId, setExpandedId] = useState<string | null>(initialId);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Sync when searchParams change
  useEffect(() => {
    const q = searchParams.get('q');
    const id = searchParams.get('id');
    if (q !== null) setSearchQuery(q);
    if (id !== null) {
      setExpandedId(id);
      setTimeout(() => {
        const el = document.getElementById(`q-${id}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  }, [searchParams]);
  
  // Flashcard Mode state
  const [flashcardIndex, setFlashcardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  // Mastery State (persisted to localStorage)
  const [masteredIds, setMasteredIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('qe2ai_mastered_questions');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [onlyUnmastered, setOnlyUnmastered] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem('qe2ai_mastered_questions', JSON.stringify(masteredIds));
    } catch (e) {
      console.error('Failed to save mastery state', e);
    }
  }, [masteredIds]);

  // Filtered Questions
  const filteredQuestions = useMemo(() => {
    return INTERVIEW_QUESTIONS.filter(q => {
      const matchesCategory = selectedCategory === 'all' || q.categorySlug === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'all' || q.difficulty === selectedDifficulty;
      const matchesMastery = !onlyUnmastered || !masteredIds.includes(q.id);

      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = !query || 
        q.question.toLowerCase().includes(query) ||
        q.shortAnswer.toLowerCase().includes(query) ||
        q.detailedAnswer.toLowerCase().includes(query) ||
        q.keyTerms.some(t => t.toLowerCase().includes(query));

      return matchesCategory && matchesDifficulty && matchesMastery && matchesSearch;
    });
  }, [selectedCategory, selectedDifficulty, onlyUnmastered, masteredIds, searchQuery]);

  // Handle Flashcard Bounds
  useEffect(() => {
    setFlashcardIndex(0);
    setIsFlipped(false);
  }, [selectedCategory, selectedDifficulty, onlyUnmastered, searchQuery]);

  const toggleMastery = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setMasteredIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const totalQuestions = INTERVIEW_QUESTIONS.length;
  const masteredCount = masteredIds.length;
  const masteryPercentage = Math.round((masteredCount / totalQuestions) * 100) || 0;

  const getDifficultyBadgeColor = (diff: InterviewQuestion['difficulty']) => {
    switch (diff) {
      case 'Beginner': return { bg: 'rgba(34, 197, 94, 0.1)', border: 'rgba(34, 197, 94, 0.3)', text: '#16a34a' };
      case 'Intermediate': return { bg: 'rgba(59, 130, 246, 0.1)', border: 'rgba(59, 130, 246, 0.3)', text: '#2563eb' };
      case 'Advanced': return { bg: 'rgba(168, 85, 247, 0.1)', border: 'rgba(168, 85, 247, 0.3)', text: '#9333ea' };
      case 'Staff/Lead': return { bg: 'rgba(234, 88, 12, 0.1)', border: 'rgba(234, 88, 12, 0.3)', text: '#ea580c' };
    }
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '6rem' }}>
      {/* 1. HERO & MASTERY PROGRESS SECTION */}
      <section style={{
        padding: '4.5rem 0 3.5rem',
        borderBottom: '1px solid var(--border-subtle)',
        background: 'var(--bg-secondary)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="container">
          <div style={{ maxWidth: '920px', margin: '0 auto', textAlign: 'center' }}>
            {/* Top Tagline Badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 0.9rem', background: 'var(--bg-primary)', borderRadius: '9999px', border: '1px solid var(--border-strong)', marginBottom: '1.25rem' }}>
              <Sparkles size={14} style={{ color: 'var(--text-primary)' }} />
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '0.04em' }}>
                QE2AI INTERVIEW PREPARATION SUITE
              </span>
            </div>

            <h1 style={{ fontSize: 'clamp(2.4rem, 5vw, 3.8rem)', fontWeight: 900, lineHeight: 1.15, marginBottom: '1rem', letterSpacing: '-0.03em' }}>
              Master the <span style={{ textDecoration: 'underline', textDecorationThickness: '3px' }}>QE → AI</span> Technical Interview.
            </h1>

            <p style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: 'var(--text-secondary)', maxWidth: '760px', margin: '0 auto 2.5rem', lineHeight: 1.6 }}>
              40+ curated, production-grade technical interview questions & detailed answers. 
              Master the concepts asked by tier-1 AI engineering teams — from async Python and advanced RAG to LangGraph multi-agent loops and Ragas evaluation gates.
            </p>

            {/* Mastery Stats Bar */}
            <div style={{
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-strong)',
              borderRadius: 'var(--radius-sm)',
              padding: '1.5rem',
              maxWidth: '720px',
              margin: '0 auto',
              boxShadow: '0 10px 25px -5px rgba(0,0,0,0.06)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <BrainCircuit size={18} style={{ color: 'var(--text-primary)' }} />
                  <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>Mastery Tracker</span>
                </div>
                <div style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                  {masteredCount} of {totalQuestions} Mastered ({masteryPercentage}%)
                </div>
              </div>

              {/* Progress Bar */}
              <div style={{
                width: '100%',
                height: '10px',
                background: 'var(--bg-tertiary)',
                borderRadius: '9999px',
                overflow: 'hidden',
                border: '1px solid var(--border-subtle)'
              }}>
                <div style={{
                  width: `${masteryPercentage}%`,
                  height: '100%',
                  background: 'var(--text-primary)',
                  borderRadius: '9999px',
                  transition: 'width 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
                }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CONTROLS, SEARCH & MODE SELECTOR */}
      <section style={{ padding: '2.5rem 0 1.5rem' }}>
        <div className="container">
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            maxWidth: '1040px',
            margin: '0 auto'
          }}>
            {/* Top Controls Row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              {/* Search Box */}
              <div style={{
                position: 'relative',
                flex: '1 1 320px',
                maxWidth: '540px'
              }}>
                <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Search questions, concepts, RAG, LangGraph, MCP..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem 0.75rem 2.6rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-strong)',
                    background: 'var(--bg-primary)',
                    color: 'var(--text-primary)',
                    fontSize: '0.9rem',
                    fontFamily: 'inherit',
                    outline: 'none'
                  }}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Mode Switcher: Study vs Flashcard */}
              <div style={{
                display: 'flex',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-strong)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.25rem',
                gap: '0.25rem'
              }}>
                <button
                  onClick={() => setMode('study')}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: 'var(--radius-xs)',
                    background: mode === 'study' ? 'var(--text-primary)' : 'transparent',
                    color: mode === 'study' ? 'var(--bg-primary)' : 'var(--text-secondary)',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <BookOpen size={14} />
                  <span>Study Mode</span>
                </button>
                <button
                  onClick={() => setMode('flashcard')}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: 'var(--radius-xs)',
                    background: mode === 'flashcard' ? 'var(--text-primary)' : 'transparent',
                    color: mode === 'flashcard' ? 'var(--bg-primary)' : 'var(--text-secondary)',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <Layers size={14} />
                  <span>Flashcard Mode</span>
                </button>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div style={{
              display: 'flex',
              gap: '0.5rem',
              overflowX: 'auto',
              paddingBottom: '0.5rem',
              scrollbarWidth: 'thin'
            }}>
              {INTERVIEW_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{
                    padding: '0.4rem 0.85rem',
                    borderRadius: '9999px',
                    border: `1px solid ${selectedCategory === cat.id ? 'var(--text-primary)' : 'var(--border-subtle)'}`,
                    background: selectedCategory === cat.id ? 'var(--text-primary)' : 'var(--bg-primary)',
                    color: selectedCategory === cat.id ? 'var(--bg-primary)' : 'var(--text-secondary)',
                    fontSize: '0.78rem',
                    fontWeight: selectedCategory === cat.id ? 700 : 500,
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    transition: 'all var(--transition-bounce)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <span>{cat.name}</span>
                  <span style={{
                    fontSize: '0.65rem',
                    opacity: 0.7,
                    padding: '0.1rem 0.35rem',
                    borderRadius: '9999px',
                    background: selectedCategory === cat.id ? 'rgba(255,255,255,0.2)' : 'var(--bg-tertiary)'
                  }}>
                    {cat.id === 'all' ? totalQuestions : INTERVIEW_QUESTIONS.filter(q => q.categorySlug === cat.id).length}
                  </span>
                </button>
              ))}
            </div>

            {/* Sub-Filters: Difficulty & Unmastered Filter */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.75rem',
              paddingTop: '0.5rem',
              borderTop: '1px solid var(--border-subtle)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Filter size={12} /> Level:
                </span>
                {['all', 'Beginner', 'Intermediate', 'Advanced', 'Staff/Lead'].map(diff => (
                  <button
                    key={diff}
                    onClick={() => setSelectedDifficulty(diff)}
                    style={{
                      padding: '0.25rem 0.65rem',
                      fontSize: '0.72rem',
                      borderRadius: 'var(--radius-xs)',
                      border: `1px solid ${selectedDifficulty === diff ? 'var(--text-primary)' : 'var(--border-subtle)'}`,
                      background: selectedDifficulty === diff ? 'var(--bg-tertiary)' : 'transparent',
                      color: selectedDifficulty === diff ? 'var(--text-primary)' : 'var(--text-secondary)',
                      fontWeight: selectedDifficulty === diff ? 700 : 500,
                      cursor: 'pointer'
                    }}
                  >
                    {diff === 'all' ? 'All Levels' : diff}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.8rem', cursor: 'pointer', userSelect: 'none' }}>
                  <input
                    type="checkbox"
                    checked={onlyUnmastered}
                    onChange={(e) => setOnlyUnmastered(e.target.checked)}
                    style={{ cursor: 'pointer' }}
                  />
                  <span>Show Unmastered Only</span>
                </label>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  Showing {filteredQuestions.length} Questions
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. MAIN CONTENT: ACCORDION OR FLASHCARD */}
      <section style={{ padding: '1.5rem 0' }}>
        <div className="container">
          <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
            
            {/* EMPTY STATE */}
            {filteredQuestions.length === 0 && (
              <div style={{
                textAlign: 'center',
                padding: '4rem 2rem',
                background: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-sm)',
                border: '1px dashed var(--border-strong)'
              }}>
                <Zap size={32} style={{ margin: '0 auto 1rem', opacity: 0.4 }} />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem' }}>No matching interview questions</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                  Try resetting your filters or search keyword.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedDifficulty('all');
                    setSearchQuery('');
                    setOnlyUnmastered(false);
                  }}
                  className="btn btn-secondary btn-sm"
                >
                  Reset All Filters
                </button>
              </div>
            )}

            {/* A. STUDY / ACCORDION MODE */}
            {mode === 'study' && filteredQuestions.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {filteredQuestions.map((q, idx) => {
                  const isExpanded = expandedId === q.id;
                  const isMastered = masteredIds.includes(q.id);
                  const diffColor = getDifficultyBadgeColor(q.difficulty);

                  return (
                    <div
                      key={q.id}
                      style={{
                        background: 'var(--bg-primary)',
                        border: `1px solid ${isExpanded ? 'var(--text-primary)' : 'var(--border-default)'}`,
                        borderRadius: 'var(--radius-sm)',
                        boxShadow: isExpanded ? '0 10px 30px -10px rgba(0,0,0,0.15)' : '0 2px 6px rgba(0,0,0,0.02)',
                        transition: 'all var(--transition-bounce)',
                        overflow: 'hidden'
                      }}
                    >
                      {/* Accordion Header */}
                      <div
                        onClick={() => setExpandedId(isExpanded ? null : q.id)}
                        style={{
                          padding: '1.25rem 1.5rem',
                          display: 'flex',
                          alignItems: 'flex-start',
                          justifyContent: 'space-between',
                          gap: '1rem',
                          cursor: 'pointer',
                          background: isExpanded ? 'var(--bg-secondary)' : 'transparent'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', flex: 1 }}>
                          {/* Mastery Check Icon */}
                          <button
                            onClick={(e) => toggleMastery(q.id, e)}
                            title={isMastered ? 'Mark as Unmastered' : 'Mark as Mastered'}
                            style={{
                              marginTop: '0.2rem',
                              color: isMastered ? '#16a34a' : 'var(--text-muted)',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'transform var(--transition-bounce)'
                            }}
                          >
                            {isMastered ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                          </button>

                          <div style={{ flex: 1 }}>
                            {/* Badges Row */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.4rem' }}>
                              <span style={{
                                fontSize: '0.68rem',
                                fontWeight: 800,
                                padding: '0.15rem 0.5rem',
                                borderRadius: 'var(--radius-xs)',
                                background: diffColor.bg,
                                border: `1px solid ${diffColor.border}`,
                                color: diffColor.text,
                                textTransform: 'uppercase'
                              }}>
                                {q.difficulty}
                              </span>
                              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                                {q.category}
                              </span>
                              <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                                #{idx + 1}
                              </span>
                            </div>

                            {/* Question Title */}
                            <h3 style={{
                              fontSize: '1.05rem',
                              fontWeight: 800,
                              lineHeight: 1.4,
                              color: 'var(--text-primary)'
                            }}>
                              {q.question}
                            </h3>

                            {/* Short Elevator Answer Preview */}
                            {!isExpanded && (
                              <p style={{
                                fontSize: '0.85rem',
                                color: 'var(--text-secondary)',
                                marginTop: '0.4rem',
                                lineHeight: 1.5,
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden'
                              }}>
                                {q.shortAnswer}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Expand/Collapse Toggle */}
                        <div style={{
                          padding: '0.4rem',
                          borderRadius: 'var(--radius-xs)',
                          background: 'var(--bg-tertiary)',
                          color: 'var(--text-primary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </div>
                      </div>

                      {/* Accordion Expanded Body */}
                      {isExpanded && (
                        <div style={{
                          padding: '1.5rem',
                          borderTop: '1px solid var(--border-subtle)',
                          background: 'var(--bg-primary)'
                        }}>
                          {/* 1-Line Elevator Pitch */}
                          <div style={{
                            padding: '1rem',
                            borderRadius: 'var(--radius-xs)',
                            background: 'var(--bg-secondary)',
                            borderLeft: '4px solid var(--text-primary)',
                            marginBottom: '1.5rem'
                          }}>
                            <div style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                              ⚡ Elevator Pitch (Quick Answer)
                            </div>
                            <div style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.5 }}>
                              {q.shortAnswer}
                            </div>
                          </div>

                          {/* Deep Technical Explanation */}
                          <div style={{ marginBottom: '1.5rem' }}>
                            <div style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.6rem' }}>
                              📖 Detailed Architectural Deep Dive
                            </div>
                            <div style={{
                              fontSize: '0.9rem',
                              color: 'var(--text-secondary)',
                              lineHeight: 1.7,
                              whiteSpace: 'pre-line'
                            }}>
                              {q.detailedAnswer}
                            </div>
                          </div>

                          {/* Code Snippet if applicable */}
                          {q.codeSnippet && (
                            <div style={{ marginBottom: '1.5rem' }}>
                              <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '0.5rem 0.85rem',
                                background: 'var(--bg-secondary)',
                                borderTopLeftRadius: 'var(--radius-xs)',
                                borderTopRightRadius: 'var(--radius-xs)',
                                border: '1px solid var(--border-strong)',
                                borderBottom: 'none'
                              }}>
                                <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-primary)' }}>
                                  {q.codeSnippet.caption || `${q.codeSnippet.language}.py`}
                                </span>
                                <button
                                  onClick={() => copyCode(q.codeSnippet!.code, q.id)}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.3rem',
                                    fontSize: '0.72rem',
                                    fontWeight: 700,
                                    color: 'var(--text-primary)',
                                    cursor: 'pointer'
                                  }}
                                >
                                  {copiedId === q.id ? <Check size={12} style={{ color: '#16a34a' }} /> : <Copy size={12} />}
                                  <span>{copiedId === q.id ? 'Copied' : 'Copy'}</span>
                                </button>
                              </div>
                              <pre style={{
                                margin: 0,
                                padding: '1rem',
                                background: 'var(--bg-code)',
                                border: '1px solid var(--border-strong)',
                                borderBottomLeftRadius: 'var(--radius-xs)',
                                borderBottomRightRadius: 'var(--radius-xs)',
                                overflowX: 'auto',
                                fontFamily: 'var(--font-mono)',
                                fontSize: '0.8rem',
                                color: 'var(--text-primary)',
                                lineHeight: 1.6
                              }}>
                                <code>{q.codeSnippet.code}</code>
                              </pre>
                            </div>
                          )}

                          {/* Key Terms Chips & Action Row */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                              <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                                Key Terms:
                              </span>
                              {q.keyTerms.map(term => (
                                <span
                                  key={term}
                                  style={{
                                    fontSize: '0.7rem',
                                    padding: '0.2rem 0.5rem',
                                    borderRadius: 'var(--radius-xs)',
                                    background: 'var(--bg-tertiary)',
                                    color: 'var(--text-primary)',
                                    fontWeight: 600,
                                    fontFamily: 'var(--font-mono)'
                                  }}
                                >
                                  {term}
                                </span>
                              ))}
                            </div>

                            <button
                              onClick={() => toggleMastery(q.id)}
                              style={{
                                padding: '0.4rem 0.85rem',
                                borderRadius: 'var(--radius-xs)',
                                border: `1px solid ${isMastered ? '#16a34a' : 'var(--border-strong)'}`,
                                background: isMastered ? '#16a34a' : 'transparent',
                                color: isMastered ? '#ffffff' : 'var(--text-primary)',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.35rem',
                                cursor: 'pointer'
                              }}
                            >
                              <CheckCircle2 size={14} />
                              <span>{isMastered ? 'Mastered ✓' : 'Mark as Mastered'}</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* B. FLASHCARD / MOCK QUIZ MODE */}
            {mode === 'flashcard' && filteredQuestions.length > 0 && (
              <div style={{ maxWidth: '780px', margin: '0 auto' }}>
                {(() => {
                  const currentCard = filteredQuestions[flashcardIndex] || filteredQuestions[0];
                  const diffColor = getDifficultyBadgeColor(currentCard.difficulty);
                  const isMastered = masteredIds.includes(currentCard.id);

                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      {/* Flashcard Nav Tracker */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                          Flashcard {flashcardIndex + 1} of {filteredQuestions.length}
                        </span>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => {
                              setIsFlipped(false);
                              setFlashcardIndex(prev => Math.max(0, prev - 1));
                            }}
                            disabled={flashcardIndex === 0}
                            className="btn btn-secondary btn-sm"
                            style={{ opacity: flashcardIndex === 0 ? 0.4 : 1 }}
                          >
                            <ArrowLeft size={14} /> Prev
                          </button>
                          <button
                            onClick={() => {
                              setIsFlipped(false);
                              setFlashcardIndex(prev => Math.min(filteredQuestions.length - 1, prev + 1));
                            }}
                            disabled={flashcardIndex === filteredQuestions.length - 1}
                            className="btn btn-primary btn-sm"
                            style={{ opacity: flashcardIndex === filteredQuestions.length - 1 ? 0.4 : 1 }}
                          >
                            Next <ArrowRight size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Interactive Flip Card */}
                      <div
                        onClick={() => setIsFlipped(!isFlipped)}
                        style={{
                          minHeight: '380px',
                          background: 'var(--bg-primary)',
                          border: '2px solid var(--text-primary)',
                          borderRadius: 'var(--radius-md)',
                          padding: '2.5rem',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          boxShadow: '0 20px 40px -15px rgba(0,0,0,0.15)',
                          cursor: 'pointer',
                          position: 'relative',
                          transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
                        }}
                      >
                        {/* Top Card Tags */}
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <span style={{
                                fontSize: '0.72rem',
                                fontWeight: 800,
                                padding: '0.2rem 0.6rem',
                                borderRadius: 'var(--radius-xs)',
                                background: diffColor.bg,
                                border: `1px solid ${diffColor.border}`,
                                color: diffColor.text,
                                textTransform: 'uppercase'
                              }}>
                                {currentCard.difficulty}
                              </span>
                              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                                {currentCard.category}
                              </span>
                            </div>
                            <button
                              onClick={(e) => toggleMastery(currentCard.id, e)}
                              style={{ color: isMastered ? '#16a34a' : 'var(--text-muted)', cursor: 'pointer' }}
                            >
                              {isMastered ? <CheckCircle2 size={22} /> : <Circle size={22} />}
                            </button>
                          </div>

                          {/* Question */}
                          <h2 style={{ fontSize: '1.4rem', fontWeight: 900, lineHeight: 1.35, marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
                            {currentCard.question}
                          </h2>

                          {/* Hidden / Revealed Content */}
                          {isFlipped ? (
                            <div className="animate-fade-in" style={{ padding: '1.25rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', borderLeft: '4px solid var(--text-primary)' }}>
                              <div style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                                Answer:
                              </div>
                              <div style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: 600, lineHeight: 1.6 }}>
                                {currentCard.shortAnswer}
                              </div>
                            </div>
                          ) : (
                            <div style={{
                              padding: '2rem 1rem',
                              textAlign: 'center',
                              background: 'var(--bg-secondary)',
                              borderRadius: 'var(--radius-sm)',
                              border: '1px dashed var(--border-default)',
                              color: 'var(--text-muted)',
                              fontSize: '0.88rem',
                              fontWeight: 600
                            }}>
                              💡 Tap anywhere to flip and reveal answer
                            </div>
                          )}
                        </div>

                        {/* Bottom Card Footer */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
                          <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                            {currentCard.keyTerms.slice(0, 3).map(t => (
                              <span key={t} style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', background: 'var(--bg-tertiary)', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                                {t}
                              </span>
                            ))}
                          </div>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                            {isFlipped ? 'Click to hide ↶' : 'Reveal answer ↷'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
