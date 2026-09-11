import pytest
from langchain_core.messages import HumanMessage, AIMessage

@pytest.mark.asyncio
async def test_multi_tool_trajectory(qa_agent_setup):
    agent = qa_agent_setup
    prompt = "I want to buy item A1. The base price is $200, and I have a 15% discount code. Can you check if it's in stock and tell me the final price?"
    inputs = {"messages": [HumanMessage(content=prompt)]}
    
    state = await agent.ainvoke(inputs)
    messages = state["messages"]
    
    executed_tools = []
    for msg in messages:
        if isinstance(msg, AIMessage) and msg.tool_calls:
            for tool_call in msg.tool_calls:
                executed_tools.append(tool_call["name"])
                
    assert "check_inventory" in executed_tools
    assert "calculate_discount" in executed_tools
    
    raw_content = messages[-1].content
    if isinstance(raw_content, list):
        final_ai_message = " ".join([p.get("text", str(p)) if isinstance(p, dict) else str(p) for p in raw_content]).lower()
    else:
        final_ai_message = str(raw_content).lower()

    assert "170" in final_ai_message
    assert "in stock" in final_ai_message or "45" in final_ai_message
