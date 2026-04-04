---
title: Harness 0.1 CLI 与接入设计
type: design
status: draft
owner: cole
scope: Harness 0.1 的最小 CLI、初始化写入资产与接入原则
applies_to: human, ai-agent
---

# Harness 0.1 CLI 与接入设计

## 1. 文档定位

本文档用于定义 `Harness 0.1` 的最小 CLI 与项目接入设计。

0.1 当前最重要的不是做复杂命令面，而是先把最小产品闭环做出来。

---

## 2. 0.1 为什么需要 CLI

如果 0.1 仍然停留在：

- 手工复制配置
- 手工复制文档
- 手工拼接 `AGENTS.md`
- 手工接 skill

那么它仍然更像一套落地方法，而不是可发布产品。

因此，0.1 必须提供正式接入入口。

---

## 3. 0.1 最小命令面

0.1 只要求一个最关键命令：

```bash
harness-codex init
```

这个命令的目标是：

**把最小 Codex-first 协作骨架写进用户项目。**

---

## 4. `init` 的职责

`init` 至少要完成以下事情：

- 扫描项目目录
- 识别是否已有接入痕迹
- 写 `.codex/config.toml`
- 写 `AGENTS.md`
- 写 `documents/README.md`
- 写 `documents/codex-pir/`
- 建立最小 skill 入口说明
- 输出初始化结果摘要

---

## 5. `init` 的最小写入资产

0.1 第一版建议至少写入：

- `.codex/config.toml`
- `AGENTS.md`
- `documents/README.md`
- `documents/codex-pir/README.md`

建议一并写入：

- `documents/codex-pir/01-roles.md`
- `documents/codex-pir/02-workflows.md`
- `documents/codex-pir/03-configuration.md`
- `documents/codex-pir/04-prompts.md`
- `documents/codex-pir/05-official-mapping.md`
- `documents/codex-pir/06-installation-and-project-integration.md`
- `documents/codex-pir/07-init-generated-assets.md`

---

## 6. 0.1 用户输入原则

0.1 应尽量做到：

**用户侧零配置。**

也就是说：

- 默认不让用户先选语言
- 默认不让用户先选项目类型
- 默认不让用户先选框架类型

系统应优先：

- 自动扫描项目目录
- 自动识别项目特征
- 自动决定按最小骨架接入

只有在识别不准时，才给出最小确认。

---

## 7. 0.1 暂不做的 CLI 能力

以下能力当前不进入 0.1 最小实现：

- 重型 `doctor`
- 重型 `upgrade`
- 多宿主统一接入
- 复杂模板系统
- skill marketplace
- 复杂 merge engine

如果后续要加，也应在 0.1 闭环稳定之后再做。

---

## 8. 0.1 初始化成功标准

如果 `harness-codex init` 执行成功，项目应立即获得：

- 最小 Codex 配置入口
- 最小项目规则入口
- 最小文档治理入口
- 最小 Codex 工作手册入口
- 最小 workflow 与 skill 接入入口

此后用户应能立刻开始：

1. 输入需求
2. `复述需求`
3. 分析/规划
4. `开始执行`
5. 输出代码与文档结果

---

## 9. 一句话总结

**Harness 0.1 的 CLI 当前不是完整控制台，而是一个把最小协作骨架写进用户项目的正式接入入口。**
