import os
import logging
from typing import Optional, List
from dotenv import load_dotenv
from langchain_core.language_models.chat_models import BaseChatModel

# Load environment variables
load_dotenv()

logger = logging.getLogger("ModelRouter")

class ModelRouter:
    """
    Intelligent Model Router that selects the optimal LLM provider
    based on available API keys in .env, token estimation, and task complexity,
    with automatic fallbacks on rate limits or errors.
    """

    @staticmethod
    def estimate_tokens(prompt: str) -> int:
        """Estimate token count based on prompt length (approx 4 chars per token)."""
        return max(1, len(prompt) // 4)

    @staticmethod
    def get_available_providers() -> List[str]:
        """Detect which providers have valid API keys set."""
        providers = []
        if os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY"):
            providers.append("google")
        if os.getenv("NVIDIA_API_KEY"):
            providers.append("nvidia")
        if os.getenv("OPEN_ROUTER_API_KEY") or os.getenv("OPENROUTER_API_KEY"):
            providers.append("openrouter")
        if os.getenv("OPENAI_API_KEY"):
            providers.append("openai")
        return providers

    @classmethod
    def create_model_instance(cls, provider: str, model_name: Optional[str] = None, temperature: float = 0.0) -> Optional[BaseChatModel]:
        """Instantiate a chat model for a given provider."""
        try:
            if provider == "google":
                from langchain_google_genai import ChatGoogleGenerativeAI
                api_key = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")
                model = model_name or os.getenv("GEMINI_MODEL", "gemini-3.6-flash")
                return ChatGoogleGenerativeAI(
                    model=model,
                    google_api_key=api_key,
                    temperature=temperature
                )

            elif provider == "nvidia":
                from langchain_openai import ChatOpenAI
                api_key = os.getenv("NVIDIA_API_KEY")
                model = model_name or os.getenv("NVIDIA_MODEL", "meta/llama-3.3-70b-instruct")
                return ChatOpenAI(
                    model=model,
                    openai_api_key=api_key,
                    openai_api_base="https://integrate.api.nvidia.com/v1",
                    temperature=temperature
                )

            elif provider == "openrouter":
                from langchain_openai import ChatOpenAI
                api_key = os.getenv("OPEN_ROUTER_API_KEY") or os.getenv("OPENROUTER_API_KEY")
                model = model_name or os.getenv("OPENROUTER_MODEL", "nvidia/nemotron-3.5-lightning:free")
                return ChatOpenAI(
                    model=model,
                    openai_api_key=api_key,
                    openai_api_base="https://openrouter.ai/api/v1",
                    temperature=temperature
                )

            elif provider == "openai":
                from langchain_openai import ChatOpenAI
                api_key = os.getenv("OPENAI_API_KEY")
                model = model_name or os.getenv("OPENAI_MODEL", "gpt-4o-mini")
                return ChatOpenAI(
                    model=model,
                    openai_api_key=api_key,
                    temperature=temperature
                )

        except Exception as e:
            logger.warning(f"Failed to instantiate model for provider '{provider}': {e}")
            return None

        return None

    @classmethod
    def get_routed_llm(
        cls,
        prompt: Optional[str] = None,
        task_type: str = "agent_tool_calling",
        preferred_provider: Optional[str] = None,
        tools: Optional[List] = None,
        temperature: float = 0.0
    ) -> BaseChatModel:
        """
        Route the request to the optimal model and configure automatic fallbacks.
        
        Routing Logic:
        1. If user explicitly specifies a preferred provider, prioritize it.
        2. Evaluate token requirements:
           - Large input (>3000 tokens): Priority to Google Gemini (massive context window & speed).
           - Tool execution / QA: Priority to Google Gemini or NVIDIA NIM / OpenRouter.
        3. Build automatic fallback chain (`with_fallbacks`) across all available providers.
        """
        available = cls.get_available_providers()
        if not available:
            raise ValueError(
                "No LLM API keys found in environment. Please provide at least one of: "
                "GOOGLE_API_KEY, NVIDIA_API_KEY, OPEN_ROUTER_API_KEY, or OPENAI_API_KEY."
            )

        token_count = cls.estimate_tokens(prompt) if prompt else 0

        # Prioritize provider based on availability and task/token profile
        ordered_providers = []
        if preferred_provider and preferred_provider in available:
            ordered_providers.append(preferred_provider)

        # Default priority: Google (Fast/High Token limits) -> NVIDIA NIM -> OpenRouter -> OpenAI
        default_order = ["google", "nvidia", "openrouter", "openai"]
        for p in default_order:
            if p in available and p not in ordered_providers:
                ordered_providers.append(p)

        logger.info(f"Routing task '{task_type}' (estimated {token_count} tokens). Provider chain: {ordered_providers}")

        models = []
        for provider in ordered_providers:
            model = cls.create_model_instance(provider, temperature=temperature)
            if model is not None:
                models.append(model)

        if not models:
            raise RuntimeError(f"Failed to instantiate any model from available providers: {available}")

        if tools:
            tool_models = [m.bind_tools(tools) for m in models]
            if len(tool_models) > 1:
                return tool_models[0].with_fallbacks(tool_models[1:], exceptions_to_handle=(Exception,))
            return tool_models[0]

        primary_model = models[0]
        if len(models) > 1:
            return primary_model.with_fallbacks(models[1:], exceptions_to_handle=(Exception,))
        return primary_model
