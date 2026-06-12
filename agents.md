# CreditMitra Dashboard — Agent Instructions

> **Repository**: `CreditMitra-dashboard`
> **Stack**: React 19 · TypeScript 6 · Vite 8 · Tailwind CSS v4 · TanStack React Query · Axios · React Router v7

---

## 1. Project Identity

CreditMitra Dashboard is the **frontend interface** for the CreditMitra bank-statement analysis pipeline. It allows users to:

1. **Upload** PDF bank statements via drag-and-drop.
2. **Monitor** background processing status with animated indicators.
3. **View** extracted and enriched transaction data in a sortable, searchable table.

The backend (`CreditMitra-engine`, a FastAPI service) handles the actual PDF extraction and payee prediction. This frontend communicates with it over REST.

> **Desktop target**: This app is architected to be wrapped in **Tauri** (or Electron) in the future. Routing uses hash-based navigation and the codebase avoids browser-exclusive APIs where possible.

---

## 2. Architecture Overview

```
frontend/
├── src/
│   ├── main.tsx                    # React DOM entry point
│   ├── App.tsx                     # Root component — QueryClientProvider + Router
│   ├── App.css                     # Global app-level styles
│   ├── index.css                   # Tailwind v4 imports + CSS custom properties
│   │
│   ├── components/                 # Shared, reusable components
│   │   ├── layout/
│   │   │   ├── Header.tsx          # Top navigation bar
│   │   │   └── Footer.tsx          # Page footer
│   │   └── ui/
│   │       ├── Button.tsx          # Reusable button with variant props
│   │       └── Button.test.tsx     # Unit test for Button
│   │
│   ├── features/                   # Feature-based modules (domain logic + UI)
│   │   ├── ingest/                 # PDF upload & processing flow
│   │   │   ├── UploadDropzone.tsx  # Drag-and-drop file upload area
│   │   │   ├── ProcessingStatus.tsx# Animated task status indicator
│   │   │   └── hooks/
│   │   │       └── useProcessStatement.ts  # Upload mutation + status polling
│   │   ├── dashboard/
│   │   │   └── Dashboard.tsx       # Main dashboard page view
│   │   └── results/
│   │       ├── TransactionTable.tsx# Sortable/searchable transaction ledger
│   │       └── StatsOverview.tsx   # Summary statistics cards
│   │
│   ├── routes/
│   │   └── index.tsx               # Route definitions (React Router v7)
│   │
│   ├── services/
│   │   └── api.ts                  # Axios instance + interceptors
│   │
│   ├── store/
│   │   └── queryClient.ts          # TanStack React Query client config
│   │
│   ├── types/
│   │   └── transaction.ts          # TypeScript interfaces for API data
│   │
│   └── utils/
│       └── cn.ts                   # clsx + tailwind-merge helper
│
├── public/                         # Static assets
├── index.html                      # HTML entry point
├── vite.config.ts                  # Vite bundler configuration
├── vitest.config.ts                # Vitest test runner config
├── tsconfig.json                   # TypeScript project references root
├── tsconfig.app.json               # App-specific TS config (strict mode)
├── tsconfig.node.json              # Node-specific TS config (Vite/tooling)
├── eslint.config.js                # ESLint flat config
├── postcss.config.js               # PostCSS — uses @tailwindcss/postcss
├── .prettierrc                     # Prettier formatting rules
└── package.json
```

### Key Architectural Decisions

| Decision                  | Choice                        | Rationale                                                    |
| ------------------------- | ----------------------------- | ------------------------------------------------------------ |
| Build tool                | Vite 8                        | Fast HMR, excellent Tauri integration                        |
| Styling                   | Tailwind CSS v4               | Utility-first, v4 uses `@import "tailwindcss"` (no config)   |
| Server state              | TanStack React Query          | Automatic caching, polling, deduplication for API calls       |
| HTTP client               | Axios                         | Interceptors for future auth, consistent error handling       |
| Routing                   | React Router v7               | Hash-based routing works in desktop app contexts              |
| Feature structure         | Feature-based (`features/`)   | Each domain feature is self-contained with components + hooks |

