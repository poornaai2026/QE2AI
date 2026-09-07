import pytest
from httpx import AsyncClient, ASGITransport
from main import app

@pytest.mark.asyncio
async def test_health_endpoint():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/healthz")
        assert response.status_code == 200
        assert response.json()["status"] == "healthy"

@pytest.mark.asyncio
async def test_create_and_get_test_case():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        payload = {
            "title": "Verify Login with Valid Credentials",
            "suite": "Authentication",
            "priority": "P0",
            "tags": ["smoke", "auth", "regression"],
            "is_automated": True,
            "expected_result": "User is redirected to the dashboard with active session token"
        }
        create_res = await client.post("/api/v1/test-cases", json=payload)
        assert create_res.status_code == 201
        data = create_res.json()
        assert data["title"] == payload["title"]
        case_id = data["id"]

        get_res = await client.get(f"/api/v1/test-cases/{case_id}")
        assert get_res.status_code == 200
        assert get_res.json()["suite"] == "Authentication"
