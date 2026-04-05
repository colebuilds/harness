#!/usr/bin/env node
import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageRoot = resolve(__dirname, "..");
const templateRoot = resolve(packageRoot, "templates", "init");

const defaultSuperpowersVersion = (() => {
  const packageJson = JSON.parse(
    readFileSync(resolve(templateRoot, "vendor-superpowers-full", "package.json"), "utf8"),
  ) as { version?: string };
  return packageJson.version ?? "unknown";
})();

export type DeveloperLanguage = "zh-CN" | "en";
export type DocumentMode = "flat" | "full";
export type DebugMode = "off" | "on";

export type InitOptions = {
  debugMode: DebugMode;
  developerLanguage: DeveloperLanguage;
  documentMode: DocumentMode;
  dryRun: boolean;
  yes: boolean;
};

type ParsedArgs = InitOptions & {
  command?: string;
  target: string;
};

type ConflictItem = {
  kind: "file" | "directory";
  path: string;
};

type TemplateContext = {
  debugMode: DebugMode;
  developerLanguage: DeveloperLanguage;
  developerLanguageLabel: string;
  documentMode: DocumentMode;
  generatedAt: string;
  superpowersManagedPath: string;
  superpowersSource: string;
  superpowersVersion: string;
};

function log(message = "") {
  process.stdout.write(`${message}\n`);
}

function usage() {
  log(
    "Usage: harness-codex init [target] [--dry-run] [--developer-language=<zh-CN|en>] [--document-mode=<flat|full>] [--debug-mode=<off|on>] [--yes]",
  );
  log("       harness-codex verify [target]");
  log("       harness-codex upgrade superpowers [target] [--dry-run] [--yes]");
}

function normalizeDeveloperLanguage(value: string | undefined): DeveloperLanguage | undefined {
  if (!value) {
    return undefined;
  }
  return value === "zh-CN" || value === "en" ? value : undefined;
}

function normalizeDocumentMode(value: string | undefined): DocumentMode | undefined {
  if (!value) {
    return undefined;
  }
  return value === "flat" || value === "full" ? value : undefined;
}

function normalizeDebugMode(value: string | undefined): DebugMode | undefined {
  if (!value) {
    return undefined;
  }
  return value === "off" || value === "on" ? value : undefined;
}

function pullFlagValue(args: string[], flag: string) {
  const prefix = `${flag}=`;
  const inline = args.find((item) => item.startsWith(prefix));
  if (inline) {
    return inline.slice(prefix.length);
  }

  const index = args.indexOf(flag);
  if (index >= 0 && index + 1 < args.length && !args[index + 1].startsWith("--")) {
    return args[index + 1];
  }

  return undefined;
}

export function parseArgs(argv: string[]): ParsedArgs {
  const args = argv.slice(2);
  const command = args[0];
  const developerLanguage = normalizeDeveloperLanguage(pullFlagValue(args, "--developer-language"));
  const documentMode = normalizeDocumentMode(pullFlagValue(args, "--document-mode"));
  const debugMode = normalizeDebugMode(pullFlagValue(args, "--debug-mode"));
  const flagsWithValues = new Set(["--developer-language", "--document-mode", "--debug-mode"]);
  const positionals: string[] = [];

  for (let index = 1; index < args.length; index += 1) {
    const item = args[index];
    if (item.startsWith("--")) {
      if (item.includes("=")) {
        continue;
      }
      if (flagsWithValues.has(item)) {
        index += 1;
      }
      continue;
    }
    positionals.push(item);
  }

  return {
    command,
    target: positionals[0] ?? ".",
    dryRun: args.includes("--dry-run"),
    yes: args.includes("--yes"),
    developerLanguage: developerLanguage ?? "zh-CN",
    documentMode: documentMode ?? "flat",
    debugMode: debugMode ?? "off",
  };
}

function ensureDirectory(pathname: string, dryRun: boolean) {
  if (existsSync(pathname) || dryRun) {
    return;
  }
  mkdirSync(pathname, { recursive: true });
}

export function toRelative(root: string, pathname: string) {
  const prefix = `${root}/`;
  return pathname.startsWith(prefix) ? pathname.slice(prefix.length) : pathname;
}

function developerLanguageLabel(language: DeveloperLanguage) {
  return language === "zh-CN" ? "中文" : "English";
}

