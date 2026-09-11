import pytest
import allure
from langchain_core.messages import HumanMessage, AIMessage

@allure.epic("Agent Capabilities")
@allure.feature("Tool Selection")
@allure.severity(allure.severity_level.CRITICAL)
@pytest.mark.asyncio
async def test_agent_selects_inventory_tool(qa_agent_setup):
    with allure.step("Initialize Agent and Define Prompt"):
        agent = qa_agent_setup
        inputs = {"messages": [HumanMessage(content="Can you check if we have item B2 in stock?")]}
    
    with allure.step("Invoke Agent LLM"):
        state = await agent.ainvoke(inputs)
        messages = state["messages"]
    
    with allure.step("Extract Tool Calls"):
        tool_call_messages = [m for m in messages if isinstance(m, AIMessage) and m.tool_calls]
        assert len(tool_call_messages) > 0, "Agent failed to invoke any tool."
        first_tool_call = tool_call_messages[0].tool_calls[0]
    
    with allure.step("Assert Correct Tool Selected"):
        assert first_tool_call["name"] == "check_inventory"

@allure.epic("Agent Capabilities")
@allure.feature("Parameter Extraction")
@pytest.mark.asyncio
async def test_agent_discount_parameters(qa_agent_setup):
    agent = qa_agent_setup
    prompt = "I have a cart total of $150. Apply a twenty percent discount to it."
    inputs = {"messages": [HumanMessage(content=prompt)]}
    
    state = await agent.ainvoke(inputs)
    messages = state["messages"]
    
    tool_call_messages = [m for m in messages if isinstance(m, AIMessage) and m.tool_calls]
    first_tool_call = tool_call_messages[0].tool_calls[0]
    
    assert first_tool_call["name"] == "calculate_discount"
    args = first_tool_call["args"]
    assert args.get("price") == 150.0
    assert args.get("discount_percent") == 20.0
