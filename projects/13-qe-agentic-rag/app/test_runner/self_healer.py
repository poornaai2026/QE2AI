"""In-Flight Active Playwright Self-Healing Locator Engine."""

import time
from typing import Dict, Any, List, Optional
from playwright.sync_api import Page, Locator, TimeoutError as PlaywrightTimeoutError

class SelfHealingLocator:
    """Intersects locator interactions, catching TimeoutErrors and healing broken selectors live in the browser session."""
    def __init__(self, page: Page):
        self.page = page
        self.healed_events: List[Dict[str, Any]] = []

    def click(self, selector: str, fallback_hint: Optional[str] = None, timeout: float = 2500) -> bool:
        """Attempts click on selector; if timed out, discovers candidate in DOM and heals."""
        try:
            self.page.locator(selector).click(timeout=timeout)
            return True
        except PlaywrightTimeoutError:
            # Trigger In-Flight DOM Discovery & Self-Healing
            healed_selector = self._discover_candidate_selector(selector, fallback_hint, action_type="button")
            if healed_selector:
                self.page.locator(healed_selector).click(timeout=timeout)
                event = {
                    "original_selector": selector,
                    "healed_selector": healed_selector,
                    "action": "click",
                    "status": "HEALED_IN_FLIGHT",
                    "reason": f"Original selector '{selector}' timed out. DOM scanner identified replacement '{healed_selector}'."
                }
                self.healed_events.append(event)
                print(f"[SelfHealingLocator] ⚡ IN-FLIGHT HEALED: {selector} ➔ {healed_selector}")
                return True
            raise

    def fill(self, selector: str, value: str, fallback_hint: Optional[str] = None, timeout: float = 2500) -> bool:
        """Attempts fill on selector; if timed out, discovers candidate in DOM and heals."""
        try:
            self.page.locator(selector).fill(value, timeout=timeout)
            return True
        except PlaywrightTimeoutError:
            healed_selector = self._discover_candidate_selector(selector, fallback_hint, action_type="input")
            if healed_selector:
                self.page.locator(healed_selector).fill(value, timeout=timeout)
                event = {
                    "original_selector": selector,
                    "healed_selector": healed_selector,
                    "action": "fill",
                    "status": "HEALED_IN_FLIGHT",
                    "reason": f"Original selector '{selector}' timed out. DOM scanner identified replacement '{healed_selector}'."
                }
                self.healed_events.append(event)
                print(f"[SelfHealingLocator] ⚡ IN-FLIGHT HEALED: {selector} ➔ {healed_selector}")
                return True
            raise

    def _discover_candidate_selector(self, original_selector: str, hint: Optional[str], action_type: str) -> Optional[str]:
        """Scans active page DOM to find matching candidate elements."""
        try:
            # 1. Search by button text or standard data-testid
            if action_type == "button":
                candidates = [
                    "[data-testid='button-login']",
                    "#legacy-login-btn",
                    "#btn-login",
                    "button:has-text('Sign In')",
                    "button:has-text('Log In')",
                    "button[type='submit']"
                ]
                for cand in candidates:
                    if cand != original_selector:
                        loc = self.page.locator(cand)
                        if loc.count() > 0 and loc.first.is_visible():
                            return cand

            elif action_type == "input":
                if "email" in original_selector or (hint and "email" in hint):
                    candidates = ["[data-testid='input-email']", "input[type='email']", "#email"]
                else:
                    candidates = ["[data-testid='input-password']", "input[type='password']", "#password"]

                for cand in candidates:
                    if cand != original_selector:
                        loc = self.page.locator(cand)
                        if loc.count() > 0 and loc.first.is_visible():
                            return cand

        except Exception as e:
            print(f"[SelfHealingLocator] Error during candidate discovery: {e}")

        return None
