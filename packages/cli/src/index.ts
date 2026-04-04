#!/usr/bin/env node
import { cpSync, existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageRoot = resolve(__dirname, "..");
const templateRoot = resolve(packageRoot, "templates", "init");

function log(message: string) {
  process.stdout.write(`${message}
`);
}

function usage() {
  log("Usage: harness-codex init [target] [--dry-run]");
}

export function parseArgs(argv: string[]) {
  const args = argv.slice(2);
  const command = args[0];
  const flags = new Set(args.filter((item) => item.startsWith("--")));
  const target = args.find((item, index) => index > 0 && !item.startsWith("--")) ?? ".";
  return {
    command,
    target,
    dryRun: flags.has("--dry-run"),
  };
}

function ensureDirectory(pathname: string, dryRun: boolean) {
  if (existsSync(pathname) || dryRun) {
    return;
  }
  mkdirSync(pathname, { recursive: true });
}

function copyIfMissing(
  source: string,
  destination: string,
  created: string[],
  skipped: string[],
  dryRun: boolean,
) {
  if (existsSync(destination)) {
    skipped.push(destination);
    return;
  }

  created.push(destination);
  if (dryRun) {
    return;
  }

  mkdirSync(dirname(destination), { recursive: true });
  cpSync(source, destination, { recursive: true });
}

function copyDirectoryContents(
  sourceDir: string,
  destinationDir: string,
  created: string[],
  skipped: string[],
  dryRun: boolean,
) {
  ensureDirectory(destinationDir, dryRun);

  for (const entry of readdirSync(sourceDir)) {
    const sourcePath = join(sourceDir, entry);
    const destinationPath = join(destinationDir, entry);
    const stats = statSync(sourcePath);

    if (stats.isDirectory()) {
      copyDirectoryContents(sourcePath, destinationPath, created, skipped, dryRun);
      continue;
    }

    copyIfMissing(sourcePath, destinationPath, created, skipped, dryRun);
  }
}

export function toRelative(root: string, pathname: string) {
  const prefix = `${root}/`;
  return pathname.startsWith(prefix) ? pathname.slice(prefix.length) : pathname;
}

export function runInit(targetArg: string, dryRun: boolean) {
  const targetRoot = resolve(process.cwd(), targetArg);
  const created: string[] = [];
  const skipped: string[] = [];

  ensureDirectory(targetRoot, dryRun);

  copyIfMissing(
    join(templateRoot, ".codex", "config.toml"),
    join(targetRoot, ".codex", "config.toml"),
    created,
    skipped,
    dryRun,
  );
  copyIfMissing(
    join(templateRoot, "AGENTS.md"),
    join(targetRoot, "AGENTS.md"),
    created,
    skipped,
    dryRun,
  );
  copyIfMissing(
    join(templateRoot, "documents", "README.md"),
    join(targetRoot, "documents", "README.md"),
    created,
    skipped,
    dryRun,
  );
  copyDirectoryContents(
    join(templateRoot, "documents", "codex-pir"),
    join(targetRoot, "documents", "codex-pir"),
    created,
    skipped,
    dryRun,
  );
  copyDirectoryContents(
    join(templateRoot, "vendor", "superpowers", "skills"),
    join(targetRoot, "vendor", "superpowers", "skills"),
    created,
    skipped,
    dryRun,
  );

  log(dryRun ? "Harness Codex initialization plan" : "Codex Harness initialized for this project.");
  log("");

  if (created.length > 0) {
    log(dryRun ? "Will create:" : "Created:");
    for (const item of created) {
      log(`- ${toRelative(targetRoot, item)}`);
    }
    log("");
  }

  if (skipped.length > 0) {
    log(dryRun ? "Will keep existing:" : "Skipped existing:");
    for (const item of skipped) {
      log(`- ${toRelative(targetRoot, item)}`);
    }
    log("");
  }

  log("Current default workflow:");
  log("1. Use `复述需求` to confirm understanding.");
  log("2. Let Planner + superpowers produce boundary and plan.");
  log("3. Use `开始执行` as the execution gate.");
  log("4. Show execution preflight before implementation.");
  log("5. Produce code and document results.");
  log("");
  log("Bundled workflow source:");
  log("- vendor/superpowers/skills/");
  log("- documents/superpowers-integration.md");
  log("");
  log("Suggested superpowers skills:");
  log("- Planner: brainstorming, writing-plans");
  log("- Implementer: executing-plans, systematic-debugging");
  log("- Reviewer: requesting-code-review, receiving-code-review");
}

function main() {
  const { command, target, dryRun } = parseArgs(process.argv);

  if (!command) {
    usage();
    process.exitCode = 1;
    return;
  }

  if (command === "init") {
    runInit(target, dryRun);
    return;
  }

  usage();
  process.exitCode = 1;
}

main();
