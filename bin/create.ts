#!/usr/bin/env bun
import { readdirSync, mkdirSync, type Dirent } from "fs";
import { join, resolve } from "path";
import { createInterface } from "readline";
import chalk from "chalk";

// Bun native: import.meta.dir replaces __dirname
const templateRoot = resolve(import.meta.dir, "..");

// Determine project name: argv[2] or prompt
const argName = (Bun.argv[2] || "").trim();

interface PackageJson {
  name?: string;
  private?: boolean;
  postinstall?: string;
  bin?: Record<string, string>;
  files?: string[];
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  [key: string]: unknown;
}

// Single readline interface for all prompts
const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

function prompt(message: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(message, (answer) => resolve(answer));
  });
}

async function promptName(defaultName: string): Promise<string> {
  const answer = await prompt(chalk.cyan(`Project name (${defaultName}): `));
  const n = (answer || defaultName).toLowerCase().replace(/[^a-z0-9-]/g, "-");
  return n || defaultName;
}

async function askYesNo(question: string, defaultYes = true): Promise<boolean> {
  const suffix = defaultYes ? "(Y/n)" : "(y/N)";
  const answer = await prompt(chalk.cyan(`${question} ${suffix} `));
  const a = (answer || "").trim().toLowerCase();
  if (!a) return defaultYes;
  return a === "y" || a === "yes";
}

async function main(): Promise<void> {
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
`),
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
  const includeGithub = await askYesNo("Include GitHub CI/CD pipeline?", true);

  const targetDir = resolve(cwd, projectName);
  const targetDirExists = await Bun.file(targetDir).exists();

  if (targetDirExists) {
    const contents = readdirSync(targetDir);
    if (contents.length > 0) {
      console.error(
        chalk.red.bold(
          `Error: directory "${projectName}" already exists and is not empty.`,
        ),
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
    "docs",
    ".vite",
    ".cache",
    "coverage",
    ".nyc_output",
  ]);
  if (!includeGithub) {
    ignore.add(".github");
  }
  const shouldIgnore = (name: string): boolean => ignore.has(name);

  const copyRecursive = async (src: string, dest: string): Promise<void> => {
    const entries: Dirent[] = readdirSync(src, { withFileTypes: true });
    for (const entry of entries) {
      if (shouldIgnore(entry.name)) continue;
      const srcPath = join(src, entry.name);
      const destPath = join(dest, entry.name);
      if (entry.isDirectory()) {
        const destExists = await Bun.file(destPath).exists();
        if (!destExists) mkdirSync(destPath, { recursive: true });
        await copyRecursive(srcPath, destPath);
      } else {
        // Skip .env files but allow .env.example files
        if (entry.name === ".env") continue;
        // Skip .tsbuildinfo files
        if (entry.name.endsWith(".tsbuildinfo")) continue;
        // Bun native file copy
        await Bun.write(destPath, Bun.file(srcPath));
      }
    }
  };

  await copyRecursive(templateRoot, targetDir);

  // Update package names and scripts in the copied project
  const pkgPath = resolve(targetDir, "package.json");
  const pkgFile = Bun.file(pkgPath);

  if (!(await pkgFile.exists())) {
    console.error(
      chalk.red.bold("Error: package.json not found in target directory"),
    );
    process.exit(1);
  }

  const rootPkg: PackageJson = await pkgFile.json();
  rootPkg.name = projectName;
  rootPkg.private = true;
  delete rootPkg.postinstall;
  delete rootPkg.bin;
  delete rootPkg.files;

  const newPrefix = `@${projectName}/`;
  const replacePrefixes = (s: unknown): unknown =>
    typeof s === "string" ? s.replace(/@thunder-app\//g, newPrefix) : s;
  if (rootPkg.scripts) {
    for (const k of Object.keys(rootPkg.scripts)) {
      rootPkg.scripts[k] = replacePrefixes(rootPkg.scripts[k]) as string;
    }
  }
  await Bun.write(pkgPath, JSON.stringify(rootPkg, null, 2) + "\n");

  const updateWorkspace = async (wsName: string): Promise<void> => {
    const wsPkgPath = resolve(targetDir, wsName, "package.json");
    const wsPkgFile = Bun.file(wsPkgPath);
    if (!(await wsPkgFile.exists())) return;

    const wsPkg: PackageJson = await wsPkgFile.json();
    if (wsPkg.name?.startsWith("@thunder-app/")) {
      wsPkg.name = wsPkg.name.replace(/@thunder-app\//, newPrefix);
    }
    if (wsPkg.dependencies) {
      for (const dep of Object.keys(wsPkg.dependencies)) {
        if (dep.startsWith("@thunder-app/")) {
          const newDep = dep.replace(/@thunder-app\//, newPrefix);
          wsPkg.dependencies[newDep] = wsPkg.dependencies[dep];
          delete wsPkg.dependencies[dep];
        }
      }
    }
    await Bun.write(wsPkgPath, JSON.stringify(wsPkg, null, 2) + "\n");
  };

  await updateWorkspace("frontend");
  await updateWorkspace("backend");
  await updateWorkspace("lib");

  // Replace import specifiers inside source files to use the new scope
  const replaceInSource = async (dir: string): Promise<void> => {
    const entries: Dirent[] = readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        // skip node_modules and dist
        if (entry.name === "node_modules" || entry.name === "dist") continue;
        await replaceInSource(fullPath);
      } else {
        if (!/(\.ts|\.tsx|\.js|\.mjs|\.cjs)$/.test(entry.name)) continue;
        const content = await Bun.file(fullPath).text();
        const replaced = content.replace(
          /(["'])@thunder-app\//g,
          `$1${newPrefix}`,
        );
        if (replaced !== content) {
          await Bun.write(fullPath, replaced);
        }
      }
    }
  };

  await replaceInSource(resolve(targetDir, "backend"));
  await replaceInSource(resolve(targetDir, "frontend"));

  // Optional installs
  const doInstall = await askYesNo(
    "Run bun install for all workspaces now?",
    true,
  );
  if (doInstall) {
    console.log(
      chalk.blue.bold("\n› Installing dependencies (root workspace)...\n"),
    );
    const res = Bun.spawnSync(["bun", "install"], {
      cwd: targetDir,
      stdio: ["inherit", "inherit", "inherit"],
    });
    if (res.exitCode !== 0) {
      console.error(
        chalk.red("bun install failed. You can run it manually later."),
      );
    } else {
      console.log(chalk.blue.bold("\n› Building lib...\n"));
      const buildRes = Bun.spawnSync(["bun", "run", "build:lib"], {
        cwd: targetDir,
        stdio: ["inherit", "inherit", "inherit"],
      });
      if (buildRes.exitCode !== 0) {
        console.error(
          chalk.red("lib build failed. You can run 'bun run build:lib' later."),
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
      "  2. bun install    # installs all workspaces (frontend, lib, backend)",
    ),
  );
  console.log(chalk.white("  3. bun run build:lib"));
  console.log(chalk.white("  4. bun run dev"));
  console.log();

  rl.close();
}

main().catch((err: Error) => {
  rl.close();
  console.error(chalk.red.bold("Error:"), chalk.red(err));
  process.exit(1);
});
