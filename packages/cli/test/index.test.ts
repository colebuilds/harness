import { existsSync, mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  parseArgs,
  runInit,
  runUpgrade,
  runVerify,
  toRelative,
  type InitOptions,
} from "../src/index";

const cleanupTargets: string[] = [];

function rememberTmpDir() {
  const pathname = mkdtempSync(join(tmpdir(), "harness-cli-test-"));
  cleanupTargets.push(pathname);
  return pathname;
}

const baseOptions: InitOptions = {
  developerLanguage: "zh-CN",
  documentMode: "flat",
  debugMode: "off",
  dryRun: false,
  yes: true,
};

afterEach(async () => {
  const { rmSync } = await import("node:fs");
  process.exitCode = 0;
  while (cleanupTargets.length > 0) {
    rmSync(cleanupTargets.pop()!, { force: true, recursive: true });
  }
});

describe("parseArgs", () => {
  it("parses init with flags and target", () => {
    expect(
      parseArgs([
        "node",
        "cli",
        "init",
        "demo",
        "--dry-run",
        "--developer-language=en",
        "--document-mode=full",
        "--debug-mode=on",
        "--yes",
      ]),
    ).toEqual({
      command: "init",
      target: "demo",
      dryRun: true,
      yes: true,
      developerLanguage: "en",
      documentMode: "full",
      debugMode: "on",
    });
  });

  it("defaults target and options", () => {
    expect(parseArgs(["node", "cli", "init"])).toEqual({
      command: "init",
      target: ".",
      dryRun: false,
      yes: false,
      developerLanguage: "zh-CN",
      documentMode: "flat",
      debugMode: "off",
    });
  });

  it("keeps upgrade target parsing compatible with positional targets", () => {
    expect(
      parseArgs(["node", "cli", "upgrade", "superpowers", "demo", "--dry-run", "--yes"]),
    ).toEqual({
      command: "upgrade",
      target: "superpowers",
      dryRun: true,
      yes: true,
      developerLanguage: "zh-CN",
      documentMode: "flat",
      debugMode: "off",
    });
  });
});

describe("toRelative", () => {
  it("trims target root prefix", () => {
    expect(toRelative("/tmp/demo", "/tmp/demo/documents/README.md")).toBe("documents/README.md");
  });
});

describe("runInit", () => {
  it("creates the flat project structure", async () => {
    const target = rememberTmpDir();

    await runInit(target, baseOptions);

    expect(existsSync(join(target, ".codex", "config.toml"))).toBe(true);
    expect(existsSync(join(target, ".harness", "project-policy.json"))).toBe(true);
    expect(existsSync(join(target, ".harness", "components.lock.json"))).toBe(true);
    expect(existsSync(join(target, ".harness", "runtime-contract.json"))).toBe(true);
    expect(existsSync(join(target, ".harness", "superpowers", "README.md"))).toBe(true);
    expect(existsSync(join(target, "AGENTS.md"))).toBe(true);
    expect(existsSync(join(target, "documents", "README.md"))).toBe(true);
    expect(existsSync(join(target, "skills", "harness-project-policy", "SKILL.md"))).toBe(true);
    expect(existsSync(join(target, "documents", "requirements"))).toBe(false);
    expect(existsSync(join(target, "documents", "codex-pir"))).toBe(false);

    const config = readFileSync(join(target, ".codex", "config.toml"), "utf8");
    expect(config).toContain("[profiles.plan]");
    expect(config).toContain("[profiles.dev]");
    expect(config).toContain("[profiles.review]");
    const runtimeContract = readFileSync(join(target, ".harness", "runtime-contract.json"), "utf8");
    expect(runtimeContract).toContain('"复述需求"');
    expect(runtimeContract).toContain('"Planner"');
  });

  it("creates the full document structure and debug logs", async () => {
    const target = rememberTmpDir();

    await runInit(target, {
      ...baseOptions,
      developerLanguage: "en",
      documentMode: "full",
      debugMode: "on",
    });

    expect(existsSync(join(target, "documents", "requirements", "README.md"))).toBe(true);
    expect(existsSync(join(target, "documents", "designs", "README.md"))).toBe(true);
    expect(existsSync(join(target, "documents", "deliveries", "README.md"))).toBe(true);
    expect(existsSync(join(target, "documents", "evolution", "README.md"))).toBe(true);
    expect(
      existsSync(join(target, "documents", "standards", "ai-collaboration", "README.md")),
    ).toBe(true);
    expect(existsSync(join(target, ".harness", "logs", "sessions"))).toBe(true);
    expect(existsSync(join(target, ".harness", "logs", "latest.json"))).toBe(true);

    const agents = readFileSync(join(target, "AGENTS.md"), "utf8");
    expect(agents).toContain("Developer language");
    expect(agents).toContain("debug_mode=on");
    const debugLog = readFileSync(join(target, ".harness", "logs", "latest.json"), "utf8");
    expect(debugLog).toContain("used_query_agent");
    expect(debugLog).toContain("execution_agent_boundaries");
  });

  it("backs up conflicting paths before replacement", async () => {
    const target = rememberTmpDir();

    await runInit(target, baseOptions);

    const { mkdirSync, writeFileSync, readdirSync } = await import("node:fs");
    writeFileSync(join(target, "AGENTS.md"), "CUSTOM_AGENT_RULE\n", "utf8");
    writeFileSync(join(target, ".harness", "runtime-contract.json"), '{"custom":true}\n', "utf8");
    mkdirSync(join(target, ".harness", "logs"), { recursive: true });
    writeFileSync(join(target, ".harness", "logs", "latest.json"), '{"custom":true}\n', "utf8");

    await runInit(target, { ...baseOptions, developerLanguage: "en", debugMode: "on" });

    const backups = readdirSync(join(target, ".harness-backup"));
    expect(backups.length).toBeGreaterThan(0);
    const backupRoot = join(target, ".harness-backup", backups[0]);
    expect(existsSync(join(backupRoot, "AGENTS.md"))).toBe(true);
    expect(existsSync(join(backupRoot, ".harness", "runtime-contract.json"))).toBe(true);
    expect(existsSync(join(backupRoot, ".harness", "logs", "latest.json"))).toBe(true);
  });
});

