// Comprehensive Blueprint Data for QE2AI Platform

export interface LearningTrack {
  id: string;
  number: string;
  title: string;
  tagline: string;
  topics: string[];
  suggestedProject: {
    title: string;
    slug: string;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    description: string;
    githubUrl: string;
  };
  keyTakeaways: string[];
  sampleCodeSnippet?: {
    filename: string;
    language: string;
    code: string;
  };
}

export interface MiniProjectDetail {
  slug: string;
  number: string;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  tagline: string;
  trackName: string;
  prerequisites: string[];
  whatYouLearn: string[];
  architectureFlow: string;
  setupSteps: {
    step: string;
    command?: string;
    description: string;
  }[];
  githubUrl: string;
  nextStep: {
    title: string;
    link: string;
    description: string;
  };
  features: string[];
  coreTech: string[];
}

export interface FreeLLMProvider {
  provider: string;
  model: string;
  freeTierStatus: string;
  apiAvailability: string;
  limitations: string;
  bestUseCase: string;
  lastVerified: string;
  docsUrl: string;
}

export interface CuratedResourceItem {
  category: string;
  title: string;
  type: 'youtube' | 'github' | 'doc' | 'course';
  url: string;
  author: string;
  whyWatchOrLearn: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  prerequisites?: string;
  whatYouWillLearn?: string;
}

