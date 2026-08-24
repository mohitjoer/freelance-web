# FreelanceBase 🚀

> A modern freelance marketplace connecting clients with skilled freelancers — secure job postings, real-time chat, reporting, and seamless project management.

[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/) [![React](https://img.shields.io/badge/React-19-61dafb)](https://react.dev/) [![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue)](https://www.typescriptlang.org/) [![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-green)](https://mongodb.com/) [![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38bdf8)](https://tailwindcss.com/) [![Bun](https://img.shields.io/badge/Bun-1.0+-000000)](https://bun.sh/)

A single-stop platform for clients and freelancers to find, manage, and deliver projects with confidence.

## Table of Contents

- [About](#about)
- [Features](#-features)
- [Tech Stack](#%EF%B8%8F-technology-stack)
- [Project Structure](#-project-structure)
- [Quick Start](#-quick-start)
- [Scripts](#scripts)
- [Architecture Notes](#architecture-notes)
- [Code Quality](#code-quality)
- [Chrome Extension](#chrome-extension)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [Security](#security)
- [License](#license)

## About

FreelanceBase is a modern, full-stack freelance marketplace designed to connect clients with freelancers worldwide. It focuses on security, performance, and a great developer experience.

## ✨ Features

- Secure authentication with role-based access control (Client / Freelancer) via Better Auth (email/password).
- Job management: post jobs, apply, manage proposals, track progress to completion.
- Real-time communication: Socket.IO chat rooms with message history.
- Reporting & dispute workflow for safety and trust.
- Freelancer dashboard: proposals, active jobs, completed work, portfolio, and skills.
- Chrome extension for quick access.
- Persistent light/dark theme support.

## 🛠️ Technology Stack

- Frontend: Next.js 16 (App Router), React 19, TypeScript (strict), Tailwind CSS v4, shadcn/ui + Radix, MUI icons
- Backend: Next.js App Router API routes + standalone Node.js Socket.IO chat server
- Database: MongoDB via Mongoose — two separate connections (main DB and chat DB)
- Auth: Better Auth with the MongoDB adapter
- Real-time: Socket.IO
- Runtime / Package Manager: Bun


## 📂 Project Structure

```
freelance-web/
├── src/
│   ├── app/                    # Next.js App Router (pages & API routes)
│   │   ├── api/                # REST endpoints (auth, jobs, proposals, users, reports, rooms)
│   │   ├── dashboard/          # Client & freelancer dashboards
│   │   ├── jobs/               # Job listings, details, create/edit
│   │   ├── room/[roomId]/      # Real-time chat room UI
│   │   └── profile/            # User profiles
│   ├── components/             # Reusable UI components (shadcn/ui in components/ui)
│   ├── lib/                    # Utilities (auth, session, serialization)
│   ├── mongo/                  # Main DB connection + Mongoose schemas
│   ├── chatmongo/              # Separate chat DB connection + models
│   └── fonts/, types/          # Fonts and shared types
├── server/
│   └── server.ts               # Standalone Socket.IO chat server (port 4000)
├── chrome extension/           # Separate MV3 browser extension (not part of the Next build)
├── public/                     # Static assets
├── next.config.ts              # Next.js config (remote image hosts whitelisted here)
├── tailwind.config.ts          # Tailwind config
├── doctor.config.json          # react-doctor scan configuration
└── tsconfig.json               # TypeScript config (`@/*` → `./src/*`)
```


## 🚀 Quick Start

### Prerequisites

- [Bun](https://bun.sh/docs/installation) v1.0+
- Node.js v18+ (for compatibility)
- MongoDB Atlas or local MongoDB (two databases)

### Installation

1. Clone the repository

```bash
git clone https://github.com/mohitjoer/freelance-web.git
cd freelance-web
```

2. Install dependencies

```bash
bun install
```

3. Create environment file

Create a `.env.local` in the project root with the values below (replace placeholders):

```env
# Databases (main app DB and separate chat DB)
MONGO_DB=mongodb+srv://username:password@cluster.mongodb.net/freelancebase
MONGO_DB_CHAT=mongodb+srv://username:password@cluster.mongodb.net/freelancebase-chat

# Better Auth
BETTER_AUTH_SECRET=your-secret-key
BETTER_AUTH_URL=http://localhost:3000

# Optional: socket server URL for the client (defaults to http://localhost:4000)
NEXT_PUBLIC_SOCKET_URL=http://localhost:4000
```

> **Note:** the app throws at import time if `MONGO_DB`, `MONGO_DB_CHAT`, `BETTER_AUTH_SECRET`,
> or `BETTER_AUTH_URL` are missing.

4. Run the development servers

```bash
bun run dev
```

This starts both processes concurrently:

- Socket.IO chat server → http://localhost:4000
- Next.js dev server → http://localhost:3000

## Scripts

| Command | Description |
| --- | --- |
| `bun run dev` | Start Socket.IO server (4000) + Next.js dev server (3000) together |
| `bun run build` | Production build (`next build`) |
| `bun run start` | Serve the production build |
| `bun run lint` | ⚠️ Currently broken — see [Code Quality](#code-quality) |

CI runs `bun install --frozen-lockfile` followed by `bun run build` and `bun run lint`
(`bun.lock` is the source of truth). The lint step currently fails due to the issue described
in [Code Quality](#code-quality); `next build`'s TypeScript check is the effective gate until then.

## Architecture Notes

- **Two Mongo connections:** main app data lives through `src/mongo/db.ts`; chat rooms live through
  `src/chatmongo/chatdb.ts`. Don't mix models across them.
- **Auth:** Better Auth with the MongoDB adapter (`src/lib/auth.ts`, catch-all route under
  `src/app/api/auth`). Use `getUserId()` from `src/lib/session.ts` for session checks in API routes
  and server components.
- **Real-time chat** runs as a standalone Node http + Socket.IO process in `server/server.ts`
  (port 4000), separate from Next.js. The client connects in `src/app/room/[roomId]/page.tsx`.
- **Remote images:** `next.config.ts` whitelists image hosts (Cloudinary, picsum). Add new hosts
  there or `next/image` will fail.
- **Path alias:** `@/*` maps to `./src/*`.

## Code Quality

- Verification: `bun run build` (includes strict type checking), then a
  [react-doctor](https://react.doctor) scan (`npx react-doctor@latest --verbose`).
- Current react-doctor score: **100/100** (0 errors, 0 warnings) as of react-doctor 0.9.12.
- Known issue: the `lint` script is broken — Next.js 16 removed `next lint`, and
  `eslint-config-next` is currently incompatible with the installed ESLint major. Migration to the
  ESLint CLI is pending; `next build`'s TypeScript check is the effective gate until then.

## Chrome Extension

The `chrome extension/` folder contains an independent Manifest V3 extension for quick access to
the platform. Load it manually via `chrome://extensions` → Developer mode → "Load unpacked".
It is not part of the Next.js build.

## Roadmap

- Escrow-style payments and invoicing
- Reviews & ratings expansion
- Notifications center
- Mobile app

## Contributing

Contributions are welcome!

1. Fork the repo and create your branch from `main`
2. Make your changes and verify with `bun install --frozen-lockfile && bun run build`
3. Run a `react-doctor` scan and make sure the score doesn't regress
4. Open a Pull Request with a clear description

## Security

Found a vulnerability? Please open a private security advisory or contact the maintainer directly
instead of filing a public issue.

## License

Distributed under the MIT License.
