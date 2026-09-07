from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
import uuid

app = FastAPI(
    title="QE Test Management API",
    description="Asynchronous Test Management Service for Quality Engineers",
    version="1.0.0"
)

# In-memory storage for test cases
TEST_CASES_DB = {}

class TestCaseCreate(BaseModel):
    title: str = Field(..., min_length=5, max_length=150, description="Test Case Title")
    suite: str = Field(..., description="Test Suite Name (e.g., Auth, Checkout)")
    priority: str = Field(..., pattern="^(P0|P1|P2|P3)$", description="Priority level")
    tags: List[str] = Field(default_factory=list, description="Categorization tags")
    is_automated: bool = False
    expected_result: str = Field(..., min_length=5, description="Expected assertion outcome")

class TestCase(TestCaseCreate):
    id: str
    created_at: datetime

@app.get("/healthz", status_code=status.HTTP_200_OK)
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}

@app.post("/api/v1/test-cases", response_model=TestCase, status_code=status.HTTP_201_CREATED)
async def create_test_case(test_case_in: TestCaseCreate):
    tc_id = str(uuid.uuid4())[:8]
    test_case = TestCase(
        id=tc_id,
        created_at=datetime.utcnow(),
        **test_case_in.model_dump()
    )
    TEST_CASES_DB[tc_id] = test_case
    return test_case

@app.get("/api/v1/test-cases", response_model=List[TestCase])
async def list_test_cases(suite: Optional[str] = None):
    if suite:
        return [tc for tc in TEST_CASES_DB.values() if tc.suite.lower() == suite.lower()]
    return list(TEST_CASES_DB.values())

@app.get("/api/v1/test-cases/{case_id}", response_model=TestCase)
async def get_test_case(case_id: str):
    if case_id not in TEST_CASES_DB:
        raise HTTPException(status_code=404, detail=f"Test case {case_id} not found")
    return TEST_CASES_DB[case_id]

@app.delete("/api/v1/test-cases/{case_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_test_case(case_id: str):
    if case_id not in TEST_CASES_DB:
        raise HTTPException(status_code=404, detail=f"Test case {case_id} not found")
    del TEST_CASES_DB[case_id]
    return None
