import os

# Clean any legacy LangChain environment variables
os.environ.pop("LANGCHAIN_TRACING", None)
os.environ.pop("LANGCHAIN_HANDLER", None)
os.environ["LANGCHAIN_TRACING_V2"] = "false"
