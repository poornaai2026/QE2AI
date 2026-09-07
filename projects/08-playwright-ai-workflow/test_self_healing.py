import pytest

class MockPage:
    def __init__(self):
        self.dom = '<button data-testid="submit-login" class="btn primary">Log In</button>'

    async def get_element(self, primary_selector: str, fallback_semantic: str = "submit"):
        if primary_selector not in self.dom:
            # Self-healing fallback triggered
            print(f"\n[AI Self-Healing] '{primary_selector}' missing. Healing to data-testid='{fallback_semantic}-login'")
            return {"status": "healed", "resolved_selector": f"[data-testid='{fallback_semantic}-login']"}
        return {"status": "exact_match", "resolved_selector": primary_selector}

@pytest.mark.asyncio
async def test_self_healing_button_locator():
    page = MockPage()
    # Assume old ID #login-btn was removed by frontend dev
    result = await page.get_element(primary_selector="#login-btn", fallback_semantic="submit")
    assert result["status"] == "healed"
    assert "submit-login" in result["resolved_selector"]

if __name__ == '__main__':
    pytest.main(["-v", __file__])
