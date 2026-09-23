"""Hybrid Retrieval Engine combining BM25 Sparse Keyword Search with Dense Vector Search using Reciprocal Rank Fusion (RRF)."""

import math
import re
from typing import List, Dict, Any, Tuple
from collections import Counter

class BM25Retriever:
    """Pure-Python, fast BM25 (Okapi) keyword search engine for technical QA documentation."""
    def __init__(self, k1: float = 1.5, b: float = 0.75):
        self.k1 = k1
        self.b = b
        self.corpus: List[Dict[str, Any]] = []
        self.doc_len: List[int] = []
        self.avg_doc_len: float = 0.0
        self.df: Counter = Counter()
        self.idf: Dict[str, float] = {}

    def _tokenize(self, text: str) -> List[str]:
        # Tokenize preserving technical tokens like AUTH_423_LOCKED, data-testid, and numbers
        return [t.lower() for t in re.findall(r"[a-zA-Z0-9_\-\:]{2,}", text)]

    def fit(self, documents: List[Dict[str, Any]]):
        """Indexes documents and calculates corpus-level IDF weights."""
        self.corpus = documents
        total_len = 0
        tokenized_corpus = []

        for doc in documents:
            tokens = self._tokenize(doc["content"])
            tokenized_corpus.append(tokens)
            doc_l = len(tokens)
            self.doc_len.append(doc_l)
            total_len += doc_l

            unique_tokens = set(tokens)
            for ut in unique_tokens:
                self.df[ut] += 1

        n_docs = len(documents)
        self.avg_doc_len = total_len / max(n_docs, 1)

        # Calculate Okapi BM25 IDF
        for word, freq in self.df.items():
            # Standard smoothed IDF formula
            self.idf[word] = math.log(1.0 + (n_docs - freq + 0.5) / (freq + 0.5))

    def search(self, query: str, top_k: int = 5) -> List[Tuple[Dict[str, Any], float]]:
        """Scores documents against query using BM25 formula."""
        q_tokens = self._tokenize(query)
        scores = []

        for idx, doc in enumerate(self.corpus):
            tokens = self._tokenize(doc["content"])
            doc_len = self.doc_len[idx]
            term_freqs = Counter(tokens)
            score = 0.0

            for q in q_tokens:
                if q in term_freqs:
                    tf = term_freqs[q]
                    idf = self.idf.get(q, 0.0)
                    numerator = tf * (self.k1 + 1.0)
                    denominator = tf + self.k1 * (1.0 - self.b + self.b * (doc_len / max(self.avg_doc_len, 1.0)))
                    score += idf * (numerator / denominator)

            scores.append((doc, score))

        scores.sort(key=lambda x: x[1], reverse=True)
        return scores[:top_k]


class HybridRetriever:
    """Combines BM25 and Vector Search results using Reciprocal Rank Fusion (RRF)."""
    def __init__(self, rrf_k: int = 60):
        self.rrf_k = rrf_k
        self.bm25 = BM25Retriever()

    def fit(self, documents: List[Dict[str, Any]]):
        self.bm25.fit(documents)

    def fuse(
        self,
        dense_results: List[Dict[str, Any]],
        sparse_results: List[Tuple[Dict[str, Any], float]],
        top_k: int = 4
    ) -> List[Dict[str, Any]]:
        """Applies Reciprocal Rank Fusion (RRF) to merge dense and sparse rankings."""
        rrf_scores: Dict[str, float] = {}
        doc_store: Dict[str, Dict[str, Any]] = {}
        dense_ranks: Dict[str, int] = {}
        sparse_ranks: Dict[str, int] = {}

        # 1. Rank Dense
        for rank, doc in enumerate(dense_results):
            content_key = doc["content"][:100]
            doc_store[content_key] = doc
            dense_ranks[content_key] = rank + 1
            rrf_scores[content_key] = rrf_scores.get(content_key, 0.0) + (1.0 / (self.rrf_k + rank + 1))

        # 2. Rank Sparse (BM25)
        for rank, (doc, score) in enumerate(sparse_results):
            content_key = doc["content"][:100]
            if content_key not in doc_store:
                doc_store[content_key] = doc
            sparse_ranks[content_key] = rank + 1
            rrf_scores[content_key] = rrf_scores.get(content_key, 0.0) + (1.0 / (self.rrf_k + rank + 1))

        # Sort by final RRF score
        sorted_keys = sorted(rrf_scores.keys(), key=lambda k: rrf_scores[k], reverse=True)

        final_results = []
        for k in sorted_keys[:top_k]:
            item = dict(doc_store[k])
            item["rrf_score"] = round(rrf_scores[k], 4)
            item["dense_rank"] = dense_ranks.get(k, None)
            item["bm25_rank"] = sparse_ranks.get(k, None)
            item["fusion_method"] = "RRF (BM25 + Dense Vector)"
            final_results.append(item)

        return final_results
