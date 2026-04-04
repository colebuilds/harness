---
title: Codex PIR 提示词模板
type: guide
status: draft
owner: cole
scope: Planner / Implementer / Reviewer 的提示词模板
applies_to: human, ai-agent
---

# Codex PIR 提示词模板

## 1. 文档定位

本文档用于定义 Codex PIR 协作体系中各角色的提示词模板。

本文档重点回答的问题是：

- `Planner` 应如何组织分析输出
- `Implementer` 应如何组织实现输出
- `Reviewer` 应如何组织审查输出
- Bug 修复时，`Implementer` 的 debug 提示词应如何变化
- 复杂任务时，`Planner` 的 orchestration 提示词应如何变化

本文档不负责说明：

- 三个角色的职责边界
- 工作流整体流转方式
- `config.toml` 和 `AGENTS.md` 的配置方式

这些内容分别由 `01-roles.md`、`02-workflows.md`、`03-configuration.md` 负责。

---

## 2. Prompt 设计原则

PIR 中的 Prompt 设计必须遵守以下原则。

### 2.1 Prompt 服务于角色，不替代角色

Prompt 的作用是帮助当前角色稳定输出，不是重新定义角色本身。

### 2.2 Prompt 服务于阶段，不追求万能

每个 Prompt 应服务于明确阶段，例如：

- 规划
- 实现
- 审查
- 调试
- 编排

不应尝试用一个 Prompt 覆盖所有任务。

### 2.3 Prompt 必须约束输出结构

Prompt 不仅要说明做什么，还应说明如何输出，避免结果漂移。

### 2.4 Prompt 必须绑定上下文

Prompt 不应是脱离项目上下文的抽象模板。  
应尽量绑定：

- 当前项目规则
- 当前任务边界
- 当前角色职责
- 当前阶段目标

### 2.5 Prompt 不承载运行配置

Prompt 不能替代：

- Profile
- 沙箱策略
- MCP 配置
- 审批策略

这些问题由 `config.toml` 解决。

---

## 3. Planner Prompt

## 3.1 Purpose

用于让 `Planner` 在分析阶段输出清晰、可执行的计划。

## 3.2 Suitable Scenarios

适用于：

- 新功能分析
- 重构前分析
- Bug 修复前分析
- 复杂任务拆分
- 跨模块需求梳理

## 3.3 Not Suitable Scenarios

不适用于：

- 直接修改代码
- 最终代码审查
- 在计划已清晰后继续空转分析

## 3.4 Prompt Template

```text
你当前处于 Codex PIR 的 Planner 阶段。

你的职责是将当前任务转化为清晰、可执行的计划，而不是直接改代码。

请基于已有上下文完成以下事项：

1. 明确本次目标
2. 明确本次不包含
3. 识别影响范围
4. 列出关键风险和前提
5. 给出分步骤执行计划
6. 给出验证方式
7. 若任务复杂，请说明是否需要拆分以及拆分依据

要求：
- 不直接进入实现
- 不用实现细节替代需求澄清
- 不扩大任务边界
- 输出必须结构化，便于直接进入 Implementer 阶段
```

## 3.5 Expected Output Structure

建议输出结构：

- Goal
- Non-Goals
- Scope
- Risks
- Plan
- Validation
- Complexity Assessment

---

## 4. Implementer Prompt

## 4.1 Purpose

用于让 `Implementer` 在实现阶段按计划落地修改，并执行必要验证。

## 4.2 Suitable Scenarios

适用于：

- 功能开发
- 明确任务下的代码修改
- 按计划执行某一步实现
- 小范围重构
- 测试补充

## 4.3 Not Suitable Scenarios

不适用于：

- 需求尚未清晰的任务
- 最终审查
- 在计划未形成时直接发散实现

## 4.4 Prompt Template

```text
你当前处于 Codex PIR 的 Implementer 阶段。

你的职责是按照既定计划完成实现，并在任务边界内执行必要验证。

请基于已有计划完成以下事项：

1. 按计划实施代码修改
2. 控制改动边界
3. 补充必要测试或验证
4. 记录实际实现与计划的偏差
5. 若发现计划关键前提失效，停止扩展并回退 Planner

要求：
- 不擅自扩大范围
- 不跳过必要验证
- 不用“顺手优化”替代计划内目标
- 输出需包含实际修改内容、验证情况和剩余风险
```

## 4.5 Expected Output Structure

建议输出结构：

- Implementation Summary
- Files/Areas Changed
- Validation Performed
- Deviations from Plan
- Remaining Risks

---

## 5. Reviewer Prompt

## 5.1 Purpose

用于让 `Reviewer` 对实现结果进行独立审查。

## 5.2 Suitable Scenarios

适用于：

- 代码审查
- 功能实现后的风险检查
- Bug 修复后的回归检查
- 计划对照审查

## 5.3 Not Suitable Scenarios

不适用于：

- 直接改代码
- 在没有实现结果时空泛评论
- 重新规划需求

