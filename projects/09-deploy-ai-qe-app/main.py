from fastapi import FastAPI
from datetime import datetime

app = FastAPI(title="Production AI QE Microservice", version="1.0.0")

@app.get("/healthz")
async def health():
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}

@app.get("/readyz")
async def readiness():
    return {"status": "ready"}
