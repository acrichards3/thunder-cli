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
