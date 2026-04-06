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
- 采集最小初始化配置
- 写 `.codex/config.toml`
- 写 `.harness/project-policy.json`
- 写 `.harness/components.lock.json`
- 写 `AGENTS.md`
- 按 `flat/full` 写 `documents/README.md` 与文档目录
- 写项目级策略 skill
- 完整接入受管 `superpowers`
- 输出初始化结果摘要

---

## 5. `init` 的最小写入资产

0.1 第一版建议至少写入：

- `.codex/config.toml`
- `.harness/project-policy.json`
- `.harness/components.lock.json`
- `AGENTS.md`
- `documents/README.md`
- `skills/harness-project-policy/SKILL.md`
- `/.harness/superpowers/`

若 `document_mode=full`，建议一并写入：

- `documents/requirements/README.md`
- `documents/designs/README.md`
- `documents/deliveries/README.md`
- `documents/evolution/README.md`
- `documents/standards/ai-collaboration/README.md`

---

## 6. 0.1 用户输入原则

0.1 当前保留的最小初始化配置为：

- `developer_language`
- `document_mode`
- `debug_mode`

其余行为固定为：

- 完整受管接入 `superpowers`
- 启用 `复述需求`
- 启用 `开始执行`
- 有冲突时统一备份后再替换

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
- 项目级策略配置入口
- 最小项目规则入口
- 最小文档治理入口
- 最小项目策略 skill
- 完整受管 `superpowers` workflow 入口

此后用户应能立刻开始：

1. 输入需求
2. `复述需求`
3. 分析/规划
4. `开始执行`
5. 输出代码与文档结果

---

## 9. 一句话总结

**Harness 0.1 的 CLI 当前不是完整控制台，而是一个把最小协作骨架、项目策略和完整受管 `superpowers` 写进用户项目的正式接入入口。**