## 5.4 Prompt Template

```text
你当前处于 Codex PIR 的 Reviewer 阶段。

你的职责是独立审查当前实现结果，重点识别 bug、风险、边界遗漏和测试缺口。

请基于计划、实现结果和验证信息完成以下事项：

1. 检查实现是否符合计划
2. 识别功能性问题和回归风险
3. 检查边界条件和异常路径
4. 检查测试和验证是否不足
5. 给出结构化审查结论

要求：
- 以 findings 为中心，而不是复述实现过程
- 不将 review 退化成继续开发
- 不扩大需求范围
- 优先指出严重问题和缺失项
```

## 5.5 Expected Output Structure

建议输出结构：

- Findings
- Severity
- Missing Coverage
- Open Questions
- Review Verdict

---

## 6. Implementer Debug Prompt

## 6.1 Purpose

用于 Bug 修复场景下，让 `Implementer` 进入 debug mode。

## 6.2 Suitable Scenarios

适用于：

- 已知 bug 修复
- 回归问题排查
- 无法解释的异常行为
- 状态、接口、边界条件导致的问题

## 6.3 Not Suitable Scenarios

不适用于：

- 普通功能开发
- 纯文档任务
- 已经明确根因、只差机械改动的简单场景

## 6.4 Prompt Template

```text
你当前处于 Codex PIR 的 Implementer 阶段，并进入 debug mode。

你的职责不是直接猜测修复方案，而是先复现问题、收集证据、判断根因，再实施修复并验证。

请按以下顺序工作：

1. 明确问题现象和复现条件
2. 尝试复现问题
3. 收集关键证据
4. 判断最可能的根因
5. 基于根因实施修复
6. 验证修复是否生效
7. 检查是否引入副作用

要求：
- 未复现前不要盲改
- 不把现象当根因
- 不在证据不足时扩大修改
- 输出需清楚区分：现象、证据、根因、修复、验证
```

## 6.5 Expected Output Structure

建议输出结构：

- Symptom
- Reproduction
- Evidence
- Root Cause
- Fix
- Validation
- Side Effects Check

---

## 7. Planner Orchestration Prompt

## 7.1 Purpose

用于复杂任务中，让 `Planner` 进入 orchestration mode。

## 7.2 Suitable Scenarios

适用于：

- 多模块改造
- 跨目录修改
- 多子任务任务链
- 存在并行分析或并行实施价值的复杂需求

## 7.3 Not Suitable Scenarios

不适用于：

- 单文件小改动
- 简单功能开发
- 不需要拆分的直接任务

## 7.4 Prompt Template

```text
你当前处于 Codex PIR 的 Planner 阶段，并进入 orchestration mode。

你的职责不是直接实现，而是先判断当前复杂任务如何拆分、排序和汇总。

请完成以下事项：

1. 明确总目标
2. 判断任务是否适合拆分
3. 划定子任务边界
4. 说明哪些部分可并行，哪些必须串行
5. 给出各子任务的输入输出
6. 说明最终如何汇总、联调和 review

要求：
- 不直接进入实现
- 不做无边界拆分
- 不为了并发而并发
- 输出需服务于后续 Implementer 和 Reviewer 阶段
```

## 7.5 Expected Output Structure

建议输出结构：

- Overall Goal
- Why Decompose / Why Not
- Task Breakdown
- Parallel vs Sequential Decisions
- Inputs and Outputs
- Integration Plan
- Final Validation Plan

---

## 8. 适用场景与切换规则

### 8.1 标准功能开发

使用顺序：

1. `Planner Prompt`
2. `Implementer Prompt`
3. `Reviewer Prompt`

### 8.2 Bug 修复

使用顺序：

1. `Planner Prompt`
2. `Implementer Debug Prompt`
3. `Reviewer Prompt`

### 8.3 复杂任务

使用顺序：

1. `Planner Orchestration Prompt`
2. `Implementer Prompt`
3. `Reviewer Prompt`

### 8.4 回退场景

若执行中发现计划失效，应回退 `Planner Prompt`。  
若 review 中发现缺陷，应回退 `Implementer Prompt` 或 `Implementer Debug Prompt`。

---

## 9. 输出结构约束

为了让 PIR 保持稳定，所有 Prompt 输出应尽量满足以下要求：

- 结构化
- 可复用
- 可比对
- 可进入下一阶段

建议避免：

- 长篇散文式输出
- 将分析、实现、审查混在一起
- 没有边界和结论的空泛说明
- 用“建议看看”替代结构化判断

---

## 10. 一句话总结

PIR 的 Prompt 体系不是为了制造更多模板，而是为了让不同阶段的角色稳定输出：

- `Planner` 负责把问题想清楚
- `Implementer` 负责把计划做出来
- `Reviewer` 负责把风险找出来

复杂任务由 `Planner` 使用 orchestration prompt，Bug 修复由 `Implementer` 使用 debug prompt，而不是新增常驻角色。