function readTemplate(pathname: string, context: TemplateContext) {
  return readFileSync(pathname, "utf8")
    .replaceAll("{{developer_language}}", context.developerLanguage)
    .replaceAll("{{developer_language_label}}", context.developerLanguageLabel)
    .replaceAll("{{document_mode}}", context.documentMode)
    .replaceAll("{{debug_mode}}", context.debugMode)
    .replaceAll("{{superpowers_managed_path}}", context.superpowersManagedPath)
    .replaceAll("{{superpowers_source}}", context.superpowersSource)
    .replaceAll("{{superpowers_version}}", context.superpowersVersion)
    .replaceAll("{{generated_at}}", context.generatedAt);
}

function writeRenderedFile(
  source: string,
  destination: string,
  context: TemplateContext,
  created: string[],
  replaced: string[],
  dryRun: boolean,
) {
  created.push(destination);
  if (existsSync(destination)) {
    replaced.push(destination);
  }
  if (dryRun) {
    return;
  }
  mkdirSync(dirname(destination), { recursive: true });
  writeFileSync(destination, readTemplate(source, context), "utf8");
}

function copyDirectory(
  source: string,
  destination: string,
  created: string[],
  replaced: string[],
  dryRun: boolean,
) {
  created.push(destination);
  if (existsSync(destination)) {
    replaced.push(destination);
  }
  if (dryRun) {
    return;
  }
  mkdirSync(dirname(destination), { recursive: true });
  rmSync(destination, { force: true, recursive: true });
  cpSync(source, destination, { recursive: true });
}

function createEmptyDirectory(
  pathname: string,
  created: string[],
  replaced: string[],
  dryRun: boolean,
) {
  created.push(pathname);
  if (existsSync(pathname)) {
    replaced.push(pathname);
  }
  if (dryRun) {
    return;
  }
  mkdirSync(pathname, { recursive: true });
}

function getTemplateContext(options: InitOptions): TemplateContext {
  return {
    developerLanguage: options.developerLanguage,
    developerLanguageLabel: developerLanguageLabel(options.developerLanguage),
    documentMode: options.documentMode,
    debugMode: options.debugMode,
    generatedAt: new Date().toISOString(),
    superpowersManagedPath: ".harness/superpowers",
    superpowersSource: "github:obra/superpowers",
    superpowersVersion: defaultSuperpowersVersion,
  };
}

function defaultDebugLog(context: TemplateContext) {
  return JSON.stringify(
    {
      debug_mode: context.debugMode,
      developer_language: context.developerLanguage,
      document_mode: context.documentMode,
      current_phase: "Planner",
      used_query_agent: false,
      used_execution_agents: 0,
      execution_agent_boundaries: [],
      phase_transitions: [],
      final_owner: "main_agent",
      runtime_agent_architecture: {
        main_agent: "orchestration_and_closeout",
        query_agent: "read_only_research",
        execution_agents: "bounded_implementation_workers",
      },
      execution_summary_requirements: [
        "current_phase",
        "used_query_agent",
        "used_execution_agents",
        "execution_agent_boundaries",
        "phase_transitions",
        "final_owner",
      ],
    },
    null,
    2,
  );
}

function conflictTargets(targetRoot: string) {
  const targets = [
    join(targetRoot, ".codex", "config.toml"),
    join(targetRoot, "AGENTS.md"),
    join(targetRoot, "documents"),
    join(targetRoot, "skills"),
    join(targetRoot, ".harness", "project-policy.json"),
    join(targetRoot, ".harness", "components.lock.json"),
    join(targetRoot, ".harness", "runtime-contract.json"),
    join(targetRoot, ".harness", "superpowers"),
    join(targetRoot, ".harness", "logs"),
  ];
  return targets;
}

function scanInitializationConflicts(targetRoot: string, options: InitOptions): ConflictItem[] {
  return conflictTargets(targetRoot)
    .filter((pathname) => existsSync(pathname))
    .map((pathname) => ({
      kind: statSync(pathname).isDirectory() ? "directory" : "file",
      path: pathname,
    }));
}

function backupConflicts(targetRoot: string, conflicts: ConflictItem[], dryRun: boolean) {
  if (conflicts.length === 0) {
    return undefined;
  }

  const backupRoot = join(
    targetRoot,
    ".harness-backup",
    new Date().toISOString().replaceAll(":", "-").replaceAll(".", "-"),
  );

  if (dryRun) {
    return backupRoot;
  }

  mkdirSync(backupRoot, { recursive: true });
  for (const item of conflicts) {
    const destination = join(backupRoot, relative(targetRoot, item.path));
    mkdirSync(dirname(destination), { recursive: true });
    cpSync(item.path, destination, { recursive: true });
  }
  return backupRoot;
}

