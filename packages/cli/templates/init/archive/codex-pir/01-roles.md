---
title: Codex PIR 角色定义
type: guide
status: draft
owner: cole
scope: Planner / Implementer / Reviewer 角色边界
applies_to: human, ai-agent
---

# Codex PIR 角色定义

## 1. 文档定位

本文档用于定义 Codex PIR 协作体系中的三个核心角色：

- `Planner`
- `Implementer`
- `Reviewer`

本文档回答的问题是：

- 当前阶段由谁负责
- 当前角色应做什么
- 当前角色不应做什么
- 什么时候从一个角色切换到另一个角色
- 在复杂任务与 Bug 修复场景下，角色如何进入特殊模式

本文档不负责说明：

- 具体 Prompt 正文
- 完整工作流步骤
- `config.toml` 配置细节

这些内容分别由 `04-prompts.md`、`02-workflows.md`、`03-configuration.md` 负责。

---

## 2. 角色设计原则

PIR 只保留三个核心角色，目的是保持协作结构稳定，避免角色无限膨胀。

角色设计遵循以下原则：

### 2.1 角色服务于阶段

角色不是长期并行存在的固定团队分工，而是任务在不同阶段的主要职责形态。

标准阶段流转为：

1. `Planner`
2. `Implementer`
3. `Reviewer`

### 2.2 角色只解决职责问题

角色用于定义：

- 谁负责当前阶段
- 当前阶段该做什么
- 当前阶段不该做什么

角色不负责解决：

- 运行参数问题
- Prompt 模板问题
- 技能目录组织问题

这些分别由 Profile、Prompts、Skills 解决。

### 2.3 不为每种场景增加新角色

复杂任务不会新增 `Orchestrator` 作为常驻角色。  
Bug 修复不会新增 `Debugger` 作为常驻角色。

两者都通过现有角色的特殊模式处理：

- `Planner` 可进入 orchestration mode
- `Implementer` 可进入 debug mode

### 2.4 角色切换必须显式

当任务从分析进入实现，或从实现进入审查时，应明确完成角色切换，而不是让同一角色持续承担多个阶段职责。

---

## 3. Planner

## 3.1 Purpose

`Planner` 负责将模糊问题转化为清晰的执行计划。

它的核心任务不是产出代码，而是产出：

- 明确目标
- 清晰边界
- 风险判断
- 可执行步骤
- 验证方式

## 3.2 Responsibilities

`Planner` 负责：

- 理解需求与上下文
- 澄清目标、约束与非目标
- 判断任务是否属于复杂任务
- 识别影响范围与潜在风险
- 输出分步骤执行计划
- 定义完成标准与验证方式
- 在复杂任务中进入 orchestration mode，进行拆分和编排

## 3.3 Non-Responsibilities

`Planner` 不负责：

- 直接改代码
- 在没有形成计划前开始实现
- 用实现细节替代需求澄清
- 代替 `Reviewer` 做最终质量裁决

## 3.4 Inputs

`Planner` 的输入通常包括：

- 用户需求
- 当前代码上下文
- 项目规则
- 文档规范
- 已知限制条件
- 相关历史背景

## 3.5 Outputs

`Planner` 的输出通常包括：

- 目标
- 本次不包含
- 影响范围
- 风险与影响面
- 分步骤计划
- 验证方式
- 是否需要拆分任务
- 是否需要进入 orchestration mode

## 3.6 Entry Criteria

以下场景应进入 `Planner`：

- 新功能需求
- Bug 修复需求
- 重构需求
- 多模块改造
- 规则边界不清晰的任务
- 涉及文档、架构、迁移等需要先形成方案的任务

## 3.7 Exit Criteria

满足以下条件后，`Planner` 可退出并切到 `Implementer`：

- 目标已经清楚
- 本次不包含已经明确
- 实施边界已经明确
- 执行步骤已经具备可操作性
- 验证方式已经明确
- 若为复杂任务，拆分和阶段顺序已经说明

---

## 4. Implementer

## 4.1 Purpose

`Implementer` 负责按照已确认的计划进行实现，并完成必要验证。

它的核心任务是：

- 改代码
- 补测试
- 跑验证
- 控制改动边界

## 4.2 Responsibilities

`Implementer` 负责：

- 按计划落地修改
- 尽量将改动控制在任务边界内
- 补充必要测试或验证
- 运行最小必要检查
- 在发现计划不成立时及时回退到 `Planner`
- 在 Bug 修复场景下进入 debug mode

## 4.3 Non-Responsibilities

`Implementer` 不负责：

- 在没有明确计划时直接扩展需求
- 擅自改变任务目标
- 用“顺手重构”扩大改动范围
- 代替 `Reviewer` 做最终审查结论

## 4.4 Inputs

`Implementer` 的输入通常包括：

- 已确认计划
- 目标文件与模块范围
- 项目规则
- 验证要求
- Bug 场景下的复现条件和问题定义

## 4.5 Outputs

`Implementer` 的输出通常包括：

- 实际代码改动
- 新增或更新的测试
- 验证结果
- 若计划失效时的回退说明
- 对后续 review 有帮助的上下文说明

## 4.6 Entry Criteria

以下场景应进入 `Implementer`：

- `Planner` 已完成计划
- 修改边界已清楚
- 已具备实施前提
- 当前任务进入代码落地阶段

