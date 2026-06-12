<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white" alt="TypeScript 6" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white" alt="Vite 8" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS v4" />
  <img src="https://img.shields.io/github/actions/workflow/status/CreditMitra-TIH-IITB/CreditMitra-dashboard/ci.yml?label=CI&logo=github" alt="CI Status" />
  <img src="https://img.shields.io/github/license/CreditMitra-TIH-IITB/CreditMitra-dashboard" alt="License" />
</p>

# CreditMitra Dashboard

> **Statement Intelligence Frontend** — Upload bank statements, monitor real-time processing, and explore enriched transaction data with payee predictions.

CreditMitra Dashboard is the frontend interface for the [CreditMitra Engine](https://github.com/CreditMitra-TIH-IITB/CreditMitra-engine) bank-statement analysis pipeline, built as part of the **TIH IIT Bombay** initiative. It provides a premium, dark-mode FinTech experience for uploading PDF bank statements and viewing ML-enriched transaction ledgers.

---

## ✨ Features

| Feature | Description |
|---|---|
| **Drag & Drop Upload** | Upload PDF bank statements via an intuitive dropzone with file validation |
| **Live Processing Status** | Animated real-time indicators that track extraction progress (`pending → processing → completed`) |
| **Transaction Ledger** | Sortable, searchable table displaying enriched transactions with payee predictions |
| **Statistics Overview** | Summary cards showing deposit/withdrawal totals, transaction counts, and balance trends |
| **Desktop-Ready** | Architected for future Tauri packaging — hash-based routing, no browser-exclusive APIs |

---

## 🏗️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Framework** | React 19 | UI component library |
| **Language** | TypeScript 6 | Strict type safety with `verbatimModuleSyntax` |
| **Bundler** | Vite 8 | Fast HMR, optimized production builds |
| **Styling** | Tailwind CSS v4 | Utility-first CSS via `@theme` directives (no config file) |
| **Server State** | TanStack React Query | Caching, polling, deduplication for API calls |
| **HTTP Client** | Axios | Interceptors, consistent error handling |
| **Routing** | React Router v7 | Hash-based navigation for desktop compatibility |
| **Icons** | Lucide React | Consistent, tree-shakeable icon set |
| **Testing** | Vitest + Testing Library | Unit & component tests in jsdom |
| **Linting** | ESLint + Prettier + Husky | Pre-commit hooks enforce code quality |

---

## 📁 Project Structure

```
src/
├── main.tsx                          # React DOM entry point
├── App.tsx                           # Root — QueryClientProvider + Router
├── App.css                           # Global app-level styles
├── index.css                         # Tailwind v4 imports + @theme tokens
│
├── components/                       # Shared, reusable components
│   ├── layout/                       # Header, Footer
│   └── ui/                           # Button, etc.
│
├── features/                         # Feature-based modules
│   ├── ingest/                       # PDF upload & processing flow
│   │   ├── UploadDropzone.tsx        # Drag-and-drop file upload
│   │   ├── ProcessingStatus.tsx      # Animated task status indicator
│   │   └── hooks/
│   │       └── useProcessStatement.ts
│   ├── dashboard/                    # Main dashboard page
│   └── results/                      # Transaction results
│       ├── TransactionTable.tsx      # Sortable/searchable ledger
│       └── StatsOverview.tsx         # Summary statistics cards
│
├── routes/                           # React Router v7 route definitions
├── services/                         # Axios instance + API functions
├── store/                            # TanStack Query client config
├── types/                            # Shared TypeScript interfaces
└── utils/                            # Helpers (cn, etc.)
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 22 (LTS recommended)
- **npm** ≥ 10
- **CreditMitra Engine** running at `http://localhost:8000` ([setup guide](https://github.com/CreditMitra-TIH-IITB/CreditMitra-engine))

### Installation

```bash
# Clone the repository
git clone https://github.com/CreditMitra-TIH-IITB/CreditMitra-dashboard.git
cd CreditMitra-dashboard

# Install dependencies
npm install

# Start development server
npm run dev
```

The dev server starts at **http://localhost:5173**.

### Environment Variables

Create a `.env` file in the project root:

```env
# Backend API base URL (default shown)
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

All environment variables must be prefixed with `VITE_` to be exposed to the client bundle.

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | TypeScript check + production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint across the project |
| `npm run format` | Format `src/` with Prettier |
| `npm run test` | Run Vitest test suite |
| `npm run prepare` | Install Husky git hooks |

---

## 🔄 CI Workflows

This project uses GitHub Actions for continuous integration.

### CI Pipeline ([`.github/workflows/ci.yml`](.github/workflows/ci.yml))

Runs on every **push** and **pull request** to `main` and `develop`.

```
┌─────────┐   ┌────────────┐   ┌────────┐
│  Lint   │   │ Type Check │   │  Test  │
│ ESLint  │   │ TypeScript │   │ Vitest │
│Prettier │   │  tsc -b    │   │        │
└────┬────┘   └─────┬──────┘   └───┬────┘
     │              │              │
     └──────────────┼──────────────┘
                    ▼
              ┌───────────┐
              │   Build   │
              │ vite build│
              │ + artifact│
              └───────────┘
```

| Job | What it does |
|---|---|
| **Lint & Format** | Runs ESLint + Prettier check |
| **Type Check** | Runs `tsc -b --noEmit` for full type validation |
| **Tests** | Runs Vitest in jsdom environment |
| **Build** | Production build (only after all checks pass), uploads `dist/` as artifact |

### Dependency Review ([`.github/workflows/dependency-review.yml`](.github/workflows/dependency-review.yml))

Scans pull requests for newly introduced dependencies with known vulnerabilities. Fails on **high-severity** issues.

---

## 🔌 Backend API Contract

The dashboard communicates with the [CreditMitra Engine](https://github.com/CreditMitra-TIH-IITB/CreditMitra-engine) REST API.

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/statements/process` | Upload a PDF bank statement (`multipart/form-data`) |
| `GET` | `/statements/status/{task_id}` | Poll processing status and retrieve results |

### Task Status Flow

```
pending → processing → completed | failed
```

### Transaction Schema

```typescript
interface Transaction {
  date: string;
  particulars: string;
  deposits: string;
  withdrawals: string;
  balance: string;
  payee: string | null;   // ML-predicted payee
}
```

---

## 🧪 Testing

Tests are colocated with their components and use **Vitest** + **Testing Library**.

```bash
# Run all tests
npm run test

# Run in watch mode
npx vitest

# Run with coverage
npx vitest --coverage
```

---

## 🎨 Styling Guide

This project uses **Tailwind CSS v4** — not v3. Key differences:

- **No `tailwind.config.js`** — theme is extended via `@theme {}` in [`src/index.css`](src/index.css)
- Import: `@import "tailwindcss"` (not the old `@tailwind` directives)
- PostCSS plugin: `@tailwindcss/postcss`

Use the `cn()` utility for conditional class merging:

```typescript
import { cn } from './utils/cn';

<div className={cn('base-class', isActive && 'active-class')} />
```

---

## 🗺️ Roadmap

- [ ] CSV / Excel export from the transaction table
- [ ] Tauri desktop packaging
- [ ] Multi-statement batch upload
- [ ] Analytics dashboard with charts and trends
- [ ] Dark / light theme toggle

---

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'feat: add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

Please ensure all CI checks pass before requesting review.

---

## 📄 License

This project is developed under the **TIH IIT Bombay** initiative.

---

<p align="center">
  Built with ❤️ by the CreditMitra team at TIH, IIT Bombay
</p>
