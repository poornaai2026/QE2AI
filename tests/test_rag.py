import pytest
from datasets import Dataset
from ragas import evaluate
from ragas.metrics import faithfulness, answer_relevancy

def test_rag_faithfulness():
    test_data = {
        "question": ["What is the company's Q3 revenue?"],
        "contexts": [["The Q3 earnings report shows a revenue of $4.2 million, up 12% from Q2."]],
        "answer": ["The Q3 revenue was $4.2 million."],
    }
    
    dataset = Dataset.from_dict(test_data)
    result = evaluate(
        dataset,
        metrics=[faithfulness, answer_relevancy],
    )
    scores = result.to_pandas()
    
    assert scores["faithfulness"][0] >= 0.9
    assert scores["answer_relevancy"][0] >= 0.8
