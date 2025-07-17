# 🧱 BRICKS.md — Production-Ready Roadmap

---

## ✅ 1️⃣ Core RBAC & Permissions

- [X] Finalize `PermissionDomain` and `PermissionKey` enums (single source of truth)
- [X] Finalize `PERMISSION_MATRIX` for both backend and frontend (no magic strings!)
- [X] Implement `@Permissions()` decorator with `PermissionKey[]` typing
- [X] Finish `PermissionsGuard` with `has_all_permissions` bypass
- [ ] Seed **all** baseline permissions + roles:
  - Default User → self-management only
  - Manager → self-management + read/update users/platforms
  - Administrator → has all permissions
- [X] Add `view_` permissions for each admin UI section:
  - `view_admin_dashboard`
  - `view_user_management_dashboard`
- [ ] Add audit logs for CRUD on roles, permissions, sensitive user actions
- [X] Add `useCan()` composable on frontend for permission checks (canActivate in application store)
- [ ] Add `canActivate` tests (unit + e2e)

---

## 🔒 2️⃣ Authentication & Security

- [ ] Fix reset password flow and ensure JWT guard runs **before** throttle guard
- [ ] Add brute-force login rate limit, in-memory lock, optional CAPTCHA
- [ ] Log:
  - Successful logins (userId, IP, user agent)
  - Failed logins (attempted email, reason)
  - Refresh token usage
  - Password resets and completions
  - Account deletions/disables
- [ ] Add 2FA (Google Authenticator)
- [ ] Add Google OAuth signup (optional)

---

## ⚙️ 3️⃣ Backend Resilience & Infrastructure

- [ ] Organize log folder structure: `yyyy/mm/dd/yyyy-mm-dd.log` + rotation
- [ ] Push old logs to cold storage (e.g., S3)
- [ ] Implement log cleanup for old uploads/unparented images
- [ ] Add job & queue logs: status, DLQ, retries
- [ ] Add concurrency limits for workers
- [ ] Add BullMQ metrics or Prometheus integration for queue health
- [ ] Send Slack/Discord/email alerts for:
  - Failed jobs
  - DB loss
  - App crashes
  - Log spikes/anomalies

---

## 🧑‍💻 4️⃣ Frontend Polish & UX

- [ ] Fully localize static text, breadcrumbs, dashboard tabs, actions
- [ ] Localize Platforms + Dashboard strings
- [ ] Add Create buttons to dropdown Actions menus (future: export, bulk)
- [ ] Move table sorting to column headers instead of dropdown
- [ ] Refine pagination filters (modal vs inline form)
- [ ] Update Search Bar “X” to bypass debounce and emit immediately
- [ ] Redesign main actions dropdown for consistency
- [ ] Add modern table UI: flexible selectors, bulk actions, better rows-per-page selector
- [ ] Improve color picker, date input, phone input

---

## 🚀 5️⃣ Monitoring & Production Readiness

- [ ] Enforce HTTPS via proxy; manage certs with Let’s Encrypt
- [ ] Add `Strict-Transport-Security` (HSTS) header
- [ ] Terminate TLS at edge (Cloudflare, load balancer)
- [ ] Monitor unusual failed logins, store security logs
- [ ] Add OpenTelemetry for distributed tracing (optional)
- [ ] Add global rate limiting for API routes; stricter for auth routes
- [ ] Ensure `NODE_ENV=production` in prod; disable ORM `synchronize`

---

## 📝 6️⃣ Logging & Auditing Must-Haves

- [ ] Log CRUD for sensitive entities (games, roles, permissions)
- [ ] Log bulk ops (e.g., batch user deletions)
- [ ] Log app startup + graceful shutdown steps
- [ ] Log failed dependency connections (DB, Redis, S3)
- [ ] Add DLQ logging for failed jobs

---

## 🌐 7️⃣ Future / Polish Bricks

- [ ] Sign up with Google OAuth
- [ ] Implement full audit logs for all user actions
- [ ] Add notifications tab in user admin
- [ ] Expand `Game` entity: icon, tags, series, genre, dev/publisher
- [ ] Normalize `game_media` table (icon + cover)
- [ ] Share JS libraries (DTOs/utilities) between frontend & backend
- [ ] Version API routes for smooth upgrades

---

## ✅ 8️⃣ Optional “Corporate-Ready” Extras

- [ ] Add startup check: verify all `PermissionKey` enums exist in DB
- [ ] Add Redis caching for user permissions at scale
- [ ] Add hierarchical/wildcard permissions for large orgs
- [ ] Use shared monorepo package for enums/constants if splitting FE/BE

---

## 📌 Immediate Next Steps

✅ Lock `PERMISSION_MATRIX` & baseline seeds  
✅ Finalize `PermissionsGuard` with `has_all_permissions` logic  
✅ Add `useCan()` checks in frontend nav  
✅ Localize missing static strings  
✅ Fix reset password flow, test throttle guard order  
✅ Ship daily log rotation + cold storage for old logs

---

## 🏆 Final Motto

> **💎 Ship once, scale forever. Lock RBAC, secure auth, test thoroughly, then polish UX.**

---
