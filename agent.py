import asyncio
from langchain_mcp_adapters.client import MultiServerMCPClient
from langgraph.prebuilt import create_react_agent
from router import ModelRouter

import os
import sys

async def get_qa_agent(prompt: str = None, preferred_provider: str = None):
    server_path = os.path.join(os.path.dirname(__file__), "mcp_server.py")
    client = MultiServerMCPClient({
        "qa_server": {
            "command": sys.executable,
            "args": [server_path],
            "transport": "stdio" 
        }
    })
    
    tools = await client.get_tools()
    llm = ModelRouter.get_routed_llm(
        prompt=prompt,
        task_type="agent_tool_calling",
        preferred_provider=preferred_provider,
        tools=tools,
        temperature=0.0
    )
    agent = create_react_agent(llm, tools)
    
    return agent, client

async def main():
    agent, client = await get_qa_agent()
    print("Sending prompt to Agent...")
    inputs = {"messages": [("user", "What is the final price of item A1 ($200) with a 15% discount, and is it in stock?")]}
    
    try:
        async for event in agent.astream(inputs, stream_mode="values"):
            message = event["messages"][-1]
            message.pretty_print()
    finally:
        if hasattr(client, "close"):
            await client.close()

if __name__ == "__main__":
    asyncio.run(main())
