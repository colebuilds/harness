---
title: Harness 文档总览
type: design
status: draft
owner: cole
scope: Harness 0.1 的产品总览、文档导航与当前范围说明
applies_to: human, ai-agent
---

# Harness

## 1. 文档定位

本目录用于承载 `Harness 0.1` 的产品说明、架构说明、接入说明与 Codex 工作手册。

当前版本的目标不是定义完整长期平台，而是先完成一个：

- 可发布
- 可安装
- 可接入
- 可开始使用

的最小产品闭环。

---

## 2. 当前版本一句话定义

**Harness 0.1 是一个最小 Codex-first 协作产品，用文档规范、PIR、superpowers、主/子 agent 最小协作与基本口令，完成复杂需求的最小稳定执行闭环。**

---

## 3. 当前版本重点

当前 0.1 重点只包含：

- 文档规范
- PIR
- `superpowers` 接入
- 主 agent + 查询子 agent + 按需执行子 agent
- 基本口令
- 最小安装接入能力

当前 0.1 明确不包含：

- 生命周期内核
- task object model
- runtime control plane
- blocked / resume
- diagnostics 闭环
- 多宿主支持

---

## 4. 当前交互主线

0.1 当前建议的最小交互流为：

1. 用户输入需求
2. 用户触发 `复述需求`
3. 系统确认：
   - 目标理解
   - 当前边界
   - 关键约束
   - 待确认点
4. 系统进入 `Planner`，默认结合 `superpowers` 的分析与计划 workflow
5. 用户触发 `开始执行`
6. 系统自动展示执行前确认：
   - 目标
   - 边界
   - 计划
   - 风险 / 待确认点
7. 进入执行阶段
8. 输出代码与文档结果

当前正式口令只保留：

- `复述需求`
- `开始执行`

---

## 5. 当前文档索引

### 产品总纲

- [product-definition.md](./product-definition.md)
- [core-architecture.md](./core-architecture.md)
- [execution-model.md](./execution-model.md)
- [roles-and-agent-runtime.md](./roles-and-agent-runtime.md)
- [skill-integration-strategy.md](./skill-integration-strategy.md)
- [documentation-and-ai-governance.md](./documentation-and-ai-governance.md)
- [product-packaging-and-monorepo.md](./product-packaging-and-monorepo.md)
- [cli-and-bootstrap-design.md](./cli-and-bootstrap-design.md)

### 0.1 收敛文档

- [0.1-product-scope.md](./0.1-product-scope.md)
- [interaction-and-command-design.md](./interaction-and-command-design.md)
- [superpowers-integration.md](./superpowers-integration.md)
- [release-checklist.md](./release-checklist.md)
- [release-flow.md](./release-flow.md)
- [release-verification-template.md](./release-verification-template.md)
- [release-verification-example.md](./release-verification-example.md)
- [releases/README.md](./releases/README.md)

### Codex 工作手册

- [codex-pir/README.md](./codex-pir/README.md)
- [codex-pir/01-roles.md](./codex-pir/01-roles.md)
- [codex-pir/02-workflows.md](./codex-pir/02-workflows.md)
- [codex-pir/03-configuration.md](./codex-pir/03-configuration.md)
- [codex-pir/04-prompts.md](./codex-pir/04-prompts.md)
- [codex-pir/05-official-mapping.md](./codex-pir/05-official-mapping.md)
- [codex-pir/06-installation-and-project-integration.md](./codex-pir/06-installation-and-project-integration.md)
- [codex-pir/07-init-generated-assets.md](./codex-pir/07-init-generated-assets.md)

---

## 6. 当前阶段说明

当前仍处于：

- 产品范围收敛
- 文档收敛
- 0.1 CLI 与接入设计收敛

在这些内容稳定之前，不进入完整长期内核实现。
