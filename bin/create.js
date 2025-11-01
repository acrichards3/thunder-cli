#!/usr/bin/env node

import { existsSync, readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Find the package root directory (where package.json should be)
// The bin script is in <package-root>/bin/create.js, so package.json is one level up
let packageRoot = dirname(__dirname);

// Check if this is a new project or already initialized
let packageJsonPath = resolve(packageRoot, "package.json");
if (!existsSync(packageJsonPath)) {
  // If not found relative to script, try cwd as fallback
  const cwdPackageJson = resolve(process.cwd(), "package.json");
  if (existsSync(cwdPackageJson)) {
    packageRoot = process.cwd();
    packageJsonPath = cwdPackageJson;
  } else {
    console.error(
      "Error: package.json not found. Please run this from the project root."
    );
    process.exit(1);
  }
}

const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));

// Only run if this is still the template package
if (
  packageJson.name === "create-thunder-app" ||
  packageJson.name === "ak-wedding"
) {
  // Get project name from directory name or command line argument
  const projectNameArg = process.argv[2];
  const targetDir = packageRoot; // Use package root as target
  const projectName =
    projectNameArg ||
    targetDir
      .split("/")
      .pop()
      ?.toLowerCase()
      .replace(/[^a-z0-9-]/g, "-") ||
    "thunder-app";

  // Update root package.json
  packageJson.name = projectName;
  packageJson.private = true;
  delete packageJson.postinstall;
  delete packageJson.bin;
  writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + "\n");

  // Update workspace package names
  const updateWorkspacePackage = (workspacePath, oldPrefixes, newPrefix) => {
    const pkgPath = resolve(targetDir, workspacePath, "package.json");
    if (existsSync(pkgPath)) {
      const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
      for (const oldPrefix of oldPrefixes) {
        if (pkg.name?.startsWith(oldPrefix)) {
          pkg.name = pkg.name.replace(oldPrefix, newPrefix);
          writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
          break;
        }
      }
    }
  };

  // Update all workspace packages (check both old and new prefixes for backward compatibility)
  const oldPrefixes = ["@ak-wedding/", "@thunder-app/"];
  const newPrefix = `@${projectName}/`;
  updateWorkspacePackage("frontend", oldPrefixes, newPrefix);
  updateWorkspacePackage("backend", oldPrefixes, newPrefix);
  updateWorkspacePackage("lib", oldPrefixes, newPrefix);

  // Update workspace dependencies in frontend and backend
  const updateDependencies = (workspacePath) => {
    const pkgPath = resolve(targetDir, workspacePath, "package.json");
    if (existsSync(pkgPath)) {
      const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
      let updated = false;

      if (pkg.dependencies) {
        Object.keys(pkg.dependencies).forEach((dep) => {
          if (
            dep.startsWith("@ak-wedding/") ||
            dep.startsWith("@thunder-app/")
          ) {
            const newDep = dep.replace(
              /@ak-wedding\/|@thunder-app\//,
              newPrefix
            );
            pkg.dependencies[newDep] = pkg.dependencies[dep];
            delete pkg.dependencies[dep];
            updated = true;
          }
        });
      }

      if (updated) {
        writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
      }
    }
  };

  updateDependencies("frontend");
  updateDependencies("backend");

  // Update build scripts that reference old package names
  const updateScripts = () => {
    const scripts = packageJson.scripts || {};
    Object.keys(scripts).forEach((key) => {
      if (scripts[key] && typeof scripts[key] === "string") {
        scripts[key] = scripts[key].replace(
          /@ak-wedding\/|@thunder-app\//g,
          newPrefix
        );
      }
    });
    writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + "\n");
  };

  updateScripts();

  console.log(`\n✓ Project initialized as "${projectName}"\n`);
  console.log("🚀 Thunder App template initialized!\n");
  console.log("Next steps:");
  console.log("  1. bun install");
  console.log("  2. bun run build:lib");
  console.log("  3. bun run dev\n");
}
