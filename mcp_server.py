from fastmcp import FastMCP

mcp = FastMCP("QA_Tools")

@mcp.tool()
def calculate_discount(price: float, discount_percent: float) -> float:
    """Calculate the final price after applying a discount."""
    return price * (1 - (discount_percent / 100))

@mcp.tool()
def check_inventory(item_id: str) -> dict:
    """Check inventory status for a specific item ID (e.g., 'A1', 'B2')."""
    inventory = {"A1": {"stock": 45}, "B2": {"stock": 0}}
    return inventory.get(item_id, {"stock": -1})

if __name__ == "__main__":
    mcp.run(transport="stdio")
