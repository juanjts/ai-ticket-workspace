# AI Ticket Workspace — Master Context & Development Plan

## Author Context

This document defines the complete technical, architectural, and strategic context for developing an AI-first technical challenge project.

The project will be developed using:
- Visual Studio Code
- OpenCode
- AI-assisted development workflow

This document serves as the main source of truth for the AI agent working on the project.

The AI agent must:
- follow the architecture defined here,
- respect the project scope,
- avoid overengineering,
- work phase by phase,
- maintain modularity and clean architecture,
- prioritize simplicity and professionalism.

---

# 1. Technical Challenge Context

The challenge consists of building a lightweight AI-powered ticket management system.

The application must allow users to:
- create tickets,
- classify tickets using AI,
- assign priority,
- generate summaries,
- display tickets in a dashboard,
- update ticket status,
- assign ticket owner,
- add comments.

---

# Real Evaluation Goals

The challenge evaluates:
- system thinking,
- execution speed,
- AI-assisted development,
- API integrations,
- ability to build deployable applications.

---

# Mandatory Requirements

The application must:
- use PostgreSQL,
- run locally using Docker Compose,
- include a functional frontend,
- include a functional backend,
- integrate a real AI provider,
- support a complete functional demo.

The evaluator must be able to run the project using:

```bash
docker compose up --build
```

---

# 2. Project Philosophy

The goal is NOT to build a complex enterprise architecture.

The goal is to build a professional MVP that is:
- clean,
- modular,
- maintainable,
- decoupled,
- easy to explain,
- fast to develop,
- reasonably scalable for the challenge scope.

---

# The project SHOULD prioritize

- modularity
- clean architecture
- simplicity
- maintainability
- separation of concerns
- AI-first development
- clean code
- developer experience
- Docker-first workflow

---

# The project SHOULD NOT include

- microservices
- Kubernetes
- CQRS
- event sourcing
- Redis
- RabbitMQ
- advanced authentication
- enterprise complexity
- overengineering

---

# 3. Final Tech Stack

| Area | Technology |
|---|---|
| Frontend | SvelteKit |
| Bundler | Vite |
| Styling | TailwindCSS |
| Backend | Node.js + Express |
| Language | TypeScript |
| ORM | Prisma |
| Database | PostgreSQL |
| AI Provider | OpenRouter |
| Infrastructure | Docker Compose |
| Package Manager | npm |
| IDE | Visual Studio Code |
| AI Workflow | OpenCode |

---

# 4. Architecture Overview

```text
Frontend (SvelteKit)
        ↓
REST API (Express)
        ↓
Application Services
        ↓
AI Provider Layer
        ↓
PostgreSQL (Prisma)
```

---

# 5. Architectural Principles

## Separation of Concerns

### Controllers
Responsible only for HTTP layer logic.

### Services
Responsible for business logic.

### Repositories
Responsible for database access.

### Providers
Responsible for external integrations.

### Validators
Responsible for request validation.

### Middlewares
Responsible for global behaviors and error handling.

---

## AI Decoupling

AI logic MUST NOT be directly coupled to:
- controllers,
- Express routes,
- Prisma queries.

Correct flow:

```text
controller
→ service
→ ai provider
→ repository
```

---

## Docker-first Development

The entire project must run using Docker Compose.

The application must NOT depend on:
- local PostgreSQL installations,
- manual setup,
- external local configurations.

---

## Professional Simplicity

The architecture must be:
- clean,
- modular,
- professional,
- easy to explain,
- but NOT unnecessarily complex.

---

# 6. Final Project Structure

```text
/frontend
  /src
    /routes
    /components
    /services
    /types
    /lib

/backend
  /src
    /controllers
    /routes
    /services
    /repositories
    /providers
    /validators
    /middlewares
    /types
    /lib

    app.ts
    server.ts

  /prisma
    schema.prisma

docker-compose.yml
README.md
.env.example
.gitignore
```

---

# 7. Domain Model

## Ticket

```ts
Ticket {
  id
  customerName
  requestText
  attachmentUrl

  category
  priority
  summary

  status
  aiStatus

  owner

  createdAt
  updatedAt
}
```

---

## Comment

```ts
Comment {
  id
  ticketId
  content
  createdAt
}
```

---

# 8. Official Prisma Schema

```prisma
enum TicketStatus {
  OPEN
  IN_PROGRESS
  RESOLVED
}

enum TicketPriority {
  LOW
  MEDIUM
  HIGH
}

enum TicketCategory {
  FINANCE
  LEGAL
  PROCUREMENT
  OPERATIONS
}

enum AIStatus {
  PENDING
  PROCESSING
  COMPLETED
  FAILED
}

model Ticket {
  id             String           @id @default(cuid())

  customerName   String
  requestText    String
  attachmentUrl  String?

  category       TicketCategory?
  priority       TicketPriority?
  summary        String?

  status         TicketStatus     @default(OPEN)
  aiStatus       AIStatus         @default(PENDING)

  owner          String?

  comments       Comment[]

  createdAt      DateTime         @default(now())
  updatedAt      DateTime         @updatedAt
}

model Comment {
  id          String    @id @default(cuid())

  ticketId    String
  ticket      Ticket    @relation(fields: [ticketId], references: [id], onDelete: Cascade)

  content     String

  createdAt   DateTime  @default(now())
}
```

