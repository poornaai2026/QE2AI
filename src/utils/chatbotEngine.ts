import { flagshipProjects } from '../content/projectsData';

export interface ChatLinkAction {
  title: string;
  url: string;
  category: 'project' | 'interview' | 'roadmap' | 'article' | 'resource' | 'external';
  description?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  links?: ChatLinkAction[];
  suggestions?: string[];
}

export const INITIAL_BOT_MESSAGE: ChatMessage = {
  id: 'msg-welcome',
  sender: 'bot',
  text: "👋 Hi! I'm your **QE2AI Learning Assistant Chatbot**.\n\nTell me what you'd like to learn or what your QA background is (e.g., *Selenium, API testing, Manual QA*), and I'll guide you with the exact projects, roadmap steps, and interview questions to master!",
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  links: [
    { title: '🗺️ Complete 6-Phase AI Roadmap', url: '/roadmap', category: 'roadmap', description: 'From Python Async to Production Multi-Agents' },
    { title: '⚡ 15 Real-Time Production Scenarios', url: '/interview-prep?category=realtime-scenarios', category: 'interview', description: 'Battle-tested failure modes & mitigations' },
    { title: '🛠️ 11 Hands-On Python Projects', url: '/projects', category: 'project', description: 'Playwright AI, LangGraph, FastMCP & RAG' }
  ],
  suggestions: [
    'I want to learn LangGraph & Deep Agents',
    'Where should I start if I only know Java / Selenium?',
    'How do I test RAG applications for hallucinations?',
    'Show me interview questions for senior AI roles',
    'What is Model Context Protocol (MCP)?'
  ]
};

