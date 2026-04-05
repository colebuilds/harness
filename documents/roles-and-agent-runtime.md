---
title: Codex Harness 角色与运行时 Agent
type: design
status: draft
owner: cole
scope: PIR 角色与主/子 agent 运行时映射
applies_to: human, ai-agent
---

# Codex Harness 角色与运行时 Agent

## 1. 文档定位

本文档用于定义 `Codex Harness` 中的阶段角色系统与运行时 agent 架构之间的关系。

本文档重点回答的问题是：

- `Planner / Implementer / Reviewer` 分别是什么
- 主 agent / 查询 agent / 执行 agent 分别是什么
- 为什么这两套结构不能混为一谈
- 各阶段由谁驱动
- 查询、执行、审查分别由哪些运行时单元承接
- 复杂任务中的主控与子任务协作如何成立

本文档不展开：

- 具体 task object 字段
- 具体 phase 细节
- 具体 skill 内容
- 具体 prompt 正文

---

## 2. 两套不同维度的结构

`Codex Harness` 中必须区分两套不同维度的结构：

### 2.1 阶段角色结构

这一套由 `PIR` 定义：

- `Planner`
- `Implementer`
- `Reviewer`

它回答的是：

- 当前任务处于哪个阶段
- 当前该做什么
- 当前不该做什么
- 当前输出应该长什么样

这是一套：

**任务阶段语义结构**

### 2.2 运行时 agent 结构

这一套由执行架构定义：

- 主 agent
- 查询 agent
- 执行 agent

它回答的是：

- 当前任务由谁调度
- 谁负责查证
- 谁负责落地
- 谁负责并行处理子任务

这是一套：

**运行时执行结构**

---

## 3. 为什么不能把角色和 agent 混为一谈

如果把两者混为一谈，会立刻出现几个问题：

- `Planner` 会被误解成一个固定的子 agent
- `Implementer` 会被误解成某个特定执行 worker
- `Reviewer` 会被误解成另一个并行常驻 agent
- 主 agent 的调度职责会和阶段角色职责混在一起

实际上：

- `Planner / Implementer / Reviewer`
  解决的是阶段职责问题
- 主/子 agent
  解决的是执行编排问题

因此，正确理解必须是：

**角色决定当前阶段语义，agent 决定当前阶段怎么执行。**

---

## 4. PIR 角色定义

## 4.1 Planner

`Planner` 是分析阶段角色。

它的职责是：

- 理解需求
- 澄清边界
- 拆解任务
- 判断复杂度
- 输出计划
- 决定是否要进入批次化与多任务编排

它不负责：

- 直接进入代码改动
- 在未形成计划前推动执行
- 代替 `Reviewer` 做最终审查

### 4.2 Implementer

`Implementer` 是执行阶段角色。

它的职责是：

- 按计划推进实现
- 按执行单元控制改动边界
- 承接执行子任务
- 完成验证前的必要实现

它不负责：

- 重新定义需求
- 擅自扩大边界
- 代替 `Planner` 做拆解

### 4.3 Reviewer

`Reviewer` 是审查阶段角色。

它的职责是：

- 检查实现是否符合计划
- 检查风险、回归、边界遗漏
- 检查测试与验证是否缺失
- 给出审查结论

它不负责：

- 主导实现
- 替代执行阶段继续改代码
- 在没有证据时给出拍脑袋判断

---

## 5. 运行时 agent 定义

## 5.1 主 agent

主 agent 是整个运行态的调度与收口中心。

它负责：

- 解释当前阶段语义
- 识别当前 Batch / Work Item / Execution Unit
- 决定是否拆分任务
- 决定调用查询 agent 还是执行 agent
- 汇总子 agent 结果
- 推动生命周期前进或回退

主 agent 不是简单的执行 worker，而是：

**运行时主控。**

## 5.2 查询 agent

查询 agent 负责：

- 读代码
- 查文档
- 查调用点
- 查接口、依赖、配置
- 收集证据
- 做只读型上下文补充

