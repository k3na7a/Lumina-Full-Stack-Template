# 🧱 BRICKS.md

## 🗓️ List for Today (Jul 9) 2025 [Doesn't have to all be done today]

New Authentication System (Csrf + Cookies + Tokens) works and is tested!
Permissions is currently hard coded (user.role == Role.enum)

- We want roles to live in the database and for user.roles to be a many to many relation (1-way)
- User can have many roles
- 2 special roles (administrator : all permissions > bypasses all checks | user : no permissions )
- ask self (and chatGPT): Do we even need a role with no permissions and set it as default? Can we not assume no roles is the same state?
- custom roles can be given permissions (eg view_game, edit_game)

## 🧱 Completed Items 🧱

- ✅ Fix Token verification (Layout instead of app) + Loading states
- ✅ Pagination swap to drop down + button combo from full button
- ✅ Navigation Dropdown not getting config (we moved it and never reconnected it)
- ✅ UserActions / Actions / Navigation dropdown fixes ( UserAction should use both Actions and Navigation structure )
- ✅ Check for cookie before doing an appstore init
- ✅ Add Create buttons to Dropdown Actions menu with future options (eg export)
- ✅ Move Table Sorting to Headers instead of dropdown

**code cleanup**

- Search Bar : X should not use debounce and emit change immediately
- Platforms + Dashboard need localized strings
- Localize Breadcrumbs in Administration
- Pagination Filters (Game_platforms, user_roles, etc.) Modal? Inline Form?
- Fix Reset Password Flow (haven't touched this through many updates of token system)
- Fix Throttle (JWT Guards run after Throttle Guard therefor userId is never set, this is a minor issue but causes conflicts when multiple users on the same ip are using the app)

- Logs should also have folder structure ... yyyy > mm > dd > yyyymmdd.log & yyyymmdd-1.log
- Remove logging on all successfull http requests (bloats logs) lets create a metrics sytstem that tracks http metrics
- Push old logs to cold storage (S3) & Clean Server of any Junk from Errors (Uploads Folder, unparanted images, etc.)
- go through and make sure all items are exported at the bottom of files and all functions are typesafed (composables)

**major feature implementation**

- Expanded User Roles & Permissions System
- Add List of permissions

- Administration Dashboard
  - Recently added games
  - Top platforms
  - New registered users per month
  - Server Health Status
  - Metrics

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