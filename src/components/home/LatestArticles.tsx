import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Clock, Tag } from 'lucide-react';
import { technicalArticles } from '../../content/articlesData';
import { Badge } from '../common/Badge';

export const LatestArticles: React.FC = () => {
  return (
    <section className="section-padding" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '3rem', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.25rem 0.75rem', background: 'var(--accent-emerald-subtle)', borderRadius: 'var(--radius-full)', border: '1px solid rgba(16, 185, 129, 0.3)', marginBottom: '0.75rem', fontSize: '0.75rem', color: 'var(--accent-emerald)', fontWeight: 600 }}>
              <BookOpen size={13} />
              <span>THE 6-QUESTION STANDARD</span>
            </div>
            <h2>Latest Engineering Deep Dives</h2>
            <p style={{ maxWidth: '600px', fontSize: 'var(--text-base)', marginTop: '0.5rem' }}>
              Every article answers: <strong>WHAT? HOW? BUILD? FAIL? TEST? PRODUCTION? INTERVIEW?</strong>
            </p>
          </div>

          <Link to="/learn" className="btn btn-secondary">
            <span>Explore All Knowledge</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '1.5rem'
        }}>
          {technicalArticles.slice(0, 3).map((article) => (
            <Link
              key={article.slug}
              to={`/learn/${article.slug}`}
              className="card card-interactive"
              style={{ display: 'flex', flexDirection: 'column' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <Badge variant={article.difficulty === 'Beginner' ? 'cyan' : article.difficulty === 'Intermediate' ? 'purple' : 'rose'}>
                  {article.difficulty}
                </Badge>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                  <Clock size={13} />
                  <span>{article.readingTime}</span>
                </div>
              </div>

              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.65rem', color: 'var(--text-primary)', lineHeight: 1.35 }}>
                {article.title}
              </h3>

              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: '1.25rem', flex: 1, lineHeight: 1.6 }}>
                {article.summary}
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1.25rem' }}>
                {article.tags.slice(0, 3).map(tag => (
                  <span
                    key={tag}
                    style={{
                      fontSize: '0.7rem',
                      background: 'var(--bg-tertiary)',
                      padding: '0.15rem 0.45rem',
                      borderRadius: 'var(--radius-xs)',
                      color: 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.2rem'
                    }}
                  >
                    <Tag size={10} />
                    {tag}
                  </span>
                ))}
              </div>

              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 'var(--text-xs)' }}>
                <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>{article.category}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                  Read Deep Dive <ArrowRight size={13} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
