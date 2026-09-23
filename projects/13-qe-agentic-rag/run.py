"""Single-command launcher for the Agentic QE Platform and Target Application."""

import sys
import time
import threading
import uvicorn
from pathlib import Path

# Add project root to sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent))

from app.config import settings
from app.rag.vector_store import get_vector_store

def start_target_app():
    """Runs the mock target enterprise app on port 8080."""
    uvicorn.run(
        "app.target_app.server:target_app",
        host="0.0.0.0",
        port=settings.TARGET_APP_PORT,
        log_level="warning"
    )

def start_main_platform():
    """Runs the main Agentic QE Platform on port 8000."""
    uvicorn.run(
        "app.server.api:app",
        host="0.0.0.0",
        port=settings.PLATFORM_PORT,
        log_level="info"
    )

def main():
    print("=" * 70)
    print("  AI-POWERED AGENTIC QUALITY ENGINEERING (QE) PLATFORM")
    print("  LangGraph • LangChain RAG • Pinecone • Ragas • MCP • Playwright")
    print("=" * 70)

    # Initialize Vector Store & Ingest Confluence Docs
    print("\n[Startup] Initializing RAG Knowledge Base...")
    store = get_vector_store()
    print(f"[Startup] Vector Store online ({store.provider_name}).")

    # Start Target App in background thread
    print(f"[Startup] Launching Target Demo App on http://localhost:{settings.TARGET_APP_PORT}/login...")
    target_thread = threading.Thread(target=start_target_app, daemon=True)
    target_thread.start()

    time.sleep(1.0)

    # Start Main Platform
    print(f"[Startup] Launching Agentic QE Dashboard on http://localhost:{settings.PLATFORM_PORT}...\n")
    start_main_platform()

if __name__ == "__main__":
    main()
