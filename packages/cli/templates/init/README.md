# Init Templates

This directory contains the project bootstrap assets used by `harness-codex init`.

Active template roots:

- `base/`
- `agents/`
- `documents-flat/`
- `documents-full/`
- `harness/`
- `skills/`
- `vendor-superpowers-full/`

These are the only template roots consumed by the current CLI implementation in
[packages/cli/src/index.ts](/Users/vilin/Documents/ai-agent/harness/packages/cli/src/index.ts).

Legacy directories retained only for historical reference:

- `archive/codex-pir/`
- `archive/superpowers-partial/`

They are not written into initialized user projects and should not be treated as
current bootstrap outputs.
