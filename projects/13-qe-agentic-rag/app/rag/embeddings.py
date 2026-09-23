"""Embedding generation with multi-provider support (OpenAI, Gemini, and Local Fallback)."""

import hashlib
import numpy as np
from typing import List
from app.config import settings

from langchain_core.embeddings import Embeddings

class LocalDeterministicEmbeddings(Embeddings):
    """Lightweight deterministic embeddings for offline execution & tests (dim=384)."""
    def __init__(self, dimension: int = 384):
        self.dimension = dimension

    def _embed_text(self, text: str) -> List[float]:
        # Generate stable pseudo-semantic embedding vector using hashed token representations
        tokens = text.lower().split()
        vector = np.zeros(self.dimension, dtype=np.float32)
        if not tokens:
            return vector.tolist()

        for token in tokens:
            # Deterministic hash to dimension space
            h = int(hashlib.md5(token.encode("utf-8")).hexdigest(), 16)
            idx = h % self.dimension
            sign = 1.0 if (h % 2 == 0) else -1.0
            vector[idx] += sign

        # L2 Normalize
        norm = np.linalg.norm(vector)
        if norm > 0:
            vector = vector / norm
        return vector.tolist()

    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        return [self._embed_text(t) for t in texts]

    def embed_query(self, text: str) -> List[float]:
        return self._embed_text(text)

    def __call__(self, text: str) -> List[float]:
        return self.embed_query(text)


def get_embedding_provider():
    """Returns the appropriate embedding provider based on available environment credentials."""
    if settings.OPENAI_API_KEY:
        try:
            from langchain_openai import OpenAIEmbeddings
            return OpenAIEmbeddings(openai_api_key=settings.OPENAI_API_KEY)
        except Exception as e:
            print(f"[Warning] Failed to initialize OpenAI Embeddings: {e}")

    if settings.GEMINI_API_KEY:
        try:
            from langchain_google_genai import GoogleGenAIEmbeddings
            return GoogleGenAIEmbeddings(google_api_key=settings.GEMINI_API_KEY, model="models/text-embedding-004")
        except Exception as e:
            print(f"[Warning] Failed to initialize Gemini Embeddings: {e}")

    return LocalDeterministicEmbeddings(dimension=384)
