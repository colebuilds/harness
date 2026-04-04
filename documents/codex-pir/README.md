---
title: Codex PIR 协作体系
type: guide
status: draft
owner: cole
scope: Codex 工程化协作总览
applies_to: human, ai-agent
---

# Codex PIR 协作体系

## 1. 文档定位

本文档用于定义一套适用于 Codex 的工程化协作体系。

这套体系的目标，不是堆积零散 prompt，也不是把所有能力都塞进一个万能 agent，而是将 Codex 的日常使用拆成稳定、可复用、可维护的协作结构。

本文档是总入口，负责说明：

- 为什么需要 PIR
- 三个核心角色分别是什么
- 三个核心 Profile 分别是什么
- 功能开发、Bug 修复、复杂任务分别如何流转
- `AGENTS.md`、`config.toml`、skills、prompts 分别承担什么职责
- 详细规则应去哪个文档查看

本目录主要回答：

**Codex 在工程项目中应该如何落地使用。**

与之对应的产品与总架构总纲位于：

- `documents/design/technical/codex-harness/README.md`

两者分工如下：

- `codex-harness/`
  - 回答产品是什么、系统怎么分层、复杂需求如何进入正式执行
- `codex-pir/`
  - 回答 Codex 的角色、配置、workflow、prompt、安装接入与工程落地方式

---

## 2. 设计目标

Codex PIR 协作体系主要解决以下问题：

- 需求分析、代码实现、代码审查混在一起，导致阶段边界不清
- 同一个 agent 在不同任务中行为漂移，输出不稳定
- Prompt 只存在于聊天记录中，难以复用和维护
- 技术规则、流程规则、配置规则缺少清晰分层
- 复杂任务缺少稳定的拆分、回退与验证机制
- Bug 修复与功能开发没有被区分对待

PIR 的目标不是让流程更重，而是让 Codex 在复杂任务中更稳定，在日常任务中更可控。

---

## 3. 为什么采用 PIR

PIR 指：

- `P` = `Planner`
- `I` = `Implementer`
- `R` = `Reviewer`

PIR 的核心思想是：

1. 先把问题想清楚
2. 再把代码做出来
3. 最后独立检查结果

这三个阶段在大多数工程任务中天然存在。PIR 的价值，在于把它们从“隐含行为”变成“显式阶段”。

采用 PIR 的原因包括：

- 防止分析阶段过早进入编码
- 防止实现阶段持续发散而不收敛
- 防止 review 阶段退化成继续开发
- 让 Prompt、Skill、Profile 都能围绕阶段稳定配置
- 让功能开发和 Bug 修复共享同一套角色体系，而不是不断增加新角色

---

## 4. 三个核心角色

### 4.1 Planner

`Planner` 负责理解需求、明确边界、识别风险、形成计划。

职责包括：

- 澄清目标、约束与非目标
- 判断是否属于复杂任务
- 输出分步骤计划
- 定义验证方式
- 在复杂任务中进入 orchestration mode，负责任务拆分与阶段编排

`Planner` 不负责直接改代码。

### 4.2 Implementer

`Implementer` 负责按计划实现代码修改，并完成必要验证。

职责包括：

- 按计划落地代码实现
- 控制修改边界
- 补充必要测试
- 运行最小必要验证

在 Bug 修复场景下，`Implementer` 会进入 debug mode，优先执行复现、证据收集、根因定位、修复验证等步骤。

### 4.3 Reviewer

`Reviewer` 负责独立审查实现结果，识别缺陷与风险。

职责包括：

- 检查实现是否符合计划
- 检查是否存在回归风险
- 检查边界条件和异常路径
- 检查测试是否缺失
- 输出审查结论

`Reviewer` 不负责扩展需求，也不应接管实现工作。

---

## 5. 三个核心 Profile

PIR 推荐至少定义三个 Profile，用于将不同阶段的运行配置分离。

### 5.1 `plan`

适用于 `Planner` 阶段。

建议特征：

- 只读优先
- 推理强度较高
- 可查资料
- 不进入代码修改

### 5.2 `dev`

适用于 `Implementer` 阶段。

建议特征：

