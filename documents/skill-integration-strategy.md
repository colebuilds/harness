---
title: Codex Harness Skill 接入策略
type: design
status: draft
owner: cole
scope: superpowers 与本地 skill workflow 接入
applies_to: human, ai-agent
---

# Codex Harness Skill 接入策略

## 1. 文档定位

本文档用于定义当前发行版中的 skill 接入策略，重点是明确：

- 为什么当前要接入 `superpowers`
- `superpowers` 在系统中的定位是什么
- skill workflow 如何映射到 `PIR`
- skill 如何和主/子 agent 运行时配合
- skill 在整体系统中应该放在哪一层
- 哪些 skill 能力属于宿主无关 workflow 概念
- 哪些 skill 能力当前属于 `adapter-codex` 的具体映射

本文档不展开：

- 具体 skill 正文
- 具体 prompt 模板
- 具体 plugin contract 字段
- 具体任务对象与 phase 细节

---

## 2. 当前 skill 层的目标

当前阶段，skill 层的目标不是重新发明一整套 workflow，而是：

**先把社区验证较成熟的 workflow 接入到 Codex-first 骨架中，作为阶段执行增强层。**

这一层的核心任务包括：

- 提升复杂需求拆解质量
- 提升分析、执行、review 的稳定性
- 减少单模型 Codex 行为漂移
- 提供高频场景下的可复用工作流

所以当前 skill 层的目标不是“越多越好”，而是：

**先接成熟 workflow，再做本地收敛。**

---

## 3. 为什么接入 superpowers

当前选择接入 `superpowers` 的主要原因有三点。

### 3.1 社区验证较充分

`superpowers` 在社区中反馈较好，其 skill 设计已经覆盖：

- brainstorming
- writing-plans
- executing-plans
- systematic-debugging
- code review
- subagent-driven-development

这意味着它比从零重造 workflow 更稳。

### 3.2 与当前 Codex-first 目标兼容

当前产品阶段不是多宿主平台，而是第一版 `adapter-codex`。

`superpowers` 更适合作为：

- workflow library
- skill enhancement layer

而不是要求系统先做一整套新的执行引擎。

### 3.3 与 PIR 可以自然映射

`superpowers` 的 skill 结构虽然不是角色系统，但它的 workflow 可以较自然映射到：

- `Planner`
- `Implementer`
- `Reviewer`

所以它非常适合作为 PIR 的 workflow layer。

---

## 4. superpowers 在系统中的定位

`superpowers` 在当前发行版中的定位必须明确收紧。

它不是：

- 产品内核
- 生命周期系统
- 运行时控制面
- 任务对象系统
- 主 agent / 子 agent 调度层

它更准确的定位是：

**阶段工作流增强层。**

更具体地说，它是：

- skill/workflow library
- role-to-skill mapping layer
- 当前 `adapter-codex` 的 workflow 增强层

所以：

- `PIR` 负责定义阶段角色语义
- `superpowers` 负责给这些阶段提供 workflow
- `Harness` 负责底层执行内核

---

## 5. skill 在系统中的层级位置

在整体架构中，skill 应位于：

**Codex 工作骨架层**

而不是：

- Harness 执行内核层
- 文档治理层

因为 skill 解决的是：

- 当前阶段如何执行
- 当前场景如何处理
- 当前角色如何组织工作流

它不负责：

- 正式任务对象建模
- 生命周期推进
- blocked / resume 协议
- 批次与执行单元承载

这些依然属于执行内核。

---

## 6. Skill 的分层

长期来看，skill 相关能力也应区分两层。

### 6.1 宿主无关 workflow 概念

这些属于长期可复用的 workflow 概念，例如：

- 分析型 workflow
- 计划型 workflow
- 执行型 workflow
- debug workflow
- review workflow
- 并行 agent workflow

这些描述的是：

**某一类阶段应该如何工作。**

它们不天然绑定 `Codex`。

### 6.2 宿主专属 skill 映射

这些属于当前 `adapter-codex` 的具体实现，例如：

- 哪个 Codex 角色命中哪个 workflow
- 哪个 profile 下优先使用哪个 skill
- skill 如何通过 `AGENTS.md` 与项目规则接入
- `superpowers` 以什么目录、什么方式接入当前项目

