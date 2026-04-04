---
title: Codex PIR 初始化生成资产
type: guide
status: draft
owner: cole
scope: init 命令第一版应写入的项目文件与目录
applies_to: human, ai-agent
---

# Codex PIR 初始化生成资产

## 1. 文档定位

本文档用于说明 `harness-codex init` 第一版执行后，项目中应出现哪些关键文件与目录。

本文档重点回答的问题是：

- 初始化后至少会写入什么
- 每个文件承担什么职责
- 哪些内容属于产品写入
- 哪些内容后续由项目自行演进

---

## 2. 第一版最小写入清单

第一版 `init` 建议至少写入以下资产：

- `.codex/config.toml`
- `AGENTS.md`
- `documents/README.md`
- `documents/codex-pir/`
- `vendor/superpowers/skills/`

---

## 3. `.codex/config.toml`

作用：

- 建立项目级 Codex 配置入口
- 提供 `plan / dev / review` 最小运行骨架

第一版最小内容：

- 默认模型位
- 默认审批与沙箱策略
- `plan / dev / review` profiles
- 项目级注释说明

这部分属于：

**产品写入的运行配置骨架。**

---

## 4. `AGENTS.md`

作用：

- 建立项目级 AI 协作规则入口
- 提供执行闸门与文档规则说明

第一版最小内容：

- 先分析后实现
- `开始执行` 是执行闸门
- 文档是正式产物
- role / skill 使用约定
- 文档路由说明

这部分属于：

**产品写入的项目规则骨架。**

---

## 5. `documents/README.md`

作用：

- 建立文档治理入口
- 说明 requirement / design / delivery / evolution 的基本职责

第一版最小内容：

- 文档目录职责
- 文档是正式产物
- 文档服务于人和 AI
- 高价值信息应长期可追溯

这部分属于：

**产品写入的文档治理骨架。**

---

## 6. `documents/codex-pir/`

作用：

- 为项目提供 Codex 工程协作手册
- 提供 role / workflow / config / prompt / 安装接入说明

第一版建议至少包含：

- `README.md`
- `01-roles.md`
- `02-workflows.md`
- `03-configuration.md`
- `04-prompts.md`
- `05-official-mapping.md`
- `06-installation-and-project-integration.md`

这部分属于：

**产品写入的工作手册资产。**

---

## 7. `vendor/superpowers/skills/`

作用：

- 为项目提供精简版 bundled workflow skills
- 直接承接 `Planner / Implementer / Reviewer` 的默认 workflow 需求

第一版当前包含：

- `brainstorming`
- `writing-plans`
- `executing-plans`
- `systematic-debugging`
- `requesting-code-review`
- `receiving-code-review`

这部分属于：

**产品写入的 workflow 资产。**

---

## 8. 产品写入与项目演进的边界

### 8.1 产品写入

第一版初始化时，由产品写入的通常包括：

- 配置骨架
- 规则骨架
- 文档治理骨架
- Codex 协作手册
- bundled superpowers workflow assets

### 8.2 项目演进

初始化完成后，由项目自行演进的通常包括：

- 项目私有规则
- 项目私有文档
- 项目私有 prompt / skill 细化
- requirement / design / delivery / evolution 的正式产物

所以：

**产品负责搭骨架，项目负责在骨架上持续演进。**

---

## 9. 一句话总结

**第一版 `init` 的核心不是写很多文件，而是把配置入口、规则入口、文档入口、Codex 协作手册与 bundled superpowers workflow 稳定写进用户项目。**
