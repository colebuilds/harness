---
title: Codex PIR 与官方能力映射
type: guide
status: draft
owner: cole
scope: 官方 Codex 能力与 PIR 自定义方法论的边界说明
applies_to: human, ai-agent
---

# Codex PIR 与官方能力映射

## 1. 文档定位

本文档用于说明 Codex PIR 协作体系与 Codex 官方能力之间的关系。

本文档重点回答的问题是：

- 哪些能力属于 Codex 官方提供
- 哪些概念属于 PIR 自定义抽象
- 哪些文件结构是官方默认
- 哪些文件结构是项目私有约定
- 在讨论 `AGENTS.md`、Profiles、Skills、Prompts、MCP 时，哪些说法应视为官方，哪些应视为项目方法论

本文档的目的不是重复官方文档，而是避免将官方能力与项目私有体系混为一谈。

---

## 2. 官方 CLI 能力

Codex 官方提供 CLI 能力，包括但不限于：

- 启动交互式会话
- 非交互式执行
- code review 模式
- MCP 管理
- 配置覆盖
- Profile 选择
- 沙箱模式选择
- 审批策略选择
- 搜索能力启用

这些能力属于 Codex 官方能力，不属于 PIR 自定义方法论。

PIR 对 CLI 的使用方式只是推荐约定，例如：

- 规划阶段优先使用 `plan` profile
- 实现阶段优先使用 `dev` profile
- 审查阶段优先使用 `review` profile

这些“如何使用”的规则属于 PIR，而不是 Codex CLI 官方行为。

---

## 3. 官方 Config 能力

Codex 官方提供 `config.toml` 配置能力，包括但不限于：

- 默认模型
- 审批策略
- 沙箱模式
- 搜索能力
- Profiles
- MCP 配置
- 项目级与用户级配置
- 可信项目配置

这些配置能力本身属于官方能力。

但以下内容不属于官方默认配置概念，而属于 PIR 的工程化约定：

- `plan / dev / review` 这三个 Profile 的语义定义
- 三阶段角色和 Profile 的绑定方式
- 如何用配置服务于 PIR 流程

也就是说：

- `Profiles` 是官方能力
- `plan / dev / review` 这套语义用法是 PIR 的自定义约定

---

## 4. 官方 AGENTS.md 能力

`AGENTS.md` 是 Codex 官方明确支持的项目级说明机制。

官方层面，`AGENTS.md` 的作用是：

- 向 agent 提供项目级指令
- 定义目录作用域
- 提供规则、约定、提示和工作方式说明

这些属于官方能力。

但 PIR 对 `AGENTS.md` 的使用方式属于自定义约定，例如：

- 在 `AGENTS.md` 中约定三阶段角色切换
- 在 `AGENTS.md` 中约定项目私有 skill 目录
- 在 `AGENTS.md` 中约定 prompts 的触发方式
- 在 `AGENTS.md` 中约定 complex task 的 orchestration 规则

也就是说：

- `AGENTS.md` 本身是官方能力
- 用 `AGENTS.md` 承载 PIR 方法论是项目自定义扩展

---

## 5. 官方 Prompting 能力

Codex 官方提供 Prompting 指南，用于说明：

- 如何描述任务
- 如何约束输出
- 如何提供上下文
- 如何提高任务成功率

这些属于官方能力。

但 PIR 中的以下内容属于自定义扩展：

- `Planner Prompt`
- `Implementer Prompt`
- `Reviewer Prompt`
- `Implementer Debug Prompt`
- `Planner Orchestration Prompt`

这些不是 Codex 官方内置 Prompt，也不是官方内置角色。  
它们是基于 Codex 官方 Prompting 能力之上，构建出的项目级模板体系。

---

## 6. 官方 MCP 能力

Codex 官方提供 MCP 接入能力，包括：

- 添加 MCP Server
- 配置 MCP Server
- 管理 MCP 启用状态
- 对工具设置审批模式

这些属于官方能力。

但以下内容属于项目自定义选择，而不是官方默认：

- 使用哪些 MCP
- 某个项目保留哪些 MCP
- 将浏览器类 MCP 作为前端项目高优先级能力
- 将某个 MCP 与某个工作流阶段绑定使用