## 4.7 Exit Criteria

满足以下条件后，`Implementer` 可退出并切到 `Reviewer`：

- 计划内实现已完成
- 必要验证已执行
- 未发现必须立即回退 `Planner` 的新问题
- 输出已具备可审查性

---

## 5. Reviewer

## 5.1 Purpose

`Reviewer` 负责独立审查实现结果是否正确、完整、可交付。

它的核心任务是识别：

- 缺陷
- 回归风险
- 边界遗漏
- 测试缺口
- 与计划不一致之处

## 5.2 Responsibilities

`Reviewer` 负责：

- 检查实现是否符合既定计划
- 检查是否存在明显 bug 或回归
- 检查边界条件与异常路径
- 检查测试与验证是否不足
- 给出结构化 review 结论

## 5.3 Non-Responsibilities

`Reviewer` 不负责：

- 擅自扩展实现范围
- 将 review 退化成继续开发
- 代替 `Planner` 重新定义需求
- 在没有证据的情况下做主观判断

## 5.4 Inputs

`Reviewer` 的输入通常包括：

- 已实现代码
- 原始计划
- 验证结果
- 差异上下文
- 相关测试与运行结果

## 5.5 Outputs

`Reviewer` 的输出通常包括：

- Findings
- 风险等级
- 缺失项
- 开放问题
- 是否建议回退到 `Implementer`
- 是否可以结束任务

## 5.6 Entry Criteria

以下场景应进入 `Reviewer`：

- 代码修改已完成
- 基本验证已执行
- 当前产出可供独立审查

## 5.7 Exit Criteria

满足以下条件后，`Reviewer` 可退出：

- 关键风险已指出
- 明显缺陷已记录
- 是否通过审查已有明确结论
- 若存在问题，已经明确回退方向

---

## 6. 角色切换规则

标准切换顺序如下：

1. `Planner`
2. `Implementer`
3. `Reviewer`

切换规则如下：

### 6.1 `Planner -> Implementer`

仅当计划已足够明确、可执行时允许切换。

若仍存在以下问题，不应切换：

- 目标模糊
- 边界未清
- 验证方式不明确
- 风险未被识别
- 关键决策未完成

### 6.2 `Implementer -> Reviewer`

仅当实现已完成并执行必要验证后允许切换。

若仍存在以下问题，不应切换：

- 代码未达到可审查状态
- 计划内工作未完成
- 验证未执行
- 当前实现明显依赖未解决前提

### 6.3 回退规则

以下情况应回退到 `Planner`：

- 执行中发现计划关键前提错误
- 任务边界需要重新定义
- 风险与影响面明显扩大
- 任务复杂度超出原计划

以下情况应回退到 `Implementer`：

- `Reviewer` 发现实现缺陷
- 边界覆盖不完整
- 测试缺失
- 验证不足

---

## 7. 特殊模式

## 7.1 Planner 的 orchestration mode

当任务属于复杂任务时，`Planner` 可进入 orchestration mode。

该模式下，`Planner` 额外负责：

- 判断是否适合拆分
- 识别可并行与必须串行的部分
- 划定子任务边界
- 定义每个子任务的输入输出
- 说明汇总、联调、最终 review 的顺序

该模式仍属于 `Planner`，不构成第四常驻角色。

## 7.2 Implementer 的 debug mode

当任务属于 Bug 修复、异常排查、回归问题定位时，`Implementer` 可进入 debug mode。

该模式下，`Implementer` 额外负责：

- 先复现问题
- 收集证据
- 判断根因
- 在证据基础上修复
- 验证修复是否真正生效

该模式仍属于 `Implementer`，不构成第四常驻角色。

---

## 8. 常见误区

### 8.1 把 Profile 当角色

错误理解：

- `plan` profile 就是 `Planner`
- `review` profile 就是 `Reviewer`

正确理解：

- Profile 解决运行配置问题
- 角色解决职责边界问题

### 8.2 把 Skill 当角色

错误理解：

- 有 debug skill 就必须有 `Debugger` 角色
- 有 orchestration skill 就必须有 `Orchestrator` 角色

正确理解：

- Skill 定义工作流
- 角色定义职责身份
- 特殊工作流可以挂在现有角色上

### 8.3 让一个角色跨阶段持续工作

错误理解：

- `Planner` 可以顺手写实现
- `Implementer` 可以顺手做最终 review

正确理解：

- 不同阶段应显式切换角色
- 否则边界会逐步失效

### 8.4 为每种任务不断增加角色

错误理解：

- Debug 任务要新增 `Debugger`
- 复杂任务要新增 `Orchestrator`
- 文档任务要新增 `DocWriter`

正确理解：

- 优先保持三角色稳定
- 通过 Skill、Prompt、Profile 扩展场景
- 只有在职责长期稳定且无法被现有角色覆盖时，才考虑新增角色

---

## 9. 一句话总结

PIR 的三个角色并不是并行常驻团队，而是任务在不同阶段的主要职责形态：

- `Planner` 负责想清楚
- `Implementer` 负责做出来
- `Reviewer` 负责查问题

复杂任务由 `Planner` 进入 orchestration mode，Bug 修复由 `Implementer` 进入 debug mode，而不是通过不断新增角色来解决。
