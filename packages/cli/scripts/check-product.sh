#!/usr/bin/env bash
set -euo pipefail

TARGET_DIR="${HARNESS_TEST_DIR:-/Users/cola/Documents/gs/harness-test}"
TARGET_PARENT="$(dirname "$TARGET_DIR")"
TARGET_NAME="$(basename "$TARGET_DIR")"
TMP_NESTED="$TARGET_PARENT/harness-product-nested/a/b/c"

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

assert_not_exists_any_children() {
  local path="$1"
  if find "$path" -mindepth 1 | grep -q .; then
    fail "expected empty directory: $path"
  fi
  pass "directory empty: $path"
}

echo "== 1. CLI availability =="

which harness-codex >/dev/null 2>&1 || fail "harness-codex not found in PATH"
pass "harness-codex found in PATH"

USAGE_OUTPUT="$(harness-codex 2>&1 || true)"
assert_output_contains "$USAGE_OUTPUT" "Usage: harness-codex init [target] [--dry-run]"

DOCTOR_OUTPUT="$(harness-codex doctor 2>&1 || true)"
assert_output_contains "$DOCTOR_OUTPUT" "Usage: harness-codex init [target] [--dry-run]"

UPGRADE_OUTPUT="$(harness-codex upgrade 2>&1 || true)"
assert_output_contains "$UPGRADE_OUTPUT" "Usage: harness-codex init [target] [--dry-run]"

echo "== 2. Prepare empty target =="

rm -rf "$TARGET_DIR"
mkdir -p "$TARGET_DIR"
assert_not_exists_any_children "$TARGET_DIR"

echo "== 3. Dry run =="

DRY_RUN_OUTPUT="$(harness-codex init "$TARGET_DIR" --dry-run)"
assert_output_contains "$DRY_RUN_OUTPUT" "Harness Codex initialization plan"
assert_output_contains "$DRY_RUN_OUTPUT" "Will create:"
assert_output_contains "$DRY_RUN_OUTPUT" ".codex/config.toml"
assert_output_contains "$DRY_RUN_OUTPUT" "AGENTS.md"
assert_output_contains "$DRY_RUN_OUTPUT" "documents/codex-pir/01-roles.md"
assert_output_contains "$DRY_RUN_OUTPUT" "vendor/superpowers/skills/brainstorming/SKILL.md"
assert_output_contains "$DRY_RUN_OUTPUT" "Current default workflow:"
assert_output_contains "$DRY_RUN_OUTPUT" "Suggested superpowers skills:"
assert_not_exists_any_children "$TARGET_DIR"

echo "== 4. Real init =="

INIT_OUTPUT="$(harness-codex init "$TARGET_DIR")"
assert_output_contains "$INIT_OUTPUT" "Codex Harness initialized for this project."
assert_output_contains "$INIT_OUTPUT" "Created:"

assert_file "$TARGET_DIR/.codex/config.toml"
assert_file "$TARGET_DIR/AGENTS.md"
assert_file "$TARGET_DIR/documents/README.md"
assert_file "$TARGET_DIR/documents/codex-pir/README.md"
assert_file "$TARGET_DIR/documents/codex-pir/01-roles.md"
assert_file "$TARGET_DIR/documents/codex-pir/02-workflows.md"
assert_file "$TARGET_DIR/documents/codex-pir/03-configuration.md"
assert_file "$TARGET_DIR/documents/codex-pir/04-prompts.md"
assert_file "$TARGET_DIR/documents/codex-pir/05-official-mapping.md"
assert_file "$TARGET_DIR/documents/codex-pir/06-installation-and-project-integration.md"
assert_file "$TARGET_DIR/documents/codex-pir/07-init-generated-assets.md"

assert_dir "$TARGET_DIR/vendor/superpowers/skills/brainstorming"
assert_dir "$TARGET_DIR/vendor/superpowers/skills/writing-plans"
assert_dir "$TARGET_DIR/vendor/superpowers/skills/executing-plans"
assert_dir "$TARGET_DIR/vendor/superpowers/skills/systematic-debugging"
assert_dir "$TARGET_DIR/vendor/superpowers/skills/requesting-code-review"
assert_dir "$TARGET_DIR/vendor/superpowers/skills/receiving-code-review"

echo "== 5. Content validation =="

assert_contains "$TARGET_DIR/.codex/config.toml" 'model = "gpt-5-codex"'
assert_contains "$TARGET_DIR/.codex/config.toml" 'model_reasoning_effort = "high"'
assert_contains "$TARGET_DIR/.codex/config.toml" 'approval_policy = "on-request"'
assert_contains "$TARGET_DIR/.codex/config.toml" 'sandbox_mode = "workspace-write"'

assert_contains "$TARGET_DIR/AGENTS.md" '复述需求'
assert_contains "$TARGET_DIR/AGENTS.md" '开始执行'
assert_contains "$TARGET_DIR/AGENTS.md" 'documents/codex-pir/'
assert_contains "$TARGET_DIR/AGENTS.md" 'superpowers'