export const generateBotResponse = (userQuery: string): ChatMessage => {
  const query = userQuery.toLowerCase().trim();
  const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // 1. LangGraph & Deep Agents
  if (query.includes('langgraph') || query.includes('deep agent') || query.includes('multi-agent') || query.includes('agentic') || query.includes('langchain')) {
    const langgraphProject = flagshipProjects.find(p => p.slug === 'langchain-deep-agents') || flagshipProjects[10];
    return {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      text: "🤖 **LangGraph & Multi-Agent Systems for QE**\n\nLangGraph allows you to build **cyclic state graphs** with persistence, conditional branching, reflection loops, and Human-in-the-Loop (HITL) breakpoints for autonomous test suites.\n\nHere are the best resources and code to dive into:",
      timestamp: now,
      links: [
        {
          title: `🚀 Project 11: ${langgraphProject?.title || 'LangChain Deep Agents & Multi-Agent Orchestrator'}`,
          url: `/projects/${langgraphProject?.slug || 'langchain-deep-agents'}`,
          category: 'project',
          description: 'StateGraph, Plan-and-Solve agents, reflection loops & full code walkthrough.'
        },
        {
          title: '❓ Interview Q: ReAct vs StateGraph Cyclic Loops',
          url: '/interview-prep?id=agt-01',
          category: 'interview',
          description: 'Why linear LCEL chains fail in production QA and how LangGraph solves self-healing.'
        },
        {
          title: '❓ Interview Q: Human-in-the-Loop & Time-Travel Debugging',
          url: '/interview-prep?id=agt-03',
          category: 'interview',
          description: 'Checkpointers (`MemorySaver`) and breakpoint interrupts for destructive actions.'
        },
        {
          title: '📺 Video: LangGraph Deep Agents Masterclass',
          url: '/resources',
          category: 'resource',
          description: 'Harrison Chase & Lance Martin tutorial on hierarchical agent design.'
        }
      ],
      suggestions: [
        'How do I prevent infinite loops in LangGraph?',
        'What is Plan-and-Solve vs ReAct?',
        'Take me to the AI Roadmap'
      ]
    };
  }

  // 2. Beginner / Starting from Selenium / Manual QA
  if (query.includes('start') || query.includes('beginner') || query.includes('selenium') || query.includes('manual') || query.includes('java') || query.includes('prerequisite') || query.includes('roadmap')) {
    return {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      text: "🎯 **Your QE-to-AI Transition Strategy**\n\nIf you have a background in Selenium, Cypress, Playwright, or Manual QA, the transition is smoother than you think! Here is the recommended step-by-step path:\n\n1. **Phase 1: Modern Python & Async Systems** (`asyncio`, `FastAPI`, `Pydantic V2`)\n2. **Phase 2: LLM Fundamentals & Prompt Engineering** (Few-Shot, CoT, System Prompts)\n3. **Phase 3: Embeddings & RAG Architectures** (Vector DBs, ChromaDB, Chunking)\n4. **Phase 4: Autonomous Agents & LangGraph** (Tool Calling, MCP, Multi-Agents)\n5. **Phase 5: AI Quality Engineering** (Ragas, DeepEval, LLM-as-a-Judge gates)",
      timestamp: now,
      links: [
        {
          title: '🗺️ Phase 1: Python for AI & Modern Async Systems',
          url: '/roadmap#phase-1',
          category: 'roadmap',
          description: 'Master async programming, type annotations, and Pydantic schemas.'
        },
        {
          title: '🚀 Project 1: AI Test Case & Playwright Generator',
          url: '/projects/ai-test-case-generator',
          category: 'project',
          description: 'Great first project: turn Jira specs into TypeScript Playwright scripts.'
        },
        {
          title: '📖 Deep Dive: Why Traditional QA Asserts Fail for AI',
          url: '/learn/why-traditional-qa-fails-for-ai',
          category: 'article',
          description: 'Understand the shift from deterministic testing to probabilistic evaluation.'
        }
      ],
      suggestions: [
        'What is the difference between RAG and Fine-Tuning?',
        'Show me Python interview questions',
        'Explore all 11 Projects'
      ]
    };
  }

  // 3. RAG, Vector DB, ChromaDB & Embeddings
  if (query.includes('rag') || query.includes('vector') || query.includes('chroma') || query.includes('embedding') || query.includes('retrieval') || query.includes('chunk')) {
    return {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      text: "📚 **Retrieval-Augmented Generation (RAG) & Vector Systems**\n\nRAG grounds LLMs in your internal documents, test cases, and databases to eliminate hallucinations. Testing RAG requires evaluating both the **Retriever** (Precision & Recall) and the **Generator** (Faithfulness & Groundedness).\n\nCheck out these essential resources:",
      timestamp: now,
      links: [
        {
          title: '🚀 Project 6: Enterprise RAG Evaluation Engine with Ragas',
          url: '/projects/enterprise-rag-eval-engine',
          category: 'project',
          description: 'Automated evaluation pipelines measuring Context Recall & Faithfulness.'
        },
        {
          title: '⚡ Scenario: 10x Latency Spike on 50k PDF Ingestion',
          url: '/interview-prep?id=scen-07',
          category: 'interview',
          description: 'HNSW indexing, Cross-Encoder candidate pruning, and Redis caching.'
        },
        {
          title: '⚡ Scenario: ChromaDB Vector Drift & Deprecated v1 Hallucinations',
          url: '/interview-prep?id=scen-02',
          category: 'interview',
          description: 'Blue/Green vector collection indexing and metadata filtering.'
        },
        {
          title: '📖 Deep Dive: Hybrid Search (BM25 + Vector Embeddings)',
          url: '/learn/hybrid-search-bm25-vectors',
          category: 'article',
          description: 'Reciprocal Rank Fusion (RRF) for high-accuracy document retrieval.'
        }
      ],
      suggestions: [
        'How do you evaluate RAG with Ragas?',
        'What is HyDE (Hypothetical Document Embeddings)?',
        'Take me to Interview Prep'
      ]
    };
  }

  // 4. Testing AI, Evaluations, Ragas & DeepEval
  if (query.includes('eval') || query.includes('ragas') || query.includes('deepeval') || query.includes('hallucination') || query.includes('judge') || query.includes('metric') || query.includes('faithfulness')) {
    return {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      text: "🛡️ **AI Quality Engineering & Evaluation (Evals)**\n\nTesting Generative AI requires statistical and semantic evaluation rather than binary `assert a == b`.\n\nKey metrics to master:\n- **Faithfulness**: Are generated claims grounded in retrieved context?\n- **Answer Relevance**: Did the answer address user intent?\n- **Context Precision**: Were the highest signal chunks ranked first?\n- **LLM-as-a-Judge**: Calibrated scoring with Cohen's Kappa.",
      timestamp: now,
      links: [
        {
          title: '🛡️ AI Quality Engineering Hub',
          url: '/ai-qe',
          category: 'resource',
          description: 'The complete guide to LLM testing, red-teaming, and CI/CD quality gates.'
        },
        {
          title: '🚀 Project 4: LLM-as-a-Judge Evaluation Framework',
          url: '/projects/llm-as-a-judge-eval-framework',
          category: 'project',
          description: 'Automated semantic scoring with position & verbosity bias mitigation.'
        },
        {
          title: '❓ Interview Q: The RAG Triad Evaluation Metrics',
          url: '/interview-prep?id=eval-02',
          category: 'interview',
          description: 'Faithfulness, Answer Relevance, and Context Precision explained.'
        },
        {
          title: '⚡ Scenario: Silent Prompt Drift Regression in CI/CD',
          url: '/interview-prep?id=scen-01',
          category: 'interview',
          description: 'Paired t-test statistical gates and Golden Dataset PR scorecards.'
        }
      ],
      suggestions: [
        'How do you build a Golden Dataset?',
        'How to prevent prompt injection attacks?',
        'Show all 15 Real-Time Scenarios'
      ]
    };
  }

  // 5. Model Context Protocol (MCP)
  if (query.includes('mcp') || query.includes('model context protocol') || query.includes('fastmcp') || query.includes('json-rpc') || query.includes('tools')) {
    return {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      text: "🔌 **Model Context Protocol (MCP)**\n\nMCP is the new open standard (by Anthropic) for connecting AI models to external tools, databases, and test harnesses uniformly across Claude Desktop, Cursor, and custom agent hosts.\n\nKey Primitives:\n- **Tools**: Executable actions (e.g. `run_playwright_test`)\n- **Resources**: Read-only context (e.g. database schemas, logs)\n- **Prompts**: Reusable prompt templates",
      timestamp: now,
      links: [
        {
          title: '🚀 Project 3: Model Context Protocol (MCP) Test Harness Server',
          url: '/projects/mcp-test-harness-server',
          category: 'project',
          description: 'Build a production FastMCP server exposing Playwright & Pytest over stdio/SSE.'
        },
        {
          title: '❓ Interview Q: What is MCP and Why is it Replacing Custom Tools?',
          url: '/interview-prep?id=mcp-01',
          category: 'interview',
          description: 'JSON-RPC 2.0 client-server architecture vs proprietary tool wrappers.'
        },
        {
          title: '❓ Interview Q: Building a Secure FastMCP Server in Python',
          url: '/interview-prep?id=mcp-03',
          category: 'interview',
          description: 'Subprocess argument sanitization with `shlex.quote` and Pydantic schemas.'
        }
      ],
      suggestions: [
        'What is stdio vs SSE transport in MCP?',
        'Explore LangGraph Multi-Agents',
        'View Roadmap Phase 4: Agents'
      ]
    };
  }

  // 6. Real-Time Scenarios & Production Failures
  if (query.includes('scenario') || query.includes('production') || query.includes('failure') || query.includes('real-time') || query.includes('realtime') || query.includes('429') || query.includes('drift') || query.includes('rate limit')) {
    return {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      text: "⚡ **15 Real-Time Production Failure Scenarios**\n\nWe have built 15 deep-dive architectural battleground scenarios covering the exact production issues asked in Senior, Lead, and Staff AI Engineering interviews:\n\n- **Prompt Drift & Silent Regression** (Paired t-test CI gates)\n- **Agent Infinite Loops & Token Runaways** ($80 burn circuit breakers)\n- **OpenAI 429 Rate Limits** (Redis Token Bucket + Full Jitter Backoff)\n- **Indirect Prompt Injection in Jira Tickets** (XML tag isolation)\n- **Streaming Hallucination Interruption** (Speculative ONNX aborts)\n- **Zero-Downtime Vector Embedding Migration** (Blue/Green dual-indexing)",
      timestamp: now,
      links: [
        {
          title: '⚡ Explore All 15 Real-Time Scenarios',
          url: '/interview-prep?category=realtime-scenarios',
          category: 'interview',
          description: 'Interactive questions with architectural breakdowns and code snippets.'
        },
        {
          title: '⚡ Scenario: LangGraph Infinite Modal Loop ($80 runaway)',
          url: '/interview-prep?id=scen-03',
          category: 'interview',
          description: 'Action fingerprinting and dollar budget circuit breakers.'
        },
        {
          title: '⚡ Scenario: High-Concurrency 429 Rate Limits under 20 Workers',
          url: '/interview-prep?id=scen-04',
          category: 'interview',
          description: 'Redis token buckets and multi-provider LiteLLM fallback routing.'
        }
      ],
      suggestions: [
        'What is Indirect Prompt Injection?',
        'How do you test multi-turn conversation memory?',
        'Take me to the Projects hub'
      ]
    };
  }

  // 7. Interview Prep & Career & Simulator
  if (query.includes('mock') || query.includes('simulator') || query.includes('interview') || query.includes('job') || query.includes('career') || query.includes('question') || query.includes('prep') || query.includes('salary') || query.includes('resume')) {
    return {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      text: "🎓 **Technical Interview Preparation & Mock Simulator**\n\nThe QE2AI interview suite contains **55 curated questions and 15 real-time scenarios** with short answers, in-depth architectural deep-dives, code snippets, an interactive **10-Minute AI Mock Interview Simulator**, and a **Downloadable Architecture Cheat Sheet**.",
      timestamp: now,
      links: [
        {
          title: '🎯 Launch AI Mock Interview Simulator',
          url: '/interview-prep?mode=simulator',
          category: 'interview',
          description: '10-minute timed session with AI rubric evaluation and feedback.'
        },
        {
          title: '🎓 Open Interview Prep Suite (55 Questions)',
          url: '/interview-prep',
          category: 'interview',
          description: 'Practice conceptual, architectural, and production scenario challenges.'
        },
        {
          title: '⚡ 15 Real-Time Production Scenarios',
          url: '/interview-prep?category=realtime-scenarios',
          category: 'interview',
          description: 'The highest-weight questions in Staff / Lead AI interviews.'
        }
      ],
      suggestions: [
        'Launch Mock Interview Simulator',
        'Show 15 Real-Time Scenarios',
        'Download Architecture Cheat Sheet'
      ]
    };
  }

  // 8. Projects & Code Repositories
  if (query.includes('project') || query.includes('build') || query.includes('code') || query.includes('github') || query.includes('repo')) {
    return {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      text: "🛠️ **11 Hands-On Flagship AI Projects**\n\nAll 11 projects are written in clean, production-grade Python with modular tests and step-by-step architectures ready to build:\n\n1. **AI Test Case & Playwright Generator**\n2. **Self-Healing UI Automation Engine**\n3. **Model Context Protocol (MCP) Test Harness**\n4. **LLM-as-a-Judge Evaluation Framework**\n5. **API Fuzzing & Security Red-Teamer**\n6. **Enterprise RAG Evaluation with Ragas**\n7. **AI Log & Root Cause Analyzer**\n8. **Synthetic Test Data Generator**\n9. **CI/CD Quality Gate with GitHub Actions**\n10. **Semantic Caching & Rate-Limiting Proxy**\n11. **LangChain Deep Agents & Multi-Agent Orchestrator**",
      timestamp: now,
      links: [
        {
          title: '🚀 Browse All 11 Projects',
          url: '/projects',
          category: 'project',
          description: 'Detailed architecture diagrams, component specs, and Python code.'
        },
        {
          title: '⭐ Star QE2AI on GitHub',
          url: 'https://github.com/poornaai2026/QE2AI',
          category: 'external',
          description: 'Pure Python 100% open-source repositories.'
        }
      ],
      suggestions: [
        'Show me Project 11: LangChain Deep Agents',
        'Show me Project 2: Self-Healing UI',
        'Where do I start as a beginner?'
      ]
    };
  }

  // 9. Playwright, UI Automation, Self-Healing
  if (query.includes('playwright') || query.includes('ui') || query.includes('self-healing') || query.includes('healing') || query.includes('selector') || query.includes('locator') || query.includes('vision') || query.includes('vlm')) {
    return {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      text: "🎭 **AI-Powered UI Automation & Self-Healing**\n\nSelf-healing locators eliminate flaky test failures by intercepting Playwright `TimeoutError`, extracting live DOM candidate elements, computing semantic similarity embeddings against historical golden attributes, and auto-repairing the test dynamically at runtime.",
      timestamp: now,
      links: [
        {
          title: '🚀 Project 2: Self-Healing UI Automation Engine',
          url: '/projects/self-healing-ui-automation-engine',
          category: 'project',
          description: 'Playwright Python dynamic locator repair with semantic DOM similarity.'
        },
        {
          title: '❓ Interview Q: How AI Self-Healing Locators Work',
          url: '/interview-prep?id=auto-01',
          category: 'interview',
          description: 'DOM extraction, element attribute similarity matching, and auto PR generation.'
        },
        {
          title: '⚡ Scenario: Flaky VLM Visual Assertion Tests in Playwright',
          url: '/interview-prep?id=scen-08',
          category: 'interview',
          description: 'Few-shot visual reference injection and deterministic DOM gates.'
        }
      ],
      suggestions: [
        'How do you generate Playwright tests from PRDs?',
        'Explore Model Context Protocol (MCP)',
        'Take me to the Projects hub'
      ]
    };
  }

  // 10. Default Fallback
  return {
    id: `bot-${Date.now()}`,
    sender: 'bot',
    text: `💡 I found several related resources on **"${userQuery}"** across our learning platform!\n\nHere are direct links to explore:`,
    timestamp: now,
    links: [
      {
        title: '🔍 Search Full Documentation & Interview Questions',
        url: `/interview-prep?q=${encodeURIComponent(userQuery)}`,
        category: 'interview',
        description: `Find answers, scenarios, and code related to "${userQuery}".`
      },
      {
        title: '🗺️ Explore the 6-Phase AI Engineering Roadmap',
        url: '/roadmap',
        category: 'roadmap',
        description: 'Comprehensive curriculum from foundations to advanced production agents.'
      },
      {
        title: '🛠️ Flagship Hands-On Python Projects',
        url: '/projects',
        category: 'project',
        description: '11 runnable projects covering Playwright AI, LangGraph, RAG & MCP.'
      }
    ],
    suggestions: [
      'I want to learn LangGraph & Multi-Agents',
      'Show me Real-Time Production Scenarios',
      'Where do I start as a manual / automation QA?',
      'How to evaluate RAG models?'
    ]
  };
};