async function collectInitOptions(parsed: ParsedArgs): Promise<InitOptions> {
  if (!input.isTTY || !output.isTTY) {
    return {
      debugMode: parsed.debugMode,
      developerLanguage: parsed.developerLanguage,
      documentMode: parsed.documentMode,
      dryRun: parsed.dryRun,
      yes: parsed.yes,
    };
  }

  const rl = createInterface({ input, output });
  try {
    const developerLanguageAnswer = await rl.question(
      `Developer language [zh-CN/en] (${parsed.developerLanguage}): `,
    );
    const documentModeAnswer = await rl.question(
      `Document mode [flat/full] (${parsed.documentMode}): `,
    );
    const debugModeAnswer = await rl.question(`Debug mode [off/on] (${parsed.debugMode}): `);

    return {
      developerLanguage:
        normalizeDeveloperLanguage(developerLanguageAnswer.trim()) ?? parsed.developerLanguage,
      documentMode: normalizeDocumentMode(documentModeAnswer.trim()) ?? parsed.documentMode,
      debugMode: normalizeDebugMode(debugModeAnswer.trim()) ?? parsed.debugMode,
      dryRun: parsed.dryRun,
      yes: parsed.yes,
    };
  } finally {
    rl.close();
  }
}

async function confirmProceed(
  conflicts: ConflictItem[],
  backupRoot: string | undefined,
  yes: boolean,
) {
  if (conflicts.length === 0 || yes) {
    return true;
  }
  if (!input.isTTY || !output.isTTY) {
    return false;
  }

  const rl = createInterface({ input, output });
  try {
    const answer = await rl.question(
      `Conflicts detected. Existing files will be backed up to ${backupRoot}. Continue? [y/N]: `,
    );
    return /^y(es)?$/i.test(answer.trim());
  } finally {
    rl.close();
  }
}

async function confirmUpgrade(targetRoot: string, backupRoot: string | undefined, yes: boolean) {
  if (yes) {
    return true;
  }
  if (!input.isTTY || !output.isTTY) {
    return false;
  }

  const rl = createInterface({ input, output });
  try {
    const answer = await rl.question(
      `Upgrade managed superpowers in ${targetRoot}? Existing files will be backed up to ${backupRoot}. [y/N]: `,
    );
    return /^y(es)?$/i.test(answer.trim());
  } finally {
    rl.close();
  }
}

function printInitializationPlan(
  targetRoot: string,
  options: InitOptions,
  conflicts: ConflictItem[],
  backupRoot: string | undefined,
) {
  log(options.dryRun ? "Harness Codex initialization plan" : "Harness Codex initialization");
  log("");
  log(`Target: ${targetRoot}`);
  log(`Developer language: ${options.developerLanguage}`);
  log(`Document mode: ${options.documentMode}`);
  log(`Debug mode: ${options.debugMode}`);
  log(`Managed superpowers: .harness/superpowers`);
  log("");

  if (conflicts.length > 0) {
    log("Conflicts to back up and replace:");
    for (const item of conflicts) {
      log(`- ${toRelative(targetRoot, item.path)} (${item.kind})`);
    }
    if (backupRoot) {
      log(`Backup location: ${toRelative(targetRoot, backupRoot)}`);
    }
    log("");
  } else {
    log("No conflicting files detected.");
    log("");
  }
}