assert_contains "$TARGET_DIR/documents/README.md" '文档是正式产物'
assert_contains "$TARGET_DIR/documents/README.md" 'documents/codex-pir/'

assert_contains "$TARGET_DIR/documents/codex-pir/02-workflows.md" 'Planner'
assert_contains "$TARGET_DIR/documents/codex-pir/02-workflows.md" 'Implementer'
assert_contains "$TARGET_DIR/documents/codex-pir/02-workflows.md" 'Reviewer'

echo "== 6. Idempotency =="

SECOND_INIT_OUTPUT="$(harness-codex init "$TARGET_DIR")"
assert_output_contains "$SECOND_INIT_OUTPUT" "Skipped existing:"

SECOND_DRY_OUTPUT="$(harness-codex init "$TARGET_DIR" --dry-run)"
assert_output_contains "$SECOND_DRY_OUTPUT" "Will keep existing:"

echo "== 7. Existing file protection =="

printf '\nCUSTOM_AGENT_RULE\n' >> "$TARGET_DIR/AGENTS.md"
harness-codex init "$TARGET_DIR" >/dev/null
assert_contains "$TARGET_DIR/AGENTS.md" 'CUSTOM_AGENT_RULE'

printf '\nCUSTOM_DOC_MARKER\n' >> "$TARGET_DIR/documents/README.md"
harness-codex init "$TARGET_DIR" >/dev/null
assert_contains "$TARGET_DIR/documents/README.md" 'CUSTOM_DOC_MARKER'

echo "== 8. Missing file recovery =="

rm "$TARGET_DIR/documents/codex-pir/04-prompts.md"
harness-codex init "$TARGET_DIR" >/dev/null
assert_file "$TARGET_DIR/documents/codex-pir/04-prompts.md"

rm "$TARGET_DIR/vendor/superpowers/skills/writing-plans/SKILL.md"
harness-codex init "$TARGET_DIR" >/dev/null
assert_file "$TARGET_DIR/vendor/superpowers/skills/writing-plans/SKILL.md"

rm -rf "$TARGET_DIR/vendor/superpowers/skills/systematic-debugging"
harness-codex init "$TARGET_DIR" >/dev/null
assert_dir "$TARGET_DIR/vendor/superpowers/skills/systematic-debugging"

echo "== 9. Relative target init =="

rm -rf "$TARGET_DIR"
mkdir -p "$TARGET_DIR"
(
  cd "$TARGET_PARENT"
  harness-codex init "$TARGET_NAME" >/dev/null
)
assert_file "$TARGET_DIR/AGENTS.md"

echo "== 10. Default current-directory init =="

rm -rf "$TARGET_DIR"
mkdir -p "$TARGET_DIR"
(
  cd "$TARGET_DIR"
  harness-codex init >/dev/null
)
assert_file "$TARGET_DIR/AGENTS.md"

echo "== 11. Dry-run with flag before target =="

rm -rf "$TARGET_DIR"
mkdir -p "$TARGET_DIR"
FLAG_FIRST_OUTPUT="$(harness-codex init --dry-run "$TARGET_DIR")"
assert_output_contains "$FLAG_FIRST_OUTPUT" "Harness Codex initialization plan"
assert_not_exists_any_children "$TARGET_DIR"

echo "== 12. Auto-create nested target =="

rm -rf "$(dirname "$(dirname "$(dirname "$TMP_NESTED")")")"
harness-codex init "$TMP_NESTED" >/dev/null
assert_file "$TMP_NESTED/AGENTS.md"
assert_file "$TMP_NESTED/.codex/config.toml"

echo "== 13. Non-empty directory incremental init =="

rm -rf "$TARGET_DIR"
mkdir -p "$TARGET_DIR/documents"
printf 'hello\n' > "$TARGET_DIR/documents/custom.md"
harness-codex init "$TARGET_DIR" >/dev/null
assert_file "$TARGET_DIR/documents/custom.md"
assert_contains "$TARGET_DIR/documents/custom.md" 'hello'
assert_file "$TARGET_DIR/AGENTS.md"

echo "== 14. Manual product workflow verification =="
cat <<'EOF'
Manual checks still required inside the target directory:

1. cd "$HARNESS_TEST_DIR" or cd /Users/cola/Documents/gs/harness-test
2. Start a Codex session in this directory
3. Send:
   复述需求：给这个项目新增一个最小登录页，只做页面骨架和路由接入，不接真实接口
4. Expected:
   - analyze first
   - clarify goal, scope, risks, and plan
   - do not start coding immediately
5. Then send:
   开始执行
6. Expected:
   - only now enter implementation phase
7. Also verify planner/debug/review style prompts:
   - 复述需求：先帮我梳理这个需求边界，再给我一个分步骤执行计划
   - 复述需求：某个页面出现回归 bug，请先复现、找根因，再给修复计划
   - 请对刚刚的实现做 review，重点找 bug、风险、遗漏测试
EOF

echo "== DONE =="
echo "Automated checks passed."