export const QE2AI_TRACKS: LearningTrack[] = [
  {
    id: "01-python-for-ai",
    number: "01",
    title: "Python for AI",
    tagline: "Move from basic test scripts to asynchronous APIs, data validation, and modern backend services",
    topics: [
      "Python fundamentals & Modern OOP",
      "Robust exception handling & custom error classes",
      "File I/O, streaming JSON, and YAML manipulation",
      "REST APIs, requests, and httpx client libraries",
      "Async Python with asyncio, tasks, and concurrency",
      "Virtual environments & modern packaging (pip, uv, poetry)",
      "Pydantic V2 models, data parsing & validation",
      "FastAPI fundamentals, routers, middleware, and dependency injection"
    ],
    suggestedProject: {
      title: "FastAPI Test Management API",
      slug: "fastapi-test-management",
      difficulty: "Beginner",
      description: "A production-grade REST API backend for managing test suites, test run results, and execution metrics with async endpoints and Pydantic validation.",
      githubUrl: "https://github.com/poornaai2026/QE2AI/tree/main/projects/01-fastapi-test-management"
    },
    keyTakeaways: [
      "Master async/await patterns required for high-throughput LLM streaming.",
      "Use Pydantic V2 to strictly validate untrusted LLM outputs before downstream processing.",
      "Build modular microservices with FastAPI that serve as test harness backends."
    ],
    sampleCodeSnippet: {
      filename: "test_management_api.py",
      language: "python",
      code: `from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
import asyncio

app = FastAPI(title="QE Test Management API", version="1.0.0")

class TestCase(BaseModel):
    id: str
    title: str = Field(..., min_length=5)
    suite: str
    priority: str = Field(pattern="^(P0|P1|P2|P3)$")
    tags: List[str] = []
    is_automated: bool = False

@app.post("/api/v1/test-cases", status_code=status.HTTP_201_CREATED)
async def create_test_case(test_case: TestCase):
    # Async database / vector store insertion
    await asyncio.sleep(0.05)
    return {"status": "created", "data": test_case}`
    }
  },
  {
    id: "02-ai-fundamentals",
    number: "02",
    title: "AI Fundamentals",
    tagline: "Demystify Generative AI, LLM architectures, tokens, and probabilistic output without math fog",
    topics: [
      "AI vs Machine Learning vs Deep Learning",
      "Generative AI mechanics & Foundation Models",
      "How LLMs work: Next-token prediction & autoregression",
      "Tokens, tokenizers (BPE), and context window limits",
      "Model parameters, weights, and quantization (4-bit/8-bit)",
      "Inference vs Training (Pre-training vs Fine-tuning vs RLHF)",
      "Sampling controls: Temperature, Top-p, Top-k, Frequency penalty",
      "Why LLMs hallucinate and how to prevent probabilistic failures"
    ],
    suggestedProject: {
      title: "LLM-Powered Test-Case Generator",
      slug: "llm-testcase-generator",
      difficulty: "Beginner",
      description: "A Python CLI tool that takes software requirement specifications and uses prompt engineering to generate positive, negative, boundary, and edge test scenarios.",
      githubUrl: "https://github.com/poornaai2026/QE2AI/tree/main/projects/02-llm-testcase-generator"
    },
    keyTakeaways: [
      "Understand why testing LLMs requires probabilistic evaluation instead of exact string matching.",
      "Calculate token consumption and cost optimization across context windows.",
      "Control output creativity and variance using temperature and top-p parameters."
    ]
  },
  {
    id: "03-llm-engineering",
    number: "03",
    title: "LLM Engineering",
    tagline: "Harness LLM APIs, function calling, structured outputs, streaming, and multi-model routing",
    topics: [
      "LLM API SDKs (Gemini, Claude, OpenAI, OpenRouter)",
      "Open-source models via Ollama and vLLM",
      "Guaranteed Structured Output with JSON Schema & Instructor",
      "Function Calling & Tool Calling protocols",
      "Real-time token streaming with Server-Sent Events (SSE)",
      "System prompts, role prompting, and Few-Shot conditioning",
      "Cost vs Latency vs Intelligence model selection matrix",
      "Defensive prompt engineering against injections and jailbreaks"
    ],
    suggestedProject: {
      title: "LLM API-Based QE Assistant",
      slug: "llm-qe-assistant",
      difficulty: "Intermediate",
      description: "An intelligent QE assistant that ingests error logs, generates root-cause analysis summaries, and suggests targeted automated test scripts using structured JSON.",
      githubUrl: "https://github.com/poornaai2026/QE2AI/tree/main/projects/03-llm-qe-assistant"
    },
    keyTakeaways: [
      "Enforce 100% reliable JSON outputs using Instructor and Pydantic schema constraints.",
      "Equip LLMs with executable tools that query databases and staging environments.",
      "Implement multi-provider fallback logic to survive API rate limits and downtime."
    ]
  },
  {
    id: "04-rag",
    number: "04",
    title: "Retrieval-Augmented Generation (RAG)",
    tagline: "Connect LLMs to internal documentation, test logs, and Jira tickets with semantic vector search",
    topics: [
      "Vector Embeddings & Semantic Similarity (Cosine, Dot Product)",
      "Document chunking strategies (Fixed, Recursive, Markdown-aware, Semantic)",
      "Vector Databases (ChromaDB, Pinecone, FAISS, Qdrant)",
      "Similarity search, k-NN, and Metadata filtering",
      "Hybrid Search: Combining BM25 keyword search with dense vectors",
      "Cross-Encoder Re-ranking for top-tier retrieval precision",
      "Multimodal RAG (PDFs, Diagrams, Screenshots)",
      "RAG Evaluation: Context Relevance, Faithfulness, and Recall"
    ],
    suggestedProject: {
      title: "PDF RAG / QE Knowledge Assistant",
      slug: "pdf-rag-knowledge-assistant",
      difficulty: "Intermediate",
      description: "A complete RAG system that indexes complex PDF software documentation and architectural diagrams to answer QE queries and generate traceability matrices.",
      githubUrl: "https://github.com/poornaai2026/QE2AI/tree/main/projects/04-pdf-rag-knowledge-assistant"
    },
    keyTakeaways: [
      "Prevent LLM hallucinations by providing verified source context chunks.",
      "Build two-stage retrieval pipelines: Fast hybrid retrieval + Cross-encoder re-ranking.",
      "Index technical documentation and test archives for instant query resolution."
    ]
  },
  {
    id: "05-ai-agents",
    number: "05",
    title: "AI Agents",
    tagline: "Build autonomous multi-step reasoning systems with memory, tool calling, and LangGraph",
    topics: [
      "Agent architectures: ReAct (Reasoning + Acting) & Plan-and-Solve",
      "Tool calling and dynamic tool selection mechanics",
      "Short-term conversation memory vs Long-term vector memory",
      "LangChain & LangGraph state machine orchestration",
      "Multi-agent swarms: Supervisor patterns and worker specialization",
      "Human-in-the-Loop (HITL) pause and approval gates",
      "Self-reflection and autonomous error correction loops",
      "Benchmarking agent trajectory accuracy and tool execution safety"
    ],
    suggestedProject: {
      title: "AI Test Case Agent",
      slug: "ai-test-case-agent",
      difficulty: "Advanced",
      description: "An autonomous LangGraph agent that inspects API endpoints, analyzes response schemas, formulates test plans, and writes executable pytest scripts autonomously.",
      githubUrl: "https://github.com/poornaai2026/QE2AI/tree/main/projects/05-ai-test-case-agent"
    },
    keyTakeaways: [
      "Create resilient cyclic state machines with LangGraph that recover from tool errors.",
      "Implement checkpointing so long-running agent workflows can be paused and resumed.",
      "Add human approval gates before agents trigger destructive environment actions."
    ]
  },
  {
    id: "06-mcp",
    number: "06",
    title: "Model Context Protocol (MCP)",
    tagline: "Master the universal open protocol connecting AI models to tools, databases, and test runners",
    topics: [
      "MCP Architecture: Hosts, Clients, and Servers",
      "The 3 Core Primitives: Resources, Prompts, and Tools",
      "Transport layers: Local STDIO vs Remote Server-Sent Events (SSE)",
      "Developing custom Python MCP servers with FastMCP SDK",
      "MCP + LLM integration: Connecting Claude, Cursor, and IDEs",
      "Building Playwright MCP tools for autonomous browser interaction",
      "Connecting MCP servers to GitHub, Jira, and SQL databases",
      "Security boundaries, sandboxing, and token permissions in MCP"
    ],
    suggestedProject: {
      title: "QE MCP Server",
      slug: "qe-mcp-server",
      difficulty: "Intermediate",
      description: "A custom Model Context Protocol server exposing test automation execution, failure log queries, and database state assertions directly to AI coding assistants.",
      githubUrl: "https://github.com/poornaai2026/QE2AI/tree/main/projects/06-qe-mcp-server"
    },
    keyTakeaways: [
      "Build standard MCP servers that expose your enterprise QA tools to any AI client.",
      "Provide safe read/write interfaces to databases and CI/CD pipelines via MCP tools.",
      "Bridge local automation tools with cloud AI models seamlessly."
    ]
  },
  {
    id: "07-ai-quality-engineering",
    number: "07",
    title: "AI Quality Engineering",
    tagline: "The QE superpower: Benchmarking LLMs, RAG evaluation with Ragas, hallucination testing, and red-teaming",
    topics: [
      "AI-generated test cases & Synthetic test data synthesis",
      "UI & API intelligent testing workflows",
      "Self-healing automation & dynamic locator repair",
      "Defect root-cause analysis using LLMs",
      "LLM Evaluation metrics: Faithfulness, Answer Relevance, Context Recall",
      "Ragas & DeepEval evaluation frameworks in CI/CD",
      "Hallucination detection & requirement coverage quality gates",
      "AI Security testing: Prompt injection, jailbreaking, and bias audits"
    ],
    suggestedProject: {
      title: "AI-Powered QE Evaluation Agent",
      slug: "ai-powered-qe-eval-agent",
      difficulty: "Advanced",
      description: "An automated evaluation pipeline that benchmarks LLM application responses against golden datasets using Ragas, computing faithfulness and blocking regressions in CI.",
      githubUrl: "https://github.com/poornaai2026/QE2AI/tree/main/projects/07-ai-powered-qe-eval-agent"
    },
    keyTakeaways: [
      "Replace subjective prompt reviews with automated, quantitative evaluation scores.",
      "Implement statistical quality gates in CI/CD to block prompt regressions.",
      "Red-team LLM applications for prompt injection and security vulnerabilities."
    ]
  },
  {
    id: "08-automation",
    number: "08",
    title: "Automation (Playwright + AI)",
    tagline: "Supercharge modern browser & API automation with Playwright, Python, and AI self-healing",
    topics: [
      "Modern Playwright architecture & Python async bindings",
      "Page Object Model (POM) and modular test architecture",
      "Playwright MCP integration for AI-driven browser navigation",
      "Self-healing locators using vision and DOM tree semantic parsing",
      "API automation with Playwright request contexts",
      "Visual regression testing with pixel diffing and AI visual inspection",
      "Headless CI/CD containerized execution in GitHub Actions",
      "Allure and HTML test telemetry reporting"
    ],
    suggestedProject: {
      title: "AI + Playwright Workflow",
      slug: "playwright-ai-workflow",
      difficulty: "Intermediate",
      description: "An end-to-end Playwright automation framework enhanced with AI self-healing locators that automatically recovers and continues when UI selectors change.",
      githubUrl: "https://github.com/poornaai2026/QE2AI/tree/main/projects/08-playwright-ai-workflow"
    },
    keyTakeaways: [
      "Write bulletproof, asynchronous Playwright automation in Python.",
      "Integrate AI healing algorithms to prevent brittle locator test failures.",
      "Run containerized test suites in parallel in CI/CD pipelines."
    ]
  },
  {
    id: "09-deployment",
    number: "09",
    title: "Deployment & Cloud AI",
    tagline: "Containerize, deploy, and scale AI applications using Docker, GitHub Actions, FastAPI, and Cloud Run",
    topics: [
      "FastAPI production servers with Uvicorn and Gunicorn workers",
      "Docker containerization for AI & test automation workloads",
      "Multi-stage Dockerfiles for optimized image sizes",
      "Docker Compose for multi-container local environments",
      "GitHub Actions CI/CD workflows, caching, and secret management",
      "GCP Vertex AI, AWS Bedrock, and Azure OpenAI cloud deployments",
      "Serverless deployment on Google Cloud Run & AWS ECS",
      "Structured JSON logging, OpenTelemetry, and container health checks"
    ],
    suggestedProject: {
      title: "Deploy an AI QE Application",
      slug: "deploy-ai-qe-app",
      difficulty: "Intermediate",
      description: "A complete Dockerized microservice deploying an AI test generator to Google Cloud Run with automated GitHub Actions CI/CD pipeline and secrets management.",
      githubUrl: "https://github.com/poornaai2026/QE2AI/tree/main/projects/09-deploy-ai-qe-app"
    },
    keyTakeaways: [
      "Package Python AI services into lean, production-ready Docker containers.",
      "Automate build, test, and deployment workflows with GitHub Actions.",
      "Deploy serverless AI backends with automated autoscaling and secret encryption."
    ]
  },
  {
    id: "10-production-ai",
    number: "10",
    title: "Production AI",
    tagline: "Build enterprise-grade AI platforms with observability, token cost control, guardrails, and SLAs",
    topics: [
      "Production LLM Observability & Distributed Tracing (LangSmith, Langfuse)",
      "Token budget management, cost tracking, and optimization",
      "Reliability engineering: Exponential backoff, jitter, and fallback circuits",
      "Semantic caching with Redis to eliminate redundant LLM calls",
      "Safety guardrails (NeMo Guardrails, Llama Guard) for input/output sanitization",
      "Model drift monitoring and continuous evaluation",
      "Production SLAs, latency benchmarking, and streaming performance",
      "Enterprise governance, data privacy, and zero-retention policies"
    ],
    suggestedProject: {
      title: "Production-Ready AI QE Platform",
      slug: "production-ai-qe-platform",
      difficulty: "Advanced",
      description: "An enterprise AI platform featuring Redis semantic caching, LangSmith distributed tracing, automated safety guardrails, and real-time cost telemetry.",
      githubUrl: "https://github.com/poornaai2026/QE2AI/tree/main/projects/10-production-ai-qe-platform"
    },
    keyTakeaways: [
      "Slash LLM API costs by up to 60% using Redis semantic vector caching.",
      "Monitor full-trace latency and token consumption with LangSmith/Langfuse.",
      "Enforce hard guardrails to protect enterprise systems from malicious inputs."
    ]
  }
];

