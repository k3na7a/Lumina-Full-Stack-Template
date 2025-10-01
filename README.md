# Lumina – Full-Stack Vue 3 + NestJS + MySQL Template

## 🚀 Overview

**Lumina** is a modern, production-ready **full-stack application template** designed to give teams a rock-solid foundation for building scalable, secure, and maintainable systems.

It’s **business-logic agnostic** yet comes with deep technical value out of the box: audit trails, background job queues, file uploads, RBAC, metrics, i18n, and security best practices.

Built with:

- **Vue 3** (Composition API, composables, localization, stores, TypeScript)
- **NestJS** (modular, layered, queues, logging, S3 uploads)
- **TypeORM**, **MySQL**, **BullMQ**, and **Redis**
- **Swagger**, **validation**, **security best practices**, **health checks**, and more!

The project demonstrates clean architecture, best practices, and robust developer experience for building real-world applications.

---

## 🗂️ Features

✅ **Vue 3 Frontend**

- Composition API with **composables** for clean, reusable logic.
- Modular components.
- Input validation with VeeValidate.
- I18n with localized messages.
- Axios API services.

✅ **NestJS Backend**

- Modular, feature-based structure.
- **TypeORM** for data persistence.
- **BullMQ** with Redis for background jobs, with queues for **logging**, **email**, and **cleanup tasks**.
- Custom **queue events listeners**, **dead letter queues (DLQs)**, and graceful job retries.
- **S3 Service** for file uploads.
- **Global logging** system with daily file rotation.
- **Swagger** API docs.
- Health checks for **Redis**, **database**, **queues**, and **disk usage**.
- Global **exception filter**, **rate limiter**, **helmet** for security.
- CORS configuration.
- Routing via `RouterModule` for clean URL design.

✅ **Production-Ready**

- ✔️ Environment variable validation.
- ✔️ Custom TypeORM logger with queues.
- ✔️ Graceful shutdown.
- ✔️ BullBoard for queue monitoring.
- ✔️ Request context with AsyncLocalStorage.
- ✔️ JWT auth with secure refresh flow
- ✔️ Scoped CSRF protection for cookie-based endpoints
- ✔️ Exact parent pagination for reliable tables
- ✔️ RBAC with flexible roles + permissions
- ✔️ CORS locked to trusted origins
- ✔️ Logs, metrics, and graceful background jobs
- ✔️ HTTPS, Helmet, rate limiting — ready for the real world.
- ✔️ Flexible roles and permissions system built into both frontend and backend.
- ✔️ Audit Trail for critical actions (user changes, role updates, entity modifications).

---

## 📌 Project Highlights

✨ **Queues & Logging**\
Logs are handled via BullMQ, processed in the background, and written with daily rotation to avoid memory bloat.

✨ **Custom Health Checks**\
Includes custom **BullMQ**, **Redis**, and **database pool** indicators with detailed stats for operational monitoring.

✨ **S3 Service**\
Handles secure uploads with content validation and temporary storage cleanup.

✨ **Authentication & Admin**\
Includes modules for authentication flows, user profile management, and administration features.

✨ **Role-Based Access Control (RBAC)**\
Flexible roles and permissions system built into both frontend and backend.

✨ **Audit & Transparency System**\
Records who, what, where, when, and why for each event.

✨ **Docker & Deployment**\
Dockerized stack for consistent local + production environments.

---

## ⚙️ Tech Stack

| Layer      | Tech                              |
| ---------- | --------------------------------- |
| Frontend   | Vue 3, TypeScript, Vite           |
| Backend    | NestJS, TypeScript                |
| Database   | MySQL with TypeORM                |
| Queues     | BullMQ, Redis                     |
| Storage    | AWS S3                            |
| Security   | JWT, Passport, Helmet, Throttler  |
| Monitoring | BullBoard, Swagger, Health Checks |

---

## 🏗️ Local Setup

**Setup environment variables**

1. Start the stack

```bash
npm run docker:up
```

- Builds and runs the Docker Compose setup.
- Starts API (NestJS), Frontend (Vue 3 with NGINX), MySQL, and Redis.
- Volumes persist MySQL and Redis data between runs.

2. Stop the stack

```bash
npm run docker:down
```

- Gracefully shuts down all containers and networks.

**Access**

- **Frontend:** [https://localhost:8080](https://localhost:8080)
- **API docs:** [https://localhost:3000/api](https://localhost:3000/api)
- **BullBoard:** [https://localhost:3000/admin/queues](https://localhost:3000/admin/queues)

---

## 🔐 Security Policy

📌 [Security Policy](./SECURITY.md)

---

## ✅ Future Improvements

- Sign up with Google
- 2FA with Google Authenticator
- Add OpenTelemetry / APM for distributed tracing.
- Automated tests with Jest and e2e integration tests.
- Deployment pipeline with Docker or CI/CD.
- Service accounts and granular access controls.
- Expanded User Roles & Permissions System.
- Administration Dashboard
- API versioning for smooth upgrades

---

## 🧭 Design Principles

- **Business-logic agnostic** → this is a template, not a toy app.
- **Transparency by design** → audit logs, metrics, and monitoring built in.
- **Security-first** → safe defaults, CORS, JWT, RBAC, CSRF, and logging.
- **Maintainability** → modular NestJS architecture + composable Vue frontend.
- **Production parity** → Dockerized stack, health checks, graceful shutdowns.

---

## 🤝 Contributing

PRs and ideas are welcome! Feel free to fork and build on this as your own boilerplate for production-ready full-stack apps.

---

## 📜 License

[MIT](./LICENSE)
