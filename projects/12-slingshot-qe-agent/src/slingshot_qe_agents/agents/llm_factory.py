"""LLM Factory for SlingShot QE Agent with support for Gemini, OpenAI, and Mock fallback."""

import os
from typing import Any, Optional
from dotenv import load_dotenv
from langchain_core.language_models import BaseChatModel

load_dotenv()


def get_chat_model(temperature: float = 0.2) -> Optional[BaseChatModel]:
    """Initialize configured Chat LLM or return None if offline mode."""
    provider = os.getenv("DEFAULT_MODEL_PROVIDER", "gemini").lower()
    gemini_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
    openai_key = os.getenv("OPENAI_API_KEY")

    if provider == "gemini" and gemini_key:
        from langchain_google_genai import ChatGoogleGenerativeAI
        model_name = os.getenv("DEFAULT_MODEL_NAME", "gemini-2.5-flash")
        return ChatGoogleGenerativeAI(
            model=model_name,
            google_api_key=gemini_key,
            temperature=temperature
        )
    elif (provider == "openai" or openai_key) and openai_key:
        from langchain_openai import ChatOpenAI
        model_name = os.getenv("DEFAULT_MODEL_NAME", "gpt-4o")
        return ChatOpenAI(
            model=model_name,
            api_key=openai_key,
            temperature=temperature
        )
    elif gemini_key:
        from langchain_google_genai import ChatGoogleGenerativeAI
        return ChatGoogleGenerativeAI(
            model="gemini-2.5-flash",
            google_api_key=gemini_key,
            temperature=temperature
        )

    return None