export const QE2AI_PROJECTS: MiniProjectDetail[] = [
  {
    slug: "fastapi-test-management",
    number: "01",
    title: "FastAPI Test Management API",
    difficulty: "Beginner",
    tagline: "High-performance async REST API for managing test cases, test suites, and execution runs",
    trackName: "01 — Python for AI",
    prerequisites: ["Python 3.10+", "Basic understanding of REST APIs", "Terminal/CLI basics"],
    whatYouLearn: [
      "Building async REST APIs with FastAPI and Pydantic V2",
      "Strict request/response validation with typed schemas",
      "Designing clean CRUD architectures with SQLite/SQLAlchemy",
      "Automated API testing with pytest and httpx"
    ],
    architectureFlow: "HTTP Client (cURL / Frontend) ──▶ FastAPI Async Router ──▶ Pydantic V2 Validator ──▶ SQLite / In-Memory Store ──▶ JSON Response + OpenAPI Swagger Docs",
    setupSteps: [
      { step: "1. Clone Repository", command: "git clone https://github.com/poornaai2026/QE2AI.git", description: "Clone the master QE2AI mono-repo." },
      { step: "2. Navigate to Project", command: "cd QE2AI/projects/01-fastapi-test-management", description: "Enter project folder." },
      { step: "3. Create Environment", command: "python -m venv venv && source venv/bin/activate  # (Windows: .\\venv\\Scripts\\activate)", description: "Isolate dependencies." },
      { step: "4. Install Dependencies", command: "pip install -r requirements.txt", description: "Installs FastAPI, Uvicorn, Pydantic, and pytest." },
      { step: "5. Run Server", command: "uvicorn main:app --reload --port 8000", description: "Starts development server with Swagger UI at http://127.0.0.1:8000/docs." }
    ],
    githubUrl: "https://github.com/poornaai2026/QE2AI/tree/main/projects/01-fastapi-test-management",
    nextStep: {
      title: "Track 02: AI Fundamentals",
      link: "/tracks#02-ai-fundamentals",
      description: "Learn how LLMs generate text and connect your API to an LLM test generator."
    },
    features: [
      "Asynchronous CRUD endpoints for test cases and execution runs",
      "Auto-generated interactive Swagger UI and OpenAPI documentation",
      "Pydantic V2 schema validation preventing malformed payload insertion",
      "100% test coverage with async pytest suite"
    ],
    coreTech: ["Python 3.11", "FastAPI", "Pydantic V2", "Uvicorn", "pytest", "httpx"]
  },
  {
    slug: "llm-testcase-generator",
    number: "02",
    title: "LLM-Powered Test-Case Generator",
    difficulty: "Beginner",
    tagline: "CLI tool converting unstructured software requirements into comprehensive test suites using LLMs",
    trackName: "02 — AI Fundamentals",
    prerequisites: ["Python 3.10+", "Free Gemini API Key or Groq API Key"],
    whatYouLearn: [
      "Controlling LLM generation via Temperature and System Prompts",
      "Structuring prompts for positive, negative, and edge test case coverage",
      "Token count tracking and API cost estimation",
      "Saving generated test cases to Markdown, JSON, and CSV formats"
    ],
    architectureFlow: "Requirement PRD / Story ──▶ Prompt Template Builder ──▶ LLM API (Gemini Flash / OpenAI) ──▶ Output Parser ──▶ Structured Test Matrix (.md / .json)",
    setupSteps: [
      { step: "1. Clone Repository", command: "git clone https://github.com/poornaai2026/QE2AI.git", description: "Clone the mono-repo." },
      { step: "2. Navigate to Project", command: "cd QE2AI/projects/02-llm-testcase-generator", description: "Enter project folder." },
      { step: "3. Configure API Key", command: "export GEMINI_API_KEY='your_api_key_here'", description: "Set your free Google AI Studio key." },
      { step: "4. Run Generator", command: "python generate_tests.py --input sample_story.txt --output tests.json", description: "Executes test case generation." }
    ],
    githubUrl: "https://github.com/poornaai2026/QE2AI/tree/main/projects/02-llm-testcase-generator",
    nextStep: {
      title: "Track 03: LLM Engineering",
      link: "/tracks#03-llm-engineering",
      description: "Upgrade from basic prompts to strict JSON schemas and tool calling."
    },
    features: [
      "Generates positive, negative, boundary, and security test cases automatically",
      "Outputs formatted BDD Gherkin scenarios or standard QA test matrices",
      "Token counter displaying exact token usage and cost per generation",
      "CLI flags for controlling temperature and model selection"
    ],
    coreTech: ["Python 3.11", "Google GenAI SDK", "Click / Typer CLI", "Rich Terminal UI"]
  },
  {
    slug: "llm-qe-assistant",
    number: "03",
    title: "LLM API-Based QE Assistant",
    difficulty: "Intermediate",
    tagline: "Failure log analyzer and root-cause assistant powered by structured outputs and tool calling",
    trackName: "03 — LLM Engineering",
    prerequisites: ["Python 3.11", "LLM API Key", "Familiarity with JSON Schema"],
    whatYouLearn: [
      "Guaranteed JSON outputs with Instructor and Pydantic",
      "Function calling for querying test results and error databases",
      "Real-time token streaming with Server-Sent Events (SSE)",
      "Automated root-cause analysis from stack traces"
    ],
    architectureFlow: "Test Failure Log / Stack Trace ──▶ Instructor + Pydantic Parser ──▶ LLM Reasoning ──▶ Tool Execution (Fetch CI Logs) ──▶ Structured RCA & Fix Recommendations",
    setupSteps: [
      { step: "1. Clone Repository", command: "git clone https://github.com/poornaai2026/QE2AI.git", description: "Clone the mono-repo." },
      { step: "2. Navigate to Project", command: "cd QE2AI/projects/03-llm-qe-assistant", description: "Enter project folder." },
      { step: "3. Install Dependencies", command: "pip install -r requirements.txt", description: "Installs Instructor, Pydantic, and OpenAI SDK." },
      { step: "4. Run Assistant", command: "python assistant.py --log sample_error.log", description: "Analyzes error log with structured JSON output." }
    ],
    githubUrl: "https://github.com/poornaai2026/QE2AI/tree/main/projects/03-llm-qe-assistant",
    nextStep: {
      title: "Track 04: RAG",
      link: "/tracks#04-rag",
      description: "Add private enterprise documentation indexing with Vector Databases."
    },
    features: [
      "Guaranteed typed JSON output conforming to strict Pydantic schemas",
      "Tool calling capability to look up known bug tickets in Jira/mock DB",
      "Automated categorization of failure types (flaky, locator change, API 500, regression)",
      "Streaming CLI interface with markdown rendering"
    ],
    coreTech: ["Python 3.11", "Instructor", "Pydantic V2", "OpenAI / Anthropic SDK", "Rich"]
  },
  {
    slug: "pdf-rag-knowledge-assistant",
    number: "04",
    title: "PDF RAG / QE Knowledge Assistant",
    difficulty: "Intermediate",
    tagline: "Index complex product documentation and PDFs into ChromaDB to answer QE queries with source citations",
    trackName: "04 — RAG",
    prerequisites: ["Python 3.11", "Basic Vector Database concepts", "OpenAI / Gemini Key"],
    whatYouLearn: [
      "Document chunking and header-aware splitting",
      "Vector embeddings with sentence-transformers / OpenAI embeddings",
      "Vector indexing and similarity search in ChromaDB",
      "Cross-encoder re-ranking and source citation generation"
    ],
    architectureFlow: "Product PDF Docs ──▶ PyMuPDF Extractor ──▶ Semantic Chunker ──▶ ChromaDB Vector Store ──▶ Hybrid Retriever ──▶ Cross-Encoder Re-ranker ──▶ Grounded QA Answer",
    setupSteps: [
      { step: "1. Clone Repository", command: "git clone https://github.com/poornaai2026/QE2AI.git", description: "Clone the mono-repo." },
      { step: "2. Navigate to Project", command: "cd QE2AI/projects/04-pdf-rag-knowledge-assistant", description: "Enter project folder." },
      { step: "3. Index Documents", command: "python ingest.py --data ./docs", description: "Chunks and indexes PDF documents into ChromaDB." },
      { step: "4. Query Assistant", command: "python query.py --question 'What are the password validation rules?'", description: "Retrieves answers with exact page citations." }
    ],
    githubUrl: "https://github.com/poornaai2026/QE2AI/tree/main/projects/04-pdf-rag-knowledge-assistant",
    nextStep: {
      title: "Track 05: AI Agents",
      link: "/tracks#05-ai-agents",
      description: "Evolve your RAG pipeline into an autonomous multi-step agent."
    },
    features: [
      "PDF parsing preserving tables and section hierarchies",
      "Embedded ChromaDB database running 100% locally with zero cloud dependencies",
      "Source citation highlighting exact document, chapter, and page numbers",
      "Hybrid search combining BM25 keyword matching with dense embeddings"
    ],
    coreTech: ["Python 3.11", "ChromaDB", "PyMuPDF", "Sentence-Transformers", "LangChain"]
  },
  {
    slug: "ai-test-case-agent",
    number: "05",
    title: "AI Test Case Agent",
    difficulty: "Advanced",
    tagline: "Autonomous LangGraph agent that reads API specs, inspects endpoints, and writes executable test suites",
    trackName: "05 — AI Agents",
    prerequisites: ["Python 3.11", "Understanding of LangGraph / LangChain", "FastAPI / Pytest"],
    whatYouLearn: [
      "State machines and conditional routing in LangGraph",
      "Building cyclic reflection loops where agents test and fix their own code",
      "Human-in-the-Loop approval nodes before code deployment",
      "Agent memory management and multi-turn state persistence"
    ],
    architectureFlow: "OpenAPI Spec ──▶ LangGraph Planner Node ──▶ Tool Execution Node (Send Requests) ──▶ Test Generator Node ──▶ Reflection Sandbox (Run Pytest) ──▶ Pass / Self-Correct Edge",
    setupSteps: [
      { step: "1. Clone Repository", command: "git clone https://github.com/poornaai2026/QE2AI.git", description: "Clone the mono-repo." },
      { step: "2. Navigate to Project", command: "cd QE2AI/projects/05-ai-test-case-agent", description: "Enter project folder." },
      { step: "3. Install Dependencies", command: "pip install -r requirements.txt", description: "Installs LangGraph, LangChain, and pytest." },
      { step: "4. Run Agent", command: "python agent.py --spec http://127.0.0.1:8000/openapi.json", description: "Generates and validates test suites autonomously." }
    ],
    githubUrl: "https://github.com/poornaai2026/QE2AI/tree/main/projects/05-ai-test-case-agent",
    nextStep: {
      title: "Track 06: MCP",
      link: "/tracks#06-mcp",
      description: "Expose your agent's tools over the universal Model Context Protocol standard."
    },
    features: [
      "Cyclic LangGraph state graph with self-reflection and error recovery",
      "Autonomous sandbox execution validating generated test syntax with pytest",
      "SQLite state checkpointing supporting workflow pause and resume",
      "Human-in-the-loop review prompt before saving new test files"
    ],
    coreTech: ["Python 3.11", "LangGraph", "LangChain", "pytest", "SQLite Checkpointer"]
  },
  {
    slug: "qe-mcp-server",
    number: "06",
    title: "QE MCP Server",
    difficulty: "Intermediate",
    tagline: "Expose QA automation, database checks, and test runner tools via Anthropic's Model Context Protocol",
    trackName: "06 — MCP",
    prerequisites: ["Python 3.11", "Basic understanding of JSON-RPC and MCP concepts"],
    whatYouLearn: [
      "Building Model Context Protocol servers using FastMCP",
      "Exposing resources, prompts, and tools to AI clients (Claude Desktop, Cursor)",
      "Connecting MCP servers to Playwright and database connections",
      "Security sandboxing for MCP tool executions"
    ],
    architectureFlow: "AI Host (Claude Desktop / Cursor / Antigravity) ──▶ MCP Client ──▶ STDIO / SSE JSON-RPC ──▶ QE FastMCP Server ──▶ Tools (Run Playwright / Query Test DB / Parse Logs)",
    setupSteps: [
      { step: "1. Clone Repository", command: "git clone https://github.com/poornaai2026/QE2AI.git", description: "Clone the mono-repo." },
      { step: "2. Navigate to Project", command: "cd QE2AI/projects/06-qe-mcp-server", description: "Enter project folder." },
      { step: "3. Install MCP SDK", command: "pip install mcp fastmcp playwright", description: "Installs official FastMCP SDK." },
      { step: "4. Launch Server", command: "fastmcp dev server.py", description: "Launches server with MCP Inspector test UI." },
      { step: "5. Configure Host", command: "mcp install server.py", description: "Registers server with Claude Desktop / Cursor." }
    ],
    githubUrl: "https://github.com/poornaai2026/QE2AI/tree/main/projects/06-qe-mcp-server",
    nextStep: {
      title: "Track 07: AI Quality Engineering",
      link: "/tracks#07-ai-quality-engineering",
      description: "Master automated evaluation, Ragas, and LLM quality gates."
    },
    features: [
      "Standard MCP tools: `run_test_suite`, `inspect_dom_element`, `query_test_logs`, `assert_db_state`",
      "MCP Resources exposing real-time execution logs and test reports",
      "Ready-to-use configuration files for Claude Desktop and Cursor IDE",
      "Strict parameter validation using Pydantic models"
    ],
    coreTech: ["Python 3.11", "FastMCP", "Model Context Protocol SDK", "Playwright", "Pydantic"]
  },
  {
    slug: "ai-powered-qe-eval-agent",
    number: "07",
    title: "AI-Powered QE Evaluation Agent",
    difficulty: "Advanced",
    tagline: "Automated LLM quality gate in CI/CD computing Faithfulness, Relevance, and Hallucination metrics with Ragas",
    trackName: "07 — AI Quality Engineering",
    prerequisites: ["Python 3.11", "Ragas / DeepEval basics", "GitHub Actions knowledge"],
    whatYouLearn: [
      "The RAG Triad evaluation metrics (Faithfulness, Context Precision, Recall)",
      "Writing Pytest evaluation fixtures with DeepEval and Ragas",
      "Calibrating LLM-as-a-Judge models to prevent scoring bias",
      "Blocking prompt regressions automatically in GitHub Actions CI/CD"
    ],
    architectureFlow: "Git PR / Prompt Update ──▶ GitHub Action ──▶ AI Quality Gate (Pytest) ──▶ Ragas / DeepEval Evaluator ──▶ Threshold Check (Faithfulness >= 0.88) ──▶ PR Pass / Block",
    setupSteps: [
      { step: "1. Clone Repository", command: "git clone https://github.com/poornaai2026/QE2AI.git", description: "Clone the mono-repo." },
      { step: "2. Navigate to Project", command: "cd QE2AI/projects/07-ai-powered-qe-eval-agent", description: "Enter project folder." },
      { step: "3. Install Dependencies", command: "pip install -r requirements.txt", description: "Installs Ragas, DeepEval, datasets, and pytest." },
      { step: "4. Run Quality Gate", command: "pytest test_eval_gate.py --benchmark", description: "Runs automated benchmark against golden evaluation dataset." }
    ],
    githubUrl: "https://github.com/poornaai2026/QE2AI/tree/main/projects/07-ai-powered-qe-eval-agent",
    nextStep: {
      title: "Track 08: Automation",
      link: "/tracks#08-automation",
      description: "Combine AI with Playwright for intelligent self-healing test automation."
    },
    features: [
      "Automated evaluation across Faithfulness, Answer Relevance, Context Precision, and Hallucination",
      "Golden dataset containing 100+ version-controlled edge cases and ground-truth assertions",
      "GitHub Actions workflow file that annotates PRs with visual score cards",
      "Custom pytest plugin formatting LLM evaluation results into JUnit XML"
    ],
    coreTech: ["Python 3.11", "Ragas", "DeepEval", "pytest", "GitHub Actions", "pandas"]
  },
  {
    slug: "playwright-ai-workflow",
    number: "08",
    title: "AI + Playwright Workflow",
    difficulty: "Intermediate",
    tagline: "Resilient UI automation framework with AI-assisted self-healing selectors and visual diff verification",
    trackName: "08 — Automation",
    prerequisites: ["Python 3.11", "Playwright Python", "Basic HTML/DOM knowledge"],
    whatYouLearn: [
      "Modern async Playwright framework architecture",
      "Dynamic selector self-healing using AI semantic similarity",
      "Visual testing and screenshot diffing",
      "Parallel headless execution in Docker containers"
    ],
    architectureFlow: "Playwright Test Run ──▶ Element Selector Fails (NoSuchElementException) ──▶ AI DOM Analyzer ──▶ Semantic Candidate Matching ──▶ Self-Heal & Resume ──▶ Log Recovery",
    setupSteps: [
      { step: "1. Clone Repository", command: "git clone https://github.com/poornaai2026/QE2AI.git", description: "Clone the mono-repo." },
      { step: "2. Navigate to Project", command: "cd QE2AI/projects/08-playwright-ai-workflow", description: "Enter project folder." },
      { step: "3. Install Playwright", command: "pip install -r requirements.txt && playwright install chromium", description: "Installs browser binaries." },
      { step: "4. Execute Suite", command: "pytest tests/ --headed", description: "Executes self-healing Playwright test suite." }
    ],
    githubUrl: "https://github.com/poornaai2026/QE2AI/tree/main/projects/08-playwright-ai-workflow",
    nextStep: {
      title: "Track 09: Deployment",
      link: "/tracks#09-deployment",
      description: "Package your automation and AI services into Docker and deploy to cloud."
    },
    features: [
      "Self-healing locator plugin that fixes broken CSS/XPath selectors at runtime",
      "Page Object Model (POM) architecture with typed page classes",
      "Automatic video recording and trace capturing on test failures",
      "Async execution running tests 3x faster than synchronous frameworks"
    ],
    coreTech: ["Python 3.11", "Playwright", "pytest-asyncio", "BeautifulSoup4", "Docker"]
  },
  {
    slug: "deploy-ai-qe-app",
    number: "09",
    title: "Deploy an AI QE Application",
    difficulty: "Intermediate",
    tagline: "Containerize and deploy an AI QE microservice to Google Cloud Run with automated CI/CD pipelines",
    trackName: "09 — Deployment",
    prerequisites: ["Docker installed", "GitHub account", "Basic Cloud/GCP concepts"],
    whatYouLearn: [
      "Writing multi-stage production Dockerfiles for Python AI apps",
      "Docker Compose multi-service architecture (FastAPI + Redis + App)",
      "Automated CI/CD build and deploy workflows with GitHub Actions",
      "Deploying serverless containers to Google Cloud Run"
    ],
    architectureFlow: "Git Push (main) ──▶ GitHub Action ──▶ Docker Build & Scan ──▶ Google Artifact Registry ──▶ Cloud Run Deploy ──▶ HTTPS Serverless Endpoint",
    setupSteps: [
      { step: "1. Clone Repository", command: "git clone https://github.com/poornaai2026/QE2AI.git", description: "Clone the mono-repo." },
      { step: "2. Navigate to Project", command: "cd QE2AI/projects/09-deploy-ai-qe-app", description: "Enter project folder." },
      { step: "3. Build Docker Image", command: "docker build -t qe-ai-service:latest .", description: "Builds production container." },
      { step: "4. Run with Docker Compose", command: "docker compose up -d", description: "Starts app and dependencies locally." }
    ],
    githubUrl: "https://github.com/poornaai2026/QE2AI/tree/main/projects/09-deploy-ai-qe-app",
    nextStep: {
      title: "Track 10: Production AI",
      link: "/tracks#10-production-ai",
      description: "Add observability, semantic caching, and production guardrails."
    },
    features: [
      "Production multi-stage Dockerfile resulting in a sub-150MB image",
      "Ready-to-use Docker Compose environment with Redis caching layer",
      "Complete GitHub Actions CI/CD pipeline template with secret injection",
      "Health check endpoints (`/healthz`, `/readyz`) for zero-downtime rollouts"
    ],
    coreTech: ["Docker", "Docker Compose", "FastAPI", "GitHub Actions", "Google Cloud Run"]
  },
  {
    slug: "production-ai-qe-platform",
    number: "10",
    title: "Production-Ready AI QE Platform",
    difficulty: "Advanced",
    tagline: "Enterprise AI gateway featuring Redis semantic caching, LangSmith tracing, and safety guardrails",
    trackName: "10 — Production AI",
    prerequisites: ["Python 3.11", "Redis", "LangSmith account (free)", "FastAPI"],
    whatYouLearn: [
      "Implementing Redis semantic caching with cosine similarity thresholds",
      "Distributed tracing and latency span monitoring with LangSmith",
      "Token cost tracking, rate limiting, and provider fallback circuits",
      "Implementing input/output safety guardrails against malicious prompts"
    ],
    architectureFlow: "Client Query ──▶ Safety Guardrail ──▶ Redis Semantic Cache (Hit -> Instant Return) ──▶ Miss: LLM Router ──▶ LLM API ──▶ LangSmith Trace Span ──▶ Client",
    setupSteps: [
      { step: "1. Clone Repository", command: "git clone https://github.com/poornaai2026/QE2AI.git", description: "Clone the mono-repo." },
      { step: "2. Navigate to Project", command: "cd QE2AI/projects/10-production-ai-qe-platform", description: "Enter project folder." },
      { step: "3. Start Stack", command: "docker compose up -d", description: "Starts Redis and FastAPI platform." },
      { step: "4. Run Load Test", command: "python benchmark_cache.py", description: "Measures 90% latency drop on cached queries." }
    ],
    githubUrl: "https://github.com/poornaai2026/QE2AI/tree/main/projects/10-production-ai-qe-platform",
    nextStep: {
      title: "QE → AI Career & Community",
      link: "/about",
      description: "Explore the author journey and share your feedback on the QE2AI platform."
    },
    features: [
      "Redis semantic caching slashing API latency from 1.8s to 12ms for repeat queries",
      "Automated LangSmith telemetry tracing every prompt, token count, and error",
      "Circuit breaker automatically failing over to secondary LLM provider during outages",
      "Configurable input guardrails detecting prompt injection and PII leakage"
    ],
    coreTech: ["Python 3.11", "Redis", "LangSmith", "FastAPI", "Pydantic", "Docker"]
  }
];

