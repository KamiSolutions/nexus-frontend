### 🏢 Nexus Portal — Deathcare Operating System

A commercial, enterprise-grade B2B SaaS platform for funeral services providers, built by
Timothy "Musa" Musama at Injozi Technology Studio. It centralises the operations a funeral
parlour or funeral group actually runs on:

- Financials & policy administration (premiums, requisitions, approvals)
- HR / payroll workflows (leave, contracts, employee directory)
- Vehicle / fleet logistics
- Lease management
- Case intake / mortuary operations
- Claims processing
- Combined role-based access control (RBAC) — down to field-ops roles like `DRIVER` and
  `MORTUARY_STAFF`

It serves two shapes of customer from one codebase: small independent parlours (shared
multi-tenant SaaS) and large enterprise networks (dedicated single-tenant deployments).

Built as a single scalable codebase running across **Android, iOS, and Web** using Expo.

---

## 🏗️ Architecture

This repo (`nexus-frontend`) is the Expo Router frontend in a **polyrepo microservices**
architecture — not a standalone prototype. It talks to a real backend of independently
deployed FastAPI services, all under the `KamiSolutions` GitHub org:

| Service | Owns |
|---|---|
| `nexus-api-gateway` | Single entry point, routes `/api/v1/*` by path prefix |
| `nexus-identity-service` | Auth (JWT issuance), tenant resolution, combined RBAC |
| `nexus-financials-service` | Finance, billing, policy administration |
| `nexus-hr-service` | Employees, HR/workforce |
| `nexus-fleet-service` | Vehicles/logistics |
| `nexus-cases-service` | Case intake / mortuary operations |
| `nexus-claims-service` | Claims, leases |
| `nexus-audit-service` | Immutable, transactional audit log |
| `nexus-platform-service` | Command Centre aggregation, companies/admin/settings/analytics/reports |
| `nexus-infra` | Shared CI/CD workflow template, Docker Compose for local multi-service dev |

Auth is JWT-based: `nexus-identity-service` is the only token issuer; every other service
verifies the token statelessly using a shared secret, with no synchronous call back to
identity-service per request. A signed-in session persists across app reloads (`expo-secure-store`
on native, `localStorage` on web) and is re-validated live against the server on launch, never
trusted from a local cache.

**Honesty rule, enforced throughout:** an "integration status" or service-health indicator never
shows a fabricated green checkmark. If something isn't actually connected, it says
"Not connected — demo mode," or the gateway returns a real `503` naming the downed service —
never a silent fake success. This applies equally to Nexus's own internal services and to
third-party providers (easiPol, EasyPay/Pay@, Netcash/EasyDebit, Sage/PaySpace — none of which
are connected yet; they're built against a specific real client engagement, not speculatively).

---

## ⚙️ Tech Stack

TypeScript · React Native · Expo Router (Web + Mobile) · React 19 · RN 0.81 · Expo ~54 ·
JWT-based auth · Combined RBAC · REST API integration against `nexus-api-gateway`

---

## 🚀 Getting Started (Local Setup)

### 1. Clone the repo

```bash
git clone https://github.com/KamiSolutions/nexus-frontend.git
cd nexus-frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env
```

`.env` needs `EXPO_PUBLIC_API_URL` pointing at a running `nexus-api-gateway` (defaults to
`http://localhost:8000` for local dev — see `nexus-infra`'s `docker-compose.yml` to bring up the
full backend stack, or run each service individually with `uvicorn`).

### 4. Start the development server

Web:
```bash
npm run web
```

Mobile (Expo Go):
```bash
npm start
```
Then scan the QR code using Expo Go.

### 5. Build for production (Web)

```bash
npm run build
```

Output is generated in `dist/` — this is what gets deployed to platforms like Vercel.

---

## 🌐 API Setup

This frontend requires a running `nexus-api-gateway` and the backend services behind it.
Requirements:

- Authentication endpoints available via `nexus-identity-service` (through the gateway)
- JWT token-based auth
- CORS configured for your frontend's origin (`nexus-api-gateway` ships a local-dev origin
  allowlist out of the box)

The fastest way to get a full backend stack running locally is `nexus-infra`'s Docker Compose
setup, which boots all 9 backend services plus a database.

---

## 📁 Project Structure (Simplified)

```
nexus-frontend/
├── app/                # Routes (Expo Router) — (auth)/ and (workspace)/ groups
├── components/         # Reusable UI components
├── lib/                # API + utilities, cross-platform storage
├── providers/          # Auth & theme providers
├── constants/          # Theme tokens & config
├── services/           # API service layer
├── assets/             # Images & fonts
└── dist/                # Production web build
```

See `FOLDER_STRUCTURE.md` for a proposed longer-term reorganization (barrel exports, path
aliases, `components/modules/*`) — that document describes a target structure to migrate toward,
not the current layout.

---

## 🔐 Key Features

- Combined role-based access control, mirrored between this repo's `lib/permissions.ts` and
  every backend service's `app/core/rbac.py` — from `SUPER_ADMIN` down to field-ops roles like
  `DRIVER` and `MORTUARY_STAFF`
- Real JWT authentication with cross-platform persisted sessions, re-validated against the
  server on every app launch
- Cross-platform UI (Web + Mobile) from one codebase
- Command Centre / Overview with real `Operational` / `Attention Required` / `Unknown` status —
  never a fabricated healthy indicator
- Read-only offline caching (policies, employees, vehicles, claims, leases) via `expo-sqlite`,
  honestly labeled as served from cache
- Write workflows (create/update/delete) across finance, HR, fleet, cases, claims, and leases,
  each backed by a real audit-log entry

---

## 🧠 Notes for Developers

- All API calls are environment-driven via `EXPO_PUBLIC_API_URL` — do not hardcode backend URLs
- Web deployment uses SPA routing (refresh-safe)
- The backend is a separate polyrepo (see Architecture above) — it must be running independently
  of this frontend
- No real third-party provider integration (easiPol, EasyPay/Pay@, Netcash/EasyDebit,
  Sage/PaySpace) is connected yet, and none is planned speculatively — real integrations are only
  built against an actual client engagement that needs a specific one

---

## 🏗 Build & Deployment

Web (Vercel-ready):
```bash
npm run build
```
Deploy the `dist/` folder.
