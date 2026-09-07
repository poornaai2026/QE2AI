# Project 04: PDF RAG / QE Knowledge Assistant

> **Track 04 — Retrieval-Augmented Generation (RAG)**  
> **Difficulty**: Intermediate  
> **Repository Path**: `projects/04-pdf-rag-knowledge-assistant`

An embedded vector search assistant that indexes complex PDF software architecture documentation and specifications into local ChromaDB to answer QE queries with exact source citations.

---

## 🏗️ Architecture

```text
PDF Software Specs
   │
   ▼
PyMuPDF Text & Table Extractor
   │
   ▼
Header-Aware Chunking (512 tokens + 64 overlap)
   │
   ▼
ChromaDB Local Vector Store (Sentence-Transformers)
   │
   ▼
Two-Stage Retrieval (Dense Cosine Similarity + Cross-Encoder Re-ranker)
   │
   ▼
Grounded QA Answer with Document & Page Citations
```

---

## 🛠️ Quickstart

```bash
cd projects/04-pdf-rag-knowledge-assistant
python -m venv venv
source venv/bin/activate

pip install -r requirements.txt

# Ingest documentation
python ingest.py --data ./docs

# Query knowledge assistant
python query.py --question "What are the session timeout requirements?"
```
