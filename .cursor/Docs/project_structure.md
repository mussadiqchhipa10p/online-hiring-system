# Project Structure

```
online-hiring-system/
├─ apps/
│  ├─ web/                 # React (Vite), Candidate + Employer UI
│  ├─ admin/               # React Admin (MUI) for Admin users
│  └─ api/                 # Express + TS + Prisma + Socket.IO
├─ packages/
│  ├─ ui/                  # Shared UI library (cards, tables, forms, charts)
│  ├─ types/               # Shared DTOs/types/zod schemas
│  └─ config/              # ESLint/Prettier/tsconfig base
├─ infra/
│  ├─ docker-compose.yml   # Postgres + Redis for local dev
│  └─ k8s/                 # optional manifests
├─ .github/workflows/      # CI/CD pipelines
├─ .env.example            # root env, plus per-app .env.example
├─ turbo.json              # build orchestration
├─ package.json            # pnpm workspaces
└─ README.md
```

## Scripts (root)
- `pnpm dev` — concurrently start web, admin, and api.
- `pnpm build` — build all apps.
- `pnpm test` — run all test suites.

## Environments
- `.env` per app. Keep secrets out of repo. Provide `.env.example` with keys.

## Conventions
- Commit style: Conventional Commits.
- Branching: trunk-based with short-lived feature branches.
- Code style enforced via ESLint + Prettier. TypeScript strict mode.
