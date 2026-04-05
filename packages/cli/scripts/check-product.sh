#!/usr/bin/env bash
set -euo pipefail

TARGET_DIR="${HARNESS_TEST_DIR:-/tmp/harness-test}"

pass() {
  printf '[PASS] %s\n' "$1"
}

fail() {
  printf '[FAIL] %s\n' "$1" >&2
  exit 1
}

assert_file() {
  local path="$1"
  [[ -f "$path" ]] || fail "missing file: $path"
  pass "file exists: $path"
}

assert_dir() {
  local path="$1"
  [[ -d "$path" ]] || fail "missing directory: $path"
  pass "directory exists: $path"
}

assert_not_exists() {
  local path="$1"
  [[ ! -e "$path" ]] || fail "unexpected path: $path"
  pass "path absent: $path"
}

assert_contains() {
  local path="$1"
  local text="$2"
  grep -Fq "$text" "$path" || fail "expected '$text' in $path"
  pass "content ok: $path contains '$text'"
}

assert_output_contains() {
  local output="$1"
  local text="$2"
  printf '%s' "$output" | grep -Fq "$text" || fail "expected output to contain: $text"
  pass "output contains: $text"
}

CLI_CMD="pnpm exec node dist/index.js"

echo "== 1. CLI availability =="
[[ -f dist/index.js ]] || fail "dist/index.js not built"
pass "dist/index.js found"

echo "== 2. Dry run =="
rm -rf "$TARGET_DIR"
mkdir -p "$TARGET_DIR"
DRY_RUN_OUTPUT="$($CLI_CMD init "$TARGET_DIR" --dry-run --developer-language=zh-CN --document-mode=full --debug-mode=on --yes)"
assert_output_contains "$DRY_RUN_OUTPUT" "Harness Codex initialization plan"
assert_output_contains "$DRY_RUN_OUTPUT" "Developer language: zh-CN"
assert_output_contains "$DRY_RUN_OUTPUT" "Document mode: full"
assert_output_contains "$DRY_RUN_OUTPUT" "Managed superpowers: .harness/superpowers"

echo "== 3. Real init =="
INIT_OUTPUT="$($CLI_CMD init "$TARGET_DIR" --developer-language=zh-CN --document-mode=full --debug-mode=on --yes)"
assert_output_contains "$INIT_OUTPUT" "Created or replaced:"
assert_output_contains "$INIT_OUTPUT" 'awaiting_restate'

assert_file "$TARGET_DIR/.codex/config.toml"
assert_file "$TARGET_DIR/.harness/project-policy.json"
assert_file "$TARGET_DIR/.harness/components.lock.json"
assert_file "$TARGET_DIR/.harness/runtime-contract.json"
assert_file "$TARGET_DIR/.harness/runtime-state.json"
assert_dir "$TARGET_DIR/.harness/superpowers"
assert_dir "$TARGET_DIR/.harness/logs/sessions"
assert_file "$TARGET_DIR/.harness/logs/latest.json"
assert_file "$TARGET_DIR/AGENTS.md"
assert_file "$TARGET_DIR/documents/README.md"
assert_file "$TARGET_DIR/documents/requirements/README.md"
assert_file "$TARGET_DIR/documents/designs/README.md"
assert_file "$TARGET_DIR/documents/deliveries/README.md"
assert_file "$TARGET_DIR/documents/evolution/README.md"
assert_file "$TARGET_DIR/documents/standards/ai-collaboration/README.md"
assert_file "$TARGET_DIR/skills/harness-project-policy/SKILL.md"

assert_not_exists "$TARGET_DIR/documents/codex-pir"
assert_not_exists "$TARGET_DIR/vendor/superpowers"

