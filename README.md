## Insyd Labs – Cheque & Cash Collections POC

Monorepo layout:

- `apps/api` – ExpressJS + MongoDB API
- `apps/web` – Next.js UI

### Features

- Intake of cheque and cash payments with required fields
- PDC tracking with simple reminder queue (pre-PDC and post-deposit)
- Status transitions: created → deposited → cleared/bounced
- Bounce details and next action date
- Basic risk labels (placeholder scoring)
- Lists, detail view, and simple actions

### Prerequisites

- Node 18+
- MongoDB running locally at `mongodb://localhost:27017/insyd_pdc`

### Setup

1) Install dependencies

```
cd apps/api && npm i
cd ../web && npm i
```

2) Configure environment

- API: environment variables (optional; defaults shown)
  - `PORT=4000`
  - `MONGODB_URI=mongodb://localhost:27017/insyd_pdc`
  - `ALLOW_ORIGIN=http://localhost:3000`

- Web: environment variables
  - `NEXT_PUBLIC_API_BASE_URL=http://localhost:4000`

3) Start

```
# Terminal 1
cd apps/api
node src/server.js

# Terminal 2
cd apps/web
npm run dev
```

Then open `http://localhost:3000`.

### API Overview

- `GET /health`
- `POST /api/payments` – create payment (cheque or cash)
- `GET /api/payments` – list payments (query: status, type, customerId, from, to)
- `GET /api/payments/:id` – payment detail
- `PATCH /api/payments/:id` – generic update
- `POST /api/payments/:id/deposit|clear|bounce` – status transitions
- `POST /api/payments/:id/allocate` – set allocations array
- `GET /api/reminders` – computed due reminders
- `POST /api/reminders/:id/mark-sent` – record reminder sent

### Notes & Assumptions

- Attachments are URL fields in POC
- Reminder sending is manual (no SMS integration yet)
- Auth is intentionally omitted


