# Harness

Harness 0.1 is a minimal Codex-first collaboration product.

## Install

Run directly from npm:

```bash
pnpm dlx harness-codex init /path/to/project
```

Preview the initialization plan without writing files:

```bash
pnpm dlx harness-codex init /path/to/project --dry-run
```

Verify an initialized project:

```bash
pnpm dlx harness-codex verify /path/to/project
```

Upgrade the managed superpowers mirror:

```bash
pnpm dlx harness-codex upgrade superpowers /path/to/project
```

## What It Writes

`harness-codex init` writes a minimal project collaboration skeleton:

- `.codex/config.toml`
- `.harness/project-policy.json`
- `.harness/components.lock.json`
- `.harness/runtime-contract.json`
- `AGENTS.md`
- `documents/README.md`
- `skills/harness-project-policy/SKILL.md`
- `.harness/superpowers/*`

When `document_mode=full`, init also writes:

- `documents/requirements/README.md`
- `documents/designs/README.md`
- `documents/deliveries/README.md`
- `documents/evolution/README.md`
- `documents/standards/ai-collaboration/README.md`

When `debug_mode=on`, init also writes:

- `.harness/logs/sessions/`
- `.harness/logs/latest.json`

## After Init

Inside the initialized project, the default interaction flow is:

1. `复述需求`
2. `开始执行`

Current init configuration prompts for:

- developer language
- document mode
- debug mode

Current focus:

- installable project bootstrap
- configuration layering
- PIR profiles
- managed superpowers integration
- main agent + query agent + on-demand execution agents
- minimal command flow with verification

## What `verify` Checks

`harness-codex verify` currently checks:

- PIR profiles in `.codex/config.toml`
- enum and path validity in `.harness/project-policy.json`
- source/version/path structure in `.harness/components.lock.json`
- command, PIR, profile, and runtime-agent mappings in `.harness/runtime-contract.json`
- required rules in `AGENTS.md`
- document routing rules in `documents/README.md`
- `full` mode collaboration rules in `documents/standards/ai-collaboration/README.md`
- `skills/harness-project-policy/SKILL.md`
- debug summary schema in `.harness/logs/latest.json` when `debug_mode=on`

See `documents/` for the current product and architecture docs.

Regression and release entry points:

- `pnpm verify`
- `pnpm check:product`
- `pnpm release:check`
- `.github/workflows/release.yml`
- `documents/release-checklist.md`
- `documents/release-flow.md`
- `.github/pull_request_template.md`

Current 0.1 init writes:

- `.codex/config.toml`
- `.harness/project-policy.json`
- `.harness/components.lock.json`
- `.harness/runtime-contract.json`
- `AGENTS.md`
- `documents/README.md`
- `skills/harness-project-policy/SKILL.md`
- `.harness/superpowers/*`
