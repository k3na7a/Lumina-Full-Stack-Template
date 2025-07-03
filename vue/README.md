# 🎨 Full-Stack Vue3 + NestJS Application — Front End

This is the **Vue 3** frontend for your Full Stack Application.

---

## 📌 Features

✅ **Vue 3 + Vite** — Modern dev server, fast HMR.
✅ **TypeScript** — Strict types throughout.
✅ **Pinia** — Next-gen state management.
✅ **Vue Router** — Nested routes & route guards.
✅ **Composable architecture** — Reusable logic & stores.
✅ **Axios** — For safe typed API calls.
✅ **Forms** — `vee-validate` for robust form validation.
✅ **Environment Config** — `.env` based per environment.

---

## ⚙️ Tech Stack

- Vue 3 Composition API
- Vite
- TypeScript
- Pinia
- Vue Router
- Axios
- Vee-Validate

---

## 🚀 Getting Started

### 📦 Install

```bash
npm install
```

---

### ⚙️ Configure Env

Create a `.env` or `.env.local`:

```env
VITE_API_URL=http://localhost:3000
```

---

### 🏃 Run Dev Server

```bash
npm run dev
```

Open **[http://localhost:5173](http://localhost:5173)**

---

## 🗂️ Project Structure

```plaintext
src/
 ├── core/               # Router, store, global composables, app-level config
 │   ├── apis/           # Shared API service hooks and factories
 │   ├── directives/     # Global Vue directives (e.g., click-outside)
 │   ├── handlers/       # Custom event or error handlers
 │   ├── plugins/        # Vue plugins and plugin registration
 │   ├── router/         # Vue Router configuration and routes
 │   ├── store/          # Pinia stores for global state
 │   ├── utils/          # Core utilities and helpers used across the app
 ├── features/           # Domain-specific features, each with own components/composables
 ├── pages/              # Route-level views and pages
 ├── lib/                # Global types, DTOs, enums, constants
 │   ├── constants/      # Shared constants
 │   ├── dto/            # Data Transfer Objects and API contracts
 │   ├── enum/           # Enumerations for consistent values
 │   ├── regex/          # Regex patterns used in validation and parsing
 │   ├── types/          # Global TypeScript types and interfaces
 ├── shared/             # Shared resources used across the app
 │   ├── components/     # Reusable UI components shared across features
 │   ├── layouts/        # App layouts (main, guest, etc.)
 │   ├── locales/        # i18n translation files and language config
 │   └── scss/           # SCSS modules and global styles
 ├── app.vue
 └── main.ts
```

---

## ✅ Tips

- API base URL: `VITE_API_URL`
- Auth JWT handled via `Pinia` + `Axios` interceptors.
- Supports URL-driven pagination, sorting.
- Forms use `vee-validate` for typed validation.

---

## 🏆 License

[MIT](../LICENSE)

---

**Built with ❤️ by John Desjardins**
