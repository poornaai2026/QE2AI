import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  ArrowRight, 
  FolderGit2, 
  BookOpen
} from 'lucide-react';

export const RoadmapPage: React.FC = () => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const roadmapSteps = [
    {
      step: 1,
      title: "QE Background",
      tagline: "Solid foundation in Java, Selenium, Appium, APIs & CI/CD",
      description: "You already have the hardest part down: understanding software contracts, automated assertion logic, debugging complex test suites, and orchestrating CI/CD pipelines. This is your foundation.",
      trackId: "01-python-for-ai",
      action: "Review your existing automation assets"
    },
    {
      step: 2,
      title: "Python for AI",
      tagline: "Modern Async Python, Pydantic V2 & FastAPI",
      description: "Transition from legacy scripting to modern asynchronous Python. Master Pydantic V2 for strict type safety and FastAPI for serving high-concurrency API endpoints.",
      trackId: "01-python-for-ai",
      action: "Build FastAPI Test Management API"
    },
    {
      step: 3,
      title: "AI Fundamentals",
      tagline: "Tokens, Context Windows, Parameters & Hallucinations",
      description: "Demystify Generative AI. Understand tokenization (BPE), temperature sampling, context windows, and why LLM outputs are probabilistic next-token predictions.",
      trackId: "02-ai-fundamentals",
      action: "Build LLM Test-Case Generator"
    },
    {
      step: 4,
      title: "LLM Fundamentals",
      tagline: "Foundation Models, Latency vs Cost & Quantization",
      description: "Understand model sizing (7B vs 70B), quantization (4-bit/8-bit), inference optimization, and the differences between proprietary APIs and open-weight models.",
      trackId: "02-ai-fundamentals",
      action: "Benchmark Open vs Closed Models"
    },
    {
      step: 5,
      title: "Prompt Engineering",
      tagline: "Few-Shot, Chain-of-Thought & Defensive Prompts",
      description: "Master structured prompting techniques: Few-Shot prompting, Chain-of-Thought (CoT), ReAct framing, and defending against direct and indirect prompt injection attacks.",
      trackId: "03-llm-engineering",
      action: "Create Injection-Proof Prompt Suite"
    },
    {
      step: 6,
      title: "LLM APIs & Tool Calling",
      tagline: "Instructor, Function Calling & Streaming Responses",
      description: "Integrate Gemini, Claude, and OpenAI APIs into Python code. Enforce guaranteed JSON outputs with Instructor and give models access to executable tools.",
      trackId: "03-llm-engineering",
      action: "Build LLM QE Assistant"
    },
    {
      step: 7,
      title: "RAG & Vector Databases",
      tagline: "Chunking, Vector Search, ChromaDB & Re-ranking",
      description: "Ground LLMs in private documentation: document chunking, generating embeddings, indexing into ChromaDB/Pinecone, BM25 hybrid search, and cross-encoder re-ranking.",
      trackId: "04-rag",
      action: "Build PDF RAG Knowledge Assistant"
    },
    {
      step: 8,
      title: "AI Agents",
      tagline: "Autonomous multi-step reasoning, memory & tools",
      description: "Move past one-shot prompts into autonomous agents that can create execution plans, execute tools, inspect outcomes, and recover from failures.",
      trackId: "05-ai-agents",
      action: "Build AI Test Case Agent"
    },
    {
      step: 9,
      title: "LangGraph State Machines",
      tagline: "Cyclic state graphs, checkpointing & Human-in-the-Loop",
      description: "Build robust multi-actor agents with LangGraph: conditional state transitions, time-travel checkpointing, reflection nodes, and Human-in-the-Loop approval gates.",
      trackId: "05-ai-agents",
      action: "Build Self-Healing Graph Agent"
    },
    {
      step: 10,
      title: "Model Context Protocol (MCP)",
      tagline: "Universal open standard for AI tools and resources",
      description: "Build MCP servers with Python FastMCP. Connect Claude, Cursor, and IDEs directly to Playwright browsers, databases, and continuous integration logs.",
      trackId: "06-mcp",
      action: "Build QE MCP Server"
    },
    {
      step: 11,
      title: "AI + Test Automation",
      tagline: "Playwright + AI Self-Healing Locators",
      description: "Supercharge your Playwright automation suites with AI self-healing locators that automatically detect DOM shifts, repair selectors, and resume test runs.",
      trackId: "08-automation",
      action: "Build Playwright AI Self-Healing Suite"
    },
    {
      step: 12,
      title: "AI Evaluation (AI QE)",
      tagline: "Ragas, DeepEval, Faithfulness & Hallucination Gates",
      description: "The core QE superpower: replace manual prompt checking with automated CI/CD quality gates measuring Faithfulness, Answer Relevance, and Context Precision.",
      trackId: "07-ai-quality-engineering",
      action: "Build AI Quality Gate with Ragas"
    },
    {
      step: 13,
      title: "Deployment & CI/CD",
      tagline: "Docker, GitHub Actions & Serverless Cloud Run",
      description: "Package AI microservices into multi-stage Docker containers, automate testing and deployment in GitHub Actions, and host on Google Cloud Run.",
      trackId: "09-deployment",
      action: "Deploy Containerized AI QE Service"
    },
    {
      step: 14,
      title: "Production AI & Observability",
      tagline: "Semantic Caching, LangSmith Tracing & Guardrails",
      description: "Scale to production: implement Redis semantic caching to slash token costs by 60%, trace multi-step spans with LangSmith, and enforce hard safety guardrails.",
      trackId: "10-production-ai",
      action: "Deploy Production AI QE Platform"
    }
  ];

  const activeStep = roadmapSteps[activeStepIndex];

  return (
    <div className="animate-fade-in" style={{ padding: '3.5rem 0 5rem' }}>
      <div className="container">
        {/* Header */}
        <div style={{ maxWidth: '820px', marginBottom: '3rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span className="badge badge-inverted">START HERE</span>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>14-Stage Structured Pathway</span>
          </div>
          <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, marginBottom: '0.75rem' }}>
            The QE → AI Roadmap
          </h1>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            A Quality Engineer coming from Selenium, Java, Appium, or traditional automation should immediately know where to begin. Follow the recommended learning loop: <code>Learn → Watch → Build → GitHub → Move forward</code>.
          </p>
        </div>

        {/* 2-Column Interactive Roadmap View */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem', alignItems: 'start' }}>
          {/* Column 1: Step List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {roadmapSteps.map((step, idx) => {
              const isActive = idx === activeStepIndex;
              return (
                <div
                  key={step.step}
                  onClick={() => setActiveStepIndex(idx)}
                  className="card card-interactive"
                  style={{
                    padding: '1rem 1.25rem',
                    background: isActive ? 'var(--bg-tertiary)' : 'var(--bg-secondary)',
                    borderColor: isActive ? 'var(--text-primary)' : 'var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                      width: '1.75rem'
                    }}>
                      {step.step.toString().padStart(2, '0')}
                    </span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                        {step.title}
                      </div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                        {step.tagline}
                      </div>
                    </div>
                  </div>
                  <ArrowRight size={14} style={{ opacity: isActive ? 1 : 0.4 }} />
                </div>
              );
            })}
          </div>

          {/* Column 2: Active Step Detail Card */}
          <div style={{ position: 'sticky', top: 'calc(var(--nav-height) + 1.5rem)' }}>
            <div className="card" style={{ padding: '2rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-default)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <span className="badge badge-inverted">Step {activeStep.step} of 14</span>
                <span style={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                  {activeStep.trackId}
                </span>
              </div>

              <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                {activeStep.title}
              </h2>
              <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                {activeStep.tagline}
              </p>

              <div style={{ padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.35rem', fontWeight: 700, letterSpacing: '0.05em' }}>
                  What You Master
                </div>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', lineHeight: 1.6 }}>
                  {activeStep.description}
                </p>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem', fontWeight: 700 }}>
                  Suggested Action & Build
                </div>
                <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle2 size={16} />
                  <span>{activeStep.action}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <Link to={`/tracks#${activeStep.trackId}`} className="btn btn-primary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                  <BookOpen size={14} />
                  <span>Open Track</span>
                </Link>
                <Link to="/projects" className="btn btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                  <FolderGit2 size={14} />
                  <span>View Projects</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
