"""Unit tests for Confluence chunking and RAG semantic retrieval."""

import pytest
from app.rag.chunker import load_confluence_docs, chunk_documents
from app.rag.vector_store import get_vector_store

def test_confluence_document_loading():
    """Verify markdown docs are loaded from confluence_docs directory."""
    docs = load_confluence_docs()
    assert len(docs) >= 3, "Expected at least 3 confluence documents."
    titles = [d["title"] for d in docs]
    assert any("Auth" in t or "Security" in t for t in titles)

def test_document_chunking():
    """Verify document chunker produces structured chunks with metadata."""
    docs = load_confluence_docs()
    chunks = chunk_documents(docs, chunk_size=300, chunk_overlap=30)
    assert len(chunks) > 0
    first_chunk = chunks[0]
    assert "chunk_id" in first_chunk
    assert "text" in first_chunk
    assert "metadata" in first_chunk
    assert "source" in first_chunk["metadata"]

def test_vector_store_similarity_search():
    """Verify similarity search returns relevant context for lockout threshold query."""
    store = get_vector_store()
    results = store.similarity_search("account lockout failed attempts threshold", k=2)
    assert len(results) > 0
    contents = " ".join([r["content"] for r in results]).lower()
    assert "lockout" in contents or "attempts" in contents or "consecutive" in contents