---

## 3. Critical Constraints — Read Before Writing Any Code

### 3.1 Desktop-Ready Architecture

This app **will be packaged in Tauri**. This means:

- **No server-side rendering**. This is a pure SPA.
- **Avoid `window.location` directly** — use React Router's navigation hooks.
- **Hash-based routing** is preferred. If you see `BrowserRouter`, discuss before changing to/from `HashRouter`.
- **Avoid browser-only APIs** (e.g., `navigator.geolocation`, Web Notifications) unless behind a capability check.
- **Keep the Axios base URL configurable** via `VITE_API_BASE_URL` env var, so Tauri can point to a sidecar or bundled backend.

### 3.2 No Authentication UI

There is **no login page, no auth flow, no token management** required. The backend has no auth. The token interceptor in `api.ts` is scaffolded but dormant — do not activate or build auth UI unless explicitly requested.

### 3.3 Tailwind CSS v4 — Not v3

This project uses **Tailwind v4**, which has a fundamentally different setup:

- **No `tailwind.config.js`** — configuration is done via CSS (`@theme` directive in `index.css`).
- Import syntax in `index.css`: `@import "tailwindcss";` (not the old `@tailwind base/components/utilities` directives).
- PostCSS plugin: `@tailwindcss/postcss` (not `tailwindcss` directly).
- **Do not create a `tailwind.config.js`**. If you need to extend the theme, use `@theme {}` in CSS.

### 3.4 Strict TypeScript

- `verbatimModuleSyntax` is enabled — always use `import type { X }` for type-only imports.
- `noUnusedLocals` and `noUnusedParameters` are enabled — no dead code.
- Target: ES2023. No need for legacy polyfills.

---

## 4. Backend API Contract

The frontend communicates with the FastAPI backend at `http://localhost:8000/api/v1` (configurable via `VITE_API_BASE_URL`).

### Endpoints Used

| Method | Path                              | Request                | Response                                      |
| ------ | --------------------------------- | ---------------------- | --------------------------------------------- |
| `POST` | `/statements/process`             | `multipart/form-data` (`pdf` field) | `{ task_id, status, message }`       |
| `GET`  | `/statements/status/{task_id}`    | —                      | `{ task_id, status, transactions?, error? }`  |

### Transaction Shape

```typescript
interface Transaction {
  date: string;
  particulars: string;
  deposits: string;
  withdrawals: string;
  balance: string;
  payee: string | null;
}
```

### Task Statuses

`"pending"` → `"processing"` → `"completed"` | `"failed"`

The `useProcessStatement` hook handles the full lifecycle: upload mutation → poll status at intervals → return results.

---

## 5. Coding Conventions

### File Naming

- Components: `PascalCase.tsx` (e.g., `TransactionTable.tsx`)
- Hooks: `camelCase.ts` prefixed with `use` (e.g., `useProcessStatement.ts`)
- Utils/services: `camelCase.ts` (e.g., `api.ts`, `cn.ts`)
- Types: `camelCase.ts` (e.g., `transaction.ts`)
- Tests: `ComponentName.test.tsx` — colocated with the component

### Component Patterns

- **Functional components only** — no class components.
- **Named exports** for feature components; **default export** only for `App.tsx`.
- Props should be typed with a dedicated interface (e.g., `interface ButtonProps { ... }`).
- Use the `cn()` utility from `utils/cn.ts` for conditional Tailwind classes:

```typescript
import { cn } from '../../utils/cn';

<div className={cn('base-class', isActive && 'active-class')} />
```

### State Management

- **Server state**: TanStack React Query (mutations for uploads, queries for polling).
- **Local UI state**: React `useState` / `useReducer`.
- **No Redux, Zustand, or Jotai** — keep it simple until complexity demands it.

### Linting & Formatting

- **ESLint**: Flat config in `eslint.config.js` (TypeScript-ESLint + React Hooks + React Refresh).
- **Prettier**: Configured in `.prettierrc`.
- **Husky + lint-staged**: Pre-commit hooks enforce linting.
- Run lint: `npm run lint`
- Run format: `npm run format`

