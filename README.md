# Online Hiring System

A comprehensive online hiring platform built with modern web technologies. This monorepo contains a web application for job seekers and employers, an admin panel for platform management, and a robust API backend.

## 🏗️ Architecture

This is a monorepo built with:
- **Frontend (Web)**: React 18 + Vite + TypeScript + Redux Toolkit + Tailwind CSS
- **Admin Panel**: React Admin + Material-UI + TypeScript
- **Backend (API)**: Node.js + Express + TypeScript + Prisma + PostgreSQL
- **Database**: PostgreSQL with Redis for caching
- **Real-time**: Socket.IO for live notifications
- **Package Manager**: pnpm workspaces

## 📁 Project Structure

```
online-hiring-system/
├── apps/
│   ├── web/                 # React frontend application
│   ├── admin/               # React Admin panel
│   └── api/                 # Express API server
├── packages/
│   ├── types/               # Shared TypeScript types
│   ├── ui/                  # Shared UI components
│   └── config/              # Shared configuration
├── docker-compose.yml       # Local development environment
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- pnpm 8+
- Docker & Docker Compose

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd online-hiring-system
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy environment files
   cp .env.example .env
   cp apps/api/.env.example apps/api/.env
   cp apps/web/.env.example apps/web/.env
   cp apps/admin/.env.example apps/admin/.env
   ```

4. **Start the development environment**
   ```bash
   # Start PostgreSQL and Redis
   docker-compose up -d
   
   # Start all applications
   pnpm dev
   ```

### Access Points

- **Web App**: http://localhost:3000
- **Admin Panel**: http://localhost:3002
- **API**: http://localhost:3001
- **API Health**: http://localhost:3001/health

## 🛠️ Development

### Available Scripts

```bash
# Development
pnpm dev              # Start all apps in development mode
pnpm build            # Build all apps
pnpm test             # Run tests
pnpm lint             # Lint all code
pnpm type-check       # Type check all TypeScript

# Database
pnpm db:generate      # Generate Prisma client
pnpm db:push          # Push schema to database
pnpm db:migrate       # Run database migrations
pnpm db:seed          # Seed database with sample data
pnpm db:studio        # Open Prisma Studio
```

### Database Setup

1. **Start PostgreSQL and Redis**
   ```bash
   docker-compose up -d
   ```

2. **Set up the database**
   ```bash
   cd apps/api
   pnpm db:generate
   pnpm db:push
   pnpm db:seed
   ```

### Sample Data

The seed script creates sample data with these accounts:

- **Admin**: admin@example.com / admin123
- **Employer**: employer@example.com / employer123  
- **Candidate**: candidate@example.com / candidate123

## 🏛️ Tech Stack

### Frontend (Web)
- React 18 with TypeScript
- Vite for build tooling
- Redux Toolkit for state management
- React Router for navigation
- Tailwind CSS for styling
- React Query for data fetching
- Socket.IO client for real-time features

### Admin Panel
- React Admin framework
- Material-UI components
- TypeScript for type safety
- Custom data providers

### Backend (API)
- Node.js with Express
- TypeScript for type safety
- Prisma ORM with PostgreSQL
- Redis for caching and sessions
- JWT for authentication
- Passport.js for OAuth (Google, LinkedIn)
- Socket.IO for real-time features
- Zod for validation

### Database
- PostgreSQL 15+ as primary database
- Redis for caching and real-time features
- Prisma for database management

## 🔐 Authentication

The system supports multiple authentication methods:

- **JWT-based authentication** with access/refresh tokens
- **OAuth integration** with Google and LinkedIn
- **Role-based access control** (Admin, Employer, Candidate)
- **Protected routes** and API endpoints

## 📊 Features

### For Job Seekers (Candidates)
- Browse and search job listings
- Apply to jobs with resume upload
- Track application status
- View interview feedback and ratings
- Real-time notifications

### For Employers
- Post and manage job listings
- Review and manage applications
- Schedule interviews
- Rate candidates after interviews
- Analytics dashboard

### For Administrators
- Manage user accounts
- Monitor platform metrics
- Oversee job postings and applications
- System analytics and reporting

## 🚀 Deployment

### Environment Variables

Key environment variables needed:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/online_hiring_system"
REDIS_URL="redis://localhost:6379"

# JWT
JWT_SECRET="your-secret-key"
JWT_REFRESH_SECRET="your-refresh-secret"

# OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
LINKEDIN_CLIENT_ID="your-linkedin-client-id"
LINKEDIN_CLIENT_SECRET="your-linkedin-client-secret"

# API
API_PORT=3001
CORS_ORIGIN="http://localhost:3000,http://localhost:3002"
```

### Production Deployment

1. **Build all applications**
   ```bash
   pnpm build
   ```

2. **Set up production database**
   - Configure PostgreSQL instance
   - Run migrations: `pnpm db:migrate`
   - Seed initial data: `pnpm db:seed`

3. **Deploy applications**
   - Deploy API to your preferred hosting platform
   - Deploy web app to Vercel/Netlify
   - Deploy admin panel to your hosting platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues or have questions, please:

1. Check the existing issues on GitHub
2. Create a new issue with detailed information
3. Contact the development team

---

**Happy Hiring! 🎉**
