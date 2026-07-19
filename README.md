# Resume Builder MVP

A full-stack resume builder: register/login, create multiple resumes, edit them with a live preview, and export to PDF (via browser print).

## Tech stack

**Frontend:** React, Vite, TypeScript, Tailwind CSS, React Router, lucide-react (icons)
**Backend:** Node.js, Express, TypeScript, Zod (validation)
**Database:** SQLite (via Prisma ORM) — chosen for this MVP so it runs locally with zero database server setup. Swap `provider = "sqlite"` to `"postgresql"` in `server/prisma/schema.prisma` if you want to move to Postgres later.
**Auth:** JWT + bcrypt password hashing

See `CHANGELOG.md` for a full list of bug fixes and design changes in the latest revision.

## Project structure

```
resume-builder/
├── client/     # React frontend (Vite)
└── server/     # Express backend + Prisma
```

## Prerequisites

- Node.js 18+ and npm installed
- That's it — no separate database server needed, SQLite is a local file.

## Setup instructions

### 1. Backend

```bash
cd server
npm install
cp .env.example .env    # already present with sane local defaults; edit JWT_SECRET for real use
npm run prisma:generate # generates the Prisma client from schema.prisma
npm run prisma:migrate  # creates the SQLite database file and tables
npm run dev              # starts the API on http://localhost:4000
```

### 2. Frontend

In a second terminal:

```bash
cd client
npm install
npm run dev              # starts the app on http://localhost:5173
```

Vite is configured to proxy `/api/*` requests to `http://localhost:4000`, so the frontend and backend talk to each other automatically in development — no CORS configuration needed on your end.

### 3. Use it

Open `http://localhost:5173`, register an account, create a resume, fill in your details, and click "Export PDF" (it opens your browser's print dialog — choose "Save as PDF" as the destination).

## Environment variables (`server/.env`)

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | SQLite file path, e.g. `file:./dev.db` |
| `JWT_SECRET` | Secret used to sign JWTs — **change this to a long random string before any real use** |
| `JWT_EXPIRES_IN` | Access token lifetime, e.g. `15m` |
| `PORT` | Port the API listens on |
| `CLIENT_ORIGIN` | Allowed CORS origin for the frontend |

## Production build

```bash
# Backend
cd server && npm run build && npm start

# Frontend
cd client && npm run build   # outputs static files to client/dist, serve with any static host
```

## Known limitations of this MVP (intentional scope cuts)

- Single access token stored in `localStorage`, no refresh-token rotation — acceptable for a personal-use tool, not recommended as-is for a public multi-user product (see the auth design notes in `client/src/context/AuthContext.tsx`).
- No email verification or password reset flow.
- One resume "template" (a single clean layout) — no template picker yet.
- PDF export relies on the browser's print-to-PDF rather than server-side PDF generation.

## Sandbox note

This project was built and type-checked in a sandboxed environment without access to `binaries.prisma.sh`, so `npx prisma generate` could not be run there. It will work normally on your machine with standard internet access — just run the setup steps above in order.