export async function runInit(targetArg: string, options: InitOptions) {
  const targetRoot = resolve(process.cwd(), targetArg);
  const created: string[] = [];
  const replaced: string[] = [];
  const context = getTemplateContext(options);

  ensureDirectory(targetRoot, options.dryRun);

  const conflicts = scanInitializationConflicts(targetRoot, options);
  const backupRoot =
    conflicts.length > 0
      ? join(
          targetRoot,
          ".harness-backup",
          new Date().toISOString().replaceAll(":", "-").replaceAll(".", "-"),
        )
      : undefined;

  printInitializationPlan(targetRoot, options, conflicts, backupRoot);

  const confirmed = await confirmProceed(conflicts, backupRoot, options.yes);
  if (!confirmed) {
    log("Initialization cancelled.");
    process.exitCode = 1;
    return;
  }

  backupConflicts(targetRoot, conflicts, options.dryRun);

  writeRenderedFile(
    resolve(templateRoot, "base", ".codex", "config.toml.tpl"),
    join(targetRoot, ".codex", "config.toml"),
    context,
    created,
    replaced,
    options.dryRun,
  );
  writeRenderedFile(
    resolve(templateRoot, "harness", "project-policy.json.tpl"),
    join(targetRoot, ".harness", "project-policy.json"),
    context,
    created,
    replaced,
    options.dryRun,
  );
  writeRenderedFile(
    resolve(templateRoot, "harness", "components.lock.json.tpl"),
    join(targetRoot, ".harness", "components.lock.json"),
    context,
    created,
    replaced,
    options.dryRun,
  );
  writeRenderedFile(
    resolve(templateRoot, "harness", "runtime-contract.json.tpl"),
    join(targetRoot, ".harness", "runtime-contract.json"),
    context,
    created,
    replaced,
    options.dryRun,
  );
  writeRenderedFile(
    resolve(templateRoot, "agents", `AGENTS.${options.developerLanguage}.md.tpl`),
    join(targetRoot, "AGENTS.md"),
    context,
    created,
    replaced,
    options.dryRun,
  );

  const documentsRoot = resolve(
    templateRoot,
    options.documentMode === "flat" ? "documents-flat" : "documents-full",
  );
  const documentsTemplate = resolve(documentsRoot, `README.${options.developerLanguage}.md.tpl`);
  writeRenderedFile(
    documentsTemplate,
    join(targetRoot, "documents", "README.md"),
    context,
    created,
    replaced,
    options.dryRun,
  );

  if (options.documentMode === "full") {
    for (const section of [
      "requirements",
      "designs",
      "deliveries",
      "evolution",
      join("standards", "ai-collaboration"),
    ]) {
      writeRenderedFile(
        resolve(documentsRoot, section, `README.${options.developerLanguage}.md.tpl`),
        join(targetRoot, "documents", section, "README.md"),
        context,
        created,
        replaced,
        options.dryRun,
      );
    }
  }

  writeRenderedFile(
    resolve(
      templateRoot,
      "skills",
      "harness-project-policy",
      `SKILL.${options.developerLanguage}.md.tpl`,
    ),
    join(targetRoot, "skills", "harness-project-policy", "SKILL.md"),
    context,
    created,
    replaced,
    options.dryRun,
  );

  copyDirectory(
    resolve(templateRoot, "vendor-superpowers-full"),
    join(targetRoot, ".harness", "superpowers"),
    created,
    replaced,
    options.dryRun,
  );

  if (options.debugMode === "on") {
    createEmptyDirectory(
      join(targetRoot, ".harness", "logs", "sessions"),
      created,
      replaced,
      options.dryRun,
    );
    created.push(join(targetRoot, ".harness", "logs", "latest.json"));
    if (!options.dryRun) {
      mkdirSync(join(targetRoot, ".harness", "logs"), { recursive: true });
      writeFileSync(
        join(targetRoot, ".harness", "logs", "latest.json"),
        defaultDebugLog(context),
        "utf8",
      );
    }
  }

  log(options.dryRun ? "Planned writes:" : "Created or replaced:");
  for (const item of created) {
    log(`- ${toRelative(targetRoot, item)}`);
  }
  log("");
  if (backupRoot && conflicts.length > 0) {
    log(`Backups: ${toRelative(targetRoot, backupRoot)}`);
    log("");
  }
  log("Next steps:");
  log("1. Use `复述需求` to confirm the task boundary.");
  log("2. Use `开始执行` only after plan approval.");
  log("3. Read `AGENTS.md` and `documents/README.md` before customising the project rules.");
}

function readExistingPolicy(targetRoot: string): TemplateContext | undefined {
  const policyPath = join(targetRoot, ".harness", "project-policy.json");
  if (!existsSync(policyPath)) {
    return undefined;
  }
  const policy = JSON.parse(readFileSync(policyPath, "utf8")) as {
    debug_mode?: string;
    developer_language?: string;
    document_mode?: string;
    superpowers_managed_path?: string;
  };
  const developerLanguage = normalizeDeveloperLanguage(policy.developer_language) ?? "zh-CN";
  const documentMode = normalizeDocumentMode(policy.document_mode) ?? "flat";
  const debugMode = normalizeDebugMode(policy.debug_mode) ?? "off";
  return {
    developerLanguage,
    developerLanguageLabel: developerLanguageLabel(developerLanguage),
    documentMode,
    debugMode,
    generatedAt: new Date().toISOString(),
    superpowersManagedPath: policy.superpowers_managed_path ?? ".harness/superpowers",
    superpowersSource: "github:obra/superpowers",
    superpowersVersion: defaultSuperpowersVersion,
  };
}

