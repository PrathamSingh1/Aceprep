# AcePrep : A Nextjs + Nodejs based interview prepration platform.

A comprehensive interview preparation platform with questions which is asked in interview, filtering, premium content, and interview experiences — built with Next.js and Express in a Turborepo monorepo.

<!-- Add your demo video/screenshot here -->

## Features

### Built

- **Authentication** — Email/password and Google OAuth with JWT sessions
- **Question Browsing** — Filter by language, field, difficulty, and text search
- **Premium Gating** — Page 2+ requires an active premium subscription
- **Admin CRUD** — Create, update, and delete question sets and questions
- **Responsive UI** — Works across desktop and mobile

### Coming Soon

- **Premium Purchase System** — Razorpay integration with tiered plans and upgrade support
- **Referral System** — Invite friends, earn wallet balance on their purchases
- **Discount Coupons** — Percentage and fixed-amount promo codes
- **Interview Experiences** — User-submitted experience posts with admin review
- **Wallet System** — In-app balance from referral rewards and purchases
- **Admin Dashboard** — Full platform management panel

## Tech Stack

### Frontend

| Technology     | Purpose                         |
| -------------- | ------------------------------- |
| Next.js 16     | React framework with App Router |
| React 19       | UI library                      |
| TypeScript     | Type-safe JavaScript            |
| Tailwind CSS 4 | Utility-first styling           |
| Axios          | HTTP client with interceptors   |

### Backend

| Technology       | Purpose                           |
| ---------------- | --------------------------------- |
| Express 5        | REST API framework                |
| TypeScript       | Type-safe server code             |
| Prisma 7         | ORM with PostgreSQL (Neon)        |
| JWT + bcrypt     | Authentication & password hashing |
| Google OAuth 2.0 | Social login                      |
| Razorpay         | Payment gateway                   |
| Zod 4            | Request validation                |
| Helmet           | Security headers                  |

### Infrastructure

| Technology        | Purpose                          |
| ----------------- | -------------------------------- |
| Turborepo         | Monorepo build system            |
| pnpm              | Package manager (workspace mode) |
| PostgreSQL (Neon) | Database                         |
| Prettier          | Code formatting                  |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [pnpm](https://pnpm.io/) v9+
- A [Neon](https://neon.tech/) PostgreSQL database
- Google OAuth credentials (optional)
- Razorpay account (optional)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/aceprep.git
   cd aceprep
   ```

2. Install dependencies
   pnpm install
3. Set up environment variables
   Server (apps/server/.env):
   DATABASE_URL="postgresql://..."
   JWT_SECRET="your-secret-key"
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   RAZORPAY_KEY_ID="your-razorpay-key"
   RAZORPAY_SECRET="your-razorpay-secret"
   FRONTEND_URL="http://localhost:3000"
   PORT=5000
   Frontend (apps/web/.env):
   NEXT_PUBLIC_API_URL="http://localhost:5000/api/v1"
   NEXT_PUBLIC_GOOGLE_CLIENT_ID="your-google-client-id"
4. Run database migrations and seed
   cd apps/server
   npx prisma migrate dev --name init
   npx prisma db seed
5. Start development servers
   pnpm dev
   Frontend runs on http://localhost:3000, backend on http://localhost:5000.
   Project Structure
   aceprep/
   ├── apps/
   │ ├── web/ # Next.js 16 frontend
   │ │ └── src/
   │ │ ├── app/ # App Router pages
   │ │ ├── components/ # Layout components
   │ │ ├── features/ # Auth & Questions modules
   │ │ └── lib/ # API client & utilities
   │ │
   │ └── server/ # Express 5 API
   │ ├── prisma/ # Schema & seed
   │ └── src/
   │ ├── features/ # Auth & Questions modules
   │ ├── middleware/ # Auth, validation, error handling
   │ ├── lib/ # Prisma client
   │ └── shared/ # Error classes
   │
   └── packages/
   ├── typescript-config/ # Shared tsconfig presets
   ├── eslint-config/ # Shared ESLint config
   └── ui/ # Shared React components
   API Endpoints
   Auth
   Method
   POST
   POST
   POST
   GET
   Questions
   Method
   GET
   GET
   GET
   POST
   POST
   DELETE
   DELETE
   Database
   The schema includes 12 models across authentication, questions, premium payments, referrals, and experiences. Key models:

- User — Account with role, wallet balance, premium status, referral code
- Question — Interview question with content, answer, difficulty, and tags
- QuestionSet — Groups questions by language + field
- PremiumPurchase — Payment records with Razorpay integration
- DiscountCoupon — Promo codes with usage limits
- ReferralReward — Referral bonus tracking
- Experience — User-submitted interview experiences
  See apps/server/prisma/schema.prisma for the full schema.
  Contributing

1. Fork the repo and create a feature branch
2. Follow the existing code patterns (feature-based modules, plain functions, Zod validation)
3. Use conventional commits: feat:, fix:, docs:, refactor:
4. Test your changes locally
5. Submit a PR with a clear description
   License
   MIT
