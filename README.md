# AI Ticket Workspace

A lightweight AI-powered ticket management system built as a technical challenge. Uses AI (OpenRouter) to automatically classify ticket categories, assign priorities, and generate summaries.

## Tech Stack

| Area | Technology |
|---|---|
| Frontend | SvelteKit + TailwindCSS |
| Backend | Node.js + Express + TypeScript |
| Database | PostgreSQL |
| ORM | Prisma 7 |
| AI | OpenRouter (OpenAI-compatible API) |
| Containerization | Docker Compose |

## Architecture

```
Frontend (SvelteKit) → REST API (Express) → Services → AI Provider (OpenRouter)
                                                  → Repository → PostgreSQL (Prisma)
```

The backend follows a clean 4-layer separation:
- **Controllers** — HTTP logic only
- **Services** — Business logic
- **Repositories** — Database access via Prisma
- **Providers** — External integrations (OpenRouter)

### AI Flow

1. User creates a ticket
2. Ticket is saved with `aiStatus: PENDING`
3. AI classification runs **asynchronously**
4. Ticket gets updated with: category, priority, summary
5. If AI fails, the ticket remains with `aiStatus: FAILED`

This ensures resilience — AI failures never block ticket creation.

## Prerequisites

- Docker and Docker Compose
- An OpenRouter API key ([get one free](https://openrouter.ai/))

## Quick Start

```bash
# 1. Clone the repository
git clone <repo-url>
cd ai-ticket-workspace

# 2. Set your OpenRouter API key
echo "AI_API_KEY=your_key_here" >> .env

# 3. Start everything
docker compose up --build
```

The application will be available at:
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3000
- **Health check:** http://localhost:3000/health

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `DATABASE_URL` | Yes | `postgresql://postgres:postgres@localhost:5432/ai_ticket_workspace` | PostgreSQL connection string |
| `AI_API_KEY` | Yes | — | API key for AI classification (OpenRouter, Groq, etc.) |
| `AI_BASE_URL` | No | `https://api.groq.com/openai/v1` | Base URL for the AI API |
| `AI_MODEL` | No | `openai/gpt-oss-20b` | Model name for ticket classification |
| `PORT` | No | `3000` | Backend server port |
| `PUBLIC_API_URL` | No | `http://localhost:3000` | Backend URL (frontend uses this) |
| `POSTGRES_USER` | No | `postgres` | PostgreSQL user |
| `POSTGRES_PASSWORD` | No | `postgres` | PostgreSQL password |
| `POSTGRES_DB` | No | `ai_ticket_workspace` | PostgreSQL database name |

## API Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/tickets` | List all tickets |
| `GET` | `/tickets/:id` | Get ticket details |
| `POST` | `/tickets` | Create a ticket |
| `PATCH` | `/tickets/:id` | Update status or owner |
| `POST` | `/tickets/:id/comments` | Add a comment |

### Creating a Ticket

```json
POST /tickets
{
  "customerName": "Acme Corp",
  "requestText": "Need urgent invoice approval for Q3",
  "attachmentUrl": "https://example.com/invoice.pdf"
}
```

## Project Structure

```
/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma    # Database schema
│   │   └── config.ts        # Prisma configuration
│   └── src/
│       ├── controllers/     # HTTP handlers
│       ├── routes/          # Express routes
│       ├── services/        # Business logic
│       ├── repositories/    # Database access
│       ├── providers/ai/    # AI integrations
│       ├── validators/      # Request validation
│       ├── middlewares/      # Express middlewares
│       ├── types/           # TypeScript types
│       └── lib/             # Shared utilities
├── frontend/
│   └── src/
│       ├── routes/          # SvelteKit pages
│       ├── lib/
│           ├── services/    # API client
│           └── components/  # Reusable components
├── docker-compose.yml
└── .env.example
```