export async function runUpgrade(targetArg: string, options: Pick<InitOptions, "dryRun" | "yes">) {
  const targetRoot = resolve(process.cwd(), targetArg);
  const managedPath = join(targetRoot, ".harness", "superpowers");
  const lockPath = join(targetRoot, ".harness", "components.lock.json");
  const runtimeContractPath = join(targetRoot, ".harness", "runtime-contract.json");
  const context = readExistingPolicy(targetRoot);

  if (!existsSync(managedPath)) {
    log("Upgrade failed: missing .harness/superpowers");
    process.exitCode = 1;
    return;
  }
  if (!existsSync(lockPath)) {
    log("Upgrade failed: missing .harness/components.lock.json");
    process.exitCode = 1;
    return;
  }
  if (!context) {
    log("Upgrade failed: missing .harness/project-policy.json");
    process.exitCode = 1;
    return;
  }

  const backupRoot = join(
    targetRoot,
    ".harness-backup",
    new Date().toISOString().replaceAll(":", "-").replaceAll(".", "-"),
    "upgrade-superpowers",
  );

  log(
    options.dryRun ? "Harness Codex superpowers upgrade plan" : "Harness Codex superpowers upgrade",
  );
  log("");
  log(`Target: ${targetRoot}`);
  log(`Managed path: ${toRelative(targetRoot, managedPath)}`);
  log(`Current source: github:obra/superpowers`);
  log(`Target version: ${defaultSuperpowersVersion}`);
  log(`Backup location: ${toRelative(targetRoot, backupRoot)}`);
  log("");

  const confirmed = await confirmUpgrade(targetRoot, backupRoot, options.yes);
  if (!confirmed) {
    log("Upgrade cancelled.");
    process.exitCode = 1;
    return;
  }

  if (!options.dryRun) {
    mkdirSync(backupRoot, { recursive: true });
    cpSync(managedPath, join(backupRoot, "superpowers"), { recursive: true });
    cpSync(lockPath, join(backupRoot, "components.lock.json"), { recursive: true });
    if (existsSync(runtimeContractPath)) {
      cpSync(runtimeContractPath, join(backupRoot, "runtime-contract.json"), { recursive: true });
    }

    rmSync(managedPath, { force: true, recursive: true });
    cpSync(resolve(templateRoot, "vendor-superpowers-full"), managedPath, { recursive: true });

    writeFileSync(
      lockPath,
      readTemplate(resolve(templateRoot, "harness", "components.lock.json.tpl"), context),
      "utf8",
    );
    writeFileSync(
      runtimeContractPath,
      readTemplate(resolve(templateRoot, "harness", "runtime-contract.json.tpl"), context),
      "utf8",
    );
  }

  log(options.dryRun ? "Would replace:" : "Replaced:");
  log(`- ${toRelative(targetRoot, managedPath)}`);
  log(`- ${toRelative(targetRoot, lockPath)}`);
  log(`- ${toRelative(targetRoot, runtimeContractPath)}`);
  log("");
  log(
    options.dryRun ? "No files changed." : `Backup saved to ${toRelative(targetRoot, backupRoot)}`,
  );
}

function parseTomlProfiles(contents: string) {
  return {
    hasPlan: contents.includes("[profiles.plan]"),
    hasDev: contents.includes("[profiles.dev]"),
    hasReview: contents.includes("[profiles.review]"),
  };
}

function readJsonFile(pathname: string, failures: string[], missingMessage: string) {
  if (!existsSync(pathname)) {
    failures.push(missingMessage);
    return undefined;
  }

  try {
    return JSON.parse(readFileSync(pathname, "utf8")) as Record<string, unknown>;
  } catch {
    failures.push(`invalid JSON: ${pathname}`);
    return undefined;
  }
}

function checkFileContains(pathname: string, pattern: string, failure: string, failures: string[]) {
  if (!existsSync(pathname)) {
    return;
  }
  const contents = readFileSync(pathname, "utf8");
  if (!contents.includes(pattern)) {
    failures.push(failure);
  }
}

