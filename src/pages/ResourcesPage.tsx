import React, { useState } from 'react';
import { 
  Tv, 
  ExternalLink, 
  Search, 
  Calendar,
  BookOpen
} from 'lucide-react';
import { 
  FREE_LLM_PROVIDERS, 
  CURATED_YOUTUBE_RESOURCES, 
  CURATED_GITHUB_REPOSITORIES,
  CURATED_AI_ARTICLES_AND_TOOLS
} from '../content/qe2aiBlueprintData';
import { GithubIcon } from '../components/common/Icons';
import { TokenCostCalculator } from '../components/interactive/TokenCostCalculator';

export const ResourcesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'llms' | 'youtube' | 'github' | 'articles'>('llms');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredLLMs = FREE_LLM_PROVIDERS.filter(item => 
    item.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.bestUseCase.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredYouTube = CURATED_YOUTUBE_RESOURCES.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGitHub = CURATED_GITHUB_REPOSITORIES.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredArticles = CURATED_AI_ARTICLES_AND_TOOLS.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="animate-fade-in" style={{ padding: '3.5rem 0 5rem' }}>
      <div className="container">
        {/* Header */}
        <div style={{ maxWidth: '820px', marginBottom: '2.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span className="badge badge-inverted">FREE & CURATED</span>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Updated Regularly</span>
          </div>
          <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, marginBottom: '0.75rem' }}>
            Free Resources & Curated Hub
          </h1>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            Build and learn without huge API bills. Explore verified free-tier LLM providers, high-signal YouTube tutorials with "Why watch this?" takeaways, and production open-source repositories.
          </p>
        </div>

        {/* Tab Selection & Search */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2rem',
          padding: '1rem',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-sm)'
        }}>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <button
              onClick={() => setActiveTab('llms')}
              className={`btn btn-sm ${activeTab === 'llms' ? 'btn-primary' : 'btn-ghost'}`}
            >
              Free LLM Providers ({FREE_LLM_PROVIDERS.length})
            </button>
            <button
              onClick={() => setActiveTab('youtube')}
              className={`btn btn-sm ${activeTab === 'youtube' ? 'btn-primary' : 'btn-ghost'}`}
            >
              Curated YouTube ({CURATED_YOUTUBE_RESOURCES.length})
            </button>
            <button
              onClick={() => setActiveTab('github')}
              className={`btn btn-sm ${activeTab === 'github' ? 'btn-primary' : 'btn-ghost'}`}
            >
              Open Source Repos ({CURATED_GITHUB_REPOSITORIES.length})
            </button>
            <button
              onClick={() => setActiveTab('articles')}
              className={`btn btn-sm ${activeTab === 'articles' ? 'btn-primary' : 'btn-ghost'}`}
            >
              Articles & Benchmarks ({CURATED_AI_ARTICLES_AND_TOOLS.length})
            </button>
          </div>

          <div style={{ position: 'relative', minWidth: '240px' }}>
            <Search size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.4rem 0.75rem 0.4rem 2.25rem',
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-xs)',
                color: 'var(--text-primary)',
                fontSize: 'var(--text-xs)',
                outline: 'none'
              }}
            />
          </div>
        </div>

        {/* TAB 1: FREE LLM PROVIDERS TABLE */}
        {activeTab === 'llms' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            <TokenCostCalculator />

            <div className="card" style={{ padding: 0, overflow: 'hidden', background: 'var(--bg-secondary)', border: '1px solid var(--border-default)' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Free LLM API Providers Directory
                </h3>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                  Free tiers change frequently — all quotas verified as of the verification date.
                </p>
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 'var(--text-xs)' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    <th style={{ padding: '0.85rem 1.25rem' }}>Provider & Model</th>
                    <th style={{ padding: '0.85rem 1.25rem' }}>Free-Tier Status</th>
                    <th style={{ padding: '0.85rem 1.25rem' }}>API Availability</th>
                    <th style={{ padding: '0.85rem 1.25rem' }}>Limitations</th>
                    <th style={{ padding: '0.85rem 1.25rem' }}>Best Use Case</th>
                    <th style={{ padding: '0.85rem 1.25rem' }}>Last Verified</th>
                    <th style={{ padding: '0.85rem 1.25rem' }}>Link</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLLMs.map((item, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background 150ms' }}>
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{item.provider}</div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>{item.model}</div>
                      </td>
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <span className="badge badge-subtle">{item.freeTierStatus}</span>
                      </td>
                      <td style={{ padding: '1rem 1.25rem', color: 'var(--text-secondary)' }}>
                        {item.apiAvailability}
                      </td>
                      <td style={{ padding: '1rem 1.25rem', color: 'var(--text-muted)', maxWidth: '220px', lineHeight: 1.4 }}>
                        {item.limitations}
                      </td>
                      <td style={{ padding: '1rem 1.25rem', color: 'var(--text-primary)', maxWidth: '260px', lineHeight: 1.4 }}>
                        {item.bestUseCase}
                      </td>
                      <td style={{ padding: '1rem 1.25rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                          <Calendar size={12} />
                          {item.lastVerified}
                        </span>
                      </td>
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <a
                          href={item.docsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-ghost btn-sm"
                          style={{ padding: '0.25rem 0.5rem' }}
                        >
                          <ExternalLink size={13} />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          </div>
        )}

        {/* TAB 2: CURATED YOUTUBE */}
        {activeTab === 'youtube' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
            {filteredYouTube.map((yt, idx) => (
              <div
                key={idx}
                className="card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-default)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span className="badge badge-outline">{yt.category}</span>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{yt.author}</span>
                  </div>

                  <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
                    {yt.title}
                  </h3>

                  <div style={{
                    padding: '0.85rem',
                    background: 'var(--bg-tertiary)',
                    borderRadius: 'var(--radius-xs)',
                    border: '1px solid var(--border-subtle)',
                    marginBottom: '1.25rem'
                  }}>
                    <div style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.3rem', letterSpacing: '0.05em' }}>
                      Why Watch This?
                    </div>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      {yt.whyWatchOrLearn}
                    </p>
                  </div>
                </div>

                <a
                  href={yt.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', width: '100%' }}
                >
                  <Tv size={14} />
                  <span>Watch on YouTube</span>
                  <ExternalLink size={12} style={{ opacity: 0.6 }} />
                </a>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: CURATED GITHUB REPOSITORIES */}
        {activeTab === 'github' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
            {filteredGitHub.map((repo, idx) => (
              <div
                key={idx}
                className="card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-default)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span className="badge badge-outline">{repo.category}</span>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{repo.author}</span>
                  </div>

                  <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
                    {repo.title}
                  </h3>

                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
                    {repo.whyWatchOrLearn}
                  </p>

                  <div style={{
                    padding: '0.75rem',
                    background: 'var(--bg-tertiary)',
                    borderRadius: 'var(--radius-xs)',
                    border: '1px solid var(--border-subtle)',
                    marginBottom: '1.25rem',
                    fontSize: 'var(--text-xs)'
                  }}>
                    <div style={{ color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                      <strong>Prerequisites:</strong> {repo.prerequisites}
                    </div>
                    <div style={{ color: 'var(--text-primary)' }}>
                      <strong>What you learn:</strong> {repo.whatYouWillLearn}
                    </div>
                  </div>
                </div>

                <a
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', width: '100%' }}
                >
                  <GithubIcon size={14} />
                  <span>View Repository</span>
                  <ExternalLink size={12} style={{ opacity: 0.6 }} />
                </a>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: CURATED AI ARTICLES, MCP & BENCHMARKS */}
        {activeTab === 'articles' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
            {filteredArticles.map((article, idx) => (
              <div
                key={idx}
                className="card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-default)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span className="badge badge-outline">{article.category}</span>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{article.author}</span>
                  </div>

                  <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
                    {article.title}
                  </h3>

                  <div style={{
                    padding: '0.85rem',
                    background: 'var(--bg-tertiary)',
                    borderRadius: 'var(--radius-xs)',
                    border: '1px solid var(--border-subtle)',
                    marginBottom: '1.25rem'
                  }}>
                    <div style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.3rem', letterSpacing: '0.05em' }}>
                      Key Takeaway & Relevance
                    </div>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      {article.whyWatchOrLearn}
                    </p>
                  </div>
                </div>

                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', width: '100%' }}
                >
                  <BookOpen size={14} />
                  <span>Open Resource</span>
                  <ExternalLink size={12} style={{ opacity: 0.6 }} />
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
