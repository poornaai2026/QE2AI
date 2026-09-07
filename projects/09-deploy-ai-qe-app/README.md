# Project 09: Deploy an AI QE Application

> **Track 09 — Deployment**  
> **Difficulty**: Intermediate  
> **Repository Path**: `projects/09-deploy-ai-qe-app`

Production-grade containerization and cloud deployment architecture for Python AI services using multi-stage Dockerfiles, Docker Compose, and automated GitHub Actions CI/CD to Google Cloud Run.

---

## 🏗️ Architecture

```text
Git Push to main
   │
   ▼
GitHub Actions CI/CD Pipeline
   ├── Multi-Stage Docker Build (< 150MB image)
   ├── Security Vulnerability Scan
   └── Container Registry Push (Google Artifact Registry)
   │
   ▼
Serverless Deployment (Google Cloud Run / AWS ECS)
   │
   ▼
Production HTTPS Endpoint with Health Checks (/healthz, /readyz)
```

---

## 🛠️ Quickstart

```bash
cd projects/09-deploy-ai-qe-app

# 1. Build local container
docker build -t qe2ai-service:latest .

# 2. Run with Docker Compose
docker compose up -d

# 3. Test Health Check
curl http://localhost:8000/healthz
```
