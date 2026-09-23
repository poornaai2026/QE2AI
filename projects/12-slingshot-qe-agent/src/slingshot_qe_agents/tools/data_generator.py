"""Synthetic Test Data Generator Tool for SlingShot QE Agent."""

import random
import string
import time
import uuid
from typing import Any, Dict


class DataGeneratorTool:
    """Tool to generate realistic synthetic mock data for API payloads and UI inputs."""

    @staticmethod
    def random_string(length: int = 8) -> str:
        """Generate random alphanumeric string."""
        return "".join(random.choices(string.ascii_letters + string.digits, k=length))

    @staticmethod
    def generate_email(prefix: str = "testuser") -> str:
        """Generate unique test email."""
        ts = int(time.time())
        return f"{prefix}_{ts}_{random.randint(100, 999)}@example.com"

    @staticmethod
    def generate_uuid() -> str:
        """Generate a random UUID v4."""
        return str(uuid.uuid4())

    @staticmethod
    def generate_order_payload(item_id: str = "ITEM-999", customer_id: str = "CUST-001") -> Dict[str, Any]:
        """Generate a realistic order processing JSON body."""
        return {
            "order_id": f"ORD-{random.randint(10000, 99999)}",
            "customer_id": customer_id,
            "item_id": item_id,
            "quantity": random.randint(1, 5),
            "amount": round(random.uniform(19.99, 499.99), 2),
            "currency": "USD",
            "timestamp": int(time.time()),
            "status": "PENDING"
        }

    @staticmethod
    def generate_user_profile() -> Dict[str, Any]:
        """Generate realistic user credentials and profile for UI automation."""
        ts = int(time.time())
        first_names = ["Alex", "Jordan", "Taylor", "Morgan", "Sam", "Chris"]
        last_names = ["Smith", "Doe", "Johnson", "Brown", "Williams"]
        fn = random.choice(first_names)
        ln = random.choice(last_names)
        return {
            "first_name": fn,
            "last_name": ln,
            "username": f"{fn.lower()}_{ts}",
            "email": f"{fn.lower()}.{ln.lower()}_{ts}@example.com",
            "password": f"P@ssw0rd_{random.randint(1000, 9999)}!",
            "phone": f"+1-555-{random.randint(100, 999)}-{random.randint(1000, 9999)}"
        }
