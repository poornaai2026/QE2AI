import pytest
from deepeval import assert_test
from deepeval.metrics import AnswerRelevancyMetric
from deepeval.test_case import LLMTestCase

@pytest.mark.asyncio
async def test_agent_answer_relevancy(qa_agent_setup):
    agent = qa_agent_setup
    prompt = "I want to buy item A1 with a 15% discount. What is the final price?"
    
    state = await agent.ainvoke({"messages": [("user", prompt)]})
    raw_output = state["messages"][-1].content
    if isinstance(raw_output, list):
        actual_output = " ".join([p.get("text", str(p)) if isinstance(p, dict) else str(p) for p in raw_output])
    else:
        actual_output = str(raw_output)
    
    test_case = LLMTestCase(
        input=prompt,
        actual_output=actual_output
    )
    
    relevancy_metric = AnswerRelevancyMetric(threshold=0.8)
    assert_test(test_case, [relevancy_metric])
