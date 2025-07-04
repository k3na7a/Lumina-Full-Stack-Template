# 🚀 Full-Stack Vue3 + NestJS Application — Back End

This is the **NestJS API server** for the Full Stack Vue3 Application.

---

## 📌 Features

- ✅ **Modern NestJS 10+** — Modular, dependency injection, robust.
- ✅ **TypeORM** — Production-ready with migrations, no `synchronize` in prod.
- ✅ **BullMQ** — Queues and workers with graceful shutdown and log rotation.
- ✅ **Custom Logging** — Smart file rotation by size and date.
- ✅ **Swagger Docs** — Auto-generated for all DTOs.
- ✅ **Rate Limiting** — Per-user/IP limits to protect from brute force & DoS.
- ✅ **Validation** — Class-validator for DTOs, Joi for env variables.
- ✅ **S3 & SendGrid** — Handles file storage and transactional email.
- ✅ **Security Best Practices** — Helmet, strict CORS, HTTPS ready.

---

## ⚙️ Tech Stack

- **NestJS 10**
- **TypeORM**
- **BullMQ + Redis**
- **Swagger**
- **AWS S3**
- **SendGrid**

---

## 🚀 Getting Started

### 📦 Install

```bash
npm install
```

### ⚙️ Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
# API CONFIG
PORT=3000
GLOBAL_PREFIX=api
NODE_ENV=development

BASE_URL=http://localhost:3000

# JWT SECRET KEYS
JWT_SECRET_KEY=...
JWT_EXPIRY_TIME=15m

REFRESH_SECRET_KEY=...
REFRESH_EXPIRY_TIME=7d

# Sendgrid
SENDGRID_API_KEY=...
SENDGRID_VERIFIED_SENDER=...
SENDGRID_VERIFIED_SENDER_EMAIL=...

# crypto salt
CRYPTO_SECRET=...

# redis cloud
REDIS_PASSWORD=...
REDIS_PORT=...
REDIS_HOST=...

# rds database credentials
DB_HOST=...
DB_PORT=...
DB_USERNAME=...
DB_PASSWORD=...
DB_DATABASE=...

# aws s3 bucket
AWS_S3_REGION=...
AWS_S3_BUCKET=...
AWS_ACCESS=...
AWS_SECRET=...

AWS_S3_URL=...
```

---

### 🗄️ Run Migrations

```bash
npm run migration:run
npm run migration:create --name=YourMigrationName
npm run migration:generate --name=YourMigrationName
```

---

### 🏃 Start Dev Server

```bash
npm run start:dev
```

API runs at **[http://localhost:3000](http://localhost:3000)**
Swagger docs at **[http://localhost:3000/api](http://localhost:3000/api)**
BullBoard dashboard at **[http://localhost:3000/api](http://localhost:3000/queue-jobs)**

---

## 🛡️ Security

- Rate limiting with `@nestjs/throttler` (per user/IP).
- Helmet + CORS strict config.
- Strong password hashing (`bcrypt`).
- All DTOs validated.
- Environment variables validated at boot.
- Graceful shutdown for BullMQ workers.

For full details, see [`SECURITY.md`](../SECURITY.md).

---

## 🗂️ Project Structure

```plaintext
src/
 ├── app/                   # Shared core utilities and app-wide modules
 │   ├── common/            # Common reusable elements
 │   │   ├── config/        # Application configuration helpers
 │   │   ├── decorators/    # Custom decorators
 │   │   ├── filters/       # Exception filters
 │   │   ├── guards/        # Auth and role guards
 │   │   ├── interceptors/  # Logging, transform interceptors
 │   │   ├── loggers/       # Custom logger classes
 │   │   ├── middleware/    # Express/Nest middleware
 │   │   ├── pipes/         # Validation pipes and transformers
 │   │   ├── providers/     # Global providers
 │   │   ├── strategies/    # Passport strategies
 │   │   ├── utilities/     # Helper utility functions
 │   │   ├── validators/    # Custom validators
 │   ├── config/            # App-wide config modules and env validation
 │   ├── features/          # Feature-specific modules (e.g., auth, user)
 │   ├── modules/           # Main application modules
 │   ├── queues/            # BullMQ processors, workers
 ├── library/               # TypeORM entities and shared library files
 │   ├── constants/         # Global constants
 │   ├── dto/               # DTOs and API contracts
 │   ├── entities/          # TypeORM entities
 │   ├── enum/              # Enums for consistent values
 │   ├── interfaces/        # Global TypeScript interfaces
 │   ├── regex/             # Regex patterns for validation
 │   ├── validators/        # Reusable validators and helpers
 ├── plugins/               # Additional NestJS plugins or integrations
 └── main.ts                # App bootstrap entry
```

---

## 🧰 Useful Scripts

```bash
npm run start:dev   # Dev mode with watch
npm run start:prod  # Production build
npm run test        # Unit tests
npm run lint        # Lint code
npm run format      # Prettier format
```

---

## 👏 Contributing

1. Fork the repo
2. Create your feature branch
3. Open a pull request!

---

## 🏆 License

[MIT](../LICENSE)

---

**Built with ❤️ by John Desjardins**
