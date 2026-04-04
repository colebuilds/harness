# Harness

Harness 0.1 is a minimal Codex-first collaboration product.

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

- .codex/config.toml
- AGENTS.md
- documents/README.md
- documents/codex-pir/\*
- vendor/superpowers/skills/\*
