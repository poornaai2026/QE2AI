import type { JourneyMilestone } from './types';

export const journeyMilestones: JourneyMilestone[] = [
  {
    year: "Phase 1",
    role: "Senior QA Automation Engineer / SDET",
    title: "The Deterministic Comfort Zone",
    description: "Built scalable Playwright, Pytest, and Cypress test frameworks, automated CI/CD pipelines in GitHub Actions, and designed API contract test suites. Testing was clean, predictable, and binary: status codes were either 200 or 500, assertions were either true or false.",
    keyShift: "Mastery of automation architecture, asynchronous test runners, and CI/CD quality gate enforcement.",
    takeaway: "Traditional QA gave me the structural discipline to build resilient software systems, but I was about to encounter a fundamentally different computing paradigm."
  },
  {
    year: "Phase 2",
    role: "QA Lead exploring Generative AI",
    title: "The Confusion: Why do LLMs fail non-deterministically?",
    description: "Started using ChatGPT and early LLM APIs to generate test cases. Quickly realized that asking an LLM with naive prompts led to hallucinated selectors, broken JSON syntax, and flaky completions that broke automated test suites.",
    keyShift: "Realized that LLMs cannot be treated as deterministic functions. Prompting alone is insufficient; they require structured outputs, grammar constraints, and Pydantic schemas.",
    takeaway: "The moment you realize an LLM is a probabilistic distribution rather than a deterministic compiler is the moment your AI engineering journey truly begins."
  },
  {
    year: "Phase 3",
    role: "AI Quality Engineer",
    title: "The Breakthrough: The RAG Triad & AI Evaluation",
    description: "Built internal RAG systems to query product specs. When retrieval failed, standard unit tests were useless. Discovered Ragas, DeepEval, and LLM-as-a-Judge. Started measuring Faithfulness, Context Precision, and Answer Relevance with automated regression benchmarks.",
    keyShift: "Realized that QA Engineers have an enormous unfair advantage in AI: We already understand edge cases, test design, and quality metrics better than pure model researchers.",
    takeaway: "AI Quality Engineering (AI QE) is not about testing LLMs manually; it is about building software systems that statistically measure, benchmark, and guardrail AI applications in CI/CD."
  },
  {
    year: "Phase 4",
    role: "AI Engineer & Platform Architect",
    title: "Building Autonomous Agents & MCP Infrastructure",
    description: "Advanced into cyclical state machines using LangGraph, multi-agent collaboration, and Anthropic's Model Context Protocol (MCP). Built autonomous self-healing test systems and enterprise support agents with live database tools and human-in-the-loop guardrails.",
    keyShift: "Transitioned from consumer of AI APIs to architect of resilient, production-grade agentic systems.",
    takeaway: "By combining Quality Engineering rigor with modern AI orchestration (LangGraph, MCP, RAG), you become the most valuable engineer on any AI team."
  }
];
