# Thunder App Template

Monorepo template: Vite + React frontend, Hono backend, and a shared TypeScript `lib`.

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
- `backend/` - HonoJS API server
- `lib/` - Shared TypeScript package used by both frontend and backend

## 💻 Development Commands (run from repo root)

| Command                | Description                                      |
| ---------------------- | ------------------------------------------------ |
| `bun run dev`          | Start both frontend and backend                  |
| `bun run dev:frontend` | Start only the frontend (Vite, port 5173)        |
| `bun run dev:backend`  | Start only the backend (Hono, port 3000)         |
| `bun run dev:lib`      | Watch mode for lib package (rebuilds on changes) |
| `bun run build`        | Build all packages                               |
| `bun run build:lib`    | Build only the lib package                       |
| `bun run typecheck`    | Type check all packages                          |
| `bun run lint`         | Lint all packages                                |
| `bun run format`       | Format all files with Prettier                   |

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

## 🛠️ Tech Stack

- **Frontend:** React 18 + Vite + TypeScript
- **Backend:** HonoJS + TypeScript
- **Package Manager:** Bun
- **Language:** TypeScript 5.9
- **Code Quality:** ESLint + Prettier

## 🔧 Defaults & Env

- Backend port: `3000`
- Frontend port: `5173`
- Frontend `VITE_BACKEND_URL`: `http://localhost:3000`

Generated env files:

```bash
# backend/.env
PORT=3000

# frontend/.env
VITE_BACKEND_URL=http://localhost:3000
VITE_PORT=5173
```

Notes:

- Vite reads `frontend/.env` at config time; restart dev server after changes
- All packages use TypeScript (strict); ESLint + Prettier configured

---

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
