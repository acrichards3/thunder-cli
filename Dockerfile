FROM oven/bun:1 AS builder
WORKDIR /app

COPY package.json bun.lock ./
COPY lib/package.json lib/
COPY backend/package.json backend/
COPY frontend/package.json frontend/
RUN bun install --frozen-lockfile --force

COPY lib/ ./lib/
COPY backend/ ./backend/
COPY tsconfig.json ./
RUN bun run build:lib && bun run build:backend

FROM oven/bun:1-slim AS runner
WORKDIR /app

COPY package.json bun.lock ./
COPY --from=builder /app/lib/package.json ./lib/
COPY --from=builder /app/lib/dist ./lib/dist
COPY --from=builder /app/backend/package.json ./backend/
COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/frontend/package.json ./frontend/
RUN bun install --frozen-lockfile --production

ENV PORT=3000
EXPOSE 3000
CMD ["bun", "run", "backend/dist/index.js"]
