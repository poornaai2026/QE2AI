# Production Multi-Stage Dockerfile for SlingShot QE Agent
FROM mcr.microsoft.com/playwright/python:v1.45.0-jammy

# Set environment
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    TEST_WORKSPACE_DIR=/app/workspace/tests \
    REPORT_WORKSPACE_DIR=/app/workspace/reports

WORKDIR /app

# Install system dependencies (Java JRE for Karate CLI if needed)
RUN apt-get update && apt-get install -y --no-install-recommends \
    openjdk-17-jre-headless \
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies
COPY pyproject.toml README.md ./
RUN pip install --no-cache-dir hatchling && \
    pip install --no-cache-dir -e . && \
    pip install --no-cache-dir fastapi uvicorn[standard] psycopg[binary]

# Copy project source code
COPY src/ ./src/
COPY examples/ ./examples/
COPY cli.py api_server.py ./

# Create runtime directories
RUN mkdir -p /app/workspace/tests /app/workspace/reports

# Expose API port
EXPOSE 8000

# Default entrypoint runs the FastAPI service
CMD ["uvicorn", "api_server:app", "--host", "0.0.0.0", "--port", "8000"]
