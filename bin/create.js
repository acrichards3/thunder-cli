#!/usr/bin/env node

import {
  existsSync,
  readFileSync,
  writeFileSync,
  copyFileSync,
  mkdirSync,
  readdirSync,
} from "fs";
import { resolve, dirname, join, basename } from "path";
import { fileURLToPath } from "url";
import { spawnSync } from "child_process";
import readline from "readline";
import chalk from "chalk";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Template source is the package root (parent of bin/)
const templateRoot = resolve(__dirname, "..");

// Determine project name: argv[2] or prompt
const argName = (process.argv[2] || "").trim();

async function promptName(defaultName) {
  return await new Promise((resolveName) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question(chalk.cyan(`Project name (${defaultName}): `), (answer) => {
      rl.close();
      const n = (answer || defaultName)
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, "-");
      resolveName(n || defaultName);
    });
  });
}

async function main() {
  console.log();
  console.log(
    chalk.cyan(`
             ===    ████████╗██╗  ██╗██╗   ██╗███╗   ██╗██████╗ ███████╗██████╗ 
           ====     ╚══██╔══╝██║  ██║██║   ██║████╗  ██║██╔══██╗██╔════╝██╔══██╗
         =====         ██║   ███████║██║   ██║██╔██╗ ██║██║  ██║█████╗  ██████╔╝
        =====          ██║   ██╔══██║██║   ██║██║╚██╗██║██║  ██║██╔══╝  ██╔══██╗
      =======          ██║   ██║  ██║╚██████╔╝██║ ╚████║██████╔╝███████╗██║  ██║
    ++++++++++++       ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚═════╝ ╚══════╝╚═╝  ╚═╝
        ++++++                                                                    
       *++++*                          █████╗  ██████╗ ██████ 
       ****                           ██╔══██╗██╔══██╗██╔══██╗
      ***                             ███████║██████╔╝██████╔╝
     **                               ██╔══██║██╔═══╝ ██╔═══╝ 
                                      ██║  ██║██║     ██║     
                                      ╚═╝  ╚═╝╚═╝     ╚═╝     
`)
  );

  const cwd = process.cwd();
  const defaultName = "thunder-app";
  let projectName = argName;
  if (!projectName) {
    projectName = await promptName(defaultName);
  }
  projectName =
    projectName.toLowerCase().replace(/[^a-z0-9-]/g, "-") || defaultName;

  // Ask about GitHub CI/CD pipeline
  const askYesNo = async (question, defaultYes = true) => {
    return await new Promise((resolveAns) => {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });
      const suffix = defaultYes ? "(Y/n)" : "(y/N)";
      rl.question(chalk.cyan(`${question} ${suffix} `), (answer) => {
        rl.close();
        const a = (answer || "").trim().toLowerCase();
        if (!a) return resolveAns(defaultYes);
        resolveAns(a === "y" || a === "yes");
      });
    });
  };

  const includeGithub = await askYesNo("Include GitHub CI/CD pipeline?", true);

  const targetDir = resolve(cwd, projectName);
  if (existsSync(targetDir)) {
    const contents = readdirSync(targetDir);
    if (contents.length > 0) {
      console.error(
        chalk.red.bold(
          `Error: directory "${projectName}" already exists and is not empty.`
        )
      );
      process.exit(1);
    }
  } else {
    mkdirSync(targetDir, { recursive: true });
  }

  // Copy files from templateRoot to targetDir, excluding unwanted dirs/files
  const ignore = new Set([
    "node_modules",
    ".git",
    ".DS_Store",
    "bin",
    "dist",
    ".vite",
    ".cache",
    "coverage",
    ".nyc_output",
  ]);
  if (!includeGithub) {
    ignore.add(".github");
  }
  const shouldIgnore = (name) => ignore.has(name);

  const copyRecursive = (src, dest) => {
    const entries = readdirSync(src, { withFileTypes: true });
    for (const entry of entries) {
      if (shouldIgnore(entry.name)) continue;
      const srcPath = join(src, entry.name);
      const destPath = join(dest, entry.name);
      if (entry.isDirectory()) {
        if (!existsSync(destPath)) mkdirSync(destPath, { recursive: true });
        copyRecursive(srcPath, destPath);
      } else {
        // Skip .env files but allow .env.example files
        if (entry.name === ".env") {
          continue;
        }
        // Skip .tsbuildinfo files
        if (entry.name.endsWith(".tsbuildinfo")) {
          continue;
        }
        copyFileSync(srcPath, destPath);
      }
    }
  };

  copyRecursive(templateRoot, targetDir);

  // Update package names and scripts in the copied project
  const pkgPath = resolve(targetDir, "package.json");
  if (!existsSync(pkgPath)) {
    console.error(
      chalk.red.bold("Error: package.json not found in target directory")
    );
    process.exit(1);
  }

  const rootPkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
  rootPkg.name = projectName;
  rootPkg.private = true;
  delete rootPkg.postinstall;
  delete rootPkg.bin;
  delete rootPkg.files;

  const newPrefix = `@${projectName}/`;
  const replacePrefixes = (s) =>
    typeof s === "string"
      ? s.replace(/@ak-wedding\/|@thunder-app\//g, newPrefix)
      : s;
  if (rootPkg.scripts) {
    for (const k of Object.keys(rootPkg.scripts)) {
      rootPkg.scripts[k] = replacePrefixes(rootPkg.scripts[k]);
    }
  }
  writeFileSync(pkgPath, JSON.stringify(rootPkg, null, 2) + "\n");

  const updateWorkspace = (wsName) => {
    const wsPkgPath = resolve(targetDir, wsName, "package.json");
    if (!existsSync(wsPkgPath)) return;
    const wsPkg = JSON.parse(readFileSync(wsPkgPath, "utf-8"));
    if (
      wsPkg.name?.startsWith("@ak-wedding/") ||
      wsPkg.name?.startsWith("@thunder-app/")
    ) {
      wsPkg.name = wsPkg.name.replace(
        /@ak-wedding\/|@thunder-app\//,
        newPrefix
      );
    }
    if (wsPkg.dependencies) {
      for (const dep of Object.keys(wsPkg.dependencies)) {
        if (dep.startsWith("@ak-wedding/") || dep.startsWith("@thunder-app/")) {
          const newDep = dep.replace(/@ak-wedding\/|@thunder-app\//, newPrefix);
          wsPkg.dependencies[newDep] = wsPkg.dependencies[dep];
          delete wsPkg.dependencies[dep];
        }
      }
    }
    writeFileSync(wsPkgPath, JSON.stringify(wsPkg, null, 2) + "\n");
  };

  updateWorkspace("frontend");
  updateWorkspace("backend");
  updateWorkspace("lib");

  // Replace import specifiers inside source files to use the new scope
  const replaceInSource = (dir) => {
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        // skip node_modules and dist
        if (entry.name === "node_modules" || entry.name === "dist") continue;
        replaceInSource(fullPath);
      } else {
        if (!/(\.ts|\.tsx|\.js|\.mjs|\.cjs)$/.test(entry.name)) continue;
        const content = readFileSync(fullPath, "utf-8");
        const replaced = content
          // preserve the original quote (single or double)
          .replace(/(["'])@ak-wedding\//g, `$1${newPrefix}`)
          .replace(/(["'])@thunder-app\//g, `$1${newPrefix}`);
        if (replaced !== content) {
          writeFileSync(fullPath, replaced);
        }
      }
    }
  };

  replaceInSource(resolve(targetDir, "backend"));
  replaceInSource(resolve(targetDir, "frontend"));

  // Optional installs
  const doInstall = await askYesNo(
    "Run bun install for all workspaces now?",
    true
  );
  if (doInstall) {
    console.log(
      chalk.blue.bold("\n› Installing dependencies (root workspace)...\n")
    );
    const res = spawnSync("bun", ["install"], {
      cwd: targetDir,
      stdio: "inherit",
    });
    if (res.status !== 0) {
      console.error(
        chalk.red("bun install failed. You can run it manually later.")
      );
    } else {
      console.log(chalk.blue.bold("\n› Building lib...\n"));
      const buildRes = spawnSync("bun", ["run", "build:lib"], {
        cwd: targetDir,
        stdio: "inherit",
      });
      if (buildRes.status !== 0) {
        console.error(
          chalk.red("lib build failed. You can run 'bun run build:lib' later.")
        );
      }
    }
  }

  console.log();
  console.log(chalk.green.bold(`✓ Project initialized as "${projectName}"`));
  console.log(chalk.yellow.bold("🚀 Thunder App template initialized!"));
  console.log();
  console.log(chalk.cyan.bold("📍 Project location:"), chalk.gray(targetDir));
  console.log();
  console.log(chalk.cyan.bold("Next steps:"));
  console.log(chalk.white(`  1. cd ${projectName}`));
  console.log(
    chalk.white(
      "  2. bun install    # installs all workspaces (frontend, lib, backend)"
    )
  );
  console.log(chalk.white("  3. bun run build:lib"));
  console.log(chalk.white("  4. bun run dev"));
  console.log();
}

main().catch((err) => {
  console.error(chalk.red.bold("Error:"), chalk.red(err));
  process.exit(1);
});