它的核心价值是：

**帮助主 agent 降低分析成本与查证成本。**

## 5.3 执行 agent

执行 agent 负责：

- 落地具体执行单元
- 处理明确边界下的实现任务
- 做局部修改
- 做局部验证

它的核心价值是：

**承接已确认执行单元的具体执行。**

---

## 6. 角色和运行时 agent 的映射关系

正确关系不是一一对应，而是“阶段角色驱动运行时架构”。

### 6.1 Planner 阶段

主要由：

- 主 agent
- 查询 agent

共同承接。

原因是：

- `Planner` 需要大量读代码、读文档、收集上下文
- 此阶段通常不是以修改代码为主

因此：

- 主 agent 负责计划与拆分
- 查询 agent 负责上下文查证

### 6.2 Implementer 阶段

主要由：

- 主 agent
- 执行 agent
- 必要时的查询 agent

共同承接。

原因是：

- `Implementer` 阶段要落地执行单元
- 复杂任务中通常需要多个执行单元并行或分批推进

因此：

- 主 agent 负责调度与总收口
- 执行 agent 负责具体实现
- 查询 agent 负责补查依赖与证据

### 6.3 Reviewer 阶段

主要由：

- 主 agent
- 查询 agent

共同承接。

原因是：

- `Reviewer` 更依赖证据、比对与只读分析
- 通常不应由执行 agent 主导

因此：

- 主 agent 负责审查结论
- 查询 agent 负责查证与对照

---

## 7. 复杂任务中的主控与编排

复杂任务不会新增第四个常驻“Orchestrator”角色。

在 `Codex Harness` 中：

- `Planner` 负责复杂任务拆解语义
- 主 agent 负责复杂任务运行时编排

也就是说：

- 在角色层，复杂任务仍属于 `Planner`
- 在运行时层，复杂任务由主 agent 负责 orchestration

这两者是同一件事的不同层面，不应再额外定义一个常驻独立角色。

---

## 8. 查询与执行的分工原则

为了防止多 agent 运行态发散，查询 agent 与执行 agent 的边界必须清楚。

### 8.1 查询 agent 适合承接的任务

- 查调用点
- 查文档
- 查依赖关系
- 查当前配置
- 收集验证前证据
- 在 review 中做只读对照

### 8.2 执行 agent 适合承接的任务

- 在已确认执行单元下修改代码
- 在已确认边界下补测试
- 完成明确交付块
- 在主 agent 指定范围内执行任务

### 8.3 不应发生的情况

- 查询 agent 擅自扩大为执行 worker
- 执行 agent 在未明确边界前重写计划
- 子 agent 脱离当前 Batch / Work Item / Execution Unit 自行发散

---

## 9. 与执行模型的关系

角色与 agent 并不是游离在执行模型之外。

它们和执行模型的关系是：

- 任务对象提供执行承载体
- 生命周期提供阶段切换
- `PIR` 提供角色语义
- 主/子 agent 提供运行时执行能力

所以整体关系应理解为：

```text
任务对象
  -> 生命周期
  -> 角色语义（PIR）
  -> 主/子 agent 执行编排
```

没有任务对象与生命周期，角色和 agent 都会退化成纯 prompt 结构。

---

## 10. 当前阶段的收敛重点

当前阶段，最重要的不是新增更多角色，而是把现有两层关系固定清楚：

1. 角色只保留 `Planner / Implementer / Reviewer`
2. 复杂任务不新增常驻 `Orchestrator`
3. bug 修复不新增常驻 `Debugger`
4. 主 agent / 查询 agent / 执行 agent 作为运行时编排层固定下来
5. 角色和 agent 的命名不能混用

---

## 11. 一句话总结

在 `Codex Harness` 中：

- `Planner / Implementer / Reviewer` 是阶段角色
- 主 agent / 查询 agent / 执行 agent 是运行时执行结构

前者定义**当前任务语义**，后者定义**当前任务如何被调度与执行**。只有两者分清，复杂任务拆解与多任务编排才不会失控。
