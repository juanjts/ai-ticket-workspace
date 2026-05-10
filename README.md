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
- An API key for any OpenAI-compatible provider (OpenAI, Groq, OpenRouter, etc.)

## Quick Start

```bash
# 1. Clone the repository
git clone <repo-url>
cd ai-ticket-workspace

# 2. Create `.env` from `.env.example` and configure your AI_API_KEY
cp .env.example .env
# Then edit `.env` and set your AI_API_KEY

# 3. Start everything
docker compose up --build
```

The application will be available at:
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3000
- **Health check:** http://localhost:3000/health

## Test Scenarios

The following test cases validate AI classification. Create each ticket via the UI or API and verify the assigned category, priority, and summary.

### Test 1: Operational Urgency

Detects immediate work-blocking language.

- **Customer:** Logística del Norte S.A.
- **Request:** "The warehouse dispatch system is down. We have 4 trucks waiting at the gate and cannot print route sheets. If they don't leave within 20 minutes, we will lose the cold chain."
- **Expected:** Category `OPERATIONS` — Priority `HIGH`

### Test 2: Legal / Administrative Request

Distinguishes technical issues from compliance or contract matters.

- **Customer:** Martín Vizcarra
- **Request:** "I need the team to review the terms and conditions of the new lease agreement for the Medellín office. There is a termination clause that is unclear and the legal department has not yet approved it."
- **Expected:** Category `LEGAL` — Priority `MEDIUM`

### Test 3: Payment / Finance Inquiry

Verifies classification toward accounting/finance.

- **Customer:** Inversiones Gómez
- **Request:** "Hello, we have not yet received the payment receipt for invoice #8892 that was due last Friday. Please confirm whether the transfer has been approved by the bank or if any information from us is still needed."
- **Expected:** Category `FINANCE` — Priority `LOW` / `MEDIUM`

### Test 4: Supply Management (Procurement)

- **Customer:** Suministros Industriales SAS
- **Request:** "The stock of safety helmets and nitrile gloves is below 5%. We need to open a bidding process to find a new supplier that meets ISO standards, since the previous one raised prices by 20% without notice. The purchasing process must start before Monday."
- **Expected:** Category `PROCUREMENT` — Priority `MEDIUM` / `HIGH`

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
