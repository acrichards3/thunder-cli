# Deployment

Deploy your Thunder App to production.

## Frontend — AWS Amplify

AWS Amplify can host your frontend as a static site with automatic builds from GitHub.

### 1. Add `amplify.yml` to the repo root

If you selected "Include AWS Amplify config?" during `bun create thunder-app`, this file is already in your project — skip to step 2. Otherwise, create `amplify.yml` at the repo root with the following contents:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - curl -fsSL https://bun.sh/install | bash
        - export PATH="$HOME/.bun/bin:$PATH"
        - bun install
        - bun run build:lib
    build:
      commands:
        - export PATH="$HOME/.bun/bin:$PATH"
        - bun run build:frontend
  artifacts:
    baseDirectory: frontend/dist
    files:
      - "**/*"
  cache:
    paths:
      - node_modules/**/*
```

Commit and push this file to your repository.

### 2. Create a new Amplify app

- Go to **AWS Console → AWS Amplify → Create new app**
- Select **GitHub** as the source provider
- Choose your repository and branch (e.g. `main`)
- Check **"My app is a monorepo"** and enter `/` as the root directory

### 3. Configure build settings

Amplify should auto-detect the build command (`bun run build:frontend`) and output directory (`frontend/dist`).

Expand **Advanced settings** and add your environment variable:

| Key                | Value                                       |
| ------------------ | ------------------------------------------- |
| `VITE_BACKEND_URL` | Your backend URL (e.g. your App Runner URL) |

### 4. Deploy

Click through **Review → Save and deploy**. Amplify will run the `preBuild` phase (installs Bun, installs dependencies, builds the lib package) followed by the `build` phase (builds the frontend). You'll get a public Amplify URL on completion.

### 5. Fix SPA routing

After the initial deploy, configure a rewrite rule so client-side routing works:

- Go to **Amplify → your app → Rewrites and redirects → Add rule**
- Source: `/<*>`
- Target: `/index.html`
- Type: **200 (Rewrite)**

Without this rule, refreshing on any route other than `/` will return a 404.

### 6. Update backend CORS

Your backend restricts CORS to the `FRONTEND_URL` environment variable. After deploying the frontend, update the backend to allow requests from your new Amplify URL:

- Set `FRONTEND_URL` to your Amplify URL in your backend's environment configuration
- Redeploy the backend service

---

> 🚧 **Backend deployment guide coming soon!**
>
> Check back later for backend deployment guides covering AWS App Runner, Fly.io, Railway, and Docker.
