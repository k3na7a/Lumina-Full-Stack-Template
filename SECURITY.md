# Security Policy

## 🚀 Project Overview

This repository (`Full-Stack-Vue3-NestJS-Application`) is a modern full-stack application using:

- **Vue 3** (frontend)
- **NestJS** (backend)
- **TypeORM**
- **BullMQ** for background jobs and queues
- **Redis**, **S3**, **SendGrid**, and more

This document outlines our current security posture and how we mitigate common risks like XSS, brute force, DDoS, and token leaks.

---

## ✅ Rate Limiting

- API rate limiting uses **@nestjs/throttler**.
- Requests are tracked **per authenticated user**, fallback is per IP.
- Defaults:
  - Authenticated routes: `60 requests/minute`
  - Unauthenticated routes: `20 requests/minute`
  - Auth-sensitive routes (login/signup): `3-10 requests/minute`
- Public endpoints (health checks, static assets) can be excluded with `@SkipThrottle`.

---

## ✅ Input Validation

- All incoming payloads validated with `class-validator` on DTOs.
- Environment variables validated with `joi` on boot.
- Large request bodies are rejected:
  - JSON and URL-encoded body size limited to `1MB`.

---

## ✅ Authentication & Secure Cookies

- Uses `passport-jwt` with secure password hashing (`bcrypt`).
- Repeated login failures are rate limited to block brute force attacks.
- Refresh tokens are stored using **`HttpOnly`, `Secure`, `SameSite=None` cookies**.
  - Cookies are only served over HTTPS (`mkcert` for local dev, real certs in production).
  - Cookies are **never accessible to JavaScript** (`HttpOnly`).
  - Frontend API calls use `withCredentials: true` to include secure cookies.
- Any endpoint that accepts the refresh token must implement **CSRF protection**.
  - Uses `csurf` middleware to generate a CSRF token.
  - Client must send the CSRF token in a custom header (`X-CSRF-Token`).
- Sign-out and account deletion **clear the cookie** server-side.

---

## ✅ HTTPS & CORS

- **All production traffic is HTTPS-only** (TLS terminated at a proxy like **NGINX** or Cloudflare).
- Local dev uses **`mkcert`** for trusted HTTPS on both backend (NestJS) and frontend (Vite).
- CORS is configured to:
  - Allow only trusted origins (`https://yourfrontend.com`).
  - Set `credentials: true` to allow secure cookie flow.

---

## ✅ HTTP Security Headers (Helmet)

- Uses **Helmet** to enforce modern HTTP security best practices:
  - `Content-Security-Policy` (CSP) is set in-app with strict defaults.
    - Example: `default-src 'self'; script-src 'self' https://trusted.cdn.com`
    - Adjust as needed for 3rd-party CDNs or images.
  - `Strict-Transport-Security` (HSTS) is enabled for HTTPS-only.
  - `X-Frame-Options` prevents clickjacking (`SAMEORIGIN`).
  - `X-Content-Type-Options` blocks MIME type sniffing.
  - `Referrer-Policy` set to `strict-origin-when-cross-origin`.
  - `X-Powered-By` is hidden.
- For static assets, a proxy like **NGINX** can also enforce the same headers globally.

---

## ✅ BullMQ Queues & Jobs

- All BullMQ workers have graceful shutdown via `onApplicationShutdown` to avoid job loss.
- Queues are **split by domain** (e.g., email, logging, cleanup) for better performance isolation.
- Dead Letter Queues (DLQs) store failed jobs with metadata (`jobId`, `attempts`, `error stack`) for safe retries.
- Log rotation prevents disk bloat; BullBoard or custom dashboards monitor queue health.

---

## ✅ Logging & Monitoring

- Logs are structured JSON for easy searching and parsing.
- Request logs include `requestId`, user context, and duration.
- Exceptions log full stack traces for non-HTTP errors.
- Sensitive data (passwords, secrets) is never logged.
- Logs rotate daily and by size; option to stream to Datadog, CloudWatch, or Loki.
- Startup logs show app version, env, port, and health check status for dependencies (DB, Redis, S3).

---

## ✅ Deployment & Environment

- `NODE_ENV` is `production` for live deployments.
- TypeORM `synchronize: true` is disabled in production — migrations only.
- Environment secrets validated at startup.
- Proxy servers (NGINX, Cloudflare) handle TLS, static caching, rate limiting, and header enforcement.

---

## ✅ Network & DDoS Mitigation

- API sits behind Cloudflare or similar edge proxy with WAF (Web Application Firewall) capabilities.
- Firewall rules and bot protection guard against scraping or large bursts of invalid traffic.
- TLS termination and connection throttling handled at the edge.

---

## ✅ Reporting Vulnerabilities

If you discover a security vulnerability, please report it responsibly:

- **DO NOT** open a public GitHub issue.
- Email [YOUR CONTACT EMAIL] or reach out privately.
- We’ll triage and patch valid reports quickly.

---

## ✅ Role-Based Access Control (RBAC)

Both frontend and backend enforce RBAC consistently:

**Backend (NestJS)**

- Uses a centralized permission matrix that defines domains, actions, and roles.
- Guards (@UseGuards) ensure only authorized roles can access protected endpoints.
- Permissions are seeded and versioned — no “ad-hoc” permissions.
- Audit trail records who performed what action (role, user ID, IP, timestamp).

**Frontend (Vue 3)**

- Permission checks baked into route guards and UI components.
- Restricted UI elements (e.g., admin buttons) are hidden/disabled for unauthorized users.
- Pinia/Vuex state synchronizes current user’s role and permissions to avoid accidental access.
- All sensitive admin routes require elevated roles.
- Principle of Least Privilege: users get only the minimum role necessary.

**All role and permission changes are logged and auditable.**

---

## ✅ Future Improvements

- Implement real-time threat detection for suspicious logins or repeated brute force attempts.
- Integrate API key management for third-party partners.
- Evaluate distributed rate limiting using Redis for multi-instance deployments.
- Add automated replay and metrics dashboards for Dead Letter Queues.

---

**Stay secure. Build responsibly. 🚀🔒**
