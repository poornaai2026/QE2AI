import type { RoadmapPhase } from './types';

export const roadmapPhases: RoadmapPhase[] = [
  {
    id: 1,
    title: "1. Python for AI & Modern Async",
    tagline: "Move from basic test automation scripts to writing clean, asynchronous Python with strict Pydantic models",
    description: "If you know basic Python or Java, this phase gets you comfortable with modern Python 3.11+: writing async code with asyncio, streaming LLM responses token-by-token, and using Pydantic to validate data types before passing them downstream.",
    duration: "2-3 Weeks",
    iconName: "Code2",
    prerequisites: ["Basic programming familiarity (Python, JavaScript, or Java)", "Familiarity with JSON and REST APIs"],
    keyConcepts: [
      "Python 3.11+ Type Hinting & Generics for cleaner code",
      "Pydantic V2 data validation and schema definitions",
      "Asynchronous I/O with `asyncio` and `httpx` for fast concurrent requests",
      "Handling real-time token streams and Server-Sent Events (SSE)",
      "Virtual environments and package management with Poetry / venv"
    ],
    handsOnLabs: [
      "Write a typed Pydantic validator that rejects malformed JSON outputs from LLMs",
      "Build an async Python script that queries 3 LLM endpoints concurrently and compares latency",
      "Set up Pytest with async fixtures to test streaming HTTP clients"
    ],
    failureModesToMaster: [
      "Accidentally blocking the async event loop with synchronous sleep or requests calls",
      "Code crashes when an LLM omits an optional field not accounted for in Pydantic",
      "Memory leaks from unclosed streaming connections"
    ],
    deliverableProject: {
      title: "Async Streaming LLM Client SDK",
      description: "A lightweight, robust Python client with automatic retries, backoff, and Pydantic validation for OpenAI and Gemini APIs.",
      slug: "async-llm-client"
    },
    articles: ["python-async-for-ai", "structured-outputs-pydantic-instructor"],
    interviewFocus: [
      "Why is asynchronous programming critical when calling LLMs with streaming responses?",
      "How do you ensure data integrity when receiving unstructured text from an external API?"
    ],
    recommendedResources: [
      {
        type: 'course',
        title: 'Python for Beginners & Async Essentials',
        authorOrSource: 'freeCodeCamp',
        url: 'https://www.youtube.com/watch?v=eWRfhZUzrAc',
        description: 'Complete hands-on Python refresh covering type hints, async/await, and object models.',
        durationOrLevel: '4 hrs • Beginner',
        isFree: true
      },
      {
        type: 'doc',
        title: 'Pydantic V2 Official Documentation',
        authorOrSource: 'Pydantic Dev Team',
        url: 'https://docs.pydantic.dev/latest/',
        description: 'Learn how to define robust data schemas, custom validators, and serialization rules.',
        durationOrLevel: 'Documentation • Free',
        isFree: true
      }
    ]
  },
  {
    id: 2,
    title: "2. AI Fundamentals (No Math Fog)",
    tagline: "Understand how LLMs, Transformers, Attention, and Vector Embeddings actually work under the hood",
    description: "Demystify the black box. You'll learn how sentences get chopped into tokens, how vector embeddings turn meaning into numbers, and why LLMs are probabilistic next-token predictors rather than deterministic compilers.",
    duration: "2 Weeks",
    iconName: "BrainCircuit",
    prerequisites: ["Phase 1 (Python Foundation)", "Basic understanding of arrays/lists"],
    keyConcepts: [
      "Tokenization (BPE, WordPiece) and why context windows matter",
      "Vector Embeddings and measuring semantic similarity with Cosine Distance",
      "The Transformer Architecture: Self-Attention, Keys, Queries, and Values explained intuitively",
      "Sampling parameters: Temperature, Top-p, Top-k, and why temperature=0 is still not 100% deterministic",
      "The fundamental difference between deterministic software assertions and probabilistic AI outputs"
    ],
    handsOnLabs: [
      "Inspect token boundaries and calculate API costs using the `tiktoken` library",
      "Generate embeddings for 20 bug reports and calculate which ones are duplicate tickets",
      "Run identical prompts at temperature 0.0 vs 0.8 to measure output variation"
    ],
    failureModesToMaster: [
      "Silent text truncation when prompts exceed the model's context window limit",
      "Poor embedding search results when embedding raw, uncleaned text containing HTML tags",
      "Assuming temperature 0.0 will always return the exact same output on multi-GPU clusters"
    ],
    deliverableProject: {
      title: "Semantic Test Failure Deduplicator",
      description: "A Python service that converts test execution logs into embeddings and clusters duplicate flaky test failures automatically.",
      slug: "semantic-test-dedup"
    },
    articles: ["transformer-attention-deep-dive"],
    interviewFocus: [
      "How would you explain the Self-Attention mechanism to a QA engineer?",
      "Why is testing an LLM fundamentally different from testing a traditional REST API?"
    ],
    recommendedResources: [
      {
        type: 'youtube',
        title: "Let's build GPT: from scratch, in code, spelled out",
        authorOrSource: 'Andrej Karpathy',
        url: 'https://www.youtube.com/watch?v=kCc8FmEb1nY',
        description: 'The definitive guide to understanding transformers, attention heads, and token embeddings.',
        durationOrLevel: '2 hr video • Essential',
        isFree: true
      },
      {
        type: 'youtube',
        title: 'Visualizing Attention and Transformer Architecture',
        authorOrSource: '3Blue1Brown',
        url: 'https://www.youtube.com/watch?v=eMlx5fFNoYc',
        description: 'World-class visual animations explaining how vectors and attention work.',
        durationOrLevel: '28 min video • Free',
        isFree: true
      }
    ]
  },
  {
    id: 3,
    title: "3. LLM Engineering & Structured Output",
    tagline: "Move beyond simple chat prompts: master strict JSON outputs, function calling, and system prompt safety",
    description: "Learn how to build real software with LLMs: enforcing strict JSON schemas so code never crashes, using function/tool calling to interact with live databases, and writing automated tests to defend against prompt injection attacks.",
    duration: "3 Weeks",
    iconName: "Terminal",
    prerequisites: ["Phase 2 (AI Fundamentals)"],
    keyConcepts: [
      "Prompt engineering patterns: Few-Shot examples, Chain-of-Thought (CoT), and ReAct prompting",
      "Guaranteed JSON outputs with Pydantic and Instructor (Constrained Decoding)",
      "Function Calling & Tool Calling protocols: how LLMs decide which tool to run",
      "Defending against Prompt Injections, Jailbreaks, and System Prompt leaks",
      "Balancing model speed, accuracy, and cost (e.g. GPT-4o vs GPT-4o-mini vs Gemini 1.5 Flash)"
    ],
    handsOnLabs: [
      "Build a Jira ticket parser that converts messy user stories into strict, typed test cases",
      "Create an automated function-calling agent that queries a SQLite test database to check bug counts",
      "Write a Pytest suite that tests a system prompt against 20 adversarial jailbreak attempts"
    ],
    failureModesToMaster: [
      "JSON syntax errors (trailing commas, missing brackets) when not using constrained decoding",
      "Indirect prompt injections hidden in user input that override your system instructions",
      "Tool hallucination: LLM inventing parameter names not declared in your schema"
    ],
    deliverableProject: {
      title: "Automated User Story to Test Case Generator",
      description: "A service that ingests Jira requirements and generates structured test scenarios (positive, negative, edge cases) in strict JSON format.",
      slug: "gherkin-to-playwright"
    },
    articles: ["structured-outputs-pydantic-instructor"],
    interviewFocus: [
      "How do you guarantee that an LLM will return valid JSON in production?",
      "How do you test a system prompt for prompt injection vulnerabilities?"
    ],
    recommendedResources: [
      {
        type: 'course',
        title: 'Building Systems with ChatGPT API',
        authorOrSource: 'DeepLearning.AI & OpenAI',
        url: 'https://www.deeplearning.ai/short-courses/building-systems-with-chatgpt/',
        description: 'Learn system prompt design, chain-of-thought, and output evaluation from OpenAI engineers.',
        durationOrLevel: '1 hr • Free Course',
        isFree: true
      },
      {
        type: 'doc',
        title: 'Instructor: Structured Outputs with Pydantic',
        authorOrSource: 'Instructor Python Docs',
        url: 'https://python.useinstructor.com/',
        description: 'Official guide for guaranteed structured JSON outputs with automatic retry handling.',
        durationOrLevel: 'Documentation • Free',
        isFree: true
      }
    ]
  },
  {
    id: 4,
    title: "4. Retrieval-Augmented Generation (RAG)",
    tagline: "Connect LLMs to internal documentation and data with Vector Databases, Hybrid Search, and Re-ranking",
    description: "Learn how to build high-precision search and question-answering systems over private documentation: document chunking, vector indexing in Chroma/Qdrant, BM25 hybrid search, and cross-encoder re-ranking to deliver surgically accurate context.",
    duration: "3-4 Weeks",
    iconName: "Layers",
    prerequisites: ["Phase 3 (LLM Engineering)"],
    keyConcepts: [
      "Chunking strategies: Recursive character, Markdown-aware, and Semantic chunking",
      "Vector Stores: ChromaDB, Qdrant, Pinecone, and how indexing works",
      "Hybrid Search: Combining exact keyword search (BM25) with semantic vector search",
      "Two-Stage Retrieval & Re-ranking: Using Cross-Encoders to pick the top-3 best chunks",
      "The RAG Triad: Context Relevance, Groundedness (Faithfulness), and Answer Relevance"
    ],
    handsOnLabs: [
      "Build a RAG pipeline that indexes product documentation and generates QA test matrices",
      "Benchmark retrieval accuracy with different chunk sizes (128 vs 512 vs 1024 tokens)",
      "Add a cross-encoder re-ranker and measure the increase in top-3 precision"
    ],
    failureModesToMaster: [
      "Chunking breaking tables or code blocks across split boundaries, losing critical context",
      "'Lost-in-the-Middle' syndrome: LLM ignoring relevant info placed in the center of long contexts",
      "Retrieval hallucination: injecting irrelevant documents that confuse the generator"
    ],
    deliverableProject: {
      title: "API Documentation & Test Plan Assistant",
      description: "A production RAG service that indexes Swagger/OpenAPI docs and generates comprehensive test matrices.",
      slug: "rag-api-test-generator"
    },
    articles: ["advanced-rag-chunking-reranking"],
    interviewFocus: [
      "What is the RAG Triad and how do you diagnose whether a bug is caused by retrieval or generation?",
      "Why would you use a Cross-Encoder for re-ranking instead of only vector similarity?"
    ],
    recommendedResources: [
      {
        type: 'youtube',
        title: 'Advanced RAG: Chunking, Vector DBs & Re-ranking',
        authorOrSource: 'LangChain YouTube',
        url: 'https://www.youtube.com/watch?v=wd7TZ4w1mSw',
        description: 'Comprehensive walkthrough on building enterprise RAG with hybrid search and re-ranking.',
        durationOrLevel: '45 min video • Free',
        isFree: true
      },
      {
        type: 'doc',
        title: 'Chroma Vector Database Documentation',
        authorOrSource: 'Chroma Core',
        url: 'https://docs.trychroma.com/',
        description: 'Fast, open-source embedded vector store for local and production RAG development.',
        durationOrLevel: 'Documentation • Free',
        isFree: true
      }
    ]
  },
  {
    id: 5,
    title: "5. Agentic AI & LangGraph State Machines",
    tagline: "Build autonomous, self-correcting agents with cyclic state graphs, reflection loops, and human approval",
    description: "Move past one-shot pipelines. Learn how to architect autonomous agents that can execute tasks, catch their own errors, reflect, loop back, modify code, and ask for human confirmation before high-risk actions.",
    duration: "4 Weeks",
    iconName: "Cpu",
    prerequisites: ["Phase 4 (RAG Fundamentals)"],
    keyConcepts: [
      "Agent design patterns: ReAct (Reason + Act), Plan-and-Solve, and Reflection loops",
      "LangGraph: State graphs, nodes, conditional edges, reducers, and checkpointing",
      "Managing agent memory (short-term thread state vs long-term vector memory)",
      "Human-in-the-Loop (HITL): Pausing agent execution for human review and approval",
      "Multi-Agent collaboration: Supervisor pattern and specialized worker swarms"
    ],
    handsOnLabs: [
      "Build a self-healing LangGraph agent that runs Playwright tests in a sandbox and fixes syntax errors",
      "Implement a stateful support triage workflow with SQLite/Redis checkpointing",
      "Add a Human-in-the-Loop approval node before the agent executes a database write"
    ],
    failureModesToMaster: [
      "Infinite execution loops that burn API tokens without making progress",
      "State dictionary corruption across multi-turn cyclic graphs",
      "Agent picking the wrong tool because tool docstrings were vague or overlapping"
    ],
    deliverableProject: {
      title: "Self-Healing Test Automation Agent",
      description: "A LangGraph agent that executes failing Playwright tests, analyzes error stack traces, updates outdated selectors, and re-validates the test run.",
      slug: "autonomous-test-repair-agent"
    },
    articles: ["langgraph-state-machine-architecture"],
    interviewFocus: [
      "Why is LangGraph superior to linear chains for complex, multi-step AI agents?",
      "How do you implement safety guards to prevent an autonomous agent from entering an infinite loop?"
    ],
    recommendedResources: [
      {
        type: 'course',
        title: 'AI Agents in LangGraph',
        authorOrSource: 'DeepLearning.AI & Harrison Chase',
        url: 'https://www.deeplearning.ai/short-courses/ai-agents-in-langgraph/',
        description: 'Official hands-on course covering state graphs, persistence, and human-in-the-loop agents.',
        durationOrLevel: '1.5 hrs • Free Course',
        isFree: true
      },
      {
        type: 'youtube',
        title: 'LangGraph Crash Course: Build Cyclic Multi-Agent Systems',
        authorOrSource: 'LangChain',
        url: 'https://www.youtube.com/watch?v=9Ayk5mRvdB8',
        description: 'Step-by-step tutorial on building resilient stateful agents with LangGraph.',
        durationOrLevel: '1 hr video • Free',
        isFree: true
      }
    ]
  },
  {
    id: 6,
    title: "6. Model Context Protocol (MCP)",
    tagline: "Connect LLMs to databases, test runners, and internal tools using Anthropic's open protocol",
    description: "Learn Model Context Protocol (MCP) — the new open standard for AI tools. Build custom MCP servers that expose company test databases, CI logs, and staging environments to Claude, Cursor, and custom AI applications.",
    duration: "2 Weeks",
    iconName: "Network",
    prerequisites: ["Phase 5 (Agentic AI)", "Understanding of Client/Server & JSON-RPC"],
    keyConcepts: [
      "MCP Architecture: Hosts, Clients, and Servers",
      "The 3 Core Primitives: Resources (data), Prompts (templates), and Tools (functions)",
      "Transports: Local STDIO vs Remote Server-Sent Events (SSE)",
      "Writing custom Python MCP servers using the `mcp` SDK and FastMCP",
      "Security boundaries, authentication, and sandboxing MCP tool execution"
    ],
    handsOnLabs: [
      "Create a custom MCP server that exposes test execution logs as readable MCP resources",
      "Build a Playwright MCP tool server that takes screenshots and inspects DOM elements for AI tools",
      "Connect your custom MCP server to Claude Desktop, Cursor, or Antigravity IDE"
    ],
    failureModesToMaster: [
      "STDIO deadlock caused by debug `print()` statements corrupting JSON-RPC streams on stdout",
      "MCP tools hanging indefinitely due to missing subprocess execution timeouts",
      "Security risks from exposing unrestricted SQL or bash execution tools"
    ],
    deliverableProject: {
      title: "QA Test Environment MCP Server",
      description: "A custom MCP server that allows AI assistants to safely query test run logs, inspect database states, and trigger automation suites.",
      slug: "qa-env-mcp-server"
    },
    articles: ["mcp-architecture-deep-dive"],
    interviewFocus: [
      "What problem does Model Context Protocol (MCP) solve compared to custom REST API tool calling?",
      "What are the best security practices when building MCP servers for enterprise tools?"
    ],
    recommendedResources: [
      {
        type: 'doc',
        title: 'Official Model Context Protocol (MCP) Documentation',
        authorOrSource: 'Anthropic & MCP Core Team',
        url: 'https://modelcontextprotocol.io/',
        description: 'Official specification, quickstart tutorials, and Python SDK references.',
        durationOrLevel: 'Documentation • Free',
        isFree: true
      },
      {
        type: 'youtube',
        title: 'Model Context Protocol (MCP) Explained for Developers',
        authorOrSource: 'Anthropic Developer Hub',
        url: 'https://www.youtube.com/watch?v=mcp-overview',
        description: 'Anthropic engineers explain how MCP connects AI models to external tools and environments.',
        durationOrLevel: '35 min video • Free',
        isFree: true
      }
    ]
  },
  {
    id: 7,
    title: "7. AI Quality Engineering & Evaluation (AI QE)",
    tagline: "The QA Superpower: Automate LLM evaluation in CI/CD using DeepEval, Ragas, and LLM-as-a-Judge",
    description: "This is where Quality Engineers hold an enormous advantage. Learn how to replace manual prompt checks with automated evaluation suites in Pytest and GitHub Actions: measuring Faithfulness, Hallucination, Context Precision, and blocking regressions in CI/CD.",
    duration: "3-4 Weeks",
    iconName: "ShieldCheck",
    prerequisites: ["Phase 4 (RAG)", "Phase 5 (Agentic AI)"],
    keyConcepts: [
      "Shifting from binary assertions to statistical evaluation scoring (0.0 to 1.0)",
      "Ragas Metrics: Faithfulness (Groundedness), Answer Relevance, Context Precision, and Recall",
      "DeepEval framework: G-Eval custom criteria, Hallucination metrics, Toxicity, and Bias checks",
      "LLM-as-a-Judge: How to calibrate judge models and eliminate verbosity bias",
      "Generating synthetic golden test datasets for regression benchmarking",
      "Building automated AI Quality Gates in GitHub Actions / GitLab CI"
    ],
    handsOnLabs: [
      "Create a golden test dataset of 100 version-controlled evaluation test cases",
      "Write a Pytest suite using DeepEval that asserts Faithfulness >= 0.85 and Answer Relevance >= 0.90",
      "Set up a GitHub Action workflow that evaluates every PR and blocks prompt changes that degrade quality"
    ],
    failureModesToMaster: [
      "Judge bias: LLMs favoring longer, more verbose answers during evaluation",
      "Dataset contamination: Synthetic evaluation questions leaking into the RAG vector store",
      "Flaky test runs caused by unstable, uncalibrated evaluation prompts"
    ],
    deliverableProject: {
      title: "Enterprise AI Quality Gate & Regression Platform",
      description: "A complete CI/CD evaluation framework that runs multi-metric benchmarks on every prompt change and blocks regressions automatically.",
      slug: "ai-quality-engineering-platform"
    },
    articles: ["ragas-deepeval-practical-guide"],
    interviewFocus: [
      "How do you design an automated CI/CD Quality Gate for a Generative AI application?",
      "How do you test and calibrate LLM-as-a-Judge to ensure consistent scoring?"
    ],
    recommendedResources: [
      {
        type: 'doc',
        title: 'DeepEval Documentation & Quickstart',
        authorOrSource: 'Confident AI',
        url: 'https://docs.confident-ai.com/',
        description: 'Comprehensive guides for writing Pytest unit tests for LLM outputs, hallucination, and RAG.',
        durationOrLevel: 'Documentation • Free',
        isFree: true
      },
      {
        type: 'doc',
        title: 'Ragas Documentation',
        authorOrSource: 'ExplodingGradients',
        url: 'https://docs.ragas.io/',
        description: 'Learn the mathematical and programmatic definitions of the RAG Triad metrics.',
        durationOrLevel: 'Documentation • Free',
        isFree: true
      },
      {
        type: 'youtube',
        title: 'How to Evaluate LLMs and RAG in Production with DeepEval',
        authorOrSource: 'Confident AI YouTube',
        url: 'https://www.youtube.com/watch?v=deepeval-eval',
        description: 'Practical video tutorial on setting up automated LLM quality gates in Python.',
        durationOrLevel: '40 min video • Free',
        isFree: true
      }
    ]
  },
  {
    id: 8,
    title: "8. Production AI & Observability",
    tagline: "Scale systems, reduce latency, slash API token costs, and monitor production LLMs with tracing",
    description: "Move from prototypes to production-ready systems: implementing Redis semantic caching to return instant answers for repeated queries, semantic prompt routing, rate limiting, and distributed tracing with LangSmith.",
    duration: "2-3 Weeks",
    iconName: "Activity",
    prerequisites: ["Phase 7 (AI Quality Engineering)"],
    keyConcepts: [
      "Semantic Caching: Using vector similarity in Redis to return cached answers and slash API costs by 50%",
      "Semantic Routers: Routing simple queries to lightweight fast models and complex tasks to heavy frontier models",
      "Distributed Tracing & Observability: LangSmith, Langfuse, and OpenTelemetry instrumentation",
      "Managing API rate limits, exponential backoff with jitter, and token bucket throttling",
      "Graceful degradation: Circuit breakers and automated fallback models during LLM provider outages"
    ],
    handsOnLabs: [
      "Implement a Redis-backed semantic cache with a 0.92 cosine similarity threshold",
      "Instrument a multi-step LangGraph agent with LangSmith to trace every tool execution and latency span",
      "Build an intelligent model router that handles simple queries with Gemini Flash and complex logic with Pro"
    ],
    failureModesToMaster: [
      "Semantic cache false positives returning stale answers for subtly different user queries",
      "Cascading latency spikes when downstream LLM APIs experience throttling (HTTP 429)",
      "Unbounded cost explosion caused by uncontrolled agent retry loops"
    ],
    deliverableProject: {
      title: "Resilient AI Gateway & Semantic Cache Proxy",
      description: "A FastAPI proxy featuring Redis semantic caching, dynamic model routing, token rate limiting, and LangSmith tracing.",
      slug: "resilient-ai-gateway"
    },
    articles: ["semantic-caching-redis-optimization"],
    interviewFocus: [
      "How do you design a high-throughput AI gateway that minimizes cost and prevents provider throttling?",
      "What telemetry metrics (beyond standard HTTP status codes) must you monitor in production GenAI systems?"
    ],
    recommendedResources: [
      {
        type: 'github',
        title: 'LangSmith Observability Platform',
        authorOrSource: 'LangChain',
        url: 'https://www.langchain.com/langsmith',
        description: 'Industry-standard observability tool for debugging agent thought steps, latency, and token spend.',
        durationOrLevel: 'Platform • Free tier available',
        isFree: true
      }
    ]
  },
  {
    id: 9,
    title: "9. Portfolio Showcase Projects",
    tagline: "Build and ship 3 production-grade portfolio projects that prove your engineering capability",
    description: "Consolidate everything into 3 enterprise-grade GitHub projects complete with Docker setups, automated Pytest test suites, DeepEval regression benchmarks, and clear architectural diagrams that impress hiring managers.",
    duration: "3-4 Weeks",
    iconName: "FolderGit2",
    prerequisites: ["Phases 1 through 8"],
    keyConcepts: [
      "End-to-End System Design: Clean separation between Ingestion, Reasoning, Tool Calling, and Evaluation",
      "Docker containerization & docker-compose setups for reproducible local runs",
      "Automated testing: Unit tests, integration tests, and DeepEval evaluation benchmarks in CI/CD",
      "Writing clear, professional READMEs with architectural flowcharts and benchmark metrics"
    ],
    handsOnLabs: [
      "Build Flagship Project 1: AI Test Case & Playwright Generator",
      "Build Flagship Project 2: Customer Support Agent with MCP Tools",
      "Build Flagship Project 3: AI Quality Engineering Platform"
    ],
    failureModesToMaster: [
      "Building toy scripts without test suites or evaluation benchmarks",
      "Messy repositories without Dockerfiles, dependency locks, or setup instructions"
    ],
    deliverableProject: {
      title: "Complete 3-Project Portfolio Triad",
      description: "Three fully documented, containerized, and benchmarked AI engineering projects hosted on GitHub.",
      slug: "flagship-portfolio-triad"
    },
    articles: ["project-architecture-ai-test-generator"],
    interviewFocus: [
      "Walk me through the architecture and evaluation metrics of your flagship project.",
      "What trade-offs did you make between retrieval latency and hallucination rate?"
    ],
    recommendedResources: [
      {
        type: 'github',
        title: 'QA2AI Open-Source Showcase Repositories',
        authorOrSource: 'QA2AI GitHub',
        url: 'https://github.com/qa2ai',
        description: 'Reference implementations of all 3 flagship architectures with full test suites.',
        durationOrLevel: 'Open Source',
        isFree: true
      }
    ]
  },
  {
    id: 10,
    title: "10. Interview Preparation & Career Strategy",
    tagline: "Position your Quality background as an unfair advantage and ace AI Engineering interviews",
    description: "Master AI System Design interviews, live coding rounds, AI QE case studies, and resume positioning to transition from QA Lead/Senior SDET into AI Engineer / AI Quality Engineering Lead.",
    duration: "2 Weeks",
    iconName: "Trophy",
    prerequisites: ["Phases 1 through 9"],
    keyConcepts: [
      "AI System Design framework: Requirements → Data Ingestion → Model Choice → RAG/Agent → Evaluation → Monitoring",
      "How to translate QA automation achievements into AI Quality Engineering leadership on your resume",
      "Handling live coding interviews with Python async, LangChain, and LangGraph",
      "Negotiating senior AI engineering compensation packages"
    ],
    handsOnLabs: [
      "Mock AI System Design: Design an Enterprise Documentation Assistant with RAG & Access Control",
      "Mock AI QE Case Study: Design an evaluation suite for a healthcare diagnosis LLM bot",
      "Resume overhaul: Convert test automation bullets into AI Evaluation & Model Quality metrics"
    ],
    failureModesToMaster: [
      "Positioning oneself as 'just a tester using ChatGPT' rather than an AI Engineer who builds and evaluates systems",
      "Focusing only on model fine-tuning while ignoring prompt engineering, RAG, and production evaluation"
    ],
    deliverableProject: {
      title: "AI Engineer Portfolio & Interview Playbook",
      description: "A personalized interview playbook with 50+ solved AI QE questions and system design diagrams.",
      slug: "interview-prep-playbook"
    },
    articles: ["top-30-ai-qe-interview-questions"],
    interviewFocus: [
      "How would you design and evaluate an enterprise RAG system handling 10,000 queries per second?",
      "Why is your background in Quality Engineering an asset for our AI Engineering team?"
    ],
    recommendedResources: [
      {
        type: 'course',
        title: 'Evaluating and Debugging Generative AI Models',
        authorOrSource: 'Weights & Biases / DeepLearning.AI',
        url: 'https://www.deeplearning.ai/short-courses/evaluating-debugging-generative-ai/',
        description: 'Essential prep course for answering AI evaluation and model debugging interview questions.',
        durationOrLevel: '1 hr • Free Course',
        isFree: true
      }
    ]
  }
];
