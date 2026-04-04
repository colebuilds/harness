# Harness Codex Product Check

## Purpose

This document defines the long-term product regression flow for `harness-codex`.

It is not limited to unit tests in the CLI package. It validates whether the
product still works when initialized into a real target project directory.

## Scope

The automated script verifies:

- global command availability
- `init` behavior
- `--dry-run` behavior
- required output files
- required output content
- idempotency
- protection of existing files
- recovery of missing files
- relative target behavior
- current-directory target behavior
- nested target creation
- incremental initialization into a non-empty directory

The manual part verifies:

- `复述需求` works as the analysis gate
- `开始执行` works as the execution gate
- planner-style behavior
- debug-style behavior
- review-style behavior

## Files

- Script: `packages/cli/scripts/check-product.sh`
- This document: `packages/cli/docs/check-product.md`

## Default Target Directory

The default target directory is:

```bash
/Users/cola/Documents/gs/harness-test
```

You can override it with:

```bash
HARNESS_TEST_DIR=/your/path pnpm check:product
```

## How To Run

From the CLI package directory:

```bash
cd /Users/cola/Documents/gs/harness/packages/cli
pnpm check:product
```

Or run the script directly:

```bash
bash /Users/cola/Documents/gs/harness/packages/cli/scripts/check-product.sh
```

## Expected Pass Condition

The automated section passes when the script ends with:

```text
Automated checks passed.
```

The full product regression passes only when the manual workflow checks also pass.

## Manual Workflow Verification

After the script finishes:

1. Enter the target directory.
2. Start a Codex session in that directory.
3. Send the following prompt:

```text
复述需求：给这个项目新增一个最小登录页，只做页面骨架和路由接入，不接真实接口
```

Expected result:

- analysis comes first
- goal, scope, risks, and plan are clarified
- coding does not start immediately

4. Then send:

```text
开始执行
```

Expected result:

- implementation starts only after this gate

5. Verify planner/debug/review style behavior with these prompts:

```text
复述需求：先帮我梳理这个需求边界，再给我一个分步骤执行计划
```

```text
复述需求：某个页面出现回归 bug，请先复现、找根因，再给修复计划
```

```text
请对刚刚的实现做 review，重点找 bug、风险、遗漏测试
```

## Notes

- The script intentionally resets the target directory several times.
- Do not point `HARNESS_TEST_DIR` at any directory that contains valuable work.
- This check is designed as a product regression, not only a package unit test.
