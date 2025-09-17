# 🧱 BRICKS.md — Production-Ready Roadmap

---

## ✅ PHASE 1: Core Cleanup & Security

Highest priority—ensures system correctness, security, and clean data handling.

# RBAC Finalization

- [ ] Frontend permission guards per route/tab
- [ ] Backend seeder alignment with full permission matrix
- [ ] Final schema review (namespacing, hierarchy, wildcards if needed)

# Logging Cleanup

- [ ] Limit logs to error and warn
- [ ] Route success/info to Metrics/Audit system
- [ ] S3 uploader for rotated logs → logs/yyyy/mm/dd/yyyymmdd.log
- [ ] Cron to clean up local logs older than X days

# Technical Debt Patching

- [ ] Rewrite/retest password reset logic to match token updates
- [ ] Ensure JWTGuard runs before ThrottleGuard
- [ ] Add IP/User-level lockouts on repeated throttles
- [ ] Audit tokens for edge cases (expiry/invalid tokens)

## 📊 PHASE 2: Metrics & Audit System

Organize visibility, observability, and compliance logic.

# Metrics Layer

- [ ] Track endpoint hits
- [ ] Error %, average response time
- [ ] BullMQ job queue stats

# Audit Trail System

- [ ] Admin edits/deletes
- [ ] S3 + SendGrid usage
- [ ] Major user updates (email, password, etc.)
- [ ] Notification deliveries

You can centralize these via a @core/telemetry module or two separate metrics + audit services.

## 🧼 PHASE 3: System Cleanup Tasks

Cron Jobs / Maintenance Tasks

- [ ] Clear orphaned uploads
- [ ] Upload & prune logs
- [ ] Clean up unpaired DB vs S3 entries
- [ ] Flag failed job artifacts for cleanup

## 🧪 PHASE 4: Internal Dev Tools / Feature Additions

Add polished, modular tooling that shows system maturity.

- [ ] 🔧 System Health Dashboard: /diagnostics
- [ ] 🔐 RBAC Visualizer: /admin/rbac-visualizer
- [ ] 🔑 JWT Debugger: /devtools/jwt-debugger
- [ ] 📊 BullMQ Monitor: /admin/queues

Each should be mountable into a <ToolKit> section or tabbed menu.

## 🧩 PHASE 5: Optional / Future Enhancements

These aren’t urgent, but should stay visible on the radar.

- [ ] Add more user metadata: username, bio, phone, country
- [ ] Google OAuth login
- [ ] Optional 2FA (Google Authenticator)
- [ ] New input types: Date picker, Intl phone input, Color picker

---

## ✅ 1️⃣ Core RBAC & Permissions

- [x] Finalize `PermissionDomain` and `PermissionKey` enums (single source of truth)
- [x] Finalize `PERMISSION_MATRIX` for both backend and frontend (no magic strings!)
- [x] Implement `@Permissions()` decorator with `PermissionKey[]` typing
- [x] Finish `PermissionsGuard` with `has_all_permissions` bypass
- [ ] Seed **all** baseline permissions + roles:
  - Default User → self-management only
  - Manager → self-management + read/update users/platforms
  - Administrator → has all permissions
- [x] Add `view_` permissions for each admin UI section:
  - `view_admin_dashboard`
  - `view_user_management_dashboard`
- [ ] Add audit logs for CRUD on roles, permissions, sensitive user actions
- [x] Add `useCan()` composable on frontend for permission checks (canActivate in application store)
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

- Table Checkboxes

  - Need to make sure the checkboxes and system know to turn off when list changes.
  - Global Tristate checkbox that handles state of all checkboxes.

## Footer Buttons

## Sorting Users

## Logs sorted by AWS events and error logs

>> Implement Audit System (Front + Back)

- Dashboard Overview

  - Server Health
  - Recent Platform History (Audits)
  - User Statistics (# of users/How many joined in last x days)
  - Game Information (Top Platforms/Recently Added/Etc)

- Assets Tab in Administration to view Media Assets (Images/Videos/Audio/Files/etc.) to view media assets stored in S3/Youtube
