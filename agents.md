# CreditMitra Dashboard — Agent Instructions

> **Repository**: `CreditMitra-dashboard`
> **Stack**: React 19 · TypeScript 6 (strict, `verbatimModuleSyntax`) · Vite 8 · Tailwind CSS v4 · Axios · React Router v7 · Vitest

The analyst UI for the CreditMitra engine (`CreditMitra-engine`): upload a bank
statement PDF, watch it process, then read the lifestyle credit report, spend
analytics and the transaction ledger.

---

## 1. Layout

```
src/
├── App.tsx                      # QueryClientProvider + router
├── routes/index.tsx             # createBrowserRouter: layout + Dashboard
├── features/
│   ├── dashboard/Dashboard.tsx  # page: upload → status → report | analytics | ledger tabs
│   ├── ingest/
│   │   ├── UploadDropzone.tsx, ProcessingStatus.tsx
│   │   └── hooks/useProcessStatement.ts   # upload + status polling (+ test)
│   ├── results/                 # StatsOverview, TransactionTable, CashFlow, CategoryBreakdown
│   └── risk/LifestyleReport.tsx # score gauge, archetype, radar, factors
├── components/ui/               # Button (+ test), ScoreGauge, RadarChart
├── services/api.ts              # axios client: uploadStatementPdf, fetchTaskStatus, fetchTaskReport
├── services/mockData.ts         # sample data for VITE_USE_MOCK only
├── types/transaction.ts         # mirrors the engine's Pydantic schemas
└── store/queryClient.ts         # React Query client (provided; polling does not use it yet)
```

Docker: `Dockerfile` (Vite build → nginx) and `nginx.conf` (SPA fallback).

---

## 2. Rules that are easy to break

- **Never show sample data as a borrower's result.** If a task completes with
  `report: null`, render "Credit report unavailable" — not `MOCK_REPORT`.
  `mockData.ts` is for `VITE_USE_MOCK` only.
- **Polling must survive transient failures.** `useProcessStatement` tolerates
  5 consecutive failed polls, stops at once on 404, skips a tick instead of
  stacking requests, and clears its interval on unmount. Keep those behaviours
  (they are tested).
- **Types mirror the engine.** `types/transaction.ts` follows
  `CreditMitra-engine/app/schemas/statements.py`. The engine contract is
  additive-only; add new fields as optional here.
- **Routing is `createBrowserRouter`**, served with an `index.html` fallback by
  nginx. If the app is packaged with Tauri, switch to a hash router then — not
  before.
- **No auth UI.** The engine has none (open hosted-vs-desktop decision).
- Tailwind v4: theme in CSS via `@theme`; there is no `tailwind.config.js`.

---

## 3. Engine API used

| Method | Path | Used by |
|---|---|---|
| `POST` | `/statements/process` (multipart `pdf`) | `uploadStatementPdf` — let axios set the multipart boundary |
| `GET` | `/statements/status/{task_id}` | `fetchTaskStatus` — status + transactions |
| `GET` | `/statements/report/{task_id}` | `fetchTaskReport` — the report, possibly `null` |

Statuses: `pending → processing → completed | failed`.

---

## 4. Environment

| Variable | Default | Notes |
|---|---|---|
| `VITE_API_BASE_URL` | `http://127.0.0.1:8000/api/v1` | Inlined at build time; in Docker it is a build arg and must be reachable from the browser |
| `VITE_USE_MOCK` | off | `1`/`true` serves sample data without an engine |

The engine's `CORS_ORIGINS` must include the dashboard's origin
(`http://localhost:5173` in dev, `http://localhost:8080` in Docker).

---

## 5. Checks

CI runs ESLint, Prettier (`npx prettier --check src`), `tsc -b`, Vitest, a
production build, and a Docker build that checks `/` and a client-side route.

```bash
npm ci
npm run lint && npx prettier --check src && npx tsc -b --noEmit && npm test && npm run build
```

On Windows, files checked out with CRLF can make Prettier complain locally even
though the committed (LF) content passes; check with
`git show HEAD:<file> | npx prettier --stdin-filepath <file> --check`.
