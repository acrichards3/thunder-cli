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

- `frontend/` - Vite React application with Auth.js integration
- `backend/` - HonoJS API server with Drizzle ORM and Auth.js
- `lib/` - Shared TypeScript package used by both frontend and backend
- `backend/src/db/schema/` - Database schema definitions
  - `users.ts` - User table (merged with auth requirements)
  - `auth.ts` - Auth.js tables (accounts, sessions, verification tokens)

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

2. **Configure environment variables** in `backend/.env` (see [Environment Variables](#-environment-variables) section)

3. **Create your schema** in `backend/src/db/schema/` (e.g., `users.ts`, `posts.ts`)

4. **Push schema to database:**

   ```bash
   bun run --filter @thunder-app/backend db:push
   ```

   Or generate and run migrations:

   ```bash
   bun run --filter @thunder-app/backend db:generate
   bun run --filter @thunder-app/backend db:migrate
   ```

5. **Open Drizzle Studio** to view/edit data:

   ```bash
   bun run --filter @thunder-app/backend db:studio
   ```

## 🔐 Authentication Setup

This template includes **Auth.js** (formerly NextAuth) integration with **Google OAuth** as the default provider. Authentication uses database sessions for secure, server-side session management.

### Backend Setup

1. **Set up Google OAuth credentials:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable the **Google+ API** or **People API**
   - Go to **APIs & Services > Credentials**
   - Create **OAuth 2.0 Client ID** (Web application)
   - Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
   - Copy the Client ID and Client Secret

2. **Configure backend environment variables** in `backend/.env`:

   ```bash
   AUTH_SECRET=your-auth-secret-here  # Generate with: openssl rand -base64 32
   DATABASE_URL=postgresql://user:password@localhost:5432/dbname
   FRONTEND_URL=http://localhost:5173  # Frontend URL for redirects
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   PORT=3000
   ```

3. **Database schema is already set up** - The auth tables (`auth_accounts`, `auth_sessions`, etc.) are defined in `backend/src/db/schema/auth.ts` and merged with your `users` table.

4. **Push the auth schema to your database:**

   ```bash
   bun run --filter @thunder-app/backend db:push
   ```

### Frontend Setup

1. **Configure frontend environment variables** in `frontend/.env`:

   ```bash
   VITE_BACKEND_URL=http://localhost:3000
   VITE_PORT=5173
   ```

2. **The frontend is already configured** with `SessionProvider` and auth hooks. The sign-in button and session management are ready to use.

3. **Vite proxy is configured** - Auth API requests (`/api/auth/*`) are automatically proxied to the backend via `vite.config.ts`. This allows the frontend to use relative URLs for auth endpoints.

### Adding More Providers

To add additional OAuth providers (GitHub, Discord, etc.):

1. **Install the provider** (if needed):

   ```bash
   cd backend
   bun add @auth/core/providers/github  # Example for GitHub
   ```

2. **Add provider to backend** in `backend/src/index.ts`:

   ```typescript
   import GitHub from "@auth/core/providers/github";

   providers: [
     Google({ clientId: env.GOOGLE_CLIENT_ID, clientSecret: env.GOOGLE_CLIENT_SECRET }),
     GitHub({ clientId: env.GITHUB_CLIENT_ID, clientSecret: env.GITHUB_CLIENT_SECRET }),
   ],
   ```

3. **Add environment variables** to `backend/.env`:

   ```bash
   GITHUB_CLIENT_ID=your-github-client-id
   GITHUB_CLIENT_SECRET=your-github-client-secret
   ```

4. **Update Google Cloud Console** with additional redirect URIs if needed

### Production Setup

For production:

1. **Update Google OAuth redirect URIs** in Google Cloud Console:
   - Add: `https://your-api-domain.com/api/auth/callback/google`

2. **Update environment variables:**
   - Set `FRONTEND_URL` to your production frontend URL
   - Set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` to production credentials
   - Ensure `AUTH_SECRET` is a strong, random secret

3. **Update CORS settings** in `backend/src/index.ts` to allow your production frontend domain

## 🛠️ Tech Stack

### Frontend

- **React 19** - UI library
- **Vite 5** - Build tool and dev server
- **TypeScript 5.9** - Type safety
- **Tailwind CSS v4** - Styling
- **React Query (@tanstack/react-query)** - Data fetching and caching
- **Zod v4** - Runtime type validation
- **@hono/auth-js/react** - Auth.js React client hooks

### Backend

- **Hono v4** - Fast web framework
- **TypeScript 5.9** - Type safety
- **Drizzle ORM** - Type-safe SQL ORM
- **PostgreSQL** - Database (via `postgres` driver)
- **Zod v4** - Runtime type validation
- **Auth.js (@hono/auth-js)** - Authentication framework
- **@auth/drizzle-adapter** - Drizzle adapter for Auth.js

### Shared

- **Bun** - Runtime and package manager
- **ESLint** - Code linting
- **Prettier** - Code formatting

## 🔧 Environment Variables

### Backend (`backend/.env`)

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# Server
PORT=3000

# Authentication
AUTH_SECRET=your-auth-secret-here  # Generate with: openssl rand -base64 32
FRONTEND_URL=http://localhost:5173  # Frontend URL for redirects after auth

# Google OAuth (required)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Additional providers (optional)
# GITHUB_CLIENT_ID=your-github-client-id
# GITHUB_CLIENT_SECRET=your-github-client-secret
```

**Required variables:**

- `DATABASE_URL` - PostgreSQL connection string
- `AUTH_SECRET` - Secret for signing sessions (generate with `openssl rand -base64 32`)
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret

**Optional variables:**

- `PORT` - Backend server port (default: `3000`)
- `FRONTEND_URL` - Frontend URL for redirects (default: `http://localhost:5173`)
- Additional provider credentials for other OAuth providers

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
