import type { Article } from './types';

export const technicalArticles: Article[] = [
  {
    slug: "structured-outputs-pydantic-instructor",
    title: "Guaranteed JSON: Structured Outputs with Pydantic & Instructor for QA Engineers",
    summary: "How to eliminate JSON parsing crashes in production LLM workflows using Constrained Decoding, Pydantic V2 schemas, and automated validation gates.",
    category: "Structured Output",
    difficulty: "Beginner",
    readingTime: "12 min read",
    publishedDate: "2026-03-01",
    tags: ["Pydantic", "Structured Output", "JSON Schema", "Reliability", "FastAPI"],
    prerequisites: ["Basic Python", "Understanding of JSON and REST APIs"],
    phaseId: 3,
    sixQuestions: {
      what: "Large Language Models are probabilistic next-token predictors. When asked to return JSON in natural language prompts, they frequently output markdown ticks (```json), trailing commas, truncated brackets, or hallucinated key names. In production applications, unvalidated LLM output causes downstream runtime exceptions. Structured output frameworks guarantee type safety, field constraints, and deterministic parsing.",
      how: "Modern LLMs support Constrained Decoding (Grammar-guided sampling) where the model's logits are masked at each step so that only valid tokens adhering to a JSON Schema grammar can physically be generated. Tool libraries like `instructor` wrap the OpenAI, Anthropic, or Gemini APIs with Pydantic models, automatically validating responses and re-prompting the model with the exact validation error when a field constraint fails.",
      build: {
        description: "Here is a complete, production-ready Python service that extracts structured bug reports from messy customer feedback using Pydantic V2 and Instructor.",
        snippets: [
          {
            language: "python",
            filename: "bug_extractor.py",
            code: `from typing import List, Literal
from pydantic import BaseModel, Field
import instructor
from openai import OpenAI

# 1. Define Strict Pydantic Schema
class ReproducibleStep(BaseModel):
    step_number: int = Field(description="Sequential step index starting from 1")
    action: str = Field(description="Exact action taken by the user")
    expected_result: str = Field(description="What was supposed to happen")
    actual_result: str = Field(description="What actually went wrong")

class BugReportSchema(BaseModel):
    title: str = Field(description="Concise 1-line bug summary")
    severity: Literal["CRITICAL", "HIGH", "MEDIUM", "LOW"] = Field(description="Severity based on user impact")
    affected_platform: Literal["WEB", "IOS", "ANDROID", "API"] = Field(description="Platform where bug occurred")
    steps_to_reproduce: List[ReproducibleStep] = Field(min_length=1, description="Ordered steps to recreate the issue")
    environment_details: str = Field(default="Not specified", description="Browser, OS version, or device")

# 2. Wrap client with Instructor
client = instructor.from_openai(OpenAI())

def extract_bug_report(raw_feedback: str) -> BugReportSchema:
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        response_model=BugReportSchema,
        max_retries=3, # Auto re-prompts if Pydantic validation fails
        messages=[
            {"role": "system", "content": "You are a Senior QA Engineer converting raw customer reports into structured Jira bug schemas."},
            {"role": "user", "content": raw_feedback}
        ]
    )
    return response

# Example execution
raw_input = "Hey, when I clicked checkout on Chrome 124 on Mac, the spinner spun forever and charged my card twice!"
report = extract_bug_report(raw_input)
print(f"Parsed Bug: [{report.severity}] {report.title}")
print(f"Steps count: {len(report.steps_to_reproduce)}")`
          }
        ]
      },
      fail: [
        "LLM fails field validation (e.g. integer returned for string field) when temperature is too high.",
        "Model invents schema keys when using unconstrained fallback modes.",
        "Max retries exhausted when validation rules (e.g., regex checks) are too complex for the model to understand."
      ],
      test: {
        strategy: "Test structured output pipelines using Pytest with parameterized edge-case inputs: empty strings, adversarial prompt injections, contradictory statements, and malformed inputs.",
        testCases: [
          "Verify schema conformity across 100 random customer complaint samples.",
          "Verify retry mechanism correctly triggers when an invalid severity level is injected.",
          "Assert 0% JSON syntax parsing exceptions in CI/CD test runs."
        ],
        metrics: ["Schema Validation Pass Rate (Target: 99.8%)", "Average Retry Count (Target: < 0.15)"]
      },
      production: [
        "Always set `max_retries` with exponential backoff to handle transient schema validation fixes.",
        "Log the raw LLM completion when Pydantic fails so QA engineers can debug prompt drift.",
        "Use OpenAI Structured Outputs (`response_format={'type': 'json_schema'}`) for zero-cost grammar constraints."
      ],
      interview: [
        {
          question: "What is the difference between Prompt Engineering for JSON and Constrained Decoding with JSON Schema?",
          answer: "Prompting asks the LLM in natural language to output JSON, but the model can still emit invalid tokens. Constrained Decoding modifies the token sampling probabilities directly at the logit level, guaranteeing 100% valid JSON conforming to the schema at the tokenizer engine."
        },
        {
          question: "How do you test and handle schema validation failures in production?",
          answer: "By wrapping the API client with libraries like Instructor that catch ValidationError, append the exact validation error message back to the LLM message history, and request a corrected token sequence up to a fixed retry threshold."
        }
      ]
    }
  },
  {
    slug: "ragas-deepeval-practical-guide",
    title: "AI Quality Engineering: Complete Guide to Ragas & DeepEval Evaluation",
    summary: "Shift from deterministic assertions to probabilistic evaluation. Master Faithfulness, Context Precision, Answer Relevance, and CI/CD Quality Gates.",
    category: "AI Evaluation",
    difficulty: "Intermediate",
    readingTime: "16 min read",
    publishedDate: "2026-03-03",
    tags: ["Ragas", "DeepEval", "RAG Evaluation", "Faithfulness", "CI/CD", "Quality Gates"],
    prerequisites: ["Phase 4 (RAG Fundamentals)", "Basic Pytest experience"],
    phaseId: 7,
    sixQuestions: {
      what: "Traditional QA relies on binary assertions: `assert response.status_code == 200` or `assert expected_text in actual_text`. In LLM and RAG systems, responses are natural language sentences that vary in phrasing. We need programmatic metrics to measure: Did the model retrieve the right knowledge? Did the model hallucinate beyond retrieved facts? Is the answer relevant to the user's prompt?",
      how: "Ragas and DeepEval use LLM-as-a-Judge and vector embeddings to compute normalized scores (0.0 to 1.0) across key quality dimensions: Faithfulness (Groundedness in context), Answer Relevance (Direct response to query), Context Precision (High-relevance chunks ranked first), and Context Recall (All necessary facts retrieved).",
      build: {
        description: "An automated Pytest test suite using DeepEval that asserts RAG quality metrics before merging code into production.",
        snippets: [
          {
            language: "python",
            filename: "test_rag_pipeline.py",
            code: `import pytest
from deepeval import assert_test
from deepeval.test_case import LLMTestCase
from deepeval.metrics import (
    FaithfulnessMetric,
    AnswerRelevancyMetric,
    ContextualPrecisionMetric
)

# Golden Test Dataset for QA Regression
EVALUATION_DATASET = [
    {
        "input": "What is the timeout threshold for automated UI tests in our framework?",
        "actual_output": "The default timeout for UI tests is 30 seconds, configurable via the playwright.config.ts file.",
        "retrieval_context": [
            "Section 4.2: Automated UI tests in Playwright have a default timeout threshold of 30 seconds. This can be customized in playwright.config.ts."
        ],
        "expected_output": "The UI test timeout threshold is 30 seconds by default."
    }
]

@pytest.mark.parametrize("test_data", EVALUATION_DATASET)
def test_rag_quality_metrics(test_data):
    # 1. Assemble Test Case
    test_case = LLMTestCase(
        input=test_data["input"],
        actual_output=test_data["actual_output"],
        expected_output=test_data["expected_output"],
        retrieval_context=test_data["retrieval_context"]
    )

    # 2. Define Quality Gate Metrics
    faithfulness = FaithfulnessMetric(threshold=0.85, model="gpt-4o-mini")
    relevancy = AnswerRelevancyMetric(threshold=0.85, model="gpt-4o-mini")
    precision = ContextualPrecisionMetric(threshold=0.80, model="gpt-4o-mini")

    # 3. Assert Quality Gates in CI/CD
    assert_test(test_case, [faithfulness, relevancy, precision])`
          }
        ]
      },
      fail: [
        "Judge Model Drift: An update to the underlying judge model changes scoring distributions unexpectedly.",
        "Context Pollution: LLM-as-a-Judge gets confused when retrieval contexts contain contradictory internal documentation.",
        "High Evaluation Latency: Running frontier LLMs as judges on 10,000 tests can take hours and cost hundreds of dollars."
      ],
      test: {
        strategy: "Calibrate AI judges against human QA ground truth using Cohen's Kappa score (> 0.80). Validate that synthetic evaluation datasets contain realistic user typos and incomplete queries.",
        testCases: [
          "Benchmark 50 known hallucinated outputs to ensure FaithfulnessMetric accurately scores them below 0.30.",
          "Benchmark 50 highly relevant outputs to ensure AnswerRelevancyMetric scores above 0.90.",
          "Run evaluation suite on 3 consecutive days to check scoring stability and variance."
        ],
        metrics: ["Faithfulness Score (>= 0.85)", "Context Precision (>= 0.80)", "Judge Agreement Rate (>= 85%)"]
      },
      production: [
        "Use smaller, faster models (e.g. Gemini 1.5 Flash or GPT-4o-mini) as judges to reduce CI/CD test run costs by 90%.",
        "Implement statistical quality gates: Do not fail CI on a single test outlier; require 95th percentile pass rate.",
        "Store historical metric trajectories in a database (like TimescaleDB) to detect gradual model degradation."
      ],
      interview: [
        {
          question: "Explain the RAG Triad and how you would test each component.",
          answer: "The RAG Triad consists of: 1) Context Relevance (did retriever get relevant chunks?), 2) Groundedness/Faithfulness (did generator stick only to retrieved facts?), and 3) Answer Relevance (did generator answer the user's actual question?). We test Context Relevance with Context Precision/Recall metrics, Groundedness with statement decomposition vs context, and Answer Relevance using embedding similarity with the query."
        },
        {
          question: "How do you handle flaky tests when using LLM-as-a-Judge?",
          answer: "We use temperature=0 for the judge model, calibrate judging rubrics with strict few-shot examples, compute statistical confidence intervals across multiple evaluation runs, and set realistic percentile-based thresholds rather than 100% strict binary passes."
        }
      ]
    }
  },
  {
    slug: "langgraph-state-machine-architecture",
    title: "Building Resilient AI Agents with LangGraph & Cyclic State Machines",
    summary: "Why linear chains fail for complex QA workflows, and how to build cyclical, fault-tolerant AI agents with state persistence, reflection, and human approval.",
    category: "LangGraph",
    difficulty: "Advanced",
    readingTime: "18 min read",
    publishedDate: "2026-03-05",
    tags: ["LangGraph", "Agents", "State Machine", "Reflection", "Self-Healing Tests"],
    prerequisites: ["Phase 5 (Agentic AI)", "Basic Graph Theory concepts"],
    phaseId: 5,
    sixQuestions: {
      what: "Standard LLM chains (like linear LangChain `LLMChain`) follow a one-way pipeline: Prompt -> Model -> Output. However, real-world tasks (like generating automation tests, triage, and self-healing test repair) require iterative loops: Attempt -> Run in sandbox -> Catch error -> Reflect -> Modify code -> Re-run. LangGraph provides a cyclical graph framework for stateful multi-step agents.",
      how: "LangGraph models agent workflows as a Directed Graph: Nodes are Python functions that transform state, Edges determine control flow (conditional routing), and State is a shared Pydantic or TypedDict object that persists across execution steps. Built-in Checkpointing enables pausing, time-travel debugging, and Human-in-the-Loop interventions.",
      build: {
        description: "A complete LangGraph agent that generates Playwright code, executes it in a test sandbox, catches execution errors, and loops back to fix its own code until tests pass.",
        snippets: [
          {
            language: "python",
            filename: "self_healing_agent.py",
            code: `from typing import TypedDict, List
from langgraph.graph import StateGraph, END
from langchain_openai import ChatOpenAI

# 1. Define Agent State
class AgentState(TypedDict):
    task_description: str
    generated_code: str
    error_message: str
    iteration_count: int
    test_passed: bool

llm = ChatOpenAI(model="gpt-4o", temperature=0.2)

# 2. Node: Generate Code
def generate_code_node(state: AgentState):
    prompt = f"Write Playwright TypeScript for: {state['task_description']}"
    if state["error_message"]:
        prompt += f"\\nPrevious execution failed with: {state['error_message']}. Fix the code!"
    response = llm.invoke(prompt)
    return {"generated_code": response.content, "iteration_count": state["iteration_count"] + 1}

# 3. Node: Execute Sandbox Test
def sandbox_execution_node(state: AgentState):
    code = state["generated_code"]
    # Mocking sandbox execution check
    if "page.click" in code and "await" in code:
        return {"error_message": "", "test_passed": True}
    else:
        return {"error_message": "TypeError: missing await keyword before page.click", "test_passed": False}

# 4. Conditional Router
def should_continue(state: AgentState):
    if state["test_passed"]:
        return END
    if state["iteration_count"] >= 3:
        return END # Prevent infinite loop
    return "generate"

# 5. Assemble Graph
workflow = StateGraph(AgentState)
workflow.add_node("generate", generate_code_node)
workflow.add_node("sandbox", sandbox_execution_node)

workflow.set_entry_point("generate")
workflow.add_edge("generate", "sandbox")
workflow.add_conditional_edges("sandbox", should_continue, {"generate": "generate", END: END})

app = workflow.compile()

# Execute Graph
initial_state = {
    "task_description": "Click login button and assert dashboard title",
    "generated_code": "",
    "error_message": "",
    "iteration_count": 0,
    "test_passed": False
}
final_result = app.invoke(initial_state)
print("Final Status:", "PASSED" if final_result["test_passed"] else "FAILED")`
          }
        ]
      },
      fail: [
        "Infinite loops when reflection node generates identical code repeatedly.",
        "State mutation collisions when parallel worker nodes update the same dictionary key without a reducer.",
        "Memory leaks from unbounded checkpoint storage in long-running agent threads."
      ],
      test: {
        strategy: "Test state transitions as a Finite State Machine (FSM). Inject artificial failures at each node to verify that conditional edges route correctly to repair nodes or human-escalation states.",
        testCases: [
          "Verify graph terminates within max iteration threshold when sandbox consistently fails.",
          "Verify state snapshot correctly persists and resumes from checkpoint after server interruption.",
          "Assert 100% state immutability across branching nodes."
        ],
        metrics: ["Graph Loop Convergence Rate (Target: > 88%)", "Average Cycles to Resolution (Target: < 2.2)"]
      },
      production: [
        "Always define a hard maximum iteration guard (`max_iterations <= 5`) on cyclic edges.",
        "Use Redis or PostgreSQL checkpointers instead of in-memory dictionaries for multi-instance production pods.",
        "Emit OpenTelemetry trace spans at every node transition to visualize agent thought steps in LangSmith or Langfuse."
      ],
      interview: [
        {
          question: "How does LangGraph solve the limitations of standard LangChain AgentExecutor?",
          answer: "AgentExecutor was a rigid black-box while loop. LangGraph decomposes agent logic into explicit state machines with custom nodes, conditional edges, parallel branches, fine-grained state reducers, and native support for Human-in-the-loop pausing and checkpoint resumption."
        },
        {
          question: "How do you test and debug multi-turn state corruption in autonomous agents?",
          answer: "By using deterministic state snapshots, time-travel debugging via LangGraph checkpointers, validating state schemas with Pydantic after every node transition, and recording complete input/output spans in distributed tracing tools."
        }
      ]
    }
  },
  {
    slug: "mcp-architecture-deep-dive",
    title: "Model Context Protocol (MCP): The Universal Bridge for AI Tools & Data",
    summary: "Understand Anthropic's Model Context Protocol. Build custom MCP tool servers in Python to connect LLMs with test runners, databases, and CI pipelines.",
    category: "MCP",
    difficulty: "Intermediate",
    readingTime: "14 min read",
    publishedDate: "2026-03-08",
    tags: ["MCP", "Model Context Protocol", "Tools", "Claude", "FastAPI", "Automation"],
    prerequisites: ["Phase 3 (Function Calling)", "JSON-RPC basics"],
    phaseId: 6,
    sixQuestions: {
      what: "Before MCP (Model Context Protocol), connecting an LLM to internal company tools required custom API integrations for every client (Claude Desktop, Cursor, Antigravity, custom web app). MCP creates a standardized, open-source protocol (like LSP for language servers) allowing any AI model to discover and invoke tools, resources, and prompt templates uniformly.",
      how: "MCP operates on JSON-RPC 2.0 over STDIO (standard input/output for local tools) or SSE (Server-Sent Events for remote cloud services). An MCP Server registers three core primitives: Resources (read-only data like logs or database schemas), Prompts (reusable prompt templates), and Tools (executable functions with typed JSON Schema arguments).",
      build: {
        description: "A complete Python MCP server using the official `mcp` library that exposes test execution and log inspection tools directly to AI clients.",
        snippets: [
          {
            language: "python",
            filename: "qa_mcp_server.py",
            code: `import asyncio
import subprocess
from mcp.server.fastmcp import FastMCP

# Initialize FastMCP Server
mcp = FastMCP("QA-Environment-Server")

@mcp.tool()
def run_playwright_test(spec_path: str, browser: str = "chromium") -> str:
    """Runs an automated Playwright test suite and returns execution output."""
    try:
        cmd = ["npx", "playwright", "test", spec_path, f"--project={browser}"]
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
        return f"STDOUT:\\n{result.stdout}\\nSTDERR:\\n{result.stderr}"
    except subprocess.TimeoutExpired:
        return "ERROR: Test run timed out after 60 seconds."
    except Exception as e:
        return f"ERROR: Execution failed: {str(e)}"

@mcp.resource("logs://latest-failure")
def get_latest_failure_log() -> str:
    """Returns the stack trace of the latest failing test run in the CI pipeline."""
    return "AssertionError: Expected 'Dashboard' but received 'Login' at login.spec.ts:42"

if __name__ == "__main__":
    # Runs over standard input/output (STDIO) transport
    mcp.run()`
          }
        ]
      },
      fail: [
        "STDIO Deadlock: Server scripts printing debug logs to `stdout` instead of `stderr`, corrupting the JSON-RPC communication stream.",
        "Unbounded Execution: MCP tools running runaway subprocesses without timeouts, blocking the AI host client.",
        "Security Breach: Exposing raw shell or SQL execution tools without argument sanitization or permission boundaries."
      ],
      test: {
        strategy: "Test MCP servers using automated JSON-RPC contract tests. Validate tool schema definitions and execute permission sandboxing checks.",
        testCases: [
          "Verify `tools/list` returns valid JSON Schema definitions matching Python type hints.",
          "Verify server responds with standard JSON-RPC error codes on malformed parameters.",
          "Ensure sensitive credentials cannot be leaked through resource URI requests."
        ],
        metrics: ["Tool Invocation Latency (< 200ms overhead)", "Schema Conformance Rate (100%)"]
      },
      production: [
        "Always write internal logging to `sys.stderr` in STDIO mode so JSON-RPC on `sys.stdout` remains pristine.",
        "Use SSE (Server-Sent Events) with OAuth2 bearer tokens for distributed enterprise MCP deployments.",
        "Implement explicit confirmation prompts for high-impact tools (e.g. database drop, server restart)."
      ],
      interview: [
        {
          question: "How does Model Context Protocol differ from standard REST API tool calling?",
          answer: "REST APIs require custom client-side parsing and bespoke adapter logic for every AI host. MCP standardizes tool discovery, schema negotiation, streaming resource inspection, and prompt template sharing under a single protocol, decoupling AI applications from tool backends."
        },
        {
          question: "What are the security risks associated with MCP servers and how do you mitigate them?",
          answer: "Security risks include unauthorized tool invocation, command injection, and data exfiltration. Mitigations include strict schema sanitization, running MCP tools in isolated container sandboxes, enforcing Human-in-the-Loop confirmation on destructive operations, and using SSE with mutual TLS and OAuth2."
        }
      ]
    }
  },
  {
    slug: "transformer-attention-deep-dive",
    title: "Deconstructing Transformers: Self-Attention & Embeddings for QA Engineers",
    summary: "Understand Query, Key, Value matrices, Attention Weights, and Vector Cosine Distances without mathematical intimidation.",
    category: "Transformers",
    difficulty: "Beginner",
    readingTime: "15 min read",
    publishedDate: "2026-03-10",
    tags: ["Transformers", "Attention", "Embeddings", "Math Intuition", "Foundations"],
    prerequisites: ["High-school vector math intuition"],
    phaseId: 2,
    sixQuestions: {
      what: "Before Transformers (introduced in 'Attention Is All You Need', 2017), Natural Language Processing used Recurrent Neural Networks (RNNs) and LSTMs that processed text word by word. RNNs suffered from catastrophic forgetting over long paragraphs and couldn't be trained in parallel. The Transformer revolutionized AI by processing entire sentences simultaneously using Attention mechanisms.",
      how: "Each token is converted into an embedding vector. In Self-Attention, each word projects into three vectors: Query (what am I looking for?), Key (what do I offer?), and Value (what information do I contain?). The model computes the dot product of Query and Key to generate an Attention Matrix, normalizing weights with Softmax to determine how much attention each word should pay to every other word.",
      build: {
        description: "A minimal, clean Python implementation of Scaled Dot-Product Attention using NumPy to visualize how attention scores are calculated.",
        snippets: [
          {
            language: "python",
            filename: "scaled_dot_product_attention.py",
            code: `import numpy as np

def softmax(x):
    e_x = np.exp(x - np.max(x, axis=-1, keepdims=True))
    return e_x / e_x.sum(axis=-1, keepdims=True)

def scaled_dot_product_attention(Q, K, V):
    """
    Q: Query Matrix (seq_len, d_k)
    K: Key Matrix   (seq_len, d_k)
    V: Value Matrix (seq_len, d_v)
    """
    d_k = Q.shape[-1]
    # 1. Compute dot product similarity between Queries and Keys
    scores = np.matmul(Q, K.T) / np.sqrt(d_k)
    
    # 2. Normalize scores into attention probabilities with Softmax
    attention_weights = softmax(scores)
    
    # 3. Multiply weights by Values to produce contextual representation
    output = np.matmul(attention_weights, V)
    return output, attention_weights

# Simulation with 3 tokens: ["The", "automated", "test"]
np.random.seed(42)
d_k = 4 # Vector dimension
Q = np.random.rand(3, d_k)
K = np.random.rand(3, d_k)
V = np.random.rand(3, d_k)

out, weights = scaled_dot_product_attention(Q, K, V)
print("Attention Weights Matrix (3x3):\\n", np.round(weights, 3))`
          }
        ]
      },
      fail: [
        "Quadratic Memory Complexity: Attention computation scales as O(N^2) with context length, leading to out-of-memory (OOM) crashes on long documents.",
        "Lost-in-the-Middle: Attention weights tend to peak at the beginning and end of long prompts, neglecting critical details in the middle.",
        "Positional Encoding degradation when inputs exceed model training context boundaries."
      ],
      test: {
        strategy: "Test attention and context retention using 'Needle-in-a-Haystack' (NIAH) benchmark tests, placing test assertions at 10%, 25%, 50%, 75%, and 90% depth of long prompt contexts.",
        testCases: [
          "Run NIAH test across context windows from 1K to 128K tokens.",
          "Verify retrieval accuracy remains > 98% across all depth intervals.",
          "Assert latency scaling conforms to expected algorithmic boundaries."
        ],
        metrics: ["Needle Retrieval Accuracy (>= 98%)", "Context Degradation Slope"]
      },
      production: [
        "Use FlashAttention-2 or vLLM PagedAttention in production serving to bypass quadratic memory bottlenecks.",
        "Place critical instructions at the top and bottom of system prompts to leverage natural attention biases.",
        "Monitor prompt token lengths to stay within optimal attention density bounds."
      ],
      interview: [
        {
          question: "Explain the Query, Key, and Value analogy in Self-Attention.",
          answer: "Think of a search engine or database: The Query is what you type into the search bar. The Keys are the tags and titles of every page in the database. The match score between Query and Key determines the Attention weight. The Value is the actual content on the matching pages that you read."
        },
        {
          question: "Why is division by sqrt(d_k) necessary in Scaled Dot-Product Attention?",
          answer: "For large vector dimensions d_k, dot products grow large in magnitude, pushing the Softmax function into regions with extremely small gradients (vanishing gradient problem). Dividing by sqrt(d_k) scales the variance back to 1.0, keeping gradient flow stable."
        }
      ]
    }
  },
  {
    slug: "advanced-rag-chunking-reranking",
    title: "Advanced RAG Architecture: Semantic Chunking & Cross-Encoder Re-ranking",
    summary: "Fix poor retrieval accuracy in RAG systems. Compare chunking algorithms and implement Cross-Encoder re-ranking to boost top-3 precision.",
    category: "RAG",
    difficulty: "Intermediate",
    readingTime: "17 min read",
    publishedDate: "2026-03-12",
    tags: ["RAG", "Vector Search", "Chunking", "Re-ranking", "Cross-Encoders", "ChromaDB"],
    prerequisites: ["Phase 4 (RAG Fundamentals)"],
    phaseId: 4,
    sixQuestions: {
      what: "Naive RAG (simple character chunking + cosine similarity top-K) fails in enterprise systems. It retrieves out-of-context text fragments, misses tabular data, and clutters the LLM's prompt with low-relevance noise. Advanced RAG incorporates Semantic Chunking and Two-Stage Retrieval with Cross-Encoder Re-ranking to deliver surgically accurate context.",
      how: "Two-Stage Retrieval works in tandem: Stage 1 (Fast Retrieval) uses Bi-Encoders to fetch top-50 candidate chunks from a Vector DB in 15ms. Stage 2 (Re-ranking) uses a heavier Cross-Encoder model that jointly processes the query and chunk together to compute exact cross-attention relevance scores, selecting the definitive top-3 chunks.",
      build: {
        description: "A Python pipeline integrating ChromaDB vector retrieval with Cohere / BGE Cross-Encoder re-ranking.",
        snippets: [
          {
            language: "python",
            filename: "advanced_rag_reranker.py",
            code: `from typing import List
from sentence_transformers import CrossEncoder

# 1. Initialize Cross-Encoder Re-ranker
reranker = CrossEncoder('BAAI/bge-reranker-base')

def retrieve_and_rerank(
    query: str, 
    initial_chunks: List[str], 
    top_k: int = 3
) -> List[dict]:
    # Form (Query, Chunk) pairs
    pairs = [[query, chunk] for chunk in initial_chunks]
    
    # Compute Cross-Encoder Relevance Scores
    scores = reranker.predict(pairs)
    
    # Rank chunks by score
    scored_chunks = [
        {"chunk": chunk, "score": float(score)} 
        for chunk, score in zip(initial_chunks, scores)
    ]
    scored_chunks.sort(key=lambda x: x["score"], reverse=True)
    
    return scored_chunks[:top_k]

# Example
query = "What is the policy on flakiness in pull requests?"
candidates = [
    "Pull requests must have 80% unit test coverage before merging.",
    "Any test identified as flaky must be quarantined within 24 hours into the quarantine suite.",
    "Our CI/CD pipeline runs on AWS Graviton instances.",
    "Flaky tests create false alarm fatigue and delay deployments."
]

top_results = retrieve_and_rerank(query, candidates, top_k=2)
for idx, res in enumerate(top_results, 1):
    print(f"Rank {idx} [Score: {res['score']:.4f}]: {res['chunk']}")`
          }
        ]
      },
      fail: [
        "Lost context when chunk boundaries split a markdown table or bulleted list across two chunks.",
        "Latency inflation when re-ranking too many initial candidates (e.g. re-ranking 200 chunks instead of 30).",
        "Embedding mismatch when using different embedding models for ingestion and querying."
      ],
      test: {
        strategy: "Use Mean Reciprocal Rank (MRR@10) and Normalized Discounted Cumulative Gain (NDCG@10) on a curated QA benchmark dataset to measure retrieval accuracy before and after re-ranking.",
        testCases: [
          "Verify MRR score increases by >= 20% after adding Cross-Encoder re-ranking.",
          "Verify chunking algorithm preserves table headers intact.",
          "Load test retrieval pipeline under 100 concurrent requests."
        ],
        metrics: ["MRR@10 (Target: > 0.85)", "Retrieval Latency p95 (< 300ms)"]
      },
      production: [
        "Use Hybrid Search (BM25 + Dense Vectors) to catch exact keyword error codes that embeddings miss.",
        "Store chunk metadata (document title, section header, last modified timestamp) for citation generation.",
        "Cache frequent query embeddings in Redis to eliminate redundant vector computations."
      ],
      interview: [
        {
          question: "What is the difference between a Bi-Encoder and a Cross-Encoder?",
          answer: "A Bi-Encoder embeds queries and documents separately into vector space, allowing fast approximate nearest neighbor search via dot product. A Cross-Encoder feeds the query and document together through attention layers, allowing full cross-token attention for higher accuracy, but is too slow for searching millions of records directly."
        },
        {
          question: "How do you evaluate if a RAG retrieval failure is caused by poor chunking vs poor embedding model?",
          answer: "Inspect the raw retrieved chunks: If the relevant sentence is chopped in half or missing necessary headers, chunking is flawed. If the relevant paragraph is present in the database with clear context but ranks below top-50, the embedding model lacks domain specificity or requires hybrid search / fine-tuning."
        }
      ]
    }
  }
];