例如：

- “前端项目优先保留浏览器验证能力”
- “Review 阶段主要使用只读工具”
- “Dev 阶段可用页面验证工具”

这些是 PIR 的工程化使用约定，不是 Codex 官方强制设计。

---

## 7. 官方 Skills 与项目私有 Skills

这里最容易混淆，需要单独说明。

### 7.1 官方默认 Skills

Codex 官方默认可识别的全局 Skills 目录通常是：

- `~/.codex/skills/*/SKILL.md`

这属于官方默认能力的一部分。

### 7.2 项目私有 Skills

以下路径如果出现在项目中，例如：

- `skills/*/SKILL.md`
- `.repo-local-skills/*/SKILL.md`
- `.agents/skills/*/SKILL.md`

它们通常不属于 Codex 官方默认自动发现目录。

这些目录是否生效、何时读取，通常属于项目私有约定，需要通过：

- `AGENTS.md`
- 项目文档
- 开发者上下文

来显式说明。

也就是说：

- `~/.codex/skills` 属于官方默认 Skill 机制
- 项目内 `skills/*` 或 `.agents/skills/*` 属于项目私有扩展

---

## 8. PIR 自定义扩展

以下概念属于 PIR 自定义方法论，而不是 Codex 官方内置概念：

- `Planner`
- `Implementer`
- `Reviewer`
- `Planner` 的 orchestration mode
- `Implementer` 的 debug mode
- 功能开发、Bug 修复、复杂任务三种标准工作流
- `plan / dev / review` 作为三阶段 Profile 的推荐语义
- 角色、Skill、Prompt、Profile 四层分工模型

这些概念的价值在于：

- 将官方基础能力组织成可复用工程方法
- 让 Codex 的行为更稳定
- 让角色、流程、配置、提示词不再混在一起

但在表述时必须注意：

- 不应把这些概念说成 Codex 官方内置角色
- 不应把这些约定说成官方默认行为
- 不应把项目目录约定说成官方默认目录

---

## 9. 不应混淆的概念

### 9.1 Profile 不是角色

官方支持 Profile。  
但 `plan / dev / review` 只是 PIR 推荐的运行模式，不是 Codex 官方角色系统。

### 9.2 Skill 不是角色

官方支持全局 Skills。  
但一个 Skill 不等于一个角色。  
Skill 定义工作流，角色定义职责。

### 9.3 项目私有目录不是官方默认目录

项目里出现的：

- `skills/`
- `.agents/skills/`
- `.repo-local-skills/`
- `prompts/`

都不应默认当作 Codex 官方自动发现目录来理解。

### 9.4 Prompt 模板不是官方内置命令

PIR 中设计的各类 Prompt 模板，只是项目级模板，不是 Codex CLI 原生命令或内置模式。

### 9.5 Orchestration 和 Debug 是模式，不是必然新增角色

在 PIR 中：

- orchestration mode 属于 `Planner`
- debug mode 属于 `Implementer`

这是一种设计选择，不是 Codex 官方内建的分类。

---

## 10. 推荐查阅顺序

建议按以下顺序理解 Codex 与 PIR 的关系：

1. 先阅读 Codex 官方 CLI / Config / Prompting / AGENTS.md 文档
2. 再阅读 PIR 的 `README.md`
3. 再阅读 `01-roles.md`
4. 再阅读 `02-workflows.md`
5. 最后阅读 `03-configuration.md` 与 `04-prompts.md`

这样能先建立“官方能力边界”，再理解“项目方法论扩展”。

---

## 11. 一句话总结

PIR 不是 Codex 官方内置角色系统，而是一套基于官方能力搭建出来的工程化协作方法：

- 官方提供 CLI、Config、AGENTS.md、MCP、Prompting、Skills
- PIR 在这些基础上抽象出 `Planner / Implementer / Reviewer`
- PIR 再通过 orchestration mode 和 debug mode 处理复杂任务与 Bug 修复
- 项目私有 Skills、Prompts、目录结构都必须被明确标记为“项目约定”，不能误说成官方默认行为
