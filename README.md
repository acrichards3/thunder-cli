<div align="center">
  <img src="frontend/public/thunder-app-logo.png" alt="Thunder App Logo" width="200" />
</div>

# Thunder App Template

A modern full-stack monorepo template with Vite + React frontend, Hono backend, and a shared TypeScript `lib` package.

## 🚀 Quickstart

Create a new app in the current directory (you'll be prompted for a name):

```bash
bun create thunder-app@latest
```

Or specify the name directly:

```bash
bun create thunder-app@latest my-app
```

The generator will:

- Copy the template into `./my-app` (or the name you provide)
- Rename all package scopes to `@<your-app>/...`
- Seed env files with sensible defaults
- Ask to run `bun install` (workspaces) and optionally build `lib`

## 📁 Project Structure

- `frontend/` - Vite React application
- `backend/` - HonoJS API server with Drizzle ORM
- `lib/` - Shared TypeScript package used by both frontend and backend

## 💻 Development Commands (run from repo root)

| Command                  | Description                                      |
| ------------------------ | ------------------------------------------------ |
| `bun run dev`            | Start both frontend, lib, and backend            |
| `bun run dev:frontend`   | Start only the frontend (Vite, port 5173)        |
| `bun run dev:backend`    | Start only the backend (Hono, port 3000)         |
| `bun run dev:lib`        | Watch mode for lib package (rebuilds on changes) |
| `bun run build`          | Build all packages (includes typecheck & lint)   |
| `bun run build:all`      | Build all packages without typecheck/lint        |
| `bun run build:frontend` | Build only the frontend package                  |
| `bun run build:backend`  | Build only the backend package                   |
| `bun run build:lib`      | Build only the lib package                       |
| `bun run typecheck`      | Type check all packages                          |
| `bun run lint`           | Lint all packages (format check + ESLint)        |
| `bun run lint:fix`       | Auto-fix linting issues                          |
| `bun run format`         | Format all files with Prettier                   |
| `bun run format:check`   | Check formatting without fixing                  |

### Database Commands (run from backend directory or with filter)

| Command                                             | Description                     |
| --------------------------------------------------- | ------------------------------- |
| `bun run --filter @thunder-app/backend db:generate` | Generate database migrations    |
| `bun run --filter @thunder-app/backend db:migrate`  | Run database migrations         |
| `bun run --filter @thunder-app/backend db:push`     | Push schema changes to database |
| `bun run --filter @thunder-app/backend db:studio`   | Open Drizzle Studio             |

## 📦 Using the Shared Library Package

The `lib` package contains shared TypeScript code that can be imported in both the frontend and backend:

```typescript
import { greet, User } from "@your-project/lib";
```

**Important:** If you make changes to the `lib` package, you must rebuild it:

```bash
bun run build:lib
```

Or run it in watch mode during development:

```bash
bun run dev:lib
```

## 🗄️ Database Setup

This template uses **Drizzle ORM** with **PostgreSQL**. The database schema is defined in `backend/src/db/schema/`.

### Setup Steps

1. **Set up your database** (local PostgreSQL or cloud provider)

2. **Configure environment variables** in `backend/.env`:

   ```bash
   DATABASE_URL=postgresql://user:password@localhost:5432/dbname
   PORT=3000
   ```

3. **Create your schema** in `backend/src/db/schema/` (e.g., `users.ts`, `posts.ts`)

4. **Generate migrations:**

   ```bash
   bun run --filter @thunder-app/backend db:generate
   ```

5. **Push schema to database:**

   ```bash
   bun run --filter @thunder-app/backend db:push
   ```

   Or run migrations:

   ```bash
   bun run --filter @thunder-app/backend db:migrate
   ```

6. **Open Drizzle Studio** to view/edit data:

   ```bash
   bun run --filter @thunder-app/backend db:studio
   ```

## 🛠️ Tech Stack

### Frontend

- **React 19** - UI library
- **Vite 5** - Build tool and dev server
- **TypeScript 5.9** - Type safety
- **Tailwind CSS v4** - Styling
- **React Query (@tanstack/react-query)** - Data fetching and caching
- **Zod v4** - Runtime type validation

### Backend

- **Hono v4** - Fast web framework
- **TypeScript 5.9** - Type safety
- **Drizzle ORM** - Type-safe SQL ORM
- **PostgreSQL** - Database (via `postgres` driver)
- **Zod v4** - Runtime type validation

### Shared

- **Bun** - Runtime and package manager
- **ESLint** - Code linting
- **Prettier** - Code formatting

## 🔧 Environment Variables

### Backend (`backend/.env`)

```bash
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
PORT=3000
```

- `DATABASE_URL` - **Required**. PostgreSQL connection string
- `PORT` - Backend server port (default: `3000`)

### Frontend (`frontend/.env`)

```bash
VITE_BACKEND_URL=http://localhost:3000
VITE_PORT=5173
```

- `VITE_BACKEND_URL` - Backend API URL (default: `http://localhost:3000`)
- `VITE_PORT` - Frontend dev server port (default: `5173`)

**Note:** Vite reads environment variables at config time; restart the dev server after changing `.env` files.

## 📝 Code Quality

- **TypeScript** - Strict mode enabled across all packages
- **ESLint** - Configured with React, TypeScript, and sorting rules
- **Prettier** - Automatic code formatting
- **Type checking** - Run `bun run typecheck` to verify all packages

## 🔧 Publishing This Template (For Maintainers)

To publish this template to npm so others can use it:

1. **Make sure you're logged into npm:**

   ```bash
   npm login
   ```

2. **Update the version in package.json** (if needed)

3. **Publish to npm:**

   ```bash
   npm publish --access public
   ```

4. **Users can then create projects with:**
   ```bash
   bun create thunder-app@latest
   ```

Note: The package name is `create-thunder-app`, but users call it with `bun create thunder-app` (Bun automatically prepends `create-`).