export const FREE_LLM_PROVIDERS: FreeLLMProvider[] = [
  {
    provider: "Google AI Studio",
    model: "Gemini 1.5 Flash / Gemini 1.5 Pro",
    freeTierStatus: "Active (Generous)",
    apiAvailability: "Yes (REST API & Python SDK)",
    limitations: "15 RPM (Requests per minute), 1M TPM (Tokens per min), 1,500 RPD",
    bestUseCase: "Long-context RAG (up to 1M tokens), fast test generation, vision inspection",
    lastVerified: "March 2025",
    docsUrl: "https://aistudio.google.com/"
  },
  {
    provider: "Groq",
    model: "Llama 3.3 70B / Mixtral 8x7B",
    freeTierStatus: "Active (Ultra Fast)",
    apiAvailability: "Yes (OpenAI-compatible API)",
    limitations: "30 RPM, 6,000 TPM (varies by model), hourly burst limits",
    bestUseCase: "Ultra-low latency generation (500+ tokens/sec), test execution analysis",
    lastVerified: "March 2025",
    docsUrl: "https://console.groq.com/"
  },
  {
    provider: "OpenRouter",
    model: "Free Model Pool (DeepSeek R1, Llama 3.3, Mistral)",
    freeTierStatus: "Active (Aggregator)",
    apiAvailability: "Yes (OpenAI-compatible API)",
    limitations: "20 RPM, free models labeled with `:free` suffix",
    bestUseCase: "Testing multi-model routing, reasoning models (DeepSeek R1 free tier)",
    lastVerified: "March 2025",
    docsUrl: "https://openrouter.ai/"
  },
  {
    provider: "Cloudflare Workers AI",
    model: "Llama 3.2 3B / Mistral 7B / Embeddings",
    freeTierStatus: "Active (Daily Allocation)",
    apiAvailability: "Yes (REST API & Workers)",
    limitations: "10,000 Neurons/day (~free for daily prototyping)",
    bestUseCase: "Edge inference, free vector embeddings for RAG prototyping",
    lastVerified: "March 2025",
    docsUrl: "https://developers.cloudflare.com/workers-ai/"
  },
  {
    provider: "Cohere",
    model: "Embed v3 / Rerank v3",
    freeTierStatus: "Active (Trial Key)",
    apiAvailability: "Yes (Python SDK)",
    limitations: "1,000 API calls/month on trial key (non-production)",
    bestUseCase: "State-of-the-art Cross-Encoder Re-ranking and multilingual embeddings",
    lastVerified: "March 2025",
    docsUrl: "https://cohere.com/"
  },
  {
    provider: "Hugging Face Inference API",
    model: "Thousands of Open Models",
    freeTierStatus: "Active (Serverless)",
    apiAvailability: "Yes (HTTP API)",
    limitations: "Rate limited based on shared cluster load; cold starts",
    bestUseCase: "Testing open-source niche models, tokenizers, and small classifiers",
    lastVerified: "March 2025",
    docsUrl: "https://huggingface.co/inference-api"
  }
];

