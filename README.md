# InvoiceHub — Frontend

A modern, dark-themed React frontend for **InvoiceHub**, a multi-tenant SaaS invoicing & billing platform.
Pairs with the FastAPI backend at [InvoiceHub-Backend](https://github.com/) (or your local copy at `INVBackend/`).

## Stack

- **React 18 + Vite 5** (JSX)
- **Tailwind CSS 3** — dark-first, custom indigo→violet→cyan gradient system, glassmorphism cards
- **Zustand** — auth + invoice draft state (with localStorage persistence)
- **React Router 6** — public/protected route guards
- **Axios** — JWT bearer + auto refresh-token interceptor
- **react-hook-form + zod** — form state & validation
- **Recharts** — dashboard revenue chart
- **react-hot-toast**, **lucide-react**, **date-fns**

## Features

- Auth (register, login, refresh, logout) with JWT access + refresh tokens
- Dashboard with KPI cards, 12-month revenue chart, recent invoices, top clients
- Invoice builder (line items, taxes, discount, currency, terms) with live totals
- Invoice detail with actions: send, mark-paid, remind, download PDF, duplicate, delete, Stripe payment link
- Client CRM (CRUD + invoice history)
- Payments page with status/method badges
- Settings: tenant info, currency/tax/prefix/payment terms, logo upload to S3

## Run locally

```bash
# 1. Install deps
npm install

# 2. Set env vars
cp .env.example .env
# edit .env to point at your backend (default is http://localhost:8000/api/v1)

# 3. Start the backend (separate terminal)
#    The backend must be running on :8000 — its CORS only allows http://localhost:5173

# 4. Start the dev server
npm run dev
# → http://localhost:5173
```

## Build for production

```bash
npm run build      # outputs to dist/
npm run preview    # preview the production build locally
```

## Project layout

```
src/
├── api/              # axios instance + per-resource API modules
├── store/            # zustand stores (auth, invoice draft)
├── hooks/            # useAuth, useInvoiceTotals
├── utils/            # currency, date, status colors
├── components/
│   ├── ui/           # Button, Input, Card, Badge, Modal, Table, …
│   ├── layout/       # AppLayout, Sidebar, Navbar, AuthLayout, ProtectedRoute
│   └── invoice/      # LineItemRow, InvoicePreview, InvoiceSummary
└── pages/
    ├── Login.jsx, Register.jsx
    ├── Dashboard.jsx
    ├── Invoices/     # List, Create, Detail
    ├── Clients/      # List, Form
    ├── Payments.jsx
    └── Settings.jsx
```

## Backend contract

All endpoints under `/api/v1`. Auth via `Authorization: Bearer <access_token>`.
`tenant_id` is encoded in the JWT — no custom header needed.
On a 401, the axios interceptor transparently refreshes the access token via the refresh token and retries.

## License

MIT