---

# 9. API Contracts

## POST /tickets

Creates a ticket.

### Request

```json
{
  "customerName": "Acme Inc",
  "requestText": "Urgent invoice approval needed",
  "attachmentUrl": "https://..."
}
```

---

## GET /tickets

Returns all tickets.

---

## GET /tickets/:id

Returns ticket details.

---

## PATCH /tickets/:id

Updates:
- status
- owner

---

## POST /tickets/:id/comments

Adds a comment.

---

# 10. Official AI Flow

```text
1. User creates ticket
2. Ticket is saved immediately
3. aiStatus = PROCESSING
4. AI classification runs asynchronously
5. Ticket gets updated
6. Frontend refreshes data
```

---

# Why this flow?

Because it demonstrates:
- resilience,
- system thinking,
- decoupling,
- better UX,
- fault tolerance.

---

# If AI fails

The ticket MUST still exist.

Correct behavior:

```text
Ticket created successfully
AI classification failed
```

---

# 11. AI Provider Architecture

## Structure

```text
/providers/ai
  AIProvider.ts
  OpenRouterProvider.ts
```

---

## Interface

```ts
export interface AIProvider {
  classifyTicket(input: string): Promise<ClassificationResult>
}
```

---

# Official AI Prompt

```text
You are an operational ticket classification assistant.

Analyze the provided operational request.

Return ONLY valid JSON with this structure:

{
  "category": "FINANCE | LEGAL | PROCUREMENT | OPERATIONS",
  "priority": "LOW | MEDIUM | HIGH",
  "summary": "short summary"
}

Request:
{{ticket_text}}
```

---

# 12. Required Security Practices

## Never commit secrets

`.gitignore`

```gitignore
.env
.env.local
.env.production
node_modules
dist
build
```

---

## Environment Variables

`.env.example`

```env
DATABASE_URL=
OPENROUTER_API_KEY=
PORT=
```

---

## Basic Environment Validation

```ts
if (!process.env.OPENROUTER_API_KEY) {
  throw new Error("Missing OPENROUTER_API_KEY");
}
```

---

## Basic Request Validation

```ts
if (!customerName || !requestText) {
  return res.status(400).json({
    error: "Missing required fields"
  });
}
```

---

## Global Error Middleware

```ts
app.use((err, req, res, next) => {
  console.error(err);

  return res.status(500).json({
    error: "Internal server error"
  });
});
```

---

# 13. Expected Frontend Features

## Dashboard
Must display:
- tickets,
- category,
- priority,
- status,
- timestamps.

---

## Ticket Detail
Must allow:
- update status,
- assign owner,
- comments.

---

## Minimum Professional UX

- loading states
- error states
- basic responsiveness

---

# 14. Docker Architecture

Expected services:

```text
frontend
backend
postgres
```

---

# Mandatory Final Command

```bash
docker compose up --build
```

---

# 15. AI-first Development Workflow

The project must be developed:
- incrementally,
- phase by phase,
- validating each step before continuing.

---

# Important Rules

## NEVER ask the AI:
"Generate the entire app."

---

## ALWAYS work by modules

Examples:
- generate ticket controller,
- generate Prisma schema,
- generate AI provider,
- generate Docker setup,
- generate dashboard component.

---

# Correct Workflow

```text
1. Create structure
2. Configure backend
3. Configure frontend
4. Configure Prisma
5. Build domain
6. Build APIs
7. Integrate AI
8. Build frontend
9. Dockerize
10. Cleanup
11. Write README
```

---

# 16. Official Development Phases

# Phase 1 — Foundation & Environment Setup

## Goal

Prepare:
- project structure,
- backend,
- frontend,
- Docker,
- PostgreSQL,
- Prisma,
- TypeScript,
- TailwindCSS.

---

## Expected Result

At the end of this phase:
- frontend works,
- backend works,
- PostgreSQL works,
- Prisma works,
- Docker Compose works,
- TypeScript works,
- Tailwind works,
- environment variables work.

---

# Phase 2 — Domain & Database

## Goal

Build:
- entities,
- Prisma schema,
- migrations,
- repositories,
- types.

---

# Phase 3 — Core API

## Goal

Build:
- REST endpoints,
- validations,
- business logic.

---

# Phase 4 — AI Integration

## Goal

Build:
- AI provider layer,
- OpenRouter integration,
- AI classification flow.

---

# Phase 5 — Frontend

## Goal

Build:
- dashboard,
- forms,
- ticket detail view,
- comments,
- loading states.

---

# Phase 6 — Cleanup & Professionalization

## Goal

Polish the MVP WITHOUT overengineering.

---

## Required Tasks

- cleanup code
- consistent imports
- consistent typing
- simple error middleware
- basic request validation
- basic environment checks
- professional README

---

## DO NOT include

- JWT auth
- Redis
- queues
- advanced observability
- enterprise patterns

---

# Phase 7 — Delivery

## Goal

Prepare final demo.

---

## Tasks

- verify Docker setup
- verify clean setup
- verify AI integration
- verify frontend flow
- verify API flow
- explain architecture clearly

---

# 17. Final Expected Result

The final project should be:

- clean
- modular
- professional
- decoupled
- dockerized
- AI-first
- maintainable
- demonstrable
- easy to explain
- easy to execute
- aligned with the technical challenge
- free of unnecessary complexity
```
