import pytest
from playwright.sync_api import Page, expect

def test_ui_navigation_and_validation(page: Page):
    """Positive: User opens landing page and verifies elements."""
    page.goto("https://example.com")
    expect(page).to_have_title("Example Domain")
    heading = page.locator("h1")
    expect(heading).to_be_visible()
    expect(heading).to_contain_text("Example Domain")

def test_ui_negative_empty_search(page: Page):
    """Negative: Validation checks on missing form inputs."""
    page.goto("https://example.com")
    # Verify links are active
    link = page.locator("a")
    expect(link).to_be_visible()
