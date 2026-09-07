import type { FlagshipProject } from './types';

export const flagshipProjects: FlagshipProject[] = [
  {
    slug: "ai-test-case-generator",
    title: "AI Test Case & Playwright Generator",
    tagline: "Autonomous pipeline from Jira/Confluence product specs to executable Playwright TypeScript test suites",
    badge: "Flagship Project 1",
    badgeColor: "cyan",
    problemStatement: "QA engineers spend 30-40% of their sprint cycles manually reading PRDs, Jira tickets, and Confluence specs to write test scenarios, then converting them into boilerplate Playwright/Selenium test automation code.",
    businessUseCase: "Accelerates QA automation authoring speed by 4x, ensures 100% acceptance criteria coverage from requirement specs, and generates production-ready Playwright tests conforming to Page Object Models (POM).",
    techStack: [
      "Python 3.11",
      "FastAPI",
      "LangChain",
      "ChromaDB",
      "OpenAI GPT-4o / Gemini 1.5 Pro",
      "Playwright (TypeScript)",
      "Pydantic V2",
      "GitHub Actions",
      "DeepEval"
    ],
    architectureDiagramText: "Jira/Confluence Docs ──▶ Ingestion & Chunking ──▶ ChromaDB (Vector Store) ──▶ Requirement Retriever ──▶ Structured LLM Generator (Pydantic POM Schema) ──▶ Playwright Code Synthesis ──▶ Automated Syntax & Execution Gate ──▶ Pull Request in GitHub",
    architectureSteps: [
      {
        step: 1,
        title: "Requirement Ingestion & Chunking",
        description: "Connects to Jira & Confluence APIs via webhooks, parses Markdown/HTML user stories, and splits text using Header-aware Markdown chunkers.",
        component: "Ingestion Worker (FastAPI + BeautifulSoup)"
      },
      {
        step: 2,
        title: "Hybrid Requirement Retrieval",
        description: "Stores embeddings in ChromaDB. Uses hybrid search (Dense vector + BM25 keyword) to fetch relevant domain rules and existing test fixtures.",
        component: "ChromaDB + BM25 Retriever"
      },
      {
        step: 3,
        title: "Structured Scenario Generation",
        description: "Prompts LLM with strict Pydantic models to output structured test cases: Positive, Negative, Boundary, and Security edge cases with Gherkin steps.",
        component: "LangChain + Pydantic Output Parser"
      },
      {
        step: 4,
        title: "Playwright Code Synthesis & Validation",
        description: "Synthesizes typed Playwright TypeScript code adhering to Page Object Model (POM) standards, runs TypeScript compiler (`tsc`) in a sandbox to verify zero syntax errors.",
        component: "Code Generator Sandbox"
      },
      {
        step: 5,
        title: "Quality Gate & PR Creation",
        description: "DeepEval checks test completeness and groundedness against the original Jira ticket. Automatically generates a GitHub Pull Request with the new `.spec.ts` files.",
        component: "GitHub Actions CI/CD Worker"
      }
    ],
    repositoryUrl: "https://github.com/qa2ai/ai-test-case-generator",
    implementationHighlights: [
      "Implemented strict JSON schema enforcement with Pydantic V2 to prevent hallucinated Playwright locators.",
      "Built an automated AST (Abstract Syntax Tree) validator that checks generated TypeScript for invalid imports before saving.",
      "Integrated few-shot examples of company-specific Page Object Model design patterns into prompt context."
    ],
    testingStrategy: {
      deterministicTesting: [
        "Unit tests verifying Pydantic schema validation on 50 sample Jira tickets.",
        "End-to-end sandbox execution of generated Playwright code against a mock web application.",
        "TypeScript compiler (`tsc --noEmit`) validation to catch type mismatches."
      ],
      probabilisticTesting: [
        "DeepEval Test Coverage Metric: Evaluates whether 100% of acceptance criteria bullets are represented in generated test steps.",
        "Hallucination Detection: Verifies that no fictional API endpoints or UI selectors are invented."
      ],
      qualityGates: [
        "Syntax Gate: 100% TypeScript compilation pass rate.",
        "DeepEval Coverage Score >= 0.88 required to trigger GitHub PR."
      ]
    },
    evaluationMetrics: [
      {
        name: "Requirement Coverage",
        threshold: ">= 90%",
        tool: "DeepEval G-Eval",
        description: "Percentage of acceptance criteria correctly converted into test assertions."
      },
      {
        name: "Code Executability",
        threshold: "100%",
        tool: "Playwright Sandbox",
        description: "Generated test runs cleanly without syntax or missing selector errors in sandbox."
      },
      {
        name: "Hallucination Rate",
        threshold: "< 3%",
        tool: "DeepEval Hallucination Metric",
        description: "Frequency of invented business logic or non-existent UI elements."
      }
    ],
    ciCdWorkflow: [
      "Jira ticket status changes to 'Ready for Test' -> triggers GitHub Action webhook.",
      "Action runs AI Test Case Generator microservice.",
      "Runs automated unit tests and DeepEval benchmark on the generated test suite.",
      "If benchmarks pass, opens PR with new test files and labels `ai-generated-test`."
    ],
    productionConsiderations: [
      "Rate Limiting: Implemented token bucket throttling on Jira webhook ingest to avoid bursting OpenAI quotas.",
      "Context Truncation: Long Jira histories are automatically summarized using a lightweight Gemini Flash model.",
      "Security: Scrubbed all PII/credentials from ticket descriptions before sending to LLM."
    ],
    lessonsLearned: [
      "Giving the LLM pre-defined UI selector fixtures from existing POM repositories reduced selector hallucinations by 72%.",
      "Two-pass generation (Pass 1: Generate Scenarios -> Pass 2: Generate Playwright Code) produced far higher quality code than single-shot generation."
    ]
  },
  {
    slug: "customer-support-agent",
    title: "Autonomous Enterprise Customer Support Agent",
    tagline: "Multi-turn reasoning agent powered by LangGraph, MCP Tools, and Live Vector Knowledge Base",
    badge: "Flagship Project 2",
    badgeColor: "purple",
    problemStatement: "Tier-1 customer support teams face high ticket volume, long resolution times, and repetitive queries while requiring access to live order databases, refund policies, and CRM ticketing systems.",
    businessUseCase: "Resolves 65% of incoming customer support inquiries end-to-end, performs real-time account and order lookups, and safely triggers human escalation for high-risk requests (e.g. refunds > $100).",
    techStack: [
      "Python 3.11",
      "LangGraph",
      "Model Context Protocol (MCP)",
      "FastAPI & WebSockets",
      "Qdrant Vector DB",
      "PostgreSQL (Order & User Data)",
      "Redis (Session State & Caching)",
      "LangSmith (Tracing)",
      "DeepEval"
    ],
    architectureDiagramText: "User Query (WebSocket) ──▶ LangGraph State Machine ──▶ Semantic Router (Policy vs Action) ──▶ MCP Tool Server (Postgres DB / Zendesk API) ──▶ Policy Guardrail (Refund Limits) ──▶ Response Generator ──▶ LangSmith Trace & Eval Gate",
    architectureSteps: [
      {
        step: 1,
        title: "Session State & Intent Classification",
        description: "FastAPI WebSocket connection manages multi-turn dialogue state in Redis. LangGraph router classifies intent into FAQ, Account Action, or Complaint.",
        component: "LangGraph State Router"
      },
      {
        step: 2,
        title: "Policy & Knowledge Retrieval (RAG)",
        description: "Queries Qdrant vector database with customer question and user membership tier metadata to fetch exact return and warranty terms.",
        component: "Qdrant Vector Store"
      },
      {
        step: 3,
        title: "MCP Tool Execution",
        description: "Executes standardized Model Context Protocol tools: `lookup_order(order_id)`, `check_shipping_status(tracking_no)`, `issue_refund(amount)`.",
        component: "Customer Ops MCP Server"
      },
      {
        step: 4,
        title: "Safety Guardrail & Human-in-the-Loop",
        description: "Enforces deterministic business rules. If refund amount > $100, the graph triggers a `Human-in-the-Loop` pause state and assigns a human supervisor.",
        component: "Guardrail & HITL Controller"
      },
      {
        step: 5,
        title: "Response Streaming & Observability",
        description: "Streams response tokens back to user via WebSocket while emitting full multi-step spans and latency metrics to LangSmith.",
        component: "FastAPI Streamer + LangSmith"
      }
    ],
    repositoryUrl: "https://github.com/qa2ai/customer-support-agent-mcp",
    implementationHighlights: [
      "Built a stateful cyclic LangGraph workflow with checkpointing to survive server restarts.",
      "Implemented a standalone MCP Server communicating over STDIO/SSE to isolate sensitive SQL database queries.",
      "Created dynamic few-shot prompt injection based on sentiment analysis scores."
    ],
    testingStrategy: {
      deterministicTesting: [
        "Unit testing individual MCP tool handlers with mock database responses.",
        "State graph transition testing verifying correct route transitions for 30 distinct conversation branches.",
        "Load testing WebSocket server with 500 concurrent virtual users using Locust."
      ],
      probabilisticTesting: [
        "DeepEval Conversational G-Eval: Evaluates tone, politeness, and brand compliance across 10-turn conversations.",
        "Toxicity & Prompt Injection Red Teaming: Testing against adversarial jailbreaks attempting unauthorized refunds."
      ],
      qualityGates: [
        "No unauthorized tool calls permitted outside declared schema.",
        "Average response latency < 1.8s for cached queries."
      ]
    },
    evaluationMetrics: [
      {
        name: "Resolution Accuracy",
        threshold: ">= 92%",
        tool: "DeepEval Conversational Metric",
        description: "Correct resolution of user intent verified against golden conversation logs."
      },
      {
        name: "Tool Calling Precision",
        threshold: ">= 98%",
        tool: "Pytest + LangSmith Tracing",
        description: "Accuracy of parameters passed to MCP database and refund tools."
      },
      {
        name: "Safety & Toxicity Score",
        threshold: "100%",
        tool: "DeepEval Toxicity Gate",
        description: "Zero offensive, biased, or unauthorized policy promises allowed."
      }
    ],
    ciCdWorkflow: [
      "Pull Request triggers test suite running 100 synthetic conversation benchmark scenarios.",
      "Evaluates LangGraph agent performance against golden regression dataset.",
      "Fails CI if resolution accuracy drops by more than 1.5% compared to main branch."
    ],
    productionConsiderations: [
      "State Checkpointing: Multi-turn states stored in PostgreSQL to support agent resumption across pods.",
      "Circuit Breakers: Automatic fallback to human support if MCP tool execution times out after 3 seconds.",
      "Data Masking: Credit card numbers and phone numbers sanitized before logging to LangSmith."
    ],
    lessonsLearned: [
      "Clear, explicit descriptions on MCP tool parameters were 10x more effective at preventing wrong tool invocations than general system prompt instructions.",
      "Adding a distinct Reflection node in LangGraph before executing financial actions eliminated hallucinated refund approvals."
    ]
  },
  {
    slug: "ai-quality-engineering-platform",
    title: "Enterprise AI Quality Engineering & Regression Platform",
    tagline: "Automated evaluation engine, synthetic benchmark generator, and CI/CD Quality Gate for LLMs & RAG",
    badge: "Flagship Project 3",
    badgeColor: "emerald",
    problemStatement: "Engineering teams push prompt modifications and model updates to production without automated regression testing, causing subtle hallucination spikes, context drift, and broken structured outputs.",
    businessUseCase: "Provides a standardized CI/CD quality gate for GenAI applications, blocking pull requests that degrade faithfulness, context recall, or latency, while offering a live regression dashboard for AI QA Leads.",
    techStack: [
      "Python 3.11",
      "FastAPI",
      "Ragas",
      "DeepEval",
      "Pytest",
      "PostgreSQL & TimescaleDB",
      "React + Vite Dashboard",
      "GitHub Actions",
      "Docker & Kubernetes"
    ],
    architectureDiagramText: "Git PR / Model Update ──▶ GitHub Action ──▶ AI Quality Gate Runner ──▶ Multi-Metric Evaluator (Faithfulness, Relevance, Precision, Hallucination) ──▶ Regression Analyzer (vs Baseline) ──▶ Pass/Fail Status Check ──▶ TimescaleDB Dashboard",
    architectureSteps: [
      {
        step: 1,
        title: "CI/CD Trigger & Synthetic Test Loading",
        description: "Triggered on any prompt file or RAG code change in GitHub. Loads a versioned golden evaluation dataset (250+ curated edge cases) from S3/Postgres.",
        component: "CI/CD Test Runner (GitHub Actions)"
      },
      {
        step: 2,
        title: "Multi-Engine Parallel Evaluation",
        description: "Runs the target AI application against test prompts in parallel, computing Ragas metrics (Faithfulness, Context Precision, Context Recall) and DeepEval G-Eval.",
        component: "Ragas & DeepEval Worker Pool"
      },
      {
        step: 3,
        title: "Statistical Regression Analysis",
        description: "Compares test run scores against the production baseline. Computes statistical significance (p-value < 0.05) to distinguish true regressions from normal LLM variance.",
        component: "Statistical Analysis Engine (SciPy)"
      },
      {
        step: 4,
        title: "Quality Gate Decision & PR Annotation",
        description: "Determines Pass/Fail status based on configurable threshold rules (e.g. Faithfulness >= 0.88). Annotates GitHub PR with visual markdown breakdown.",
        component: "GitHub PR Notifier"
      },
      {
        step: 5,
        title: "Historical Quality Telemetry",
        description: "Stores all metric vectors, cost per test run, and latency logs in TimescaleDB for visualization in the QA2AI interactive dashboard.",
        component: "TimescaleDB + React Analytics UI"
      }
    ],
    repositoryUrl: "https://github.com/qa2ai/ai-quality-engineering-platform",
    implementationHighlights: [
      "Created a custom Pytest plugin `pytest-ai-eval` that outputs standardized JUnit XML for GitHub test reporting.",
      "Implemented an LLM-as-a-Judge calibration suite that aligns evaluation scores with human QA engineer ratings.",
      "Engineered automated synthetic dataset generation that creates hard negative retrieval tests from raw documentation."
    ],
    testingStrategy: {
      deterministicTesting: [
        "Unit tests for metric computation math, thresholds, and statistical significance calculations.",
        "FastAPI REST API endpoint contract tests.",
        "Database schema migration tests for TimescaleDB."
      ],
      probabilisticTesting: [
        "Judge Consistency Testing: Measures variance of LLM judges by evaluating identical responses 5 times.",
        "Alignment Verification: Computes Cohen's Kappa score between AI Judge metrics and senior QA human labels (achieved 0.84)."
      ],
      qualityGates: [
        "Faithfulness score must not degrade by > 2% compared to baseline.",
        "Zero increase in Hallucination rate allowed on critical financial queries."
      ]
    },
    evaluationMetrics: [
      {
        name: "RAG Faithfulness",
        threshold: ">= 0.88",
        tool: "Ragas",
        description: "Measures factual consistency of generated answers against retrieved context."
      },
      {
        name: "Context Precision",
        threshold: ">= 0.85",
        tool: "Ragas",
        description: "Verifies that ground-truth relevant context is ranked at the top of retrieved chunks."
      },
      {
        name: "Evaluation Cost per Run",
        threshold: "< $0.50",
        tool: "Token Tracker",
        description: "Keeps evaluation runs affordable by using efficient judge models (GPT-4o-mini / Gemini Flash)."
      }
    ],
    ciCdWorkflow: [
      "Developer updates system prompt or RAG chunking parameters in a PR.",
      "GitHub Action executes `pytest-ai-eval --benchmark=baseline`.",
      "Generates interactive comment on PR showing metric deltas (Green = improved, Red = regressed).",
      "Blocks merge if any core quality gate threshold fails."
    ],
    productionConsiderations: [
      "Judge Model Selection: Utilizes calibrated GPT-4o-mini and Gemini 1.5 Flash to reduce evaluation costs by 85% compared to frontier models.",
      "Rate Limit Backoff: Implemented adaptive retry with jitter for high-concurrency evaluation batches.",
      "Data Isolation: Evaluator operates inside a secure VPC with zero test data retention."
    ],
    lessonsLearned: [
      "Using reference-free metrics alone allowed subtle subtle inaccuracies; combining reference-based (ground truth) and reference-free metrics yielded the highest detection accuracy.",
      "Statistical significance testing is vital to prevent false alarms on non-deterministic LLM variance."
    ]
  }
];
