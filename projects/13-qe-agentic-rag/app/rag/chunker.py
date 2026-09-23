"""Document chunking and ingestion utility for Confluence specifications."""

from pathlib import Path
from typing import List, Dict, Any
from langchain_text_splitters import RecursiveCharacterTextSplitter
from app.config import settings

def load_confluence_docs(docs_dir: Path = settings.CONFLUENCE_DIR) -> List[Dict[str, Any]]:
    """Loads all markdown files from the Confluence docs directory."""
    documents = []
    if not docs_dir.exists():
        return documents

    for file_path in docs_dir.glob("*.md"):
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()
            documents.append({
                "source": file_path.name,
                "path": str(file_path),
                "content": content,
                "title": file_path.stem.replace("_", " ").title()
            })
        except Exception as e:
            print(f"[Warning] Failed to read {file_path}: {e}")
    return documents

def chunk_documents(documents: List[Dict[str, Any]], chunk_size: int = 400, chunk_overlap: int = 50) -> List[Dict[str, Any]]:
    """Chunks documents into retrievable snippets with preserved metadata."""
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        separators=["\n## ", "\n### ", "\n\n", "\n", " "]
    )

    chunks = []
    for doc in documents:
        splits = splitter.split_text(doc["content"])
        for idx, split_text in enumerate(splits):
            chunks.append({
                "chunk_id": f"{doc['source']}#chunk_{idx}",
                "text": split_text.strip(),
                "metadata": {
                    "source": doc["source"],
                    "title": doc["title"],
                    "chunk_index": idx
                }
            })
    return chunks
