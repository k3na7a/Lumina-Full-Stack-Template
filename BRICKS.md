# 🧱 BRICKS.md

## 🧱 Completed Items 🧱

- ✅ Fix Token verification (Layout instead of app) + Loading states
- ✅ Pagination swap to drop down + button combo from full button
- ✅ Navigation Dropdown not getting config (we moved it and never reconnected it)
- ✅ UserActions / Actions / Navigation dropdown fixes ( UserAction should use both Actions and Navigation structure )
- ✅ Check for cookie before doing an appstore init
- ✅ Add Create buttons to Dropdown Actions menu with future options (eg export)
- ✅ Move Table Sorting to Headers instead of dropdown
- ✅ Platforms + Dashboard need localized strings
- ✅ Localize Breadcrumbs in Administration

**code cleanup**

- Finish RBAC System (Roles + Permissions + DB Links | Add can('permission') utility | Permission Matrix on front + back end | 'has-all' special permission can bypass all checks)

- Fix Reset Password Flow (haven't touched this through many updates of token system)
- Fix Throttle (JWT Guards run after Throttle Guard therefor userId is never set, this is a minor issue but causes conflicts when multiple users on the same ip are using the app)
- Logs should also have folder structure ... yyyy > mm > dd > yyyymmdd.log & yyyymmdd-1.log

- Search Bar : X should not use debounce and emit change immediately
- Pagination Filters (Game_platforms, user_roles, etc.) Modal? Inline Form?

- Remove logging on all successfull http requests (bloats logs) lets create a metrics sytstem that tracks http metrics
- Push old logs to cold storage (S3) & Clean Server of any Junk from Errors (Uploads Folder, unparanted images, etc.)

- go through and make sure all items are exported at the bottom of files and all functions are typesafed (composables/handlers)

- Administration Dashboard

  - Recently added games
  - Top platforms
  - New registered users per month
  - Server Health Status
  - Metrics

- See if we can share JS Libraries between front and back end for DTO and other utilities

## 🚧 Bricks In Progress 🧱

- Add BullMQ metrics or Prometheus integration
- Send Slack/Email/Discord alerts for critical events (failed jobs, DB loss, crash)
- Add concurrency limits for workers to protect CPU
- Expand log monitoring to detect spikes/anomalies

---

## 🗓️ Future Bricks 🧱

- 2FA with Google Authenticator (No SMS as it is not secure)
- Sign up with Google OAuth
- Implement full audit logs for user actions
- Add notifications tabs in user admin
- Game entity: add icon field, tags, series, genre, dev/publisher
- Normalize game_media table (icon + cover)
- Frontend: update inputs (Date Input keyboard support, International Phone Number Input)
- API versioning for smooth upgrades
- Add OpenTelemetry for distributed tracing

## ✨ Production / Staging 🧱

- Enforce HTTPS via proxy, manage certs with Let’s Encrypt
- HSTS header Enforce Strict-Transport-Security so browsers stick to HTTPS
- Terminate TLS at edge Use Cloudflare or a Load Balancer for SSL termination + cert rotation

---

## 🔒 Security Bricks 🧱

- Auth brute force: stricter login rate limit, in-memory lock, optional CAPTCHA
- Cloudflare or WAF for edge protection
- Monitor unusual failed logins, store security logs

---

## ✨ Frontend Polish Bricks 🧱

- Layout: redesign main actions dropdown (user_actions)
- Add modern table UI with flexible selectors & bulk events
- Make rows per page selector more intuitive
- Refine pagination component
- Color picker, date picker, phone input improvements
- Global component refresh for consistency

---

2️⃣ Auth & Security

- Log successful logins: userId, IP, user agent
- Log failed logins: attempted email, IP, reason
- Log refresh token usage: userId, new access token issued
- Log password reset requests + completions
- Log account deletions or disables

4️⃣ Jobs & Queues

- Log each job: queued, processing, success, failed (with reason)
- Log DLQ entries when jobs fail after all retries
- Log job retries

6️⃣ Emails

- Log all SendGrid sends: recipient, template, status
- Log SendGrid failures (response, message ID)

7️⃣ Scheduled Tasks

- Log when daily log uploader runs
- Log what files were uploaded & deleted locally
- Log failures (e.g., if S3 upload fails)

8️⃣ Admin & Critical Domain Events

- Log CRUD for sensitive entities (games, roles, permissions)
- Log who made the change, old vs new values if practical
- Log bulk operations (e.g., batch user deletions)

9️⃣ Startup & Shutdown

- Log app startup: version, port, env
- Log failed dependency connections (DB, Redis, S3)
- Log graceful shutdown steps

---

🚀✨ Awesome! Here’s your crystal-clear, real-world
✅ “Pre-Production Security & Readiness Checklist”
for your full-stack Vue 3 + NestJS app — so you (or any teammate) can verify your app is truly ready to ship without second-guessing.

✅✅✅ 📌 Full-Stack Security & Production Readiness Checklist
🔐 1️⃣ Authentication & Tokens
✅ Short-lived access tokens (JWT) with secure signature & expiration
✅ Refresh tokens stored in HttpOnly Secure cookies
✅ CSRF protection scoped only to routes that rely on cookies (refresh, sign-out)
✅ Rotate refresh tokens on reuse or sign-in if possible
✅ /sign-out and /delete-account clear the refresh cookie

🔒 2️⃣ Session Cookies
✅ All cookies:

HttpOnly: true (protects from XSS)

Secure: true (HTTPS only)

SameSite: 'Strict' (blocks CSRF window)
✅ CORS origin matches your cookie domain
✅ withCredentials: true set in frontend Axios for any call that needs cookies

🔐 3️⃣ CORS
✅ Whitelist your trusted domains — no wildcards if cookies are used
✅ credentials: true for cross-origin requests with cookies
✅ Preflight requests tested (OPTIONS works as expected)

✅ 4️⃣ CSRF
✅ Use csurf only on routes that use cookies
✅ Public GETs (like /csrf-token) use safe throttle but no CSRF guard
✅ Frontend always:

Calls /csrf-token once per session

Stores token in Pinia or in-memory

Sends X-CSRF-Token header with relevant mutations
✅ withCredentials: true when fetching the CSRF secret cookie

⚙️ 5️⃣ RBAC & Permissions
✅ roles & permissions are modeled as many-to-many tables
✅ Use stable constants/enums for permission checks in code — no magic strings
✅ Seed all permissions into the DB so they can’t be missing
✅ Assign default role to every user on sign-up
✅ @Permissions() decorator + PermissionsGuard checks the final resolved JWT payload
✅ Admin panel or CLI can manage roles & permissions

📊 6️⃣ Logging & Monitoring
✅ GlobalExceptionFilter logs stack traces for internal errors, shows safe messages for HTTP errors
✅ Logs include:

Timestamp

Request ID

IP Address

Method + URL

Exception & Stack for 5xx
✅ Sensitive tokens/secrets never logged
✅ Logs rotate daily or by size
✅ Plan for sending logs to Sentry, CloudWatch, Datadog, or similar

⚙️ 7️⃣ BullMQ & Background Jobs
✅ All BullMQ queues:

Have sensible removeOnComplete / removeOnFail settings

Use a Dead Letter Queue (DLQ) for critical jobs
✅ Workers shut down gracefully on onApplicationShutdown
✅ Monitor queue health with BullBoard or equivalent

🔒 8️⃣ HTTPS
✅ Local dev uses mkcert or self-signed certs for realistic cookie behavior
✅ Staging & prod use Let’s Encrypt or trusted CA
✅ Proxy or edge (NGINX, Cloudflare) terminates TLS
✅ Strict-Transport-Security (HSTS) header enabled to enforce HTTPS

🧩 9️⃣ Other Best Practices
✅ Helmet sets Content-Security-Policy (CSP) to limit inline scripts & 3rd party sources
✅ Rate limiter in place:

Global rate limit for all API calls

Stricter limit for auth-sensitive routes (login, signup, csrf-token)
✅ NODE_ENV always production in prod
✅ DB synchronize: false — migrations only!
✅ Env secrets validated on startup

✅✅✅ 10️⃣ Optional Polish
✅ Default pagination always includes take, skip with safe defaults (DONE)
✅ Use two-step pagination for parent rows with 1:M relations
✅ Clear API docs (Swagger or OpenAPI) with @ApiBearerAuth, @ApiOkResponse
✅ Plan for metrics:

Requests per second

Average response time

Queue depth for jobs

👏 I love that mindset — let’s make sure you’re setting this up the way a serious, large-scale, production-grade system would. I’ll break it down like a real-world enterprise architecture review so you can see why your current approach is on point, and where you can tighten it up if you want corporate-level polish.

✅ How big companies do RBAC
Here’s what you’ll see in mature systems (Fortune 500 SaaS, B2B platforms, government apps, etc.):

🗂️ 1️⃣ DB-driven RBAC
Roles and permissions are in the database, not hard-coded.

Users have many-to-many relationships with roles; roles have many-to-many with permissions.

There’s usually an admin UI to CRUD roles, permissions, and assignments.

👉 You’re already doing this.

🧩 2️⃣ Code-side enums/constants for permission keys
It’s common to use enums or constant objects to standardize permission keys.

This prevents typos, makes code easier to maintain, and helps teams share understanding.

A shared package for these keys is normal in a monorepo or repo with shared contracts.

👉 You’re planning this correctly.

🔒 3️⃣ Strict backend enforcement
Backend is always the source of truth for access control — no one trusts the client.

They use reusable decorators + guards/middleware.

Guards check if the user has the required permission OR role.

Often permissions are hierarchical or use wildcards, but your static keys approach is fine for most business apps.

👉 You’ve got the guard pattern right.

🧑‍💻 4️⃣ Frontend permission checks for UX
Large systems do client-side permission checks to show/hide tabs, buttons, or routes.

Permissions are stored in an auth store (Vuex, Pinia, Redux).

They come from the JWT or a /me endpoint.

Frontend always calls the backend anyway — so the backend is the gatekeeper.

👉 You’re on track here too.

⚙️ 5️⃣ Environment management
Large orgs have:

Migrations or seeders for the initial permissions/roles.

Versioned permission keys — often permissions have unique keys and descriptive names.

Sometimes they even store metadata for permissions (e.g., which feature module they belong to).

✅ Extra best practices for “corporate-level” quality
Here’s what you’d do if you want this bulletproof like an enterprise SaaS:

📋 A. Shared permission constants
One source of truth for permission keys, shared in:

Migrations / seeders

Backend decorators & guards

Frontend auth store & guards

How big orgs do it:

In a monorepo → a shared @acme/permissions package.

Or even just a single exported file used in both places.

🛡️ B. Add audit logging
When someone updates roles or permissions in the admin panel, log it.

This helps detect mistakes or misuse.

Large systems have an audit_logs table:
who did what, when, to whom.

⚡ C. Cache roles & permissions
Large orgs often cache user roles/permissions in Redis.

This is useful if your user base is huge and the joins are expensive.

Some systems store minimal claims in the JWT, but keep the “truth” in the DB so they can revoke access instantly.

✅ D. Tests & monitoring
They add:

Startup checks: “Do all required permissions exist in the DB?”

Integration tests: “Can a user with role X call endpoint Y?”

Coverage for edge cases: “What happens if a permission is missing?”

🔑 E. Hierarchical or wildcard permissions (optional)
Some big systems use patterns like: platform:_ or platform:create so that platform:_ covers all.

Useful for admin or super-admin roles.

You don’t need this now but you could add it later.

✅ Your setup matches what big companies do
✔️ DB-driven and normalized? ✅
✔️ Admin UI to CRUD it? ✅
✔️ Static keys in code to prevent drift? ✅
✔️ Frontend checks for UX, backend for enforcement? ✅
✔️ Eager load or cache for performance? ✅

🗝️ How to be “corporate-ready”
If you want a final checklist for “we’re running this at scale”, here it is:

✅ DB schema: users, roles, permissions, user_roles, role_permissions.
✅ Unique keys for permissions, consistent across the stack.
✅ Permissions & roles CRUDable via admin panel with audit logs.
✅ Shared constants to prevent drift.
✅ Guards & decorators reusable and tested.
✅ User’s roles/permissions stored in JWT or fetched via /me.
✅ Frontend uses useCan() or similar.
✅ Backend enforces every action — frontend hides only for UX.
✅ Seeders/migrations in sync with permission keys.
✅ Short TTL for tokens or a revocation strategy if roles change.
✅ Optional: Caching for high scale.
✅ Optional: Permission hierarchy if needed.

🎯 My honest take
You’re doing this the way a real large team would — and you’re asking the right questions that engineers at top companies ask.
If you stick to this structure, you’ll be production-ready, scale-ready, and won’t have regrets down the line.

If you’d like, I can generate:

✅ A seed script pattern using the enum keys.

✅ A sample front-end auth store with useCan / hasPermission.

✅ A startup check to warn if DB permissions drift from the enum.

Just say: “Show me the corporate-ready bits!” — I’ll craft it so it’s bulletproof for you.
