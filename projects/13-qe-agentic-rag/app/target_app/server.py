"""Target enterprise application mock server for Playwright automated testing."""

from pathlib import Path
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse
from app.config import settings

target_app = FastAPI(title="Target Enterprise Web Application")
TEMPLATE_PATH = Path(__file__).parent / "templates" / "index.html"

_app_state = {
    "bug_mode": False,
    "lockout_attempts": 0,
    "locked": False
}

@target_app.get("/", response_class=HTMLResponse)
@target_app.get("/login", response_class=HTMLResponse)
async def login_page(request: Request, buggy: bool = False):
    """Serves the login page, injecting bug_mode parameter if enabled."""
    is_buggy = buggy or _app_state["bug_mode"]
    with open(TEMPLATE_PATH, "r", encoding="utf-8") as f:
        html = f.read()

    if is_buggy:
        # Replace data-testid to trigger locator drift demo
        html = html.replace('data-testid="button-login"', 'id="legacy-login-btn"')
        html = html.replace('Mode: Certified Stable (v2.4)', 'Mode: Buggy UI (Locator Drift Active)')
        html = html.replace('class="badge"', 'class="badge buggy"')
        html = html.replace('let bugMode = false;', 'let bugMode = true;')

    return HTMLResponse(content=html)


@target_app.get("/dashboard", response_class=HTMLResponse)
async def dashboard_page():
    with open(TEMPLATE_PATH, "r", encoding="utf-8") as f:
        html = f.read()
    # Inject dashboard display block
    html = html.replace('class="auth-card dashboard-view" id="dashboard-card"', 'class="auth-card" id="dashboard-card"')
    html = html.replace('id="login-card"', 'id="login-card" style="display:none"')
    return HTMLResponse(content=html)


@target_app.post("/api/auth/reset")
async def reset_auth_state():
    """Resets lockout and failed attempts for fresh test suite execution."""
    _app_state["lockout_attempts"] = 0
    _app_state["locked"] = False
    return {"status": "RESET_SUCCESSFUL", "failed_attempts": 0, "locked": False}


@target_app.post("/api/target/toggle-bug")
async def toggle_bug(enable: bool):
    """Toggles intentional locator drift / premature lockout bug mode."""
    _app_state["bug_mode"] = enable
    return {"status": "SUCCESS", "bug_mode": _app_state["bug_mode"]}


@target_app.get("/api/target/status")
async def target_status():
    return {
        "server": "Target App Online",
        "port": settings.TARGET_APP_PORT,
        "bug_mode": _app_state["bug_mode"],
        "lockout_attempts": _app_state["lockout_attempts"],
        "locked": _app_state["locked"]
    }
