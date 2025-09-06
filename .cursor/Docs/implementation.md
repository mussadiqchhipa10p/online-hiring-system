# Implementation Guide — Online Hiring System

## Overview
A scalable platform with three roles: **Candidate**, **Employer**, **Admin**. Built with React (web + admin), Node.js/Express API, Postgres (Prisma), Redis, Socket.IO, JWT+OAuth. This guide covers APIs, models, auth, sockets, analytics, and security.

## Data Model (Prisma)
See the canonical schema in `apps/api/prisma/schema.prisma`. Key entities: User, Employer, Candidate, Job, Application, Rating, Resume. Application has a single Rating created by Employer post-interview.

## REST API (v1)
- **Auth**
  - `POST /auth/register` — body: {email, password, role}
  - `POST /auth/login` — returns access/refresh tokens (httpOnly cookies)
  - `POST /auth/refresh`, `POST /auth/logout`
  - `GET /auth/google`, `GET /auth/linkedin` — OAuth
- **Jobs**
  - `GET /jobs` — query: `q, skills[], location, status, employerId, sort, page, pageSize`
  - `POST /jobs` (EMPLOYER) — create
  - `PATCH /jobs/:id` (EMPLOYER) — update/publish/close
  - `DELETE /jobs/:id` (EMPLOYER|ADMIN)
- **Applications**
  - `POST /applications` (CANDIDATE) — {jobId, resumeUrl, notes}
  - `GET /applications` — filter by `jobId`, `candidateId`, `status`
  - `PATCH /applications/:id/status` (EMPLOYER) — transitions with audit
- **Ratings**
  - `POST /ratings` (EMPLOYER) — {applicationId, score:1–5, feedback}
  - `GET /candidates/:id/ratings` — candidate sees their feedback
- **Employers (Admin)**
  - `GET /admin/employers`, `POST /admin/employers`, `PATCH /admin/employers/:id`, `DELETE /admin/employers/:id`
- **Analytics**
  - `GET /analytics/overview?from&to` — totals, apps per job, avg ratings, hires
  - `GET /analytics/employer/:id` — employer-specific KPIs

## Auth & RBAC
- JWT: short-lived access, long-lived refresh, rotate refresh on use.
- OAuth (Google/LinkedIn) with Passport. Map provider IDs to existing users by email; on first login, create role-specific profile.
- RBAC middleware: enforce `role in [ADMIN|EMPLOYER|CANDIDATE]`; resource ownership checks (e.g., employer→job).

## Realtime
- Socket.IO namespaces: `/employer`, `/candidate`, `/admin`.
- Events: `application:created`, `application:statusChanged`, `rating:created`, `job:published`.
- Auth handshake with JWT; join rooms by userId/employerId.

## Analytics
- Source of truth: Postgres. Use SQL views/materialized views for heavy aggregates.
- Cache hot aggregates in Redis with TTL; bust on writes to Jobs/Applications/Ratings.
- Example KPIs: applications per job, conversion to interview, avg rating by employer, time-to-hire.

## Security
- Helmet, CORS allowlist, rate limiting, input validation (Zod), output encoding.
- Store passwords with bcrypt; never log secrets.
- Enforce pagination on list endpoints; avoid N+1 via Prisma `include/select`.
- Audit logs for status changes and admin actions.

## Testing
- Unit (Jest/Supertest) for routes/services.
- Component (Vitest/RTL) for React.
- E2E (Cypress) for happy-path apply→rate flow.
- Load (Artillery) for critical endpoints; target P95 < 300ms.

## Deployment
- Frontend: Vercel/Netlify. Admin can be a separate site.
- Backend: AWS (EC2/ECS). Managed **Postgres** (RDS/Neon/Supabase). Redis (ElastiCache/Upstash).
- CI runs Prisma migrations before starting API.
