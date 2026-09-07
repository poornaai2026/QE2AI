from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import time

app = FastAPI(title="QE2AI Resilient Gateway", version="1.0.0")

# Local in-memory mock semantic cache
SEMANTIC_CACHE = {}

class QueryRequest(BaseModel):
    prompt: str
    user_id: str

class QueryResponse(BaseModel):
    answer: str
    latency_ms: float
    cached: bool
    estimated_cost: float

@app.post("/api/v1/generate", response_model=QueryResponse)
async def generate_response(req: QueryRequest):
    start_time = time.time()
    
    # Check Semantic Cache
    if req.prompt in SEMANTIC_CACHE:
        latency = (time.time() - start_time) * 1000
        return QueryResponse(
            answer=SEMANTIC_CACHE[req.prompt],
            latency_ms=round(latency, 2),
            cached=True,
            estimated_cost=0.0000
        )
    
    # Cache Miss: Simulate LLM generation
    time.sleep(0.3)
    generated_text = f"Analyzed prompt '{req.prompt}' with high faithfulness."
    SEMANTIC_CACHE[req.prompt] = generated_text
    
    latency = (time.time() - start_time) * 1000
    return QueryResponse(
        answer=generated_text,
        latency_ms=round(latency, 2),
        cached=False,
        estimated_cost=0.0015
    )

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
