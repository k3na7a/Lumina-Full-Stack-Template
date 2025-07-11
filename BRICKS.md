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

**code cleanup**

- Platforms + Dashboard need localized strings
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
