import { describe, expect, it } from "vitest";
import { parseArgs, toRelative } from "../src/index";

describe("parseArgs", () => {
  it("parses init with dry run and target", () => {
    expect(parseArgs(["node", "cli", "init", "demo", "--dry-run"])).toEqual({
      command: "init",
      target: "demo",
      dryRun: true,
    });
  });

  it("defaults target to current directory", () => {
    expect(parseArgs(["node", "cli", "init"])).toEqual({
      command: "init",
      target: ".",
      dryRun: false,
    });
  });
});

describe("toRelative", () => {
  it("trims target root prefix", () => {
    expect(toRelative("/tmp/demo", "/tmp/demo/documents/README.md")).toBe("documents/README.md");
  });
});