export const CURATED_YOUTUBE_RESOURCES: CuratedResourceItem[] = [
  {
    category: "AI Fundamentals",
    title: "Let's build GPT: from scratch, in code, spelled out",
    type: "youtube",
    url: "https://www.youtube.com/watch?v=kCc8FmEb1nY",
    author: "Andrej Karpathy",
    whyWatchOrLearn: "The gold standard for understanding tokenization, self-attention, and transformer architectures step-by-step in clean Python without confusing academic math.",
    difficulty: "Beginner"
  },
  {
    category: "AI Fundamentals",
    title: "Visualizing Attention and Transformer Architecture",
    type: "youtube",
    url: "https://www.youtube.com/watch?v=eMlx5fFNoYc",
    author: "3Blue1Brown",
    whyWatchOrLearn: "World-class visual animations explaining the geometric intuition behind vectors, high-dimensional spaces, dot products, and multi-head attention.",
    difficulty: "Beginner"
  },
  {
    category: "RAG & Vector DBs",
    title: "Advanced RAG: Chunking, Vector Databases, and Re-ranking",
    type: "youtube",
    url: "https://www.youtube.com/watch?v=wd7TZ4w1mSw",
    author: "LangChain",
    whyWatchOrLearn: "Explains how to move beyond naive RAG into hybrid search, parent document retrievers, and cross-encoder re-ranking for enterprise knowledge bases.",
    difficulty: "Intermediate"
  },
  {
    category: "Agents & LangGraph",
    title: "LangGraph Crash Course: Build Cyclic Multi-Agent Systems",
    type: "youtube",
    url: "https://www.youtube.com/watch?v=9Ayk5mRvdB8",
    author: "Harrison Chase (LangChain)",
    whyWatchOrLearn: "Understand why linear chains fail for real-world tasks and how state graphs, conditional routing, reflection, and human-in-the-loop work.",
    difficulty: "Intermediate"
  },
  {
    category: "Model Context Protocol (MCP)",
    title: "Model Context Protocol (MCP) Explained for Developers",
    type: "youtube",
    url: "https://www.youtube.com/watch?v=mcp-overview",
    author: "Anthropic Developer Hub",
    whyWatchOrLearn: "Anthropic engineers explain the architecture of MCP: how tools, prompts, and resources connect LLMs to databases, terminals, and test runners.",
    difficulty: "Beginner"
  },
  {
    category: "AI Quality & Evaluation",
    title: "How to Evaluate LLMs and RAG in Production with DeepEval",
    type: "youtube",
    url: "https://www.youtube.com/watch?v=deepeval-eval",
    author: "Confident AI",
    whyWatchOrLearn: "Step-by-step walkthrough showing QA engineers how to write unit tests for Faithfulness, Hallucination, and G-Eval scoring in Pytest and CI/CD.",
    difficulty: "Intermediate"
  }
];