这些能力明确属于：

- 当前发行版
- 当前宿主适配层

---

## 7. superpowers 与 PIR 的映射关系

`superpowers` 虽然不是角色系统，但它的 skill workflow 可以映射到 `PIR`。

### 7.1 Planner 对应的 skills

主要包括：

- `brainstorming`
- `writing-plans`
- 复杂任务时的 `dispatching-parallel-agents`

这些 skills 的职责是：

- 澄清目标
- 梳理边界
- 输出计划
- 判断任务是否需要拆分
- 为复杂任务提供 orchestration workflow

所以它们属于：

**Planner 阶段的 workflow layer**

### 7.2 Implementer 对应的 skills

主要包括：

- `executing-plans`
- `test-driven-development`
- bug 场景的 `systematic-debugging`
- 长任务场景的 `subagent-driven-development`

这些 skills 的职责是：

- 按计划推进实现
- 在执行单元下稳定落地
- 在 bug 场景下先复现再修复
- 在复杂任务场景中协助子任务执行

所以它们属于：

**Implementer 阶段的 workflow layer**

### 7.3 Reviewer 对应的 skills

主要包括：

- `requesting-code-review`
- `receiving-code-review`
- 显式 agent 可参考 `code-reviewer`

这些 skills 的职责是：

- 识别问题
- 聚焦风险
- 检查边界遗漏
- 检查测试与验证缺口

所以它们属于：

**Reviewer 阶段的 workflow layer**

---

## 8. superpowers 与主/子 agent 运行时的关系

`superpowers` 并不直接等于主/子 agent 编排结构。

更准确地说：

- skill 决定当前阶段采用什么 workflow
- 主/子 agent 决定当前 workflow 如何被执行

例如：

### 8.1 Planner 阶段

- skill：`brainstorming` / `writing-plans`
- agent：主 agent + 查询子 agent

### 8.2 Implementer 阶段

- skill：`executing-plans` / `systematic-debugging`
- agent：主 agent + 执行子 agent + 辅助查询子 agent

### 8.3 Reviewer 阶段

- skill：`requesting-code-review` / `receiving-code-review`
- agent：主 agent + 查询子 agent

所以：

**skill 不替代 agent，skill 只是 agent 的工作流增强器。**

---

## 9. 为什么 skill 不能直接等于内核

如果把 skill 直接视为系统内核，会出现几个问题：

### 9.1 缺少正式任务承载

skill 能描述“怎么做”，但不能天然承载：

- Requirement
- Task
- Batch
- Work Item
- Execution Unit

### 9.2 缺少正式生命周期

skill 能描述工作流，但不能天然替代：

- `requirement-analysis`
- `planning`
- `execution`
- `verification`
- `submission`
- `closure`

### 9.3 缺少正式运行态与恢复协议

skill 能帮助执行，但不能天然承担：

- blocked / resume
- runtime state
- 批次推进
- diagnostics 升级闭环

因此：

- skill 负责阶段工作流
- 内核负责正式执行系统

---

## 10. 当前阶段接入原则

当前阶段，skill 接入应坚持以下原则：

### 10.1 先接成熟 workflow，不重造全家桶

优先吸收 `superpowers` 中已经成熟、验证较好的 workflow。

### 10.2 先服务 `adapter-codex`

当前所有 skill 接入都应优先围绕：

- Codex profiles
- PIR 阶段角色
- Codex 项目接入方式

来做，不要提前抽象成多宿主统一市场。

### 10.3 保持 skill 不越权到内核

skill 不应承担：

- 任务对象系统
- 生命周期控制
- runtime control plane
- blocked / resume 协议

### 10.4 为未来 `skills-kit` 保留抽象

虽然当前主要围绕 `adapter-codex`，但应逐步把：

- workflow 概念
- role-to-skill mapping
- glue 层

往未来 `skills-kit` 的长期结构上收敛。

---

## 11. 一句话总结

**当前 skill 层的正确定位，是作为 `adapter-codex` 的阶段工作流增强层：`PIR` 负责角色语义，`superpowers` 负责 workflow，`Harness` 负责正式执行内核。**