export function runVerify(targetArg: string) {
  const targetRoot = resolve(process.cwd(), targetArg);
  const failures: string[] = [];
  const configPath = join(targetRoot, ".codex", "config.toml");
  const policyPath = join(targetRoot, ".harness", "project-policy.json");
  const lockPath = join(targetRoot, ".harness", "components.lock.json");
  const runtimeContractPath = join(targetRoot, ".harness", "runtime-contract.json");
  const agentsPath = join(targetRoot, "AGENTS.md");
  const documentsPath = join(targetRoot, "documents", "README.md");
  const superpowersPath = join(targetRoot, ".harness", "superpowers");
  const policySkillPath = join(targetRoot, "skills", "harness-project-policy", "SKILL.md");

  if (!existsSync(configPath)) {
    failures.push("missing .codex/config.toml");
  } else {
    const profiles = parseTomlProfiles(readFileSync(configPath, "utf8"));
    if (!profiles.hasPlan || !profiles.hasDev || !profiles.hasReview) {
      failures.push("missing one or more PIR profiles in .codex/config.toml");
    }
  }

  let documentMode: DocumentMode = "flat";
  let debugMode: DebugMode = "off";
  const policy = readJsonFile(policyPath, failures, "missing .harness/project-policy.json") as
    | {
        debug_mode?: string;
        developer_language?: string;
        document_mode?: string;
        superpowers_managed_path?: string;
      }
    | undefined;
  if (policy) {
    if (policy.developer_language !== "zh-CN" && policy.developer_language !== "en") {
      failures.push("invalid developer_language in project policy");
    }
    if (policy.document_mode !== "flat" && policy.document_mode !== "full") {
      failures.push("invalid document_mode in project policy");
    } else {
      documentMode = policy.document_mode;
    }
    if (policy.debug_mode !== "off" && policy.debug_mode !== "on") {
      failures.push("invalid debug_mode in project policy");
    } else {
      debugMode = policy.debug_mode;
    }
    if (policy.superpowers_managed_path !== ".harness/superpowers") {
      failures.push("invalid superpowers_managed_path in project policy");
    }
  }

  const lock = readJsonFile(lockPath, failures, "missing .harness/components.lock.json") as
    | {
        superpowers?: {
          source?: string;
          version?: string;
          managed_path?: string;
        };
      }
    | undefined;
  if (lock) {
    if (!lock.superpowers) {
      failures.push("components lock missing superpowers entry");
    } else {
      if (lock.superpowers.source !== "github:obra/superpowers") {
        failures.push("components lock has invalid superpowers source");
      }
      if (!lock.superpowers.version) {
        failures.push("components lock missing superpowers version");
      }
      if (lock.superpowers.managed_path !== ".harness/superpowers") {
        failures.push("components lock has invalid managed superpowers path");
      }
    }
  }

  const runtimeContract = readJsonFile(
    runtimeContractPath,
    failures,
    "missing .harness/runtime-contract.json",
  ) as
    | {
        developer_language?: string;
        document_mode?: string;
        debug_mode?: string;
        profiles?: Record<string, string>;
        commands?: Record<
          string,
          {
            pir_phase?: string;
            profile?: string;
            preferred_superpowers_skills?: string[];
            runtime_agents?: string[];
          }
        >;
        runtime_agent_architecture?: Record<string, string>;
        managed_superpowers_path?: string;
      }
    | undefined;
  if (runtimeContract) {
    if (runtimeContract.developer_language !== policy?.developer_language) {
      failures.push("runtime contract developer_language does not match project policy");
    }
    if (runtimeContract.document_mode !== policy?.document_mode) {
      failures.push("runtime contract document_mode does not match project policy");
    }
    if (runtimeContract.debug_mode !== policy?.debug_mode) {
      failures.push("runtime contract debug_mode does not match project policy");
    }
    if (runtimeContract.managed_superpowers_path !== ".harness/superpowers") {
      failures.push("runtime contract has invalid managed superpowers path");
    }

    const profiles = runtimeContract.profiles ?? {};
    if (profiles.plan !== "Planner") {
      failures.push("runtime contract missing plan -> Planner profile mapping");
    }
    if (profiles.dev !== "Implementer") {
      failures.push("runtime contract missing dev -> Implementer profile mapping");
    }
    if (profiles.review !== "Reviewer") {
      failures.push("runtime contract missing review -> Reviewer profile mapping");
    }

    const commands = runtimeContract.commands ?? {};
    const restateCommand = commands["复述需求"];
    if (!restateCommand) {
      failures.push("runtime contract missing `复述需求` mapping");
    } else {
      if (restateCommand.pir_phase !== "Planner") {
        failures.push("runtime contract has invalid PIR phase for `复述需求`");
      }
      if (restateCommand.profile !== "plan") {
        failures.push("runtime contract has invalid profile for `复述需求`");
      }
      if (!restateCommand.runtime_agents?.includes("main_agent")) {
        failures.push("runtime contract missing main_agent for `复述需求`");
      }
      if (!restateCommand.runtime_agents?.includes("query_agent")) {
        failures.push("runtime contract missing query_agent for `复述需求`");
      }
    }

    const executeCommand = commands["开始执行"];
    if (!executeCommand) {
      failures.push("runtime contract missing `开始执行` mapping");
    } else {
      if (executeCommand.pir_phase !== "Implementer") {
        failures.push("runtime contract has invalid PIR phase for `开始执行`");
      }
      if (executeCommand.profile !== "dev") {
        failures.push("runtime contract has invalid profile for `开始执行`");
      }
      if (!executeCommand.runtime_agents?.includes("main_agent")) {
        failures.push("runtime contract missing main_agent for `开始执行`");
      }
      if (!executeCommand.runtime_agents?.includes("execution_agents")) {
        failures.push("runtime contract missing execution_agents for `开始执行`");
      }
    }

    const reviewCommand = commands.review_request;
    if (!reviewCommand) {
      failures.push("runtime contract missing review_request mapping");
    } else {
      if (reviewCommand.pir_phase !== "Reviewer") {
        failures.push("runtime contract has invalid PIR phase for review_request");
      }
      if (reviewCommand.profile !== "review") {
        failures.push("runtime contract has invalid profile for review_request");
      }
    }

    const runtimeAgents = runtimeContract.runtime_agent_architecture ?? {};
    if (!runtimeAgents.main_agent) {
      failures.push("runtime contract missing main_agent runtime architecture");
    }
    if (!runtimeAgents.query_agent) {
      failures.push("runtime contract missing query_agent runtime architecture");
    }
    if (!runtimeAgents.execution_agents) {
      failures.push("runtime contract missing execution_agents runtime architecture");
    }
  }
  if (!existsSync(agentsPath)) {
    failures.push("missing AGENTS.md");
  } else {
    checkFileContains(agentsPath, "复述需求", "AGENTS.md missing `复述需求` rule", failures);
    checkFileContains(agentsPath, "开始执行", "AGENTS.md missing `开始执行` rule", failures);
    checkFileContains(
      agentsPath,
      ".harness/superpowers",
      "AGENTS.md missing managed superpowers path",
      failures,
    );
    checkFileContains(
      agentsPath,
      policy?.developer_language === "en" ? "main agent" : "主 agent",
      "AGENTS.md missing runtime agent architecture",
      failures,
    );
  }
  if (!existsSync(documentsPath)) {
    failures.push("missing documents/README.md");
  } else {
    if (documentMode === "flat") {
      checkFileContains(
        documentsPath,
        "flat",
        "documents/README.md missing flat mode description",
        failures,
      );
    }
    if (documentMode === "full") {
      checkFileContains(
        documentsPath,
        "requirements/",
        "documents/README.md missing full mode routing",
        failures,
      );
      checkFileContains(
        documentsPath,
        "standards/ai-collaboration/",
        "documents/README.md missing AI collaboration routing",
        failures,
      );
    }
  }
  if (!existsSync(superpowersPath)) {
    failures.push("missing .harness/superpowers");
  }
  if (!existsSync(policySkillPath)) {
    failures.push("missing skills/harness-project-policy/SKILL.md");
  } else {
    checkFileContains(
      policySkillPath,
      "project-policy.json",
      "policy skill missing project-policy reference",
      failures,
    );
    checkFileContains(
      policySkillPath,
      "debug_mode",
      "policy skill missing debug_mode handling",
      failures,
    );
  }

  if (documentMode === "full") {
    const aiCollabPath = join(
      targetRoot,
      "documents",
      "standards",
      "ai-collaboration",
      "README.md",
    );
    for (const required of [
      join(targetRoot, "documents", "requirements", "README.md"),
      join(targetRoot, "documents", "designs", "README.md"),
      join(targetRoot, "documents", "deliveries", "README.md"),
      join(targetRoot, "documents", "evolution", "README.md"),
      aiCollabPath,
    ]) {
      if (!existsSync(required)) {
        failures.push(`missing ${toRelative(targetRoot, required)} for full document mode`);
      }
    }
    const expectedQueryAgentTerm =
      policy?.developer_language === "en" ? "Query agent" : "查询 agent";
    const expectedExecutionAgentTerm =
      policy?.developer_language === "en" ? "Execution agents" : "执行 agent";
    checkFileContains(
      aiCollabPath,
      expectedQueryAgentTerm,
      "ai-collaboration README missing query agent rule",
      failures,
    );
    checkFileContains(
      aiCollabPath,
      expectedExecutionAgentTerm,
      "ai-collaboration README missing execution agent rule",
      failures,
    );
    checkFileContains(
      aiCollabPath,
      "Planner",
      "ai-collaboration README missing PIR mapping",
      failures,
    );
  }

  if (debugMode === "on" && !existsSync(join(targetRoot, ".harness", "logs", "sessions"))) {
    failures.push("missing .harness/logs/sessions for debug mode");
  }
  if (debugMode === "on") {
    const latestLog = join(targetRoot, ".harness", "logs", "latest.json");
    const debugLog = readJsonFile(
      latestLog,
      failures,
      "missing .harness/logs/latest.json for debug mode",
    ) as
      | {
          debug_mode?: string;
          developer_language?: string;
          document_mode?: string;
          current_phase?: string;
          used_query_agent?: unknown;
          used_execution_agents?: unknown;
          execution_agent_boundaries?: unknown;
          phase_transitions?: unknown;
          final_owner?: string;
          runtime_agent_architecture?: Record<string, string>;
          execution_summary_requirements?: unknown;
        }
      | undefined;
    if (debugLog) {
      if (debugLog.debug_mode !== "on") {
        failures.push("debug log has invalid debug_mode");
      }
      if (debugLog.developer_language !== policy?.developer_language) {
        failures.push("debug log developer_language does not match project policy");
      }
      if (debugLog.document_mode !== policy?.document_mode) {
        failures.push("debug log document_mode does not match project policy");
      }
      if (!["Planner", "Implementer", "Reviewer"].includes(debugLog.current_phase ?? "")) {
        failures.push("debug log has invalid current_phase");
      }
      if (typeof debugLog.used_query_agent !== "boolean") {
        failures.push("debug log used_query_agent must be boolean");
      }
      if (
        typeof debugLog.used_execution_agents !== "number" ||
        !Number.isInteger(debugLog.used_execution_agents) ||
        debugLog.used_execution_agents < 0
      ) {
        failures.push("debug log used_execution_agents must be a non-negative integer");
      }
      if (!Array.isArray(debugLog.execution_agent_boundaries)) {
        failures.push("debug log execution_agent_boundaries must be an array");
      }
      if (!Array.isArray(debugLog.phase_transitions)) {
        failures.push("debug log phase_transitions must be an array");
      }
      if (debugLog.final_owner !== "main_agent") {
        failures.push("debug log final_owner must be main_agent");
      }
      const runtimeAgents = debugLog.runtime_agent_architecture ?? {};
      if (
        !runtimeAgents.main_agent ||
        !runtimeAgents.query_agent ||
        !runtimeAgents.execution_agents
      ) {
        failures.push("debug log missing runtime agent architecture fields");
      }
      const summaryRequirements = debugLog.execution_summary_requirements;
      if (!Array.isArray(summaryRequirements)) {
        failures.push("debug log execution_summary_requirements must be an array");
      } else {
        for (const field of [
          "current_phase",
          "used_query_agent",
          "used_execution_agents",
          "execution_agent_boundaries",
          "phase_transitions",
          "final_owner",
        ]) {
          if (!summaryRequirements.includes(field)) {
            failures.push(`debug log missing execution summary requirement: ${field}`);
          }
        }
      }
    }
  }

  if (failures.length > 0) {
    log("Harness verification failed:");
    for (const item of failures) {
      log(`- ${item}`);
    }
    process.exitCode = 1;
    return;
  }

  log("Harness verification passed.");
}

async function main() {
  const parsed = parseArgs(process.argv);

  if (!parsed.command) {
    usage();
    process.exitCode = 1;
    return;
  }

  if (parsed.command === "init") {
    const options = await collectInitOptions(parsed);
    await runInit(parsed.target, options);
    return;
  }

  if (parsed.command === "verify") {
    runVerify(parsed.target);
    return;
  }

  if (parsed.command === "upgrade") {
    const args = process.argv.slice(2);
    if (args[1] !== "superpowers") {
      usage();
      process.exitCode = 1;
      return;
    }
    await runUpgrade(args[2] ?? ".", { dryRun: parsed.dryRun, yes: parsed.yes });
    return;
  }

  usage();
  process.exitCode = 1;
}

void main();
