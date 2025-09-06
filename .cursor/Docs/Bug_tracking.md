# Bug Tracking & QA Process

## Tools
- Issue tracker (Jira or GitHub Issues/Projects).
- Labels: `bug`, `type:ui`, `type:api`, `priority:{p0,p1,p2}`, `area:{auth,jobs,apps,ratings,admin,analytics}`.

## Triage
- New issues auto-labeled `triage`.
- Daily triage by tech lead + QA: set priority/severity, assign owner, add milestone.

## Severity & SLA
- **P0 Critical:** downtime, data loss — fix/start < 4h, hotfix release.
- **P1 High:** core flow broken — fix within 1–2 days.
- **P2 Medium/Low:** minor issues — schedule in next sprint.

## Templates
**Bug Report**
- Summary
- Steps to Reproduce
- Expected vs Actual
- Screenshots/Logs
- Environment (commit, env, browser)

**Regression Checklist** (attach to PR)
- Area under change
- Impacted routes/components
- Tests added/updated
- Rollback plan

## Quality Gates
- PR requires: passing CI, tests, lint, reviewer approval.
- Release requires: smoke test checklist, E2E run green, changelog updated.
