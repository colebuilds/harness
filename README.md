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

## What It Writes

`harness-codex init` writes a minimal project collaboration skeleton:

- `.codex/config.toml`
- `AGENTS.md`
- `documents/README.md`
- `documents/codex-pir/*`
- `vendor/superpowers/skills/*`

## After Init

Inside the initialized project, the default interaction flow is:

1. `复述需求`
2. `开始执行`

Current focus:

- installable project bootstrap
- documentation rules
- PIR
- bundled superpowers skills
- main agent + query subagent + on-demand execution subagent
- minimal command flow

See `documents/` for the current product and architecture docs.

Regression and release entry points:

- `pnpm verify`
- `pnpm check:product`
- `pnpm release:check`
- `documents/release-checklist.md`
- `documents/release-flow.md`
- `.github/pull_request_template.md`

Current 0.1 init writes:

- `.codex/config.toml`
- `AGENTS.md`
- `documents/README.md`
- `documents/codex-pir/*`
- `vendor/superpowers/skills/*`
