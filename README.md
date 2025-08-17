# FreelanceBase 🚀

> A modern, full-stack freelance marketplace connecting clients with skilled freelancers worldwide.

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0-green)](https://mongodb.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8)](https://tailwindcss.com/)
[![Bun](https://img.shields.io/badge/Bun-1.0-000000)](https://bun.sh/)

## ✨ Features

### 🔐 **Secure Authentication**
- JWT-based authentication with Clerk integration
- Role-based access control (Client/Freelancer)
- Profile verification system

### 💼 **Job Management**
- **For Clients:** Post detailed job requirements with budget ranges
- **For Freelancers:** Browse and apply to relevant opportunities
- Smart matching algorithm based on skills and preferences
- Proposal tracking and management

### 💬 **Real-time Communication**
- WebSocket-powered instant messaging
- Message history and search

### ⚠️ **Safety & Trust**
- Comprehensive user reporting system
- Automatic job cancellation 
- Dispute resolution workflow

### 📊 **Advanced Dashboard**
- Analytics for project completion
- Calendar integration for deadlines

### 🌐 **Performance**
- Server-side rendering with Next.js 15
- Automatic sitemap generation

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | Next.js 15, TypeScript, TailwindCSS | Modern React framework with type safety |
| **Backend** | Next.js App Router, API Routes | Full-stack capabilities with edge functions |
| **Database** | MongoDB, Mongoose | Flexible document database with ODM |
| **Authentication** | Clerk/NextAuth.js | Secure user management |
| **Real-time** | Socket.io, WebSockets | Live chat and notifications |
| **Package Manager** | Bun | Fast JavaScript runtime and package manager |

## 📂 Project Architecture

```
freelance-web/
├── 📁 src/
│   ├── 📁 app/                    # Next.js App Router
│   │   ├── 📁 api/                # API endpoints
│   │   │   ├── 📁 auth/           # Authentication routes
│   │   │   ├── 📁 jobs/           # Job management APIs
│   │   │   ├── 📁 users/          # User profile APIs
│   │   │   └── 📁 chat/           # Real-time chat APIs
│   │   ├── 📁 (dashboard)/        # Protected dashboard routes
│   │   ├── 📁 jobs/               # Job listing and details
│   │   ├── 📁 profile/            # User profiles
│   │   └── 📁 chat/               # Chat interface
│   ├── 📁 components/             # Reusable UI components
│   │   ├── 📁 ui/                 # Base UI components
│   │   ├── 📁 forms/              # Form components
│   │   ├── 📁 layout/             # Layout components
│   │   └── 📁 features/           # Feature-specific components
│   ├── 📁 lib/                    # Utility libraries
│   │   ├── 📁 db/                 # Database connection
│   │   ├── 📁 auth/               # Authentication helpers
│   │   └── 📁 utils/              # Helper functions
│   ├── 📁 models/                 # MongoDB schemas
│   ├── 📁 types/                  # TypeScript type definitions
│   └── 📁 styles/                 # Global styles
├── 📁 public/                     # Static assets
├── 📄 package.json                # Dependencies and scripts
├── 📄 tailwind.config.js          # TailwindCSS configuration
├── 📄 next.config.js              # Next.js configuration
└── 📄 tsconfig.json               # TypeScript configuration
```

## 🚀 Quick Start

### Prerequisites

Ensure you have the following installed:
- **Bun** v1.0+ ([Install Bun](https://bun.sh/docs/installation))
- **Node.js** v18+ (for compatibility)
- **MongoDB** Atlas account or local MongoDB instance

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/mohitjoer/freelance-web.git
   cd freelance-web
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Environment Configuration**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Database
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/freelancebase
   
   # Authentication (Clerk)
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
   CLERK_SECRET_KEY=sk_test_your_secret_here
   CLERK_WEBHOOK_SECRET=whsec_your_webhook_secret
   
   ```

4. **ENV Setup**
   
   Add the ENV to the .env .
  

5. **Start Development Server**
   ```bash
   bun dev
   ```

6. **Open Application**
   
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## 📜 Available Scripts

```bash

bun dev              # Start development server with hot reload
bun build            # Create production build
bun start            # Start production server
bun server/server.ts # Start websockit server

```

## 📈 Roadmap & Future Features

### Phase 1 (Current)
- ✅ Core marketplace functionality
- 🔄 **Advanced Search** - Elasticsearch implementation
- 
### Phase 2 (Q2 2025)
- ⏳ **Multi-language Support** - i18n implementation
- ⏳ **Advanced Analytics** - Business intelligence dashboard


### Phase 3 (Q3 2025)
- ⏳ **AI-Powered Matching** - ML-based job recommendations
- ⏳ **API Marketplace** - Third-party integrations

### Phase 4 (Q4 2025)
- ⏳ **White-label Solution** - Customizable instances
- ⏳ **Enterprise Features** - Team management, bulk hiring

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Getting Started

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes** and add tests
4. **Run the test suite** (`bun test`)
5. **Commit your changes** (`git commit -m 'Add amazing feature'`)
6. **Push to the branch** (`git push origin feature/amazing-feature`)
7. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style and conventions
- Write tests for new features
- Update documentation as needed
- Use conventional commit messages
- Ensure all tests pass before submitting PR

### Code of Conduct

Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before contributing.

## 🐛 Bug Reports & Feature Requests

- **Bug Reports:** Use the [bug report template](.github/ISSUE_TEMPLATE/bug_report.md)
- **Feature Requests:** Use the [feature request template](.github/ISSUE_TEMPLATE/feature_request.md)
- **Security Issues:** Email freelancebase01@gmail.com


## 🔒 Security

### Security Measures
- Input validation and sanitization
- Rate limiting on API endpoints
- CSRF protection
- XSS prevention
- SQL injection protection (NoSQL injection for MongoDB)

### Reporting Security Issues

Please report security vulnerabilities to **freelancebase01@gmail.com**. Do not create public issues for security concerns.

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** - For the amazing React framework
- **MongoDB** - For the flexible database solution
- **Tailwind CSS** - For the utility-first CSS framework
- **Bun** - For the fast JavaScript runtime

## 📞 Support & Contact
- **Email:** freelancebase01@gmail.com

---

<div align="center">

**[⭐ Star this repository](https://github.com/mohitjoer/freelance-web)** if you find it helpful!

Made with ❤️ by the FreelanceBase team

</div>
