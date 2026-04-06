---
title: Harness 发布流程
type: guide
status: draft
owner: cole
scope: Harness 0.1 的版本准备、发布前检查与 changeset 发布顺序
applies_to: human, ai-agent
---

# Harness 发布流程

## 1. 文档定位

本文档用于说明 `Harness 0.1` 当前的实际发布顺序。

它关注的是：

- 发布前自动化检查
- 人工验收
- changeset 准备
- version bump
- publish 顺序
- GitHub Actions 自动发版

它不替代：

- `documents/release-checklist.md`
- `documents/release-verification-template.md`
- CI 工作流

---

## 2. 当前发布前提

当前仓库已经具备以下发布基础：

- `changesets`
- 根脚本 `release:check`
- 产品回归脚本 `check:product`
- CI 工作流
- Release 工作流
- 发布前人工验收模板

根仓库相关命令位于：

- `pnpm release:check`
- `pnpm release:version`
- `pnpm release:publish`

GitHub Actions 入口位于：

- `.github/workflows/release.yml`

---

## 3. 建议发布顺序

当前推荐顺序如下：

1. 在功能 PR 中补对应的 changeset
2. 运行发布前自动化检查
3. 执行人工工作流验收
4. 归档人工验收记录
5. 合并到 `main`
6. 由 GitHub Actions 自动创建/更新版本 PR
7. 合并版本 PR 后，由 GitHub Actions 自动 publish

本地 `release:version` / `release:publish` 仍可作为应急兜底方式，但不再是首选。

---

## 4. 步骤说明

### 4.1 发布前自动化检查

在仓库根目录执行：

```bash
cd /Users/cola/Documents/gs/harness
pnpm release:check
```

这一步会执行：

- `pnpm verify`
- `HARNESS_TEST_DIR=/tmp/harness-test pnpm check:product`

通过标准：

- 命令整体通过
- 输出中无失败项

### 4.2 人工工作流验收

按照以下文档执行：

- `documents/release-checklist.md`
- `documents/release-verification-template.md`

建议将结果归档到：

- `documents/releases/`

### 4.3 版本变更

如果本次改动需要发布新版本，应先在功能分支添加 changeset：

```bash
cd /Users/cola/Documents/gs/harness
pnpm changeset
```

合并到 `main` 后，Release 工作流会调用：

```bash
pnpm release:version
```

这一步会调用：

```bash
changeset version
```

预期结果：

- 更新版本号
- 生成或更新与版本相关的发布元数据

### 4.4 GitHub Actions 自动发版

Release 工作流位于：

- `.github/workflows/release.yml`

触发方式：

- push 到 `main`
- 手动 `workflow_dispatch`

工作流行为：

- 先执行 `pnpm release:check`
- 如果 `main` 上存在未消费的 changeset，则创建或更新版本 PR
- 如果版本 PR 已合并且 npm 上尚未存在该版本，则自动执行 `pnpm release:publish`

仓库首次启用前需准备：

- 在 npm 包 `harness-codex` 的设置中配置 Trusted Publisher
- GitHub provider 指向 `colebuilds/harness`
- workflow 文件名必须精确填写 `release.yml`
- workflow 使用 GitHub-hosted runner
- Release workflow 需要 `id-token: write`

当前实现不再依赖仓库 Secret `NPM_TOKEN`。

Trusted Publisher 在 npm 后台中的关键字段：

- Organization or user: `colebuilds`
- Repository: `harness`
- Workflow filename: `release.yml`
- Environment: 留空

### 4.5 审查 version 结果

执行 `release:version` 之后，至少应检查：

- `package.json` 版本是否符合预期
- lockfile 是否有异常变化
- 发布相关文件是否完整
- 本次 version 变更是否需要补充说明

### 4.6 发布

确认版本信息无误后，在仓库根目录执行：

```bash
cd /Users/cola/Documents/gs/harness
pnpm release:publish
```

这一步会调用：

```bash
changeset publish
```

---

## 5. PR 合并与正式发布的边界

不是每个 PR 合并都需要立刻发布。

建议边界如下：

### 5.1 PR 合并前至少完成

- `pnpm release:check`
- 人工工作流验收
- 验收记录归档
- PR 模板填写完整

### 5.2 真正发布前额外完成

- changeset 已补齐
- npm 包已配置 Trusted Publisher
- 版本 PR 或 publish job 通过

---

## 6. 最小命令清单

### 仅做发布前验证

```bash
cd /Users/cola/Documents/gs/harness
pnpm release:check
```

### 本地兜底发布

```bash
cd /Users/cola/Documents/gs/harness
pnpm release:check
pnpm release:version
pnpm release:publish
```

### GitHub Actions 自动发布

```text
1. 功能 PR 中包含 changeset
2. 合并到 main
3. Release workflow 创建版本 PR
4. 合并版本 PR
5. Release workflow 自动 publish
```

---

## 7. 不通过时的处理

如果以下任一步失败：

- `pnpm release:check`
- 人工工作流验收
- `pnpm release:version`
- `pnpm release:publish`
- Release workflow

则不进入下一步。

应优先：

- 定位失败属于代码、脚本、配置还是发布流程问题
- 修复真实问题
- 重新执行前置步骤

---

## 8. 一句话总结

**当前 Harness 推荐使用 GitHub Actions 驱动的 changeset 发版；本地 `release:version` / `release:publish` 仅作为兜底。**
