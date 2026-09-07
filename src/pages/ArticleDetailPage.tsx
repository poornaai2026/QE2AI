import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Clock, 
  Tag, 
  CheckCircle2, 
  BookOpen,
  ArrowRight,
  Compass
} from 'lucide-react';
import { technicalArticles } from '../content/articlesData';
import type { Article } from '../content/types';
import { Badge } from '../components/common/Badge';
import { QA2AISixQuestions } from '../components/article/QA2AISixQuestions';
import { ArticleTOC } from '../components/article/ArticleTOC';

export const ArticleDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const article = technicalArticles.find((a: Article) => a.slug === slug);

  if (!article) {
    return <Navigate to="/learn" replace />;
  }

  // Find other articles for related reading
  const otherArticles = technicalArticles.filter((a: Article) => a.slug !== article.slug);

  return (
    <div className="animate-fade-in section-padding" style={{ paddingTop: '2rem' }}>
      <div className="container">
        {/* Back navigation */}
        <div style={{ marginBottom: '1.5rem' }}>
          <Link to="/learn" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
            <ArrowLeft size={16} />
            <span>Back to Knowledge Library</span>
          </Link>
        </div>

        {/* Article Main Grid with TOC */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 280px', gap: '3.5rem', alignItems: 'flex-start' }}>
          {/* Main Article Content */}
          <article>
            {/* Header / Metadata */}
            <div style={{ marginBottom: '2.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                <Badge variant={article.difficulty === 'Beginner' ? 'cyan' : article.difficulty === 'Intermediate' ? 'purple' : 'rose'}>
                  {article.difficulty}
                </Badge>
                <Badge variant="emerald">{article.category}</Badge>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                  <Clock size={13} />
                  <span>{article.readingTime}</span>
                </div>
                {article.phaseId && (
                  <Link to={`/roadmap#phase-${article.phaseId}`} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: 'var(--text-xs)', color: 'var(--accent-cyan)' }}>
                    <Compass size={13} />
                    <span>Roadmap Phase {article.phaseId}</span>
                  </Link>
                )}
              </div>

              <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', lineHeight: 1.25, marginBottom: '1rem' }}>
                {article.title}
              </h1>

              <p style={{ fontSize: 'var(--text-lg)', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                {article.summary}
              </p>

              {/* Tags */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {article.tags.map((tag: string) => (
                  <span
                    key={tag}
                    style={{
                      fontSize: '0.75rem',
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-subtle)',
                      padding: '0.2rem 0.6rem',
                      borderRadius: 'var(--radius-full)',
                      color: 'var(--text-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem'
                    }}
                  >
                    <Tag size={11} />
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Prerequisites Callout */}
            {article.prerequisites.length > 0 && (
              <div style={{ background: 'var(--bg-secondary)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: '2.5rem' }}>
                <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                  Prerequisites for this Deep Dive:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                  {article.prerequisites.map((p: string, i: number) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                      <CheckCircle2 size={14} style={{ color: 'var(--accent-cyan)' }} />
                      <span>{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* The 6-Question Framework Body */}
            <QA2AISixQuestions data={article.sixQuestions} />

            {/* Related Articles Footer */}
            {otherArticles.length > 0 && (
              <div style={{ marginTop: '4rem', paddingTop: '2.5rem', borderTop: '1px solid var(--border-subtle)' }}>
                <h3 style={{ fontSize: 'var(--text-xl)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <BookOpen size={18} style={{ color: 'var(--accent-cyan)' }} />
                  <span>Continue Learning</span>
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
                  {otherArticles.slice(0, 2).map((other: Article) => (
                    <Link
                      key={other.slug}
                      to={`/learn/${other.slug}`}
                      className="card card-interactive"
                      style={{ padding: '1.25rem' }}
                    >
                      <Badge variant="cyan" className="mb-2">{other.category}</Badge>
                      <h4 style={{ fontSize: 'var(--text-base)', marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
                        {other.title}
                      </h4>
                      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                        {other.summary}
                      </p>
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--accent-cyan)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                        Read Article <ArrowRight size={12} />
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* Right Floating TOC */}
          <ArticleTOC />
        </div>
      </div>
    </div>
  );
};