---

## 6. Adding New Features — Step-by-Step

### New Feature Module

1. Create a directory under `src/features/<feature-name>/`.
2. Add components (`.tsx`), hooks (`hooks/useXyz.ts`), and feature-local types if needed.
3. If the feature needs API calls, add typed functions to `src/services/api.ts` or a new service file.
4. Add shared TypeScript interfaces to `src/types/`.
5. Wire the feature into routing in `src/routes/index.tsx`.

### New Shared Component

1. Add to `src/components/ui/` (generic) or `src/components/layout/` (structural).
2. Keep it **stateless and prop-driven** — no API calls inside shared components.
3. Write a colocated test: `ComponentName.test.tsx`.

### New API Endpoint Integration

1. Add the function to `src/services/api.ts`:
   ```typescript
   export const fetchAnalytics = () => api.get<AnalyticsResponse>('/analytics/summary');
   ```
2. Create a custom hook in the relevant feature's `hooks/` directory using React Query:
   ```typescript
   import { useQuery } from '@tanstack/react-query';
   import { fetchAnalytics } from '../../../services/api';

   export const useAnalytics = () =>
     useQuery({ queryKey: ['analytics'], queryFn: fetchAnalytics });
   ```

---

## 7. Styling Guidelines

### Design Language

- **Dark-mode FinTech aesthetic** — deep grays, vibrant accent gradients, glass-morphism cards.
- **No plain/generic colors** — use curated HSL palette defined in CSS custom properties.
- **Micro-animations** — subtle hover effects, transitions, loading shimmer.
- **The UI must feel premium**, not generic or "AI-generated".

### Tailwind v4 Theming

Extend the design system via `@theme` in `src/index.css`:

```css
@import "tailwindcss";

@theme {
  --color-brand: oklch(0.65 0.24 265);
  --color-surface: oklch(0.15 0.01 260);
  /* ... */
}
```

### Utility Helper

Always use the `cn()` function for merging Tailwind classes:

```typescript
// src/utils/cn.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

---

## 8. Environment Variables

All env vars must be prefixed with `VITE_` to be exposed to the client bundle.

| Variable             | Default                              | Description                       |
| -------------------- | ------------------------------------ | --------------------------------- |
| `VITE_API_BASE_URL`  | `http://localhost:8000/api/v1`       | Backend API base URL              |

Create a `.env` file in the `frontend/` root for local overrides. **Never commit secrets** — the `.gitignore` already excludes `.env*`.

---

## 9. Running the Frontend

```bash
cd frontend
npm install
npm run dev
```

Dev server starts at `http://localhost:5173`.

### Other Scripts

| Command             | Purpose                                      |
| -------------------- | -------------------------------------------- |
| `npm run dev`        | Start Vite dev server with HMR               |
| `npm run build`      | TypeScript check + production build           |
| `npm run preview`    | Preview the production build locally          |
| `npm run lint`       | Run ESLint                                    |
| `npm run format`     | Run Prettier on `src/`                        |
| `npm run test`       | Run Vitest tests                              |

---

## 10. Testing

- **Test runner**: Vitest (configured in `vitest.config.ts`).
- **DOM testing**: `@testing-library/react` + `@testing-library/jest-dom`.
- **Environment**: `jsdom`.
- Tests are colocated with components: `Button.test.tsx` next to `Button.tsx`.

```typescript
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
```

---

## 11. Future Considerations

- **Tauri packaging**: Vite is Tauri's recommended bundler. When the time comes, run `npx @tauri-apps/cli init` in this directory. The Axios base URL will need to point to a sidecar backend (`http://localhost:<port>`) or Tauri's IPC layer.
- **Electron alternative**: If Electron is chosen instead, the SPA build (`npm run build`) can be loaded via `BrowserWindow.loadFile('dist/index.html')`.
- **Offline support**: Since the backend is local and there's no auth, this app is inherently offline-capable once packaged. Consider adding a service worker only if needed.
- **CSV/Excel export**: Likely next feature — add an export button to `TransactionTable.tsx` that triggers a download from a new backend endpoint or generates client-side.
