# Project 10: Production-Ready AI QE Platform

> **Track 10 — Production AI**  
> **Difficulty**: Advanced  
> **Repository Path**: `projects/10-production-ai-qe-platform`

An enterprise AI gateway and observability platform featuring Redis semantic caching to slash token costs, LangSmith distributed tracing, and input/output safety guardrails.

---

## 🏗️ Architecture

```text
Client Application Request
   │
   ▼
Input Safety Guardrail (Prompt Injection & PII Sanitizer)
   │
   ▼
Redis Semantic Cache (Cosine Similarity >= 0.92)
   ├── Cache Hit  ──▶ Instant Response (12ms, $0.00 cost)
   └── Cache Miss ──▶ LLM Router ──▶ OpenAI / Claude API
                           │
                           ▼
Distributed Tracing Span ──▶ LangSmith / Langfuse
   │
   ▼
Client Response & Cache Write
```

---

## 🛠️ Quickstart

```bash
cd projects/10-production-ai-qe-platform

# 1. Launch Redis and Gateway stack
docker compose up -d

# 2. Run cache benchmark script
python benchmark_cache.py
```