echo "== 4. Content validation =="
assert_contains "$TARGET_DIR/.codex/config.toml" '[profiles.plan]'
assert_contains "$TARGET_DIR/.codex/config.toml" '[profiles.dev]'
assert_contains "$TARGET_DIR/.codex/config.toml" '[profiles.review]'
assert_contains "$TARGET_DIR/.harness/project-policy.json" '"document_mode": "full"'
assert_contains "$TARGET_DIR/.harness/project-policy.json" '"debug_mode": "on"'
assert_contains "$TARGET_DIR/.harness/components.lock.json" '"managed_path": ".harness/superpowers"'
assert_contains "$TARGET_DIR/.harness/runtime-contract.json" '"复述需求"'
assert_contains "$TARGET_DIR/.harness/runtime-contract.json" '"Planner"'
assert_contains "$TARGET_DIR/.harness/runtime-contract.json" '"main_agent"'
assert_contains "$TARGET_DIR/.harness/runtime-contract.json" '"restate_gate"'
assert_contains "$TARGET_DIR/.harness/runtime-contract.json" '"protected_branches"'
assert_contains "$TARGET_DIR/.harness/runtime-state.json" '"task_state": "awaiting_restate"'
assert_contains "$TARGET_DIR/AGENTS.md" '复述需求'
assert_contains "$TARGET_DIR/AGENTS.md" '开始执行'
assert_contains "$TARGET_DIR/AGENTS.md" '.harness/superpowers'
assert_contains "$TARGET_DIR/AGENTS.md" '主 agent'
assert_contains "$TARGET_DIR/AGENTS.md" '不得进入规划产出和代码实现'
assert_contains "$TARGET_DIR/AGENTS.md" '不得修改代码、生成补丁、执行实现性命令'
assert_contains "$TARGET_DIR/AGENTS.md" '必须先检查当前 git 分支'
assert_contains "$TARGET_DIR/AGENTS.md" '默认不得直接实施代码修改'
assert_contains "$TARGET_DIR/.harness/logs/latest.json" 'used_query_agent'
assert_contains "$TARGET_DIR/.harness/logs/latest.json" 'execution_agent_boundaries'
assert_contains "$TARGET_DIR/.harness/logs/latest.json" 'gate_status'
assert_contains "$TARGET_DIR/skills/harness-project-policy/SKILL.md" 'runtime-state.json'
assert_contains "$TARGET_DIR/skills/harness-project-policy/SKILL.md" '只能输出需求复述'
assert_contains "$TARGET_DIR/skills/harness-project-policy/SKILL.md" '只能输出执行前确认摘要'
assert_contains "$TARGET_DIR/skills/harness-project-policy/SKILL.md" '必须先检查当前 git 分支'
assert_contains "$TARGET_DIR/skills/harness-project-policy/SKILL.md" '默认先切出工作分支'

echo "== 5. Verification =="
$CLI_CMD verify "$TARGET_DIR" >/dev/null
pass "verify passed"

echo "== 6. Backup check =="
printf 'CUSTOM_AGENT_RULE\n' > "$TARGET_DIR/AGENTS.md"
$CLI_CMD init "$TARGET_DIR" --developer-language=en --document-mode=flat --debug-mode=off --yes >/dev/null
BACKUP_DIR="$(find "$TARGET_DIR/.harness-backup" -mindepth 1 -maxdepth 1 | head -n 1)"
[[ -n "$BACKUP_DIR" ]] || fail "backup directory not created"
assert_file "$BACKUP_DIR/AGENTS.md"
assert_file "$BACKUP_DIR/.harness/runtime-state.json"

echo "== 7. Superpowers upgrade =="
printf '{"broken":true}\n' > "$TARGET_DIR/.harness/components.lock.json"
$CLI_CMD upgrade superpowers "$TARGET_DIR" --yes >/dev/null
assert_contains "$TARGET_DIR/.harness/components.lock.json" '"managed_path": ".harness/superpowers"'
assert_contains "$TARGET_DIR/.harness/runtime-contract.json" '"main_agent"'

echo "== DONE =="
echo "Automated checks passed."
