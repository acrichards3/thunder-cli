# Thunder App Template

A monorepo template with Vite React frontend, HonoJS backend, and shared lib package.

## 🚀 Using This Template

Create a new project using this template:

```bash
bun create thunder-app@latest
```

This will create a new directory and clone the template. After that:

```bash
cd <your-project-name>
bun install
bun run build:lib
bun run dev
```

## 📁 Project Structure

- `frontend/` - Vite React application
- `backend/` - HonoJS API server
- `lib/` - Shared TypeScript package used by both frontend and backend

## 💻 Development Commands

All commands can be run from the root directory:

| Command                | Description                                      |
| ---------------------- | ------------------------------------------------ |
| `bun run dev`          | Start both frontend and backend                  |
| `bun run dev:frontend` | Start only the frontend (port 3000)              |
| `bun run dev:backend`  | Start only the backend (port 3001)               |
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

## 📝 Additional Notes

- The frontend runs on port **3000**
- The backend runs on port **3001**
- All packages use TypeScript with strict mode enabled
- ESLint and Prettier are configured for code consistency

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

Note: The package name is `create-thunder-app`, but users call it with `bun create thunder-app` (Bun automatically prepends `create-` when looking for the package).
