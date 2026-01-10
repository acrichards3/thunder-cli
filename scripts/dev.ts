#!/usr/bin/env bun
import { resolve } from "path";
import chalk from "chalk";
import type { Subprocess } from "bun";

const rootDir = resolve(import.meta.dir, "..");

interface ServiceConfig {
  emoji: string;
  color: typeof chalk.cyan;
  name: string;
  port: string | null;
}

// Colors and labels for each service
const services = {
  frontend: {
    emoji: "⚛️",
    color: chalk.cyan,
    name: "Frontend",
    port: "5173",
  },
  lib: {
    emoji: "📦",
    color: chalk.yellow,
    name: "Lib",
    port: null,
  },
  backend: {
    emoji: "🚀",
    color: chalk.green,
    name: "Backend",
    port: "3000",
  },
} as const satisfies Record<string, ServiceConfig>;

// Spawn a process and prefix its output
function spawnWithLabel(
  service: string,
  command: string[],
  cwd: string,
): Subprocess {
  const config = services[service];
  const label = `${config.color.bold(`[${config.emoji} ${config.name}]`)}`;

  console.log(
    `${label} ${chalk.gray(`Starting ${config.name.toLowerCase()}...`)}`,
  );

  const proc = Bun.spawn(command, {
    cwd,
    stdin: "inherit",
    stdout: "pipe",
    stderr: "pipe",
  });

  // Prefix stdout
  (async () => {
    const reader = proc.stdout.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (line.trim()) {
          console.log(`${label} ${line}`);
        }
      }
    }

    if (buffer.trim()) {
      console.log(`${label} ${buffer}`);
    }
  })();

  // Prefix stderr
  (async () => {
    const reader = proc.stderr.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (line.trim()) {
          console.log(`${label} ${chalk.red(line)}`);
        }
      }
    }

    if (buffer.trim()) {
      console.log(`${label} ${chalk.red(buffer)}`);
    }
  })();

  return proc;
}

// Start all services
console.log();
console.log(chalk.bold.blue("╔════════════════════════════════════════╗"));
console.log(chalk.bold.blue("║   Starting Development Servers         ║"));
console.log(chalk.bold.blue("╚════════════════════════════════════════╝"));
console.log();

// Start lib (TypeScript watch)
const libProc = spawnWithLabel(
  "lib",
  ["bun", "run", "dev"],
  resolve(rootDir, "lib"),
);

// Start backend
const backendProc = spawnWithLabel(
  "backend",
  ["bun", "run", "dev"],
  resolve(rootDir, "backend"),
);

// Start frontend
const frontendProc = spawnWithLabel(
  "frontend",
  ["bun", "run", "dev"],
  resolve(rootDir, "frontend"),
);

// Wait a moment for services to start, then show status
setTimeout(() => {
  console.log();
  console.log(chalk.bold.green("✓ All services started!"));
  console.log();
  console.log(chalk.bold("Services running:"));
  console.log(
    `  ${services.frontend.emoji} ${chalk.cyan.bold("Frontend")}  → http://localhost:${services.frontend.port}`,
  );
  console.log(
    `  ${services.backend.emoji} ${chalk.green.bold("Backend")}  → http://localhost:${services.backend.port}`,
  );
  console.log(
    `  ${services.lib.emoji} ${chalk.yellow.bold("Lib")}      → Watching for changes`,
  );
  console.log();
  console.log(chalk.gray("Press Ctrl+C to stop all services"));
  console.log();
}, 2000);

// Handle cleanup on exit
process.on("SIGINT", () => {
  console.log();
  console.log(chalk.yellow("Stopping all services..."));
  libProc.kill();
  backendProc.kill();
  frontendProc.kill();
  process.exit(0);
});

process.on("SIGTERM", () => {
  libProc.kill();
  backendProc.kill();
  frontendProc.kill();
  process.exit(0);
});
