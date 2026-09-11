import pytest_asyncio
import sys
import os
import sniffio
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from agent import get_qa_agent

@pytest_asyncio.fixture(scope="function")
async def qa_agent_setup():
    sniffio.current_async_library_cvar.set("asyncio")
    agent, client = await get_qa_agent()
    yield agent
    if hasattr(client, "close"):
        await client.close()
