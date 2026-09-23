"""Vector store management supporting Pinecone with seamless FAISS local fallback."""

import os
from typing import List, Dict, Any, Optional
from langchain_community.vectorstores import FAISS
from langchain_core.documents import Document

from app.config import settings
from app.rag.chunker import load_confluence_docs, chunk_documents
from app.rag.embeddings import get_embedding_provider
from app.rag.hybrid_search import HybridRetriever

_vector_store_instance = None

class KnowledgeVectorStore:
    def __init__(self):
        self.embedding_provider = get_embedding_provider()
        self.store = None
        self.hybrid_engine = HybridRetriever(rrf_k=60)
        self.provider_name = "FAISS (Local) + BM25 Hybrid"
        self._initialize_store()

    def _initialize_store(self):
        # Check if Pinecone credentials are set
        if settings.PINECONE_API_KEY:
            try:
                from pinecone import Pinecone
                from langchain_community.vectorstores import Pinecone as PineconeVectorStore
                pc = Pinecone(api_key=settings.PINECONE_API_KEY)
                # Verify or create index
                self.store = PineconeVectorStore.from_existing_index(
                    index_name=settings.PINECONE_INDEX,
                    embedding=self.embedding_provider
                )
                self.provider_name = "Pinecone (Cloud) + BM25 Hybrid"
                print(f"[VectorStore] Initialized Pinecone Index '{settings.PINECONE_INDEX}'")
                return
            except Exception as e:
                print(f"[VectorStore] Pinecone initialization notice: {e}. Falling back to FAISS.")

        # Fallback to FAISS
        self.provider_name = "FAISS (In-Memory) + BM25 Hybrid"
        self.ingest_documents()

    def ingest_documents(self, custom_docs: Optional[List[Dict[str, Any]]] = None):
        """Loads and indexes Confluence documents into both Vector and BM25 stores."""
        raw_docs = custom_docs or load_confluence_docs()
        chunks = chunk_documents(raw_docs)

        documents = [
            Document(page_content=c["text"], metadata=c["metadata"])
            for c in chunks
        ]

        # Index BM25
        bm25_docs = [{"content": c["text"], "metadata": c["metadata"], "source": c["metadata"].get("source", "confluence")} for c in chunks]
        self.hybrid_engine.fit(bm25_docs)

        if not documents:
            documents = [
                Document(page_content="Enterprise QA Knowledge Base Initialized.", metadata={"source": "system"})
            ]

        self.store = FAISS.from_documents(documents, self.embedding_provider)
        print(f"[VectorStore] Indexed {len(documents)} document chunks into {self.provider_name}.")

    def similarity_search(self, query: str, k: int = 4) -> List[Dict[str, Any]]:
        """Performs Hybrid search (BM25 Sparse + Dense Vector + Reciprocal Rank Fusion)."""
        if not self.store:
            self.ingest_documents()

        # 1. Dense retrieval
        dense_docs = self.store.similarity_search(query, k=max(k * 2, 6))
        dense_formatted = [
            {"content": d.page_content, "metadata": d.metadata, "source": d.metadata.get("source", "confluence")}
            for d in dense_docs
        ]

        # 2. Sparse BM25 retrieval
        sparse_results = self.hybrid_engine.bm25.search(query, top_k=max(k * 2, 6))

        # 3. Reciprocal Rank Fusion
        fused_results = self.hybrid_engine.fuse(dense_formatted, sparse_results, top_k=k)
        return fused_results


def get_vector_store() -> KnowledgeVectorStore:
    global _vector_store_instance
    if _vector_store_instance is None:
        _vector_store_instance = KnowledgeVectorStore()
    return _vector_store_instance
