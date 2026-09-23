import os
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

os.environ.pop("LANGCHAIN_TRACING", None)
os.environ.pop("LANGCHAIN_HANDLER", None)
os.environ["LANGCHAIN_TRACING_V2"] = "false"

BASE_DIR = Path(__file__).resolve().parent.parent

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=str(BASE_DIR / ".env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )

    BASE_DIR: Path = BASE_DIR

    # API Keys & Models
    OPENAI_API_KEY: Optional[str] = None
    OPENAI_MODEL: str = "gpt-4o"
    GEMINI_API_KEY: Optional[str] = None
    GEMINI_MODEL: str = "gemini-2.5-flash"

    # Pinecone Vector DB
    PINECONE_API_KEY: Optional[str] = None
    PINECONE_INDEX: str = "qe-enterprise-rag"
    PINECONE_ENVIRONMENT: str = "us-east-1"

    # Ports
    PLATFORM_PORT: int = 8000
    TARGET_APP_PORT: int = 8080
    MCP_SERVER_PORT: int = 8001

    # Quality Gate & Agent Controls
    AI_QUALITY_GATE_THRESHOLD: float = 0.85
    MAX_REGENERATION_ATTEMPTS: int = 2
    HEADLESS_BROWSER: bool = True
    HITL_ENABLED: bool = False

    # Directories
    DATA_DIR: Path = BASE_DIR / "app" / "data"
    CONFLUENCE_DIR: Path = BASE_DIR / "app" / "data" / "confluence_docs"
    TESTS_DIR: Path = BASE_DIR / "app" / "test_runner" / "generated_tests"
    REPORTS_DIR: Path = BASE_DIR / "app" / "test_runner" / "reports"

settings = Settings()

# Ensure directories exist
settings.DATA_DIR.mkdir(parents=True, exist_ok=True)
settings.CONFLUENCE_DIR.mkdir(parents=True, exist_ok=True)
settings.TESTS_DIR.mkdir(parents=True, exist_ok=True)
settings.REPORTS_DIR.mkdir(parents=True, exist_ok=True)
