# Deployment

Thunder App is a monorepo with two deployable pieces: a static frontend (Vite build) and a Bun-powered backend API. The frontend compiles to static files that can be served from any CDN or hosting provider. The backend runs on Bun and needs a host that supports it — either through a Docker container or a platform with native Bun support. Both pieces need to know about each other: the frontend needs `VITE_BACKEND_URL` at build time, and the backend needs `FRONTEND_URL` at runtime for CORS.

## Quick Deployment Guide

This guide walks through deploying your Thunder App using AWS Amplify for the frontend and AWS App Runner (via ECR) for the backend. The frontend deployment takes about 5 minutes — connect your GitHub repo, set one environment variable, and Amplify handles the rest, including automatic redeployments on every push to `main`. The backend takes a bit more setup but gives you a fully managed, auto-scaling container service running Bun.

### Frontend — AWS Amplify

AWS Amplify can host your frontend as a static site with automatic builds from GitHub.

#### 1. Add `amplify.yml` to the repo root

If you selected "Include Thunder App quick deploy setup?" during `bun create thunder-app`, this file is already in your project — skip to step 2. Otherwise, create `amplify.yml` at the repo root with the following contents:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - curl -fsSL https://bun.sh/install | bash
        - export PATH="$HOME/.bun/bin:$PATH"
        - bun install --force
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

#### 2. Create a new Amplify app

- Go to **AWS Console → AWS Amplify → Create new app**
- Select **GitHub** as the source provider
- Choose your repository and branch (e.g. `main`)
- Check **"My app is a monorepo"** and enter `/` as the root directory

#### 3. Configure build settings

Amplify should auto-detect the build command (`bun run build:frontend`) and output directory (`frontend/dist`).

Expand **Advanced settings** and add your environment variable:

| Key                | Value                                       |
| ------------------ | ------------------------------------------- |
| `VITE_BACKEND_URL` | Your backend URL (e.g. your App Runner URL) |

#### 4. Deploy

Click through **Review → Save and deploy**. Amplify will run the `preBuild` phase (installs Bun, installs dependencies, builds the lib package) followed by the `build` phase (builds the frontend). You'll get a public Amplify URL on completion.

> **Note:** Amplify automatically redeploys your frontend every time code is pushed to `main`. No additional CI/CD setup required.

#### 5. Fix SPA routing

After the initial deploy, configure a rewrite rule so client-side routing works:

- Go to **Amplify → your app → Rewrites and redirects → Add rule**
- Source: `/<*>`
- Target: `/index.html`
- Type: **200 (Rewrite)**

Without this rule, refreshing on any route other than `/` will return a 404.

#### 6. Update backend CORS

Your backend restricts CORS to the `FRONTEND_URL` environment variable. After deploying the frontend, update the backend to allow requests from your new Amplify URL:

- Set `FRONTEND_URL` to your Amplify URL in your backend's environment configuration
- Redeploy the backend service

### Backend — AWS App Runner via ECR

App Runner is a fully managed container service that auto-scales your backend. You'll build a Docker image, push it to ECR (Elastic Container Registry), and point App Runner at it.

#### 1. Create a `Dockerfile` at the repo root

If you selected "Include Thunder App quick deploy setup?" during `bun create thunder-app`, the `Dockerfile` and `.dockerignore` are already in your project — skip to step 3.

Multi-stage build — the builder stage compiles `lib` and `backend`, the runner stage copies only the compiled output:

```dockerfile
FROM oven/bun:1 AS builder
WORKDIR /app

COPY package.json bun.lock ./
COPY lib/package.json lib/
COPY backend/package.json backend/
COPY frontend/package.json frontend/
RUN bun install --force

COPY lib/ ./lib/
COPY backend/ ./backend/
COPY tsconfig.json ./
RUN bun run build:lib && bun run build:backend

FROM oven/bun:1-slim AS runner
WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/lib/dist ./lib/dist
COPY --from=builder /app/lib/package.json ./lib/
COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/backend/package.json ./backend/
COPY --from=builder /app/backend/node_modules ./backend/node_modules
COPY package.json ./

EXPOSE 3000
CMD ["bun", "run", "backend/dist/index.js"]
```

The builder copies all workspace `package.json` files (including `frontend/package.json`) so Bun doesn't complain about missing workspaces during install.

#### 2. Create a `.dockerignore` at the repo root

Keep the build context small:

```
node_modules
**/node_modules
frontend/src
frontend/public
**/.env
**/dist
.git
```

#### 3. Test the image locally

```bash
docker build --platform linux/amd64 -t my-app-backend .
docker run -p 3001:3000 \
  -e ENVIRONMENT=production \
  -e DATABASE_URL=your-database-url \
  -e AUTH_SECRET=your-auth-secret \
  -e FRONTEND_URL=http://localhost:5173 \
  -e GOOGLE_CLIENT_ID=your-client-id \
  -e GOOGLE_CLIENT_SECRET=your-client-secret \
  my-app-backend
```

> **Important:** Always build with `--platform linux/amd64`. App Runner runs on amd64 — if you build on Apple Silicon without this flag, the image defaults to arm64 and the container will silently fail to start.

#### 4. Install AWS CLI and configure credentials

```bash
brew install awscli
aws configure
```

Enter your Access Key, Secret Key, and region. Create a dedicated IAM user with `AmazonEC2ContainerRegistryFullAccess` and `AWSAppRunnerFullAccess` policies rather than using the root account.

#### 5. Create an ECR repository

- Go to **AWS Console → ECR → Create repository**
- Visibility: **Private**
- Name: e.g. `my-app-backend`

Note the repository URI — you'll need it for the next steps.

#### 6. Push the image to ECR

```bash
aws ecr get-login-password --region your-region \
  | docker login --username AWS --password-stdin \
    your-account-id.dkr.ecr.your-region.amazonaws.com

docker tag my-app-backend:latest \
  your-account-id.dkr.ecr.your-region.amazonaws.com/my-app-backend:latest

docker push \
  your-account-id.dkr.ecr.your-region.amazonaws.com/my-app-backend:latest
```

Replace `your-account-id` and `your-region` with your AWS account ID and region.

#### 7. Create an App Runner service

- Go to **AWS Console → App Runner → Create service**
- Source: **Container registry → Amazon ECR**
- Image URI: your ECR image URI with the `:latest` tag
- Deployment: **Manual**
- ECR access role: let AWS auto-create one
- Port: `3000`
- Add environment variables:

| Key                    | Value                                |
| ---------------------- | ------------------------------------ |
| `ENVIRONMENT`          | `production`                         |
| `FRONTEND_URL`         | Your Amplify URL (no trailing slash) |
| `DATABASE_URL`         | Your PostgreSQL connection string    |
| `AUTH_SECRET`          | Your auth secret                     |
| `GOOGLE_CLIENT_ID`     | Your Google OAuth client ID          |
| `GOOGLE_CLIENT_SECRET` | Your Google OAuth client secret      |

#### 8. Verify and troubleshoot

If the first deploy fails with a health check error, the most common cause is an architecture mismatch. Rebuild with `--platform linux/amd64`, re-push to ECR, and click **Rebuild** in App Runner.

#### 9. Connect frontend and backend

Once both services are live, make sure the URLs are configured correctly on both sides:

- **Amplify:** Set `VITE_BACKEND_URL` to your App Runner URL (no trailing slash) → redeploy
- **App Runner:** Set `FRONTEND_URL` to your Amplify URL (no trailing slash) → redeploy

Trailing slashes in either URL will cause CORS failures.
