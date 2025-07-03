# Full-Stack Vue 3 + NestJS Application

## 🚀 Overview

This is a modern, production-ready **full-stack application** built with:

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

- Environment variable validation.
- Custom TypeORM logger with queues.
- Graceful shutdown.
- BullBoard for queue monitoring.
- Request context with AsyncLocalStorage.

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

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Setup environment variables**

   ```bash
   cp .env.example .env
   # Fill in your DB, Redis, S3 configs etc.
   ```

3. **Run services**

   ```bash
   npm run start:dev  # NestJS API
   npm run web        # Vue frontend
   ```

4. **Access**

   - **Frontend:** [http://localhost:8080](http://localhost:8080)
   - **API docs:** [http://localhost:3000/api](http://localhost:3000/api)
   - **BullBoard:** [http://localhost:3000/admin/queues](http://localhost:3000/admin/queues)

---

## 🔐 Security Policy

📌 [Security Policy](./SECURITY.md)

---

## ✅ Future Improvements

- Add OpenTelemetry / APM for distributed tracing.
- Automated tests with Jest and e2e integration tests.
- Deployment pipeline with Docker or CI/CD.
- Service accounts and granular access controls.

---

## 🤝 Contributing

PRs and ideas are welcome! Feel free to fork and build on this as your own boilerplate for production-ready full-stack apps.

---

## 📜 License

MIT License.
