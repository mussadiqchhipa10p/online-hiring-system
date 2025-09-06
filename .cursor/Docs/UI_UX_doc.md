# UI/UX Guidelines

## Design Principles
- Clear role-based navigation (Candidate, Employer, Admin).
- Progressive disclosure: simple first, advanced filters/actions on demand.
- Mobile-first responsive design (CSS Grid/Flexbox).
- Accessibility: WCAG 2.1 AA targets, keyboard navigable, ARIA for forms/tables.

## Components
- **Job Card/List:** title, company, location, skills tags, status badge, CTA (Apply/View).
- **Application Table:** sortable columns (candidate, status, updated), bulk actions, row expansion.
- **Rating Form:** 1–5 stars, textarea feedback, optional interviewer field.
- **Analytics Charts:** time-series for applications, bar for avg ratings, pie for statuses.
- **Notifications/Toasts:** real-time updates for status/rating.

## Flows
- **Candidate:** browse → filter → view job → apply (resume URL/upload) → track status → view feedback.
- **Employer:** post job → review applications → set status → rate after interview → view analytics.
- **Admin:** manage employers → monitor jobs/applications → view platform analytics.

## Visual System
- Typography scale (e.g., 12/14/16/20/24/32).
- Color tokens for roles/status: 
  - Status: draft, published, closed, pending, interview, hired, rejected.
- Spacing: 8px grid, cards with generous padding and clear hierarchy.

## Empty/Error States
- Provide guidance and a primary action (e.g., “No applications yet — invite candidates”).

## Performance
- Virtualize long tables, paginate lists, cache queries, optimistic UI for status changes.
