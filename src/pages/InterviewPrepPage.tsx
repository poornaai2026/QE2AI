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
  BrainCircuit,
  Filter,
  ArrowRight,
  ArrowLeft,
  FileText,
  Clock,
  Award,
  Play,
  CheckCircle,
  AlertTriangle,
  Send
} from 'lucide-react';
import { INTERVIEW_CATEGORIES, INTERVIEW_QUESTIONS, type InterviewQuestion } from '../content/interviewData';
import { CheatSheetModal } from '../components/common/CheatSheetModal';

interface RoundEvaluation {
  score: number;
  rootCauseScore: number;
  mitigationScore: number;
  toolingScore: number;
  strengths: string[];
  missingPoints: string[];
  feedback: string;
}

export const InterviewPrepPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialId = searchParams.get('id') || null;

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);
  const [mode, setMode] = useState<'study' | 'flashcard' | 'simulator'>('study');
  const [expandedId, setExpandedId] = useState<string | null>(initialId);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [cheatSheetOpen, setCheatSheetOpen] = useState<boolean>(false);

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

  // Simulator Mode state
  const [simulatorActive, setSimulatorActive] = useState<boolean>(false);
  const [simulatorQuestions, setSimulatorQuestions] = useState<InterviewQuestion[]>([]);
  const [simRound, setSimRound] = useState<number>(0);
  const [simAnswer, setSimAnswer] = useState<string>('');
  const [simTimer, setSimTimer] = useState<number>(600); // 10 minutes
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [roundEvaluations, setRoundEvaluations] = useState<RoundEvaluation[]>([]);
  const [currentEval, setCurrentEval] = useState<RoundEvaluation | null>(null);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [simulationFinished, setSimulationFinished] = useState<boolean>(false);

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

  // Simulator Timer countdown
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (simulatorActive && isTimerRunning && simTimer > 0 && !currentEval && !simulationFinished) {
      interval = setInterval(() => {
        setSimTimer(t => t - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [simulatorActive, isTimerRunning, simTimer, currentEval, simulationFinished]);

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

  // Start Mock Interview Simulator
  const startSimulation = () => {
    // Select 3 random real-time production scenario challenges or advanced questions
    const scenarioPool = INTERVIEW_QUESTIONS.filter(q => q.categorySlug === 'realtime-scenarios' || q.difficulty === 'Staff/Lead' || q.difficulty === 'Advanced');
    const shuffled = [...scenarioPool].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 3);
    
    setSimulatorQuestions(selected);
    setSimRound(0);
    setSimAnswer('');
    setSimTimer(600);
    setIsTimerRunning(true);
    setRoundEvaluations([]);
    setCurrentEval(null);
    setSimulationFinished(false);
    setSimulatorActive(true);
  };

  // Submit and Evaluate Mock Answer
  const submitAnswerForEvaluation = () => {
    if (!simAnswer.trim() || isEvaluating) return;
    setIsEvaluating(true);

    const activeQuestion = simulatorQuestions[simRound];
    const text = simAnswer.toLowerCase();
    
    // Evaluate based on key terms & architectural keywords
    const matchedTerms = activeQuestion.keyTerms.filter(term => text.includes(term.toLowerCase()));
    const termRatio = matchedTerms.length / Math.max(1, activeQuestion.keyTerms.length);

    // Calculate score metrics
    const wordCount = simAnswer.trim().split(/\s+/).length;
    const lengthScore = Math.min(1.0, wordCount / 40); // Target at least 40 words for architectural depth
    
    const rootCauseScore = Math.round(Math.min(30, (lengthScore * 15) + (termRatio * 15)));
    const mitigationScore = Math.round(Math.min(40, (lengthScore * 20) + (termRatio * 20)));
    const toolingScore = Math.round(Math.min(30, (lengthScore * 15) + (termRatio * 15)));
    
    const totalScore = rootCauseScore + mitigationScore + toolingScore;

    const strengths: string[] = [];
    const missingPoints: string[] = [];

    if (matchedTerms.length > 0) {
      strengths.push(`Identified core architectural primitives: ${matchedTerms.join(', ')}.`);
    }
    if (wordCount >= 50) {
      strengths.push('Provided substantial engineering depth and technical context.');
    } else {
      missingPoints.push('Elaborate on the step-by-step diagnostic workflow and error isolation.');
    }

    const unmentionedTerms = activeQuestion.keyTerms.filter(term => !text.includes(term.toLowerCase()));
    if (unmentionedTerms.length > 0) {
      missingPoints.push(`Consider addressing industry standards: ${unmentionedTerms.slice(0, 3).join(', ')}.`);
    }

    const evaluation: RoundEvaluation = {
      score: totalScore,
      rootCauseScore,
      mitigationScore,
      toolingScore,
      strengths: strengths.length > 0 ? strengths : ['Good initial conceptual attempt.'],
      missingPoints: missingPoints.length > 0 ? missingPoints : ['Addressed all major production edge cases.'],
      feedback: totalScore >= 80 ? '🌟 Excellent Staff-level architecture breakdown!' :
                totalScore >= 60 ? '👍 Solid understanding with clear mitigation strategy.' :
                '⚠️ Needs deeper root-cause isolation and production tooling details.'
    };

    setTimeout(() => {
      setCurrentEval(evaluation);
      setRoundEvaluations(prev => [...prev, evaluation]);
      setIsEvaluating(false);
      // Automatically toggle question mastery if score >= 75
      if (totalScore >= 75 && !masteredIds.includes(activeQuestion.id)) {
        setMasteredIds(prev => [...prev, activeQuestion.id]);
      }
    }, 600);
  };

  const handleNextRound = () => {
    if (simRound < simulatorQuestions.length - 1) {
      setSimRound(r => r + 1);
      setSimAnswer('');
      setCurrentEval(null);
    } else {
      setSimulationFinished(true);
    }
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

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="interview-prep-page" style={{ paddingBottom: '6rem' }}>
      {/* 1. HERO SECTION */}
      <section style={{
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '4.5rem 0 3.5rem',
        position: 'relative'
      }}>
        <div className="container">
          <div style={{ maxWidth: '880px', margin: '0 auto', textAlign: 'center' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.35rem 0.9rem',
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-strong)',
              borderRadius: '9999px',
              fontSize: '0.78rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '1.25rem'
            }}>
              <Sparkles size={13} style={{ color: 'var(--accent-amber)' }} />
              <span>55 Production Questions • 15 Real-Time Scenarios</span>
            </div>

            <h1 style={{ fontSize: 'clamp(2.4rem, 5vw, 3.8rem)', fontWeight: 900, lineHeight: 1.15, marginBottom: '1rem', letterSpacing: '-0.03em' }}>
              Master the <span style={{ textDecoration: 'underline', textDecorationThickness: '3px' }}>QE → AI</span> Technical Interview.
            </h1>

            <p style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: 'var(--text-secondary)', maxWidth: '760px', margin: '0 auto 2rem', lineHeight: 1.6 }}>
              Curated conceptual challenges and real-world production failure scenarios. Master async Python, advanced RAG, LangGraph multi-agent loops, FastMCP servers, and Ragas evaluation gates.
            </p>

            {/* Quick Action Buttons: Cheat Sheet */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => setCheatSheetOpen(true)}
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.25rem', borderRadius: 'var(--radius-sm)' }}
              >
                <FileText size={16} />
                <span>📥 Download Architecture Cheat Sheet (.md)</span>
              </button>
              <button
                onClick={() => {
                  setMode('simulator');
                  startSimulation();
                }}
                className="btn btn-secondary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.25rem', borderRadius: 'var(--radius-sm)' }}
              >
                <Play size={15} />
                <span>🎯 Launch Mock Interview Simulator</span>
              </button>
            </div>

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
                  placeholder="Search questions, scenarios, RAG, LangGraph, MCP..."
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

              {/* Mode Switcher: Study vs Flashcard vs Simulator */}
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
                    padding: '0.5rem 0.85rem',
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
                  <span>Study</span>
                </button>
                <button
                  onClick={() => setMode('flashcard')}
                  style={{
                    padding: '0.5rem 0.85rem',
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
                  <span>Flashcards</span>
                </button>
                <button
                  onClick={() => {
                    setMode('simulator');
                    if (!simulatorActive) startSimulation();
                  }}
                  style={{
                    padding: '0.5rem 0.85rem',
                    borderRadius: 'var(--radius-xs)',
                    background: mode === 'simulator' ? 'var(--text-primary)' : 'transparent',
                    color: mode === 'simulator' ? 'var(--bg-primary)' : 'var(--text-secondary)',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <Award size={14} />
                  <span>Simulator</span>
                </button>
              </div>
            </div>

            {/* Category Filter Pills (Study & Flashcard modes) */}
            {mode !== 'simulator' && (
              <>
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
              </>
            )}
          </div>
        </div>
      </section>

      {/* 3. MAIN CONTENT: ACCORDION, FLASHCARD OR SIMULATOR */}
      <section style={{ padding: '1.5rem 0' }}>
        <div className="container">
          <div style={{ maxWidth: '1040px', margin: '0 auto' }}>

            {/* SIMULATOR MODE */}
            {mode === 'simulator' && (
              <div>
                {!simulatorActive || simulationFinished ? (
                  /* Simulation Summary Scorecard */
                  <div style={{
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-strong)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '2.5rem',
                    textAlign: 'center',
                    boxShadow: '0 15px 35px -5px rgba(0,0,0,0.08)'
                  }}>
                    <Award size={48} style={{ color: 'var(--accent-amber)', margin: '0 auto 1rem' }} />
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '0.5rem' }}>
                      {simulationFinished ? 'Mock Interview Assessment Complete!' : 'AI Mock Interview Simulator'}
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '600px', margin: '0 auto 2rem', lineHeight: 1.6 }}>
                      {simulationFinished 
                        ? 'Here is your overall technical performance across the 3 production architectural battlegrounds:' 
                        : 'Practice answering 3 real-world production failure scenarios under realistic 10-minute interview conditions with automated AI rubric scoring.'}
                    </p>

                    {simulationFinished && (
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
                        {roundEvaluations.map((ev, i) => (
                          <div key={i} style={{
                            padding: '1.25rem 1.5rem',
                            background: 'var(--bg-secondary)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: 'var(--radius-sm)',
                            minWidth: '180px'
                          }}>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>Round {i + 1}</div>
                            <div style={{ fontSize: '2rem', fontWeight: 900, color: ev.score >= 75 ? '#10b981' : '#f59e0b', margin: '0.25rem 0' }}>
                              {ev.score}/100
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                              {ev.score >= 75 ? 'Staff Qualified' : 'Review Needed'}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <button
                      onClick={startSimulation}
                      className="btn btn-primary"
                      style={{ padding: '0.85rem 2rem', fontSize: '0.95rem', fontWeight: 700, borderRadius: 'var(--radius-sm)' }}
                    >
                      {simulationFinished ? 'Retake Another Mock Session' : 'Start 10-Minute Mock Simulation'}
                    </button>
                  </div>
                ) : (
                  /* Active Simulation Round */
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* Header bar with Timer & Round counter */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border-strong)',
                      padding: '1rem 1.5rem',
                      borderRadius: 'var(--radius-sm)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>
                          Round {simRound + 1} of {simulatorQuestions.length}
                        </span>
                        <span style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          padding: '0.15rem 0.5rem',
                          borderRadius: 'var(--radius-xs)',
                          background: getDifficultyBadgeColor(simulatorQuestions[simRound].difficulty).bg,
                          color: getDifficultyBadgeColor(simulatorQuestions[simRound].difficulty).text,
                          border: `1px solid ${getDifficultyBadgeColor(simulatorQuestions[simRound].difficulty).border}`
                        }}>
                          {simulatorQuestions[simRound].difficulty}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '1.1rem', color: simTimer < 120 ? '#ef4444' : 'var(--text-primary)' }}>
                        <Clock size={16} />
                        <span>{formatTimer(simTimer)}</span>
                      </div>
                    </div>

                    {/* Question Card */}
                    <div style={{
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-strong)',
                      padding: '1.75rem',
                      borderRadius: 'var(--radius-sm)'
                    }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                        {simulatorQuestions[simRound].category}
                      </div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, lineHeight: 1.4, color: 'var(--text-primary)' }}>
                        {simulatorQuestions[simRound].question}
                      </h3>
                    </div>

                    {!currentEval ? (
                      /* Candidate Response Input */
                      <div style={{
                        background: 'var(--bg-primary)',
                        border: '1px solid var(--border-strong)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '1.5rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Your Architectural & Diagnostic Answer:</span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {simAnswer.trim().split(/\s+/).filter(Boolean).length} words
                          </span>
                        </div>

                        <textarea
                          rows={7}
                          value={simAnswer}
                          onChange={e => setSimAnswer(e.target.value)}
                          placeholder="Structure your answer: 1. Root Cause Isolation -> 2. Mitigation Strategy -> 3. Verification & Defensive Tooling..."
                          style={{
                            width: '100%',
                            padding: '1rem',
                            background: 'var(--bg-secondary)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: 'var(--radius-xs)',
                            color: 'var(--text-primary)',
                            fontSize: '0.875rem',
                            lineHeight: '1.6',
                            fontFamily: 'inherit',
                            outline: 'none',
                            resize: 'vertical'
                          }}
                        />

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            💡 Rubric: Root Cause (30%) • Mitigation Strategy (40%) • Production Tooling (30%)
                          </div>
                          <button
                            onClick={submitAnswerForEvaluation}
                            disabled={!simAnswer.trim() || isEvaluating}
                            className="btn btn-primary"
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.5rem' }}
                          >
                            {isEvaluating ? (
                              <span>Evaluating Answer...</span>
                            ) : (
                              <>
                                <Send size={14} />
                                <span>Submit & Grade Round</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Evaluation Result Card */
                      <div style={{
                        background: 'var(--bg-primary)',
                        border: '1px solid var(--border-strong)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '1.75rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1.5rem',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.06)'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
                          <div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700 }}>Round {simRound + 1} Assessment</div>
                            <h4 style={{ fontSize: '1.2rem', fontWeight: 900, color: currentEval.score >= 75 ? '#10b981' : '#f59e0b' }}>
                              {currentEval.score}/100 — {currentEval.feedback}
                            </h4>
                          </div>
                          <button
                            onClick={handleNextRound}
                            className="btn btn-primary"
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.25rem' }}
                          >
                            <span>{simRound < simulatorQuestions.length - 1 ? 'Proceed to Next Round' : 'View Final Scorecard'}</span>
                            <ArrowRight size={14} />
                          </button>
                        </div>

                        {/* Pillar Scores */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
                          <div style={{ padding: '0.85rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-subtle)' }}>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>Root Cause Analysis</div>
                            <div style={{ fontSize: '1.3rem', fontWeight: 800 }}>{currentEval.rootCauseScore}/30</div>
                          </div>
                          <div style={{ padding: '0.85rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-subtle)' }}>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>Mitigation Strategy</div>
                            <div style={{ fontSize: '1.3rem', fontWeight: 800 }}>{currentEval.mitigationScore}/40</div>
                          </div>
                          <div style={{ padding: '0.85rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-subtle)' }}>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>Production Tooling</div>
                            <div style={{ fontSize: '1.3rem', fontWeight: 800 }}>{currentEval.toolingScore}/30</div>
                          </div>
                        </div>

                        {/* Strengths & Missing Points */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                          <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.06)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: 'var(--radius-xs)' }}>
                            <div style={{ fontWeight: 700, fontSize: '0.8rem', color: '#10b981', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                              <CheckCircle size={14} /> Strengths
                            </div>
                            <ul style={{ paddingLeft: '1rem', fontSize: '0.78rem', lineHeight: '1.5', color: 'var(--text-primary)' }}>
                              {currentEval.strengths.map((s, idx) => <li key={idx}>{s}</li>)}
                            </ul>
                          </div>

                          <div style={{ padding: '1rem', background: 'rgba(245, 158, 11, 0.06)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: 'var(--radius-xs)' }}>
                            <div style={{ fontWeight: 700, fontSize: '0.8rem', color: '#f59e0b', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                              <AlertTriangle size={14} /> Recommended Refinements
                            </div>
                            <ul style={{ paddingLeft: '1rem', fontSize: '0.78rem', lineHeight: '1.5', color: 'var(--text-primary)' }}>
                              {currentEval.missingPoints.map((m, idx) => <li key={idx}>{m}</li>)}
                            </ul>
                          </div>
                        </div>

                        {/* Golden Model Answer Comparison */}
                        <div style={{ padding: '1.25rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xs)' }}>
                          <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                            📖 Golden Architectural Answer:
                          </div>
                          <div style={{ fontSize: '0.8rem', lineHeight: '1.6', color: 'var(--text-secondary)', whiteSpace: 'pre-line' }}>
                            {simulatorQuestions[simRound].detailedAnswer}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* STUDY MODE (ACCORDION) */}
            {mode === 'study' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {filteredQuestions.map((q, idx) => {
                  const isExpanded = expandedId === q.id;
                  const isMastered = masteredIds.includes(q.id);
                  const diffColor = getDifficultyBadgeColor(q.difficulty);

                  return (
                    <div 
                      key={q.id}
                      id={`q-${q.id}`}
                      style={{
                        background: 'var(--bg-primary)',
                        border: `1px solid ${isExpanded ? 'var(--border-strong)' : 'var(--border-default)'}`,
                        borderRadius: 'var(--radius-sm)',
                        overflow: 'hidden',
                        transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)',
                        boxShadow: isExpanded ? '0 10px 30px -10px rgba(0,0,0,0.08)' : 'none'
                      }}
                    >
                      {/* Header */}
                      <div 
                        onClick={() => setExpandedId(isExpanded ? null : q.id)}
                        style={{
                          padding: '1.25rem 1.5rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'flex-start',
                          justifyContent: 'space-between',
                          gap: '1rem',
                          userSelect: 'none',
                          background: isExpanded ? 'var(--bg-secondary)' : 'transparent'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', flex: 1 }}>
                          <button
                            onClick={(e) => toggleMastery(q.id, e)}
                            title={isMastered ? "Mark as unmastered" : "Mark as mastered"}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              padding: '2px',
                              marginTop: '2px',
                              color: isMastered ? 'var(--text-primary)' : 'var(--text-muted)'
                            }}
                          >
                            {isMastered ? (
                              <CheckCircle2 size={20} style={{ color: '#10b981' }} />
                            ) : (
                              <Circle size={20} />
                            )}
                          </button>

                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                                #{idx + 1}
                              </span>
                              <span style={{
                                fontSize: '0.7rem',
                                fontWeight: 700,
                                padding: '0.15rem 0.5rem',
                                borderRadius: 'var(--radius-xs)',
                                background: diffColor.bg,
                                color: diffColor.text,
                                border: `1px solid ${diffColor.border}`
                              }}>
                                {q.difficulty}
                              </span>
                              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                                • {q.category}
                              </span>
                            </div>

                            <h3 style={{
                              fontSize: '1.05rem',
                              fontWeight: 700,
                              lineHeight: 1.4,
                              color: isMastered ? 'var(--text-secondary)' : 'var(--text-primary)',
                              textDecoration: isMastered ? 'none' : 'none'
                            }}>
                              {q.question}
                            </h3>

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

                        <div style={{ marginTop: '4px', color: 'var(--text-muted)' }}>
                          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </div>
                      </div>

                      {/* Expanded Content */}
                      {isExpanded && (
                        <div style={{
                          padding: '1.5rem',
                          borderTop: '1px solid var(--border-subtle)',
                          background: 'var(--bg-primary)'
                        }}>
                          {/* Short TL;DR */}
                          <div style={{
                            padding: '1rem',
                            background: 'var(--bg-secondary)',
                            borderLeft: '3px solid var(--text-primary)',
                            borderRadius: 'var(--radius-xs)',
                            marginBottom: '1.5rem'
                          }}>
                            <div style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                              TL;DR Summary
                            </div>
                            <div style={{ fontSize: '0.9rem', lineHeight: 1.5, fontWeight: 500 }}>
                              {q.shortAnswer}
                            </div>
                          </div>

                          {/* Detailed Answer */}
                          <div style={{ marginBottom: '1.5rem' }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                              Architectural Deep Dive
                            </div>
                            <div style={{
                              fontSize: '0.875rem',
                              lineHeight: 1.7,
                              color: 'var(--text-primary)',
                              whiteSpace: 'pre-line'
                            }}>
                              {q.detailedAnswer}
                            </div>
                          </div>

                          {/* Code Recipe Snippet if present */}
                          {q.codeSnippet && (
                            <div style={{ marginBottom: '1.5rem' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                                  {q.codeSnippet.caption || 'Production Code Recipe'}
                                </span>
                                <button
                                  onClick={() => copyCode(q.codeSnippet!.code, q.id)}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.35rem',
                                    fontSize: '0.75rem',
                                    background: 'var(--bg-secondary)',
                                    border: '1px solid var(--border-subtle)',
                                    borderRadius: 'var(--radius-xs)',
                                    padding: '0.2rem 0.5rem',
                                    cursor: 'pointer',
                                    color: 'var(--text-secondary)'
                                  }}
                                >
                                  {copiedId === q.id ? <Check size={12} style={{ color: '#10b981' }} /> : <Copy size={12} />}
                                  <span>{copiedId === q.id ? 'Copied!' : 'Copy Code'}</span>
                                </button>
                              </div>
                              <pre style={{
                                background: 'var(--bg-tertiary)',
                                border: '1px solid var(--border-subtle)',
                                padding: '1rem',
                                borderRadius: 'var(--radius-xs)',
                                overflowX: 'auto',
                                fontSize: '0.8rem',
                                fontFamily: 'var(--font-mono)',
                                lineHeight: 1.5,
                                color: 'var(--text-primary)'
                              }}>
                                <code>{q.codeSnippet.code}</code>
                              </pre>
                            </div>
                          )}

                          {/* Key Terms */}
                          <div>
                            <div style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                              Key Industry Terms
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                              {q.keyTerms.map((term, tIdx) => (
                                <span
                                  key={tIdx}
                                  style={{
                                    fontSize: '0.72rem',
                                    fontWeight: 600,
                                    padding: '0.2rem 0.6rem',
                                    background: 'var(--bg-secondary)',
                                    border: '1px solid var(--border-subtle)',
                                    borderRadius: 'var(--radius-xs)',
                                    color: 'var(--text-secondary)'
                                  }}
                                >
                                  {term}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* FLASHCARD MODE */}
            {mode === 'flashcard' && filteredQuestions.length > 0 && (
              <div style={{
                maxWidth: '680px',
                margin: '0 auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                    Card {flashcardIndex + 1} of {filteredQuestions.length}
                  </span>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '0.2rem 0.6rem',
                    borderRadius: 'var(--radius-xs)',
                    background: getDifficultyBadgeColor(filteredQuestions[flashcardIndex].difficulty).bg,
                    color: getDifficultyBadgeColor(filteredQuestions[flashcardIndex].difficulty).text,
                    border: `1px solid ${getDifficultyBadgeColor(filteredQuestions[flashcardIndex].difficulty).border}`
                  }}>
                    {filteredQuestions[flashcardIndex].difficulty}
                  </span>
                </div>

                {/* Card Container */}
                <div 
                  onClick={() => setIsFlipped(!isFlipped)}
                  style={{
                    minHeight: '340px',
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-strong)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '2.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    boxShadow: '0 20px 40px -15px rgba(0,0,0,0.1)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    userSelect: 'none'
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'none'}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
                    <span>{filteredQuestions[flashcardIndex].category}</span>
                    <span>{isFlipped ? 'Answer (Click to flip)' : 'Question (Click to flip)'}</span>
                  </div>

                  <div style={{ margin: '1.5rem 0', textAlign: 'center' }}>
                    {!isFlipped ? (
                      <h3 style={{ fontSize: '1.35rem', fontWeight: 800, lineHeight: 1.4, color: 'var(--text-primary)' }}>
                        {filteredQuestions[flashcardIndex].question}
                      </h3>
                    ) : (
                      <div>
                        <div style={{ fontSize: '1rem', lineHeight: 1.6, color: 'var(--text-primary)', marginBottom: '1.25rem', textAlign: 'left' }}>
                          {filteredQuestions[flashcardIndex].shortAnswer}
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', justifyContent: 'center' }}>
                          {filteredQuestions[flashcardIndex].keyTerms.map((t, idx) => (
                            <span key={idx} style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-subtle)' }}>
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    💡 Tip: Click anywhere on the card to reveal the answer
                  </div>
                </div>

                {/* Navigation Controls */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button
                    onClick={() => {
                      setFlashcardIndex(prev => Math.max(0, prev - 1));
                      setIsFlipped(false);
                    }}
                    disabled={flashcardIndex === 0}
                    className="btn btn-secondary"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: flashcardIndex === 0 ? 0.4 : 1 }}
                  >
                    <ArrowLeft size={14} /> Previous
                  </button>

                  <button
                    onClick={() => toggleMastery(filteredQuestions[flashcardIndex].id)}
                    className="btn"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      background: masteredIds.includes(filteredQuestions[flashcardIndex].id) ? '#10b981' : 'var(--bg-secondary)',
                      color: masteredIds.includes(filteredQuestions[flashcardIndex].id) ? '#ffffff' : 'var(--text-primary)',
                      border: '1px solid var(--border-strong)'
                    }}
                  >
                    <CheckCircle2 size={14} />
                    {masteredIds.includes(filteredQuestions[flashcardIndex].id) ? 'Mastered' : 'Mark as Mastered'}
                  </button>

                  <button
                    onClick={() => {
                      setFlashcardIndex(prev => Math.min(filteredQuestions.length - 1, prev + 1));
                      setIsFlipped(false);
                    }}
                    disabled={flashcardIndex === filteredQuestions.length - 1}
                    className="btn btn-secondary"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: flashcardIndex === filteredQuestions.length - 1 ? 0.4 : 1 }}
                  >
                    Next <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Cheat Sheet Modal */}
      <CheatSheetModal
        isOpen={cheatSheetOpen}
        onClose={() => setCheatSheetOpen(false)}
      />
    </div>
  );
};
