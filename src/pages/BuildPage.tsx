import React from 'react';
import { Link } from 'react-router-dom';
import { Hammer, ArrowRight, CheckCircle2, Layers, Cpu, Server, Network } from 'lucide-react';
import { Badge } from '../components/common/Badge';

export const BuildPage: React.FC = () => {
  const buildTracks = [
    {
      title: "RAG Systems & Vector Stores",
      category: "Retrieval Architecture",
      icon: Layers,
      color: "cyan",
      description: "Build production RAG pipelines: Document parsing, Markdown-aware chunking, Chroma/Qdrant vector stores, BM25 hybrid search, and cross-encoder re-ranking.",
      projects: ["Jira / Confluence Spec RAG", "OpenAPI Test Matrix Generator", "Semantic Bug Deduplicator"]
    },
    {
      title: "Autonomous Agents & LangGraph",
      category: "Cyclic State Machines",
      icon: Cpu,
      color: "purple",
      description: "Architect stateful agents with reflection loops, sandboxed execution, Human-in-the-Loop approval nodes, and multi-turn persistence with PostgreSQL checkpointers.",
      projects: ["Self-Healing Playwright Agent", "Customer Ops Triage Swarm", "Code Generation Sandbox"]
    },
    {
      title: "Model Context Protocol (MCP) Servers",
      category: "Tool & Context Standards",
      icon: Network,
      color: "emerald",
      description: "Expose enterprise test environments, Kubernetes logs, and internal databases as standardized MCP tools and resources to Claude, Cursor, and custom AI clients.",
      projects: ["QA Environment Inspector Server", "TestRail Execution Server", "PostgreSQL Sandbox Tool"]
    },
    {
      title: "Production AI Gateways & APIs",
      category: "High-Throughput Services",
      icon: Server,
      color: "amber",
      description: "Build FastAPI AI gateways with Redis semantic caching, prompt token compression, dynamic model fallback cascades, and LangSmith tracing.",
      projects: ["Resilient AI Gateway Proxy", "Token Bucket Rate Limiter", "Semantic Prompt Router"]
    }
  ];

  return (
    <div className="animate-fade-in section-padding" style={{ paddingTop: '2.5rem' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '3rem', textAlign: 'center', maxWidth: '750px', marginLeft: 'auto', marginRight: 'auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.25rem 0.75rem', background: 'var(--accent-purple-subtle)', borderRadius: 'var(--radius-full)', border: '1px solid rgba(139, 92, 246, 0.3)', marginBottom: '1rem', fontSize: '0.75rem', color: 'var(--accent-purple)', fontWeight: 600 }}>
            <Hammer size={14} />
            <span>PRACTICAL IMPLEMENTATIONS</span>
          </div>
          <h1 style={{ marginBottom: '1rem' }}>
            Build Real-World <span className="gradient-text">AI Systems</span>
          </h1>
          <p style={{ fontSize: 'var(--text-lg)', color: 'var(--text-secondary)' }}>
            Move beyond simple chat interfaces. Construct resilient, scalable, production-ready AI software blueprints with complete architectural specifications.
          </p>
        </div>

        {/* Tracks Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '1.75rem',
          marginBottom: '3.5rem'
        }}>
          {buildTracks.map(track => {
            const Icon = track.icon;
            return (
              <div key={track.title} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                  <div style={{
                    width: '2.5rem',
                    height: '2.5rem',
                    borderRadius: 'var(--radius-md)',
                    background: `var(--accent-${track.color}-subtle)`,
                    color: `var(--accent-${track.color})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Icon size={20} />
                  </div>
                  <Badge variant={track.color as any}>{track.category}</Badge>
                </div>

                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.65rem', color: 'var(--text-primary)' }}>
                  {track.title}
                </h3>

                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem', flex: 1 }}>
                  {track.description}
                </p>

                <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: '1.25rem' }}>
                  <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                    Blueprint Implementations:
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    {track.projects.map((p, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                        <CheckCircle2 size={13} style={{ color: `var(--accent-${track.color})` }} />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link to="/projects" className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
                  <span>Explore Blueprint Architectures</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
