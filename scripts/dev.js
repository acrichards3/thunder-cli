#!/usr/bin/env node

import { spawn } from "child_process";
import chalk from "chalk";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, "..");

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
};

// Spawn a process and prefix its output
function spawnWithLabel(service, command, args, cwd) {
  const config = services[service];
  const label = `${config.color.bold(`[${config.emoji} ${config.name}]`)}`;

  console.log(
    `${label} ${chalk.gray(`Starting ${config.name.toLowerCase()}...`)}`
  );

  const proc = spawn(command, args, {
    cwd,
    stdio: ["inherit", "pipe", "pipe"],
    shell: true,
  });

  // Prefix stdout
  proc.stdout.on("data", (data) => {
    const lines = data.toString().split("\n");
    lines.forEach((line) => {
      if (line.trim()) {
        console.log(`${label} ${line}`);
      }
    });
  });

  // Prefix stderr
  proc.stderr.on("data", (data) => {
    const lines = data.toString().split("\n");
    lines.forEach((line) => {
      if (line.trim()) {
        console.log(`${label} ${chalk.red(line)}`);
      }
    });
  });

  proc.on("exit", (code) => {
    if (code !== 0 && code !== null) {
      console.log(`${label} ${chalk.red(`Process exited with code ${code}`)}`);
    }
  });

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
  "bun",
  ["run", "dev"],
  resolve(rootDir, "lib")
);

// Start backend
const backendProc = spawnWithLabel(
  "backend",
  "bun",
  ["run", "dev"],
  resolve(rootDir, "backend")
);

// Start frontend
const frontendProc = spawnWithLabel(
  "frontend",
  "bun",
  ["run", "dev"],
  resolve(rootDir, "frontend")
);

// Wait a moment for services to start, then show status
setTimeout(() => {
  console.log();
  console.log(chalk.bold.green("✓ All services started!"));
  console.log();
  console.log(chalk.bold("Services running:"));
  console.log(
    `  ${services.frontend.emoji} ${chalk.cyan.bold("Frontend")}  → http://localhost:${services.frontend.port}`
  );
  console.log(
    `  ${services.backend.emoji} ${chalk.green.bold("Backend")}  → http://localhost:${services.backend.port}`
  );
  console.log(
    `  ${services.lib.emoji} ${chalk.yellow.bold("Lib")}      → Watching for changes`
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
