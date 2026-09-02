# ⚡ RelayPulse - High-Concurrency Task Engine & Distributed Event Dispatcher

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen)](https://nodejs.org/)
[![Next.js Version](https://img.shields.io/badge/next.js-v15-blue)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/typescript-v5-blue)](https://www.typescriptlang.org/)
[![Docker](https://img.shields.io/badge/docker-ready-cyan)](https://www.docker.com/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

> Production-grade **Developer Task Engine & Distributed Event Dispatcher** built with Node.js, Express, TypeScript, BullMQ, Redis, PostgreSQL, Prisma ORM, Socket.IO WebSockets, and Next.js 15 (App Router). Visual aesthetic inspired by Vercel, Linear, Supabase, and Inngest.

---

## 🌟 Platform Capabilities

RelayPulse offloads heavy or asynchronous background tasks (file transformations, report generations, web scraping, batch notifications, and data processing pipelines) without blocking HTTP API gateway threads.

### Key Features:
- ⚡ **Non-Blocking Architecture**: Express API Gateway offloads heavy workloads to dedicated Redis-backed BullMQ Workers.
- 🔄 **Real-Time Telemetry**: Socket.IO WebSockets stream live job progress (`0%` ➔ `100%`), state transitions (`PENDING` ➔ `PROCESSING` ➔ `COMPLETED` / `FAILED`), and execution logs directly to connected clients without polling.
- 🛡️ **Enterprise Multi-Tenant Security**: Dual-token JWT Authentication (Access + Refresh tokens rotated via Redis), password hashing via `bcrypt`, and Role-Based Access Control (`USER` / `ADMIN`).
- 🔄 **Resilient Execution Engine**: Automatic exponential backoff retries (max 3 attempts), delay scheduling, priority queueing (P1–P3), and step-by-step audit log trails.
- 🎨 **Production-Grade Developer UI**: Sleek neutral design system with light/dark contrast, Geist/Inter typography, data-dense task queue tables, single-tone status indicators, and 5 interactive telemetry views.

---

## 🛠️ Complete Technology Stack

| Layer | Technology | Key Function / Role |
| :--- | :--- | :--- |
| **Frontend Framework** | Next.js 15 (App Router) | Server Component SSR, Client Hydration, Routing, Developer Landing Page |
| **Global State** | Redux Toolkit | Session management, token persistence |
| **Server State** | TanStack Query v5 | Data fetching, background refetching, user-scoped cache keys |
| **Styling** | Tailwind CSS + Lucide Icons | Clean neutral palette (`#FAFAFA` / `#FFFFFF`), micro-borders, responsive design |
| **Backend Framework** | Express.js & Node.js 20 | REST API Gateway, Routing, Socket Server Host |
| **Language** | TypeScript 5 | Strict type safety across client and server |
| **Database & ORM** | PostgreSQL 16 & Prisma | Relational entity storage, indexes, schema migrations, type-safe queries |
| **Async Queue** | Redis 7 & BullMQ | Asynchronous job queues, workers, delayed execution, backoff retries |
| **Real-Time Engine** | Socket.IO | WebSockets engine emitting live progress % and task status updates |
| **Security** | JWT + bcrypt | Dual-token authentication with Redis refresh token invalidation & RBAC |
| **DevOps & Testing** | Docker & Compose | Multi-container orchestration, Jest unit testing |

---

## 🚀 Quick Start Guide (Local Setup)

### 1. System Requirements
- [Node.js v20+](https://nodejs.org/)
- [Docker Desktop](https://www.docker.com/) (running in background)
- Git

### 2. Clone Repository & Install Dependencies
```bash
git clone https://github.com/Pm-vk/RelayPulse.git
cd RelayPulse

# Install root monorepo runner dependencies
npm install
```

### 3. Start PostgreSQL & Redis Containers
```bash
docker compose up postgres redis -d
```
*Starts PostgreSQL on port `5434` and Redis on port `6379`.*

### 4. Run Database Migrations & Seed Accounts
```bash
cd server
npx prisma migrate dev --name init
npx tsx src/prisma/seed.ts
cd ..
```

### 5. Start All Application Services (1 Command)
```bash
npm run dev
```

*Starts all 3 application services concurrently:*
- 🌐 **Client (Next.js)**: `http://localhost:3004` (or `3000`)
- ⚡ **Server (Express API)**: `http://localhost:5001`
- ⚙️ **Worker (BullMQ Task Processor)**: Background queue worker loop

---

## 🗝️ Default Pre-Seeded Accounts

| Account Role | Email Address | Password | Access Privileges |
| :--- | :--- | :--- | :--- |
| 👤 **Demo User** | `user@taskforge.ai` | `UserPassword123!` | Personal queue isolation, create/manage own background tasks |
| 🛡️ **Admin User** | `admin@taskforge.ai` | `AdminPassword123!` | System-wide access, global metrics, view/retry all user tasks |

---

## 📡 API Reference Endpoint Summary

### Authentication Routes (`/api/v1/auth`)
- `POST /api/v1/auth/register`: Create a new user account.
- `POST /api/v1/auth/login`: Authenticate credentials & receive Access + Refresh tokens.
- `POST /api/v1/auth/refresh-token`: Refresh Access Token using valid Refresh Token.
- `POST /api/v1/auth/logout`: Revoke Refresh Token & invalidate Redis session.
- `GET /api/v1/auth/me`: Fetch authenticated user profile (`Bearer` token required).

### Task Queue Routes (`/api/v1/tasks`)
- `POST /api/v1/tasks`: Dispatch new background task (Supports scheduling & JSON payload).
- `GET /api/v1/tasks`: User-scoped or Admin-global paginated task list.
- `GET /api/v1/tasks/:id`: Fetch single task details with execution audit logs (`TaskLog`).
- `DELETE /api/v1/tasks/:id`: Cancel & delete task from database.
- `POST /api/v1/tasks/:id/retry`: Re-queue a `FAILED` task for background worker retry.
- `GET /api/v1/tasks/stats/summary`: Aggregate metrics for dashboard cards.

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for details.
