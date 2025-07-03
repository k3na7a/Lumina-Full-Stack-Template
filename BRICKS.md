🧱 BRICKS.md
“We build this project brick by brick.”

This document tracks our big ideas, improvements, next steps, and vision.
Each brick is an actionable piece of the wall we’re building together.

✅ Foundation Bricks — Done 🧱
✔️ Global HttpExceptionFilter for REST errors
✔️ Dead letter queue (DLQ) for logs that fail after all retries
✔️ Log rotation by date or max file size
✔️ All backend DTOs documented with API descriptions/examples
✔️ Env variable validation (DB_URL, REDIS_URL, etc.)
✔️ NODE_ENV=production enforced in prod
✔️ synchronize: true disabled in TypeORM prod
✔️ Job retries with exponential backoff
✔️ Bull Board at /admin/queues for visibility
✔️ QueueEvents listener for failed jobs
✔️ Graceful shutdown (onApplicationShutdown) drains workers safely
✔️ Health checks for BullMQ, Redis, and TypeORM
✔️ Router module refactored to router.ts
✔️ Logging to S3
✔️ Fallback for unexpected non-HTTP errors
✔️ Monitor BullMQ for stuck/blocked jobs
✔️ DB connection pooling tuned (maxQueryExecutionTime)
✔️ Workers drain before exit, logs flushed
✔️ AsyncLocalStorage or cls-hooked for request scoping

🚧 Bricks In Progress 🧱
Per-route rate limits for sensitive endpoints (/auth/login, /reset)
Add request ID tracing end-to-end
Push rotated logs to cold storage (S3)
Add BullMQ metrics or Prometheus integration
Send Slack/Email/Discord alerts for critical events (failed jobs, DB loss, crash)
Add concurrency limits for workers to protect CPU
Expand log monitoring to detect spikes/anomalies

🗓️ Future Bricks 🧱
Sign up with Google OAuth
Add CSRF protection if using cookies for JWT
Implement full audit logs for user actions
Add roles/permissions/notifications tabs in user admin
Move profile → user_profile for clarity
Game entity: add icon field, tags, series, genre, dev/publisher
Normalize game_media table (icon + cover)
Frontend: update inputs, tables, pagination, bulk selectors
New reusable phone number & date picker components
API versioning for smooth upgrades
Add OpenTelemetry for distributed tracing

🔒 Security Bricks 🧱
DDOS/Abuse: request size limits, strict CORS, Helmet
Auth brute force: stricter login rate limit, in-memory lock, optional CAPTCHA
Cloudflare or WAF for edge protection
Monitor unusual failed logins, store security logs
Enforce HTTPS via proxy, manage certs with Let’s Encrypt
CSP headers via Helmet/NGINX
Secure cookies if JWT is cookie-based
Never trust client input — validate all DTOs server-side

✨ Frontend Polish Bricks 🧱
Layout: redesign main actions dropdown (user_actions)
Add modern table UI with flexible selectors & bulk events
Make rows per page selector more intuitive
Refine pagination component
Color picker, date picker, phone input improvements
Global component refresh for consistency

✅ How We Use This
Add new ideas here when they come up.
Move bricks to “Done” when finished.
Keep reviewing and reshuffling priority — brick by brick!

**Keep crushing it — you’re building real, reliable backend architecture! 💪✨**
**🧱 We build strong — one brick at a time. Let’s keep stacking. 🚀**