describe("runVerify", () => {
  it("passes on a valid initialized project", async () => {
    const target = rememberTmpDir();

    await runInit(target, {
      ...baseOptions,
      documentMode: "full",
      debugMode: "on",
    });

    runVerify(target);
    expect(process.exitCode ?? 0).toBe(0);
  });

  it("passes on a valid english full-mode project", async () => {
    const target = rememberTmpDir();

    await runInit(target, {
      ...baseOptions,
      developerLanguage: "en",
      documentMode: "full",
      debugMode: "on",
    });

    runVerify(target);
    expect(process.exitCode ?? 0).toBe(0);
  });

  it("fails when project policy has invalid enum values", async () => {
    const target = rememberTmpDir();

    await runInit(target, baseOptions);

    const { writeFileSync } = await import("node:fs");
    writeFileSync(
      join(target, ".harness", "project-policy.json"),
      JSON.stringify(
        {
          developer_language: "fr",
          document_mode: "nested",
          debug_mode: "verbose",
          superpowers_managed_path: ".harness/other",
        },
        null,
        2,
      ),
      "utf8",
    );

    runVerify(target);
    expect(process.exitCode).toBe(1);
  });

  it("fails when runtime contract structure no longer matches policy and mappings", async () => {
    const target = rememberTmpDir();

    await runInit(target, {
      ...baseOptions,
      documentMode: "full",
      debugMode: "on",
    });

    const { writeFileSync } = await import("node:fs");
    writeFileSync(
      join(target, ".harness", "runtime-contract.json"),
      JSON.stringify(
        {
          developer_language: "en",
          document_mode: "flat",
          debug_mode: "off",
          profiles: {
            plan: "Wrong",
          },
          commands: {
            复述需求: {
              pir_phase: "Implementer",
              profile: "dev",
              runtime_agents: ["main_agent"],
            },
          },
          runtime_agent_architecture: {
            main_agent: "orchestration_and_closeout",
          },
          managed_superpowers_path: ".harness/other",
        },
        null,
        2,
      ),
      "utf8",
    );

    runVerify(target);
    expect(process.exitCode).toBe(1);
  });

  it("fails when debug log schema is invalid", async () => {
    const target = rememberTmpDir();

    await runInit(target, {
      ...baseOptions,
      documentMode: "full",
      debugMode: "on",
    });

    const { writeFileSync } = await import("node:fs");
    writeFileSync(
      join(target, ".harness", "logs", "latest.json"),
      JSON.stringify(
        {
          debug_mode: "off",
          developer_language: "en",
          document_mode: "flat",
          current_phase: "Shipping",
          used_query_agent: "sometimes",
          used_execution_agents: -1,
          execution_agent_boundaries: {},
          phase_transitions: {},
          final_owner: "query_agent",
          runtime_agent_architecture: {
            main_agent: "orchestration_and_closeout",
          },
          execution_summary_requirements: ["current_phase"],
        },
        null,
        2,
      ),
      "utf8",
    );

    runVerify(target);
    expect(process.exitCode).toBe(1);
  });

  it("fails when full mode ai-collaboration rules are missing", async () => {
    const target = rememberTmpDir();

    await runInit(target, {
      ...baseOptions,
      documentMode: "full",
    });

    const { writeFileSync } = await import("node:fs");
    writeFileSync(
      join(target, "documents", "standards", "ai-collaboration", "README.md"),
      "# AI Collaboration\n",
      "utf8",
    );

    runVerify(target);
    expect(process.exitCode).toBe(1);
  });
});

describe("runUpgrade", () => {
  it("replaces managed superpowers and refreshes lock files", async () => {
    const target = rememberTmpDir();

    await runInit(target, {
      ...baseOptions,
      documentMode: "full",
      debugMode: "on",
    });

    const { writeFileSync } = await import("node:fs");
    writeFileSync(join(target, ".harness", "components.lock.json"), '{"broken":true}\n', "utf8");

    await runUpgrade(target, { dryRun: false, yes: true });

    const lock = readFileSync(join(target, ".harness", "components.lock.json"), "utf8");
    expect(lock).toContain('"managed_path": ".harness/superpowers"');
    expect(lock).toContain(defaultUpgradeVersionHint());
    expect(existsSync(join(target, ".harness-backup"))).toBe(true);
  });
});

function defaultUpgradeVersionHint() {
  return '"version": "5.0.7"';
}
