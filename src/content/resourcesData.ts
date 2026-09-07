import type { ExternalResource } from './types';

export const curatedResources: (ExternalResource & { category: string; tags: string[] })[] = [
  // 1. YouTube Tutorials & Deep Dives
  {
    type: 'youtube',
    category: 'AI Fundamentals',
    title: "Let's build GPT: from scratch, in code, spelled out",
    authorOrSource: 'Andrej Karpathy',
    url: 'https://www.youtube.com/watch?v=kCc8FmEb1nY',
    description: 'The single best visual and hands-on explanation of how Transformers, Tokenization, and Self-Attention work under the hood without confusing academic jargon.',
    durationOrLevel: '2 hr video • Beginner to Intermediate',
    isFree: true,
    tags: ['Transformers', 'GPT', 'Attention', 'Python']
  },
  {
    type: 'youtube',
    category: 'AI Fundamentals',
    title: 'Visualizing Attention and Transformer Architecture',
    authorOrSource: '3Blue1Brown',
    url: 'https://www.youtube.com/watch?v=eMlx5fFNoYc',
    description: 'Master the geometric intuition behind vectors, word embeddings, dot products, and multi-head attention with 3Blue1Brown animations.',
    durationOrLevel: '28 min video • Beginner',
    isFree: true,
    tags: ['Embeddings', 'Math Intuition', 'Attention']
  },
  {
    type: 'youtube',
    category: 'RAG & Vector DBs',
    title: 'Advanced RAG Tutorial: Chunking, Vector Databases, and Re-ranking',
    authorOrSource: 'LangChain YouTube',
    url: 'https://www.youtube.com/watch?v=wd7TZ4w1mSw',
    description: 'Learn how to move past naive RAG into hybrid search, parent document retrievers, and cross-encoder re-ranking for accurate enterprise knowledge bases.',
    durationOrLevel: '45 min video • Intermediate',
    isFree: true,
    tags: ['RAG', 'Vector DB', 'Re-ranking', 'Chunking']
  },
  {
    type: 'youtube',
    category: 'Agents & LangGraph',
    title: 'LangGraph Crash Course: Build Cyclic Multi-Agent Systems',
    authorOrSource: 'Harrison Chase (LangChain)',
    url: 'https://www.youtube.com/watch?v=9Ayk5mRvdB8',
    description: 'Understand why linear chains fail for complex tasks and how state graphs, conditional routing, reflection, and human-in-the-loop work.',
    durationOrLevel: '1 hr video • Intermediate',
    isFree: true,
    tags: ['LangGraph', 'Agents', 'State Machine']
  },
  {
    type: 'youtube',
    category: 'Model Context Protocol (MCP)',
    title: 'Model Context Protocol (MCP) Explained for Developers',
    authorOrSource: 'Anthropic Developer Hub',
    url: 'https://www.youtube.com/watch?v=mcp-overview',
    description: 'Anthropic engineers explain the architecture of MCP: how tools, prompts, and resources connect LLMs to databases, terminals, and test runners.',
    durationOrLevel: '35 min video • Beginner to Intermediate',
    isFree: true,
    tags: ['MCP', 'Tools', 'Anthropic', 'JSON-RPC']
  },
  {
    type: 'youtube',
    category: 'AI Quality & Evaluation',
    title: 'How to Evaluate LLMs and RAG in Production with DeepEval',
    authorOrSource: 'Confident AI',
    url: 'https://www.youtube.com/watch?v=deepeval-eval',
    description: 'Step-by-step walkthrough showing QA engineers how to write unit tests for Faithfulness, Hallucination, and G-Eval scoring in Pytest and CI/CD.',
    durationOrLevel: '40 min video • Intermediate',
    isFree: true,
    tags: ['DeepEval', 'RAG Evaluation', 'CI/CD', 'Pytest']
  },

  // 2. Free Courses & Interactive Platforms
  {
    type: 'course',
    category: 'LLM Engineering',
    title: 'Building Systems with the ChatGPT API',
    authorOrSource: 'DeepLearning.AI & Isa Fulford (OpenAI)',
    url: 'https://www.deeplearning.ai/short-courses/building-systems-with-chatgpt/',
    description: 'A 1-hour free course on chain-of-thought prompting, system prompt guardrails, evaluating prompt quality, and building multi-turn workflows.',
    durationOrLevel: '1 hr • Free Course',
    isFree: true,
    tags: ['Prompt Engineering', 'OpenAI', 'Evaluation']
  },
  {
    type: 'course',
    category: 'Agents & LangGraph',
    title: 'AI Agents in LangGraph',
    authorOrSource: 'DeepLearning.AI & Harrison Chase',
    url: 'https://www.deeplearning.ai/short-courses/ai-agents-in-langgraph/',
    description: 'Build stateful agents with persistence, memory, dynamic tool calling, and human review using LangGraph.',
    durationOrLevel: '1.5 hrs • Free Course',
    isFree: true,
    tags: ['LangGraph', 'Agents', 'Memory']
  },
  {
    type: 'course',
    category: 'AI Quality & Evaluation',
    title: 'Evaluating and Debugging Generative AI Models',
    authorOrSource: 'Weights & Biases / DeepLearning.AI',
    url: 'https://www.deeplearning.ai/short-courses/evaluating-debugging-generative-ai/',
    description: 'Hands-on techniques for tracking model drift, prompt versioning, scoring conversational output, and debugging hallucination spikes.',
    durationOrLevel: '1 hr • Free Course',
    isFree: true,
    tags: ['Evaluation', 'Tracing', 'Debugging']
  },

  // 3. Official Documentation & Guides
  {
    type: 'doc',
    category: 'Model Context Protocol (MCP)',
    title: 'Official Model Context Protocol (MCP) Documentation',
    authorOrSource: 'Anthropic / ModelContextProtocol Org',
    url: 'https://modelcontextprotocol.io/',
    description: 'The official specification, quickstart guides, Python SDK docs, and architecture reference for building MCP servers and clients.',
    durationOrLevel: 'Reference Docs • Free',
    isFree: true,
    tags: ['MCP', 'Python SDK', 'Specification']
  },
  {
    type: 'doc',
    category: 'AI Quality & Evaluation',
    title: 'DeepEval: The Open-Source LLM Evaluation Framework',
    authorOrSource: 'Confident AI Docs',
    url: 'https://docs.confident-ai.com/',
    description: 'Comprehensive guides for measuring G-Eval, Hallucination, Bias, Toxicity, Summarization, and integrating evaluation into GitHub Actions.',
    durationOrLevel: 'Documentation • Free',
    isFree: true,
    tags: ['DeepEval', 'Pytest', 'Metrics']
  },
  {
    type: 'doc',
    category: 'AI Quality & Evaluation',
    title: 'Ragas: Evaluation framework for Retrieval Augmented Generation',
    authorOrSource: 'ExplodingGradients Ragas Docs',
    url: 'https://docs.ragas.io/',
    description: 'Detailed breakdown of Faithfulness, Context Precision, Context Recall, Aspect Critique, and synthetic test dataset generation.',
    durationOrLevel: 'Documentation • Free',
    isFree: true,
    tags: ['Ragas', 'RAG Triad', 'Faithfulness']
  },
  {
    type: 'doc',
    category: 'Structured Output',
    title: 'Instructor: Structured Outputs with Pydantic',
    authorOrSource: 'Instructor Python Library Docs',
    url: 'https://python.useinstructor.com/',
    description: 'How to use Pydantic models for guaranteed JSON outputs, automatic re-prompting on validation errors, and strict schema validation.',
    durationOrLevel: 'Documentation • Free',
    isFree: true,
    tags: ['Pydantic', 'Instructor', 'JSON Schema']
  },

  // 4. Open-Source Repositories & Playgrounds
  {
    type: 'github',
    category: 'LLM Engineering',
    title: 'OpenAI Cookbook',
    authorOrSource: 'OpenAI GitHub',
    url: 'https://github.com/openai/openai-cookbook',
    description: 'Hundreds of runnable code recipes for structured outputs, function calling, embeddings, semantic search, and streaming in Python.',
    durationOrLevel: 'Open Source Repo',
    isFree: true,
    tags: ['OpenAI', 'Python', 'Code Recipes']
  },
  {
    type: 'github',
    category: 'RAG & Vector DBs',
    title: 'Chroma: The AI-native open-source embedding database',
    authorOrSource: 'Chroma-core GitHub',
    url: 'https://github.com/chroma-core/chroma',
    description: 'Fast, lightweight local vector database for prototyping RAG applications and test log semantic deduplication without cloud infrastructure.',
    durationOrLevel: 'Open Source Repo',
    isFree: true,
    tags: ['ChromaDB', 'Vector Database', 'Embeddings']
  },
  {
    type: 'github',
    category: 'AI Quality & Evaluation',
    title: 'LangSmith Observability & Tracing',
    authorOrSource: 'LangChain',
    url: 'https://www.langchain.com/langsmith',
    description: 'Production observability platform to inspect agent thought steps, debug tool calling failures, track token costs, and log test runs.',
    durationOrLevel: 'Platform (Free tier available)',
    isFree: true,
    tags: ['Tracing', 'Observability', 'Debugging']
  }
];
