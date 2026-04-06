---
title: Harness 发布检查清单
type: guide
status: draft
owner: cole
scope: PR 合并前、版本发布前、CI 通过后的最终检查入口
applies_to: human, ai-agent
---

# Harness 发布检查清单

## 1. 文档定位

本文档定义 `Harness 0.1` 在合并前与发布前的统一检查入口。

它不替代：

- 单元测试
- 产品回归脚本
- CI 工作流

它负责把这些检查收敛成一个最终可执行的放行清单。

人工验收记录模板位于：

- `documents/release-verification-template.md`

参考示例位于：

- `documents/release-verification-example.md`

实际归档目录位于：

- `documents/releases/`

---

## 2. 检查目标

发布前至少要确认以下问题：

- CLI 是否仍可构建和调用
- `init` 是否仍能生成正确骨架
- 产品回归是否通过
- 关键文档入口是否正确
- `复述需求 -> 开始执行` 工作流是否仍成立
- 当前版本是否引入未声明的范围变化

---

## 3. 自动化检查

### 3.1 包级验证

在仓库根目录执行：

```bash
cd /Users/cola/Documents/gs/harness
pnpm verify
```

通过标准：

- typecheck 通过
- test 通过
- build 通过
- publint 通过

### 3.2 产品回归

本地执行：

```bash
cd /Users/cola/Documents/gs/harness
pnpm check:product
```

如果要使用 CI 等价的临时目标目录：

```bash
cd /Users/cola/Documents/gs/harness
HARNESS_TEST_DIR=/tmp/harness-test pnpm check:product
```

通过标准：

- 脚本输出 `Automated checks passed.`

### 3.2.1 聚合入口

如果希望一次完成发布前自动化主链，可执行：

```bash
cd /Users/cola/Documents/gs/harness
pnpm release:check
```

它会顺序执行：

- `pnpm verify`
- `HARNESS_TEST_DIR=/tmp/harness-test pnpm check:product`

### 3.3 CI 结果

CI 工作流文件位于：

- `.github/workflows/ci.yml`
- `.github/workflows/release.yml`

通过标准：

- `verify` job 全部通过
- 如果本次涉及发版，Release workflow 的对应 run 成功

### 3.4 PR 信息完整性

如果通过 Pull Request 合并，PR 描述至少应包含：

- 自动化检查结果
- 人工工作流验收结果
- 人工验收记录路径
- 风险与后续项

建议使用：

- `.github/pull_request_template.md`

---

## 4. 人工工作流验收

自动化通过后，还需要至少做一轮最小人工验收。

### 4.1 进入测试目标目录

例如：

```bash
cd /Users/cola/Documents/gs/harness-test
```

### 4.2 验证分析闸门

在 Codex 会话中发送：

```text
复述需求：给这个项目新增一个最小登录页，只做页面骨架和路由接入，不接真实接口
```

通过标准：

- 先分析，不直接改代码
- 输出目标、边界、风险、计划

### 4.3 验证执行闸门

在同一会话中发送：

```text
开始执行
```

通过标准：

- 只有在这一步之后才进入执行阶段

### 4.4 验证三类典型工作流

Planner 场景：

```text
复述需求：先帮我梳理这个需求边界，再给我一个分步骤执行计划
```

Debug 场景：

```text
复述需求：某个页面出现回归 bug，请先复现、找根因，再给修复计划
```

Review 场景：

```text
请对刚刚的实现做 review，重点找 bug、风险、遗漏测试
```

通过标准：

- Planner 输出以边界和计划为主
- Debug 输出以复现、证据、根因为主
- Review 输出以 findings 和风险为主

---

## 5. 发布前清单

以下条目全部满足，才允许进入发布：

- [ ] `pnpm verify` 通过
- [ ] `pnpm check:product` 通过
- [ ] CI 通过
- [ ] 若走 GitHub 自动发版，`release.yml` workflow 已通过
- [ ] 人工工作流验收完成
- [ ] 已填写人工验收记录模板
- [ ] 人工验收记录已归档到 `documents/releases/`
- [ ] 当前版本范围与 `0.1-product-scope.md` 一致
- [ ] 文档入口仍可用
- [ ] 若修改了初始化骨架，已确认生成结果符合预期
- [ ] 若修改了命令面，README 与文档已同步
- [ ] 若走 GitHub 自动发版，仓库已配置 `NPM_TOKEN`

---

## 6. 不通过时的处理

如果任一检查失败：

- 不进入发布
- 明确失败点属于代码、脚本、文档还是产品行为
- 优先修复真实回归，不用临时绕过检查代替修复

---

## 7. 一句话标准

**只有当 CLI、初始化骨架、产品回归、文档入口和工作流行为同时成立时，Harness 才算可发布。**
