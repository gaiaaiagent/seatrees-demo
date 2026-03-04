# SeaTrees Demo

Marine biodiversity credit intelligence dashboard powered by Regen Network. A 5-screen demo showcasing SeaTrees project data, on-chain verification, credit analytics, and impact storytelling.

## Architecture

- **API** (`api/`): Fastify 5 + PostgreSQL — serves seeded project/credit data with live Regen Ledger proxy routes
- **Frontend** (`frontend/`): Next.js 16 + React 19 + Tailwind CSS 4 + shadcn/ui — dark ocean-themed dashboard

## Getting Started

```bash
# API
cd api
cp .env.example .env   # configure DATABASE_URL
npm install
npm run seed            # seed the database
npm run dev             # starts on port 4000

# Frontend
cd frontend
npm install
npm run dev             # starts on port 3000
```
