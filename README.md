# FreelanceBase 🚀

> A modern freelance marketplace connecting clients with skilled freelancers — secure job postings, real-time chat, reporting, and seamless project management.

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/) [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/) [![MongoDB](https://img.shields.io/badge/MongoDB-7.0-green)](https://mongodb.com/) [![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8)](https://tailwindcss.com/) [![Bun](https://img.shields.io/badge/Bun-1.0-000000)](https://bun.sh/)


A single-stop platform for clients and freelancers to find, manage, and deliver projects with confidence.

Table of Contents

- About
- Features
- Tech Stack
- Project Structure
- Quick Start
- Scripts
- Chrome Extension
- Theme (Dark/Light)
- Roadmap
- Contributing
- Security
- License
- Acknowledgments


## About

FreelanceBase is a modern, full-stack freelance marketplace designed to connect clients with freelancers worldwide. It focuses on security, performance, and a great developer experience.

Language composition: TypeScript (99.2%), Other (0.8%).


## ✨ Features

- Secure authentication with role-based access control (Client / Freelancer) and Clerk integration.
- Job management: post jobs, apply, manage proposals, track progress.
- Real-time communication: WebSocket-based chat with history and search.
- Reporting & dispute workflow for safety and trust.
- Analytics dashboard and calendar integration.
- Chrome extension for quick access.
- Persistent light/dark theme support.


## 🛠️ Technology Stack

- Frontend: Next.js 15, TypeScript, TailwindCSS
- Backend: Next.js App Router (API routes / edge functions)
- Database: MongoDB (Mongoose)
- Auth: Clerk (NextAuth.js reference)
- Real-time: WebSockets / Socket.io
- Runtime / Package Manager: Bun


## 📂 Project Structure

```
frelance-web/
├── src/
│   ├── app/                    # Next.js App Router (pages & api)
│   │   ├── api/                # API endpoints (auth, jobs, users, chat)
│   │   ├── (dashboard)/        # Protected dashboard routes
│   │   ├── jobs/               # Job listings and details
│   │   ├── profile/            # User profiles
│   │   └── chat/               # Chat interface
│   ├── components/             # Reusable UI components
│   ├── lib/                    # Utilities (db, auth, utils)
│   ├── models/                 # MongoDB schemas
│   ├── types/                  # TypeScript types
│   └── styles/                 # Global styles
├── public/                     # Static assets
├── package.json                # Dependencies & scripts
├── tailwind.config.js          # Tailwind config
├── next.config.js              # Next.js config
└── tsconfig.json               # TypeScript config
```


## 🚀 Quick Start

Prerequisites

- Bun v1.0+ (https://bun.sh/docs/installation)
- Node.js v18+ (for compatibility)
- MongoDB Atlas or local MongoDB

Installation

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
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/freelancebase

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_secret_here
CLERK_WEBHOOK_SECRET=whsec_your_webhook_secret
```

4. Start development server

```bash
bun dev
```

Open http://localhost:3000


## 📜 Available Scripts

```bash
bun dev              # Start development server with hot reload
bun build            # Create production build
bun start            # Start production server
bun server/server.ts # Start websocket server
```


## 🔌 Chrome Extension (optional)

A lightweight Chrome extension is included for one-click access to the app.

To test:
- Open Chrome → Extensions → Enable Developer Mode → Load Unpacked → Select the extension folder
- Click the FreelanceBase icon → Open FreelanceBase


## 🌗 Theme (Dark / Light)

- Tailwind is configured with `darkMode: 'class'`.
- ThemeProvider manages `light`, `dark`, and `system` modes.
- Preference stored in `localStorage` under `freelancebase-theme`.


## 📈 Roadmap

- Phase 1: Core marketplace features (done)
- Phase 2: Multi-language support, Advanced Analytics
- Phase 3: AI-powered matching, API marketplace
- Phase 4: Enterprise & white-label features


## 🤝 Contributing

We welcome contributions! Please follow the standard Git workflow:

1. Fork the repo
2. Create a branch: `git checkout -b feature/your-feature`
3. Make changes & add tests
4. Run tests: `bun test`
5. Commit & open a PR

Please follow code style, add tests, and update docs.


## 🔒 Security

Report vulnerabilities to freelancebase01@gmail.com. Do not open public issues for security concerns.


## 📄 License

MIT — see LICENSE file.


## 🙏 Acknowledgments

Thanks to Next.js, MongoDB, Tailwind CSS, and Bun.

---

Made with ❤️ by the FreelanceBase team