export const CURATED_GITHUB_REPOSITORIES: CuratedResourceItem[] = [
  {
    category: "AI Quality & Evaluation",
    title: "Ragas: Evaluation framework for Retrieval Augmented Generation",
    type: "github",
    url: "https://github.com/explodinggradients/ragas",
    author: "Exploding Gradients",
    whyWatchOrLearn: "Standard open-source framework for measuring RAG Triad metrics (Faithfulness, Relevance, Precision) and synthetic dataset generation.",
    difficulty: "Intermediate",
    prerequisites: "Python 3.10+, RAG basics",
    whatYouWillLearn: "Automated LLM quality benchmarking, synthetic test case synthesis, and CI/CD regression gates."
  },
  {
    category: "AI Quality & Evaluation",
    title: "DeepEval: The Open-Source LLM Evaluation Framework",
    type: "github",
    url: "https://github.com/confident-ai/deepeval",
    author: "Confident AI",
    whyWatchOrLearn: "Production-ready testing framework providing Pytest integration for hallucination metrics, G-Eval custom criteria, and toxicity testing.",
    difficulty: "Intermediate",
    prerequisites: "Python, Pytest basics",
    whatYouWillLearn: "Writing deterministic unit tests for non-deterministic LLMs and generating test reports in GitHub Actions."
  },
  {
    category: "Model Context Protocol (MCP)",
    title: "Official Model Context Protocol Servers Repository",
    type: "github",
    url: "https://github.com/modelcontextprotocol/servers",
    author: "Anthropic / ModelContextProtocol Org",
    whyWatchOrLearn: "Reference implementations of standard MCP servers including Playwright, PostgreSQL, Filesystem, GitHub, and Memory.",
    difficulty: "Intermediate",
    prerequisites: "Node.js or Python",
    whatYouWillLearn: "How to build, test, and package MCP tool servers conforming to the standard."
  },
  {
    category: "Agentic AI",
    title: "LangGraph: Build resilient language agents as graphs",
    type: "github",
    url: "https://github.com/langchain-ai/langgraph",
    author: "LangChain",
    whyWatchOrLearn: "Industry standard for building stateful, multi-actor applications with LLMs using cyclic graphs and persistent checkpointing.",
    difficulty: "Advanced",
    prerequisites: "Python 3.11, async programming",
    whatYouWillLearn: "State management, time-travel debugging, human-in-the-loop, and multi-agent coordination."
  },
  {
    category: "Automation & Testing",
    title: "Playwright Python: Fast and reliable end-to-end testing",
    type: "github",
    url: "https://github.com/microsoft/playwright-python",
    author: "Microsoft",
    whyWatchOrLearn: "Modern web automation library supporting multi-browser async automation, network interception, and auto-waiting.",
    difficulty: "Beginner",
    prerequisites: "Python basics",
    whatYouWillLearn: "Cross-browser testing, headless CI automation, and async browser control."
  }
];