- 允许在工作区内修改代码
- 正常推理强度
- 允许必要命令执行
- 以实现与验证为主

### 5.3 `review`

适用于 `Reviewer` 阶段。

建议特征：

- 只读
- 推理强度较高
- 不做代码修改
- 输出结构化审查结论

Profile 解决的是运行参数问题，不等于角色本身。

---

## 6. 三类典型任务流

### 6.1 功能开发

标准流程：

1. `Planner` 分析需求并形成计划
2. `Implementer` 按计划实现
3. `Reviewer` 审查结果

### 6.2 Bug 修复

标准流程：

1. `Planner` 明确问题、影响面、修复目标
2. `Implementer` 进入 debug mode，先复现和定位，再修复和验证
3. `Reviewer` 检查修复是否真正覆盖问题，是否引入副作用

Bug 修复场景不会新增第四角色，而是让 `Implementer` 切换到 debug 工作流。

### 6.3 复杂任务

标准流程：

1. `Planner` 判断任务是否需要拆分
2. 若需要，`Planner` 进入 orchestration mode，负责拆分、排序、并行判断和汇总策略
3. 形成明确执行边界后，再进入 `Implementer`
4. 最终由 `Reviewer` 统一审查

复杂任务不会新增独立 `orchestrator` 角色，而是视为 `Planner` 的特殊工作模式。

---

## 7. 配置、规则、Skill、Prompt 的关系

在 PIR 中，几类结构的职责必须分清：

### 7.1 `AGENTS.md`

用于定义项目级协作规则，例如：

- 修改边界
- 目录约定
- 验证要求
- 文档规则
- 项目私有 skills / prompts 的使用约定

### 7.2 `config.toml`

用于定义 Codex 的运行配置，例如：

- 默认模型
- 审批策略
- 沙箱模式
- MCP 配置
- Profiles

### 7.3 Skills

用于定义任务执行方式与工作流约束，例如：

- 分析如何做
- 实现如何做
- Debug 如何做
- Review 如何做

Skills 解决的是“怎么做”。

### 7.4 Prompts

用于定义角色在当前阶段的输出模板与思考结构，例如：

- Planner Prompt
- Implementer Prompt
- Reviewer Prompt
- Debug Prompt
- Orchestration Prompt

Prompts 解决的是“怎么说、怎么组织输出”。

---

## 8. 文档索引

本目录下其他文档分工如下：

- `01-roles.md`
  - 说明三个角色的职责、边界、切换规则与特殊模式
- `02-workflows.md`
  - 说明功能开发、Bug 修复、复杂任务的阶段流转
- `03-configuration.md`
  - 说明如何在 Codex 中通过 `AGENTS.md`、`config.toml`、Profiles、MCP 落地 PIR
- `04-prompts.md`
  - 说明三个角色及特殊模式对应的 Prompt 模板
- `05-official-mapping.md`
  - 说明哪些能力来自 Codex 官方，哪些属于 PIR 自定义方法论
- `06-installation-and-project-integration.md`
  - 说明当前 `adapter-codex` 发行版如何安装、初始化、校验与升级
- `07-init-generated-assets.md`
  - 说明 `init` 第一版会向项目写入哪些关键文件与目录

---

## 9. 最小使用原则

采用 PIR 时，建议默认遵守以下原则：

- 先分析，后实现
- 先计划，后编码
- 功能开发与 Bug 修复共用三角色体系
- 复杂任务通过 `Planner` 的 orchestration mode 处理，而不是增加常驻角色
- Prompt、Skill、Profile 不混用、不混名
- 配置问题放到 `config.toml`
- 项目规则放到 `AGENTS.md`
- 阶段职责放到角色定义
- 输出结构放到 Prompt 模板

---

## 10. 一句话总结

Codex PIR 协作体系的核心，不是增加更多角色，而是让 Codex 在不同阶段以不同职责稳定工作：

- `Planner` 负责想清楚
- `Implementer` 负责做出来
- `Reviewer` 负责查问题

复杂任务通过 `Planner` 的 orchestration mode 扩展，Bug 修复通过 `Implementer` 的 debug mode 扩展。
