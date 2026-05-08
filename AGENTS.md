# AGENT PROTOCOL — AI Ticket Workspace (Mantis Challenge)

This file serves as the **Operational Brain** for OpenCode/AI Agents. Every action taken must align with the architectural and strategic constraints defined below.

## 1. PROJECT IDENTITY & MISSION
- **Project Name:** AI Ticket Workspace
- **Core Mission:** Build a professional, AI-powered lightweight ticket management system.
- **Key Metric:** Evaluate System Thinking, Speed, and AI-assisted execution.

## 2. STRICT ARCHITECTURAL CONSTRAINTS (MANDATORY)
The AI must follow a **Clean & Modular** approach. Overengineering is strictly forbidden.

- **Backend (Express + TS):** Use a 4-layer separation:
  1. `Controllers`: HTTP logic only.
  2. `Services`: Business logic.
  3. `Repositories`: Prisma/DB access.
  4. `Providers`: External integrations (OpenRouter).
- **Frontend (SvelteKit + Tailwind):** Use `/lib/components` for UI and `/lib/services` for API calls.
- **AI Logic:** Must be **Decoupled**. AI processing should be asynchronous (`aiStatus: PENDING` -> `PROCESSING` -> `COMPLETED`) to ensure system resilience.

## 3. TECHNOLOGY STACK
- **Runtime:** Node.js + TypeScript.
- **Frameworks:** Express (Backend) / SvelteKit (Frontend).
- **ORM:** Prisma (PostgreSQL).
- **IA:** OpenRouter (OpenAI SDK compatible).
- **Infra:** Docker Compose (`docker-compose.yml`).

## 4. DOMAIN MODEL (PRISMA SCHEMA REFERENCE)
Refer to `PROJECT_CONTEXT.md` for full schema. Key entities:
- **Ticket:** `id`, `customerName`, `requestText`, `category` (Enum), `priority` (Enum), `status`, `aiStatus`, `summary`.
- **Comment:** `id`, `ticketId`, `content`, `createdAt`.

## 5. AGENT WORKFLOW & SKILLS
To ensure high-quality output, the Agent must apply these skills:

### Skill: "Context First"
- **Action:** Read `PROJECT_CONTEXT.md` before generating any file.
- **Goal:** Maintain consistency with the roadmap and tech stack.

### Skill: "Atomic Development"
- **Action:** Do NOT generate the entire app at once.
- **Goal:** Work phase by phase (Foundation -> Domain -> API -> AI -> Frontend).

### Skill: "Windows/Docker Optimization"
- **Action:** Ensure `DATABASE_URL` is configured for Docker networking (use `db` host inside containers).
- **Goal:** Ensure `docker compose up --build` works out-of-the-box on Windows.

## 6. NEXT IMMEDIATE STEPS (PHASE 1: FOUNDATION)
1. Initialize `backend/package.json` and install base dependencies (Express, Prisma, Cors, Dotenv).
2. Initialize `frontend/` using SvelteKit skeleton with TypeScript.
3. Create `docker-compose.yml` with PostgreSQL and persistent volumes.
4. Configure `.env` and `.env.example` with required keys.
5. Setup `prisma/schema.prisma` and perform the first migration.

---
**Status:** In Preparation (Manual Scaffold Created).
**Last Sync:** 2026-05-08.
