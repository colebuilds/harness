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
- `documents/guides/engineering/codex-pir/`

如果项目没有文档子目录，还建议建立最小文档入口，例如：

- `documents/requirements/README.md`
- `documents/designs/README.md`
- `documents/deliveries/README.md`
- `documents/evolution/README.md`

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

## 6. `documents/guides/engineering/codex-pir/`

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

## 7. 文档子目录占位

如果项目尚未具备更完整的文档体系，第一版还可建立以下最小占位：

- `documents/requirements/README.md`
- `documents/designs/README.md`
- `documents/deliveries/README.md`
- `documents/evolution/README.md`

这些文件的目标不是一开始塞满内容，而是：

- 先立住目录职责
- 先让用户知道文档该往哪放

---

## 8. skill 入口目录

第一版不一定需要自动安装完整 skill 集合，但建议至少建立入口约定，例如：

- `.agents/README.md`
- `.agents/skills/`

或项目约定的本地 skill 目录说明。

这部分的目标是：

- 建立 workflow 接入入口
- 为后续 skill 演进保留位置

---

## 9. 产品写入与项目演进的边界

### 9.1 产品写入

第一版初始化时，由产品写入的通常包括：

- 配置骨架
- 规则骨架
- 文档治理骨架
- Codex 协作手册
- skill 入口约定

### 9.2 项目演进

初始化完成后，由项目自行演进的通常包括：

- 项目私有规则
- 项目私有文档
- 项目私有 prompt / skill 细化
- requirement / design / delivery / evolution 的正式产物

所以：

**产品负责搭骨架，项目负责在骨架上持续演进。**

---

## 10. 一句话总结

**第一版 `init` 的核心不是写很多文件，而是把配置入口、规则入口、文档入口与 Codex 协作手册稳定写进用户项目。**
