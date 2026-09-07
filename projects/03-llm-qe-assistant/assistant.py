from pydantic import BaseModel, Field
from typing import List, Optional
import os
import json

class FailureRCA(BaseModel):
    failure_category: str = Field(..., description="Category: Flaky Test | Selector Change | Backend 500 | Race Condition")
    root_cause_summary: str = Field(..., description="Concise explanation of the underlying failure")
    affected_component: str = Field(..., description="Identified module or endpoint")
    suggested_fix: str = Field(..., description="Actionable fix for automation or developer")
    target_automated_test: str = Field(..., description="Playwright or Pytest snippet to prevent regression")

def analyze_error_log(log_content: str) -> FailureRCA:
    """Analyze stack trace and return structured RCA."""
    # In production, wrapped with instructor.from_openai(OpenAI())
    return FailureRCA(
        failure_category="Selector Change",
        root_cause_summary="The submit button ID '#btn-checkout' was removed and replaced with a data-testid attribute 'data-testid=checkout-submit'.",
        affected_component="Checkout Page UI",
        suggested_fix="Update Page Object locator from page.locator('#btn-checkout') to page.get_by_test_id('checkout-submit').",
        target_automated_test="""async def test_checkout_submit_button_exists(page):
    await page.goto('/checkout')
    await expect(page.get_by_test_id('checkout-submit')).to_be_visible()"""
    )

if __name__ == '__main__':
    sample_log = "TimeoutError: locator.click: Timeout 5000ms exceeded.\nWaiting for locator('#btn-checkout')"
    result = analyze_error_log(sample_log)
    print(json.dumps(result.model_dump(), indent=2))
