# Multi-stage Dockerfile for Agentic QE Platform with Playwright & Python 3.13
FROM mcr.microsoft.com/playwright/python:v1.48.0-noble

WORKDIR /app

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    HEADLESS_BROWSER=true \
    PLATFORM_PORT=8000 \
    TARGET_APP_PORT=8080

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Install Playwright browser binaries
RUN playwright install chromium

# Copy application source code
COPY . .

# Expose Main Platform, Target App, and MCP Server ports
EXPOSE 8000 8080 8001

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:8000/api/requirements || exit 1

# Launch Platform
CMD ["python", "run.py"]