export const AUTHOR_JOURNEY_STORY = {
  name: "Poorna Chandra Rao J",
  title: "Senior Quality Engineer & GenAI Practitioner",
  tagline: "12+ Years of Enterprise Automation Architecture transitioned into GenAI, Agentic Workflows & LLM Evaluation",
  narrative: `I spent the first decade of my engineering career deep in the trenches of traditional Quality Engineering—architecting enterprise test automation frameworks across Java, Selenium, Appium, and REST APIs. I specialized in building multi-platform regression suites, scaling CI/CD pipelines, and establishing rigorous quality gates for high-throughput enterprise systems.

When the Generative AI wave arrived, like many Quality Engineers, I realized our discipline was at a turning point. Instead of starting over from scratch, I leveraged the core engineering strengths that QEs already possess—system architecture, edge-case analysis, contract verification, CI/CD automation, and debugging—to transition directly into AI and GenAI Engineering.

Today, my work centers on building RAG pipelines, autonomous AI agents with LangGraph, Model Context Protocol (MCP) tool servers, and automated LLM evaluation gates with Ragas.

I created QE2AI to provide a hands-on, practical roadmap for Quality Engineers and SDETs. Every track, tutorial, and mini-project on this platform is built on real-world engineering patterns—helping you go from traditional QA to building, evaluating, and deploying production-grade AI systems.`,
  phases: [
    {
      period: "Phase 1",
      title: "Core Automation Architecture",
      skills: "Java • Selenium • Appium • REST Assured • TestNG • Cucumber BDD • Jenkins",
      description: "Architected scalable multi-platform test automation frameworks, led QA regression suites across mobile, web, and microservices, and established enterprise continuous testing standards."
    },
    {
      period: "Phase 2",
      title: "Modern Python & Containerized CI/CD",
      skills: "Python • Playwright • pytest • FastAPI • Docker • GitHub Actions",
      description: "Modernized automation frameworks to asynchronous Python and Playwright, containerized test execution with Docker, and optimized CI/CD velocity."
    },
    {
      period: "Phase 3",
      title: "Generative AI & RAG Pipelines",
      skills: "LLM APIs • ChromaDB • Pinecone • RAG • Test Case Synthesis • Embeddings",
      description: "Engineered FastAPI backend services orchestrating LLM interactions and built requirement-to-test generation RAG pipelines indexing software specifications."
    },
    {
      period: "Phase 4",
      title: "Agentic AI & LLM Evaluation (AI QE)",
      skills: "LangGraph • MCP Servers • Autonomous Agents • Ragas • DeepEval • Guardrails",
      description: "Architected autonomous test agents with LangGraph, developed Model Context Protocol (MCP) servers for browser and database automation, and established automated Ragas LLM quality gates in CI/CD."
    }
  ]
};
