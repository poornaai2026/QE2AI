import React, { useState } from 'react';
import { 
  Briefcase, 
  HelpCircle, 
  FileText, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  Search
} from 'lucide-react';
import { skillMappings, interviewQuestions } from '../content/careerData';
import type { SkillMapping } from '../content/careerData';
import type { InterviewQuestionItem } from '../content/types';
import { Badge } from '../components/common/Badge';
import { Callout } from '../components/common/Callout';

export const CareerPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(interviewQuestions[0]?.id || null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'AI Quality & Evaluation', 'RAG & Vector', 'Agents & MCP', 'LLM & Prompt', 'System Design & Career'];

  const filteredQuestions = interviewQuestions.filter((q: InterviewQuestionItem) => {
    const matchCat = selectedCategory === 'All' || q.category === selectedCategory;
    const matchSearch =
      searchQuery === '' ||
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.answerExplanation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.keyPoints.some((k: string) => k.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchSearch;
  });

  const toggleQuestion = (id: string) => {
    setExpandedQuestionId(prev => (prev === id ? null : id));
  };

  return (
    <div className="animate-fade-in section-padding" style={{ paddingTop: '2.5rem' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '3.5rem', textAlign: 'center', maxWidth: '800px', marginLeft: 'auto', marginRight: 'auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.25rem 0.75rem', background: 'var(--accent-cyan-subtle)', borderRadius: 'var(--radius-full)', border: '1px solid rgba(6, 182, 212, 0.3)', marginBottom: '1rem', fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>
            <Briefcase size={14} />
            <span>CAREER STRATEGY & INTERVIEWS</span>
          </div>
          <h1 style={{ marginBottom: '1rem' }}>
            QA → AI <span className="gradient-text">Career Transition</span>
          </h1>
          <p style={{ fontSize: 'var(--text-lg)', color: 'var(--text-secondary)' }}>
            Position your Quality Engineering background as an unfair advantage. Master AI QE interview questions, resume positioning, and system design frameworks.
          </p>
        </div>

        {/* Section 1: Skill Mapping Matrix */}
        <section style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <Sparkles size={20} style={{ color: 'var(--accent-cyan)' }} />
            <h2 style={{ fontSize: 'var(--text-2xl)' }}>1. The QA-to-AI Skill Translation Matrix</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
            {skillMappings.map((map: SkillMapping, i: number) => (
              <div key={i} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ marginBottom: '0.75rem' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Traditional QA Skill
                  </div>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-secondary)', textDecoration: 'line-through', opacity: 0.75 }}>
                    {map.traditionalQe}
                  </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent-cyan)', textTransform: 'uppercase' }}>
                    AI Engineering Equivalent
                  </div>
                  <div style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {map.aiEngineeringEquivalent}
                  </div>
                </div>

                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem', flex: 1 }}>
                  {map.whyItMatters}
                </p>

                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem', fontSize: 'var(--text-xs)', color: 'var(--accent-purple)', fontWeight: 600 }}>
                  Showcase Project: {map.recommendedProject}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: Resume Transformation Advice */}
        <section style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <FileText size={20} style={{ color: 'var(--accent-purple)' }} />
            <h2 style={{ fontSize: 'var(--text-2xl)' }}>2. Resume Transformation: High-Impact Bullet Points</h2>
          </div>

          <Callout type="qe" title="How to frame your experience on your Resume & LinkedIn">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
              <div>
                <strong style={{ color: 'var(--text-primary)' }}>❌ Don't say:</strong>
                <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                  "Tested company's internal chatbot and used ChatGPT to generate Selenium test scripts."
                </div>
              </div>
              <div>
                <strong style={{ color: 'var(--accent-emerald)' }}>✅ Do say:</strong>
                <div style={{ color: 'var(--text-primary)', fontSize: 'var(--text-sm)', fontWeight: 500 }}>
                  "Architected an automated AI Quality Gate in GitHub Actions using DeepEval and Ragas, evaluating Faithfulness and Context Precision across 250+ golden benchmark queries, reducing RAG hallucination rate from 14% to 2.8% in CI/CD."
                </div>
              </div>
            </div>
          </Callout>
        </section>

        {/* Section 3: 30+ AI QE Interview Questions Bank */}
        <section style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <HelpCircle size={20} style={{ color: 'var(--accent-amber)' }} />
              <h2 style={{ fontSize: 'var(--text-2xl)' }}>3. AI QE & System Design Interview Bank</h2>
            </div>
          </div>

          {/* Search & Category Filter */}
          <div className="card" style={{ padding: '1.25rem', marginBottom: '1.75rem' }}>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Search interview questions by keyword (e.g. non-deterministic, RAG triad, LangGraph)..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 1rem 0.65rem 2.4rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-default)',
                    background: 'var(--bg-primary)',
                    color: 'var(--text-primary)',
                    fontFamily: 'inherit',
                    fontSize: 'var(--text-sm)',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '0.3rem 0.65rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    background: selectedCategory === cat ? 'var(--accent-cyan-subtle)' : 'transparent',
                    border: selectedCategory === cat ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                    color: selectedCategory === cat ? 'var(--accent-cyan)' : 'var(--text-secondary)'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Question List Accordion */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredQuestions.map((q: InterviewQuestionItem) => {
              const isExpanded = expandedQuestionId === q.id;
              return (
                <div key={q.id} className="card" style={{ padding: '1.5rem', cursor: 'pointer' }} onClick={() => toggleQuestion(q.id)}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
                      <Badge variant={q.difficulty === 'Beginner' ? 'cyan' : q.difficulty === 'Intermediate' ? 'purple' : 'rose'}>
                        {q.difficulty}
                      </Badge>
                      <h3 style={{ fontSize: 'var(--text-base)', color: 'var(--text-primary)', margin: 0 }}>
                        {q.question}
                      </h3>
                    </div>
                    {isExpanded ? <ChevronUp size={18} style={{ color: 'var(--accent-cyan)' }} /> : <ChevronDown size={18} style={{ color: 'var(--text-muted)' }} />}
                  </div>

                  {isExpanded && (
                    <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)', cursor: 'default' }} onClick={e => e.stopPropagation()}>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--accent-cyan)', fontWeight: 600, marginBottom: '0.75rem' }}>
                        💡 QE Interview Context: {q.qeContext}
                      </div>

                      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
                        {q.answerExplanation}
                      </p>

                      <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: '1rem' }}>
                        <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                          Key Interview Talking Points:
                        </div>
                        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                          {q.keyPoints.map((kp: string, idx: number) => (
                            <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                              <CheckCircle2 size={13} style={{ color: 'var(--accent-emerald)' }} />
                              <span>{kp}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                        Common Follow-up: "{q.sampleFollowUp}"
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};
