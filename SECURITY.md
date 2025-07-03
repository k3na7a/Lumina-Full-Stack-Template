# Security Policy

## 🚀 Project Overview

This repository (`Full-Stack-Vue3-NestJS-Application`) is a full-stack application using:

- **Vue 3** (frontend)
- **NestJS** (backend)
- **TypeORM**
- **BullMQ**
- Redis, S3, SendGrid, and more.

This document outlines our current security posture and how we mitigate common risks like brute force, DDoS, and data leaks.

---

## ✅ Rate Limiting

- API rate limiting uses **@nestjs/throttler**.
- Requests are tracked **per authenticated user** when available; fallback is per IP.
- Defaults:
  - Authenticated routes: `60 requests/minute`
  - Unauthenticated routes: `20-40 requests/minute`
  - Auth-sensitive routes (login/signup): `5-10 requests/minute`
- Public endpoints (health checks, static content) can be excluded with `@SkipThrottle`.

---

## ✅ Input Validation

- All incoming payloads are validated using `class-validator` decorators on DTOs.
- Environment variables are validated using `joi` on boot.
- Large request bodies are rejected:
  - JSON and URL-encoded body size limited to `1MB`.

---

## ✅ Authentication & Brute Force

- Uses `passport-jwt` with secure password hashing (`bcrypt`).
- Repeated login failures are rate limited to prevent brute force attacks.
- (Optional) CAPTCHA or IP blocking can be added for repeated failed logins.

---

## ✅ HTTPS & CORS

- All production traffic is served over HTTPS (TLS terminated at a proxy like NGINX or Cloudflare).
- CORS is configured to allow only trusted origins.

---

## ✅ HTTP Security Headers

- Uses `helmet` to set safe default headers.
- CSP (Content-Security-Policy) headers should be enforced at the proxy or CDN layer.
- Cookies (if used) must be `HttpOnly` and `Secure` in production.

---

## ✅ BullMQ Queues & Jobs

- All BullMQ Workers have graceful shutdown via `onApplicationShutdown` to avoid job loss.
- Log rotation is implemented to prevent disk bloat.
- BullBoard or custom dashboards monitor queue health.

---

## ✅ Logging & Monitoring

- All logs rotate daily and by max file size.
- Sensitive data (like passwords, secrets) is never logged.
- Optionally integrate with log management/alerting (Datadog, CloudWatch, Sentry).

---

## ✅ Deployment & Environment

- `NODE_ENV` is set to `production` for all live deployments.
- TypeORM `synchronize: true` is disabled in production — migrations are used.
- Environment secrets are validated at startup.

---

## ✅ Network & DDoS Mitigation

- API sits behind Cloudflare or a similar edge proxy with WAF capabilities.
- Firewall rules and bot protection prevent scraping or large bursts of invalid traffic.
- NGINX or Cloudflare handles TLS termination, rate limiting at the edge, and connection throttling.

---

## ✅ Reporting Vulnerabilities

If you discover a security vulnerability, please report it responsibly:

1. **DO NOT** open a public GitHub issue.
2. Email [YOUR CONTACT EMAIL] or contact the project maintainers privately.
3. We’ll triage and patch valid reports promptly.

---

## ✅ Future Improvements

- Implement advanced threat detection for repeated suspicious activity.
- Integrate API key management for third-party access.
- Consider distributed rate limiting with Redis for multi-instance deployments.

---

**Stay safe & secure — Happy coding!**
