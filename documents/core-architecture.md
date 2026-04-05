---
title: Harness 0.1 核心架构
type: design
status: draft
owner: cole
scope: Harness 0.1 的最小架构分层与连接关系
applies_to: human, ai-agent
---

# Harness 0.1 核心架构

## 1. 文档定位

本文档用于定义 `Harness 0.1` 的最小架构分层。

0.1 不讨论完整长期内核，只讨论当前最小产品闭环需要哪些层，以及这些层如何连接。

---

## 2. 0.1 架构原则

0.1 的架构原则是：

- 尽量少层
- 尽量少概念
- 先把最小闭环打通
- 不过早引入生命周期与运行态重系统

因此，0.1 应按以下四层理解。

---

## 3. 文档与规则层

这一层负责：

- 项目入口规则
- 文档规范
- AI 协作规范
- 文档作为正式产物的约束

当前主要资产包括：

- `AGENTS.md`
- `documents/README.md`
- `.harness/project-policy.json`
- `.harness/runtime-contract.json`
- `documents/standards/ai-collaboration/`（`full` 模式）

这一层解决的是：

- AI 协作规则只存在于对话里
- 文档无正式位置
- 接入后没有统一入口

---

## 4. 协作工作流层

这一层负责：

- PIR
- `superpowers` workflow
- 正式口令与系统步骤
- 口令到 PIR / profile / skill / runtime agent 的映射

当前最小工作流为：

- `复述需求`
- `Planner`
- `开始执行`
- `Implementer`
- `Reviewer`

但 0.1 中真正的正式口令只保留：

- `复述需求`
- `开始执行`

这一层解决的是：

- 分析/实现/review 混在一起
- 缺少稳定工作流
- skill 没有正式承载方式

---

## 5. Agent 协作层

这一层负责：

- 主 agent
- 查询 agent
- 按需执行 agent

其中：

- 主 agent 负责主流程推进
- 查询 agent 负责查询资料、代码、文档等上下文
- 执行 agent 按需参与复杂实现任务

  0.1 中，这一层只做最小协作约定，不做复杂运行时编排系统；当前主要通过：

- `AGENTS.md`
- `.harness/runtime-contract.json`
- `debug_mode=on` 时的调试摘要模板

固化这套最小运行时架构。

---

## 6. 接入与引导层

这一层负责：

- 初始化接入
- 最小骨架写入
- 项目扫描
- 最小健康检查

当前主要承载体是：

- `harness-codex init`
- `harness-codex verify`
- `harness-codex upgrade superpowers`

这一层解决的是：

- 用户无法快速接入
- 骨架落地依赖手工复制
- 文档、配置、规则分散

---

## 7. 0.1 各层关系

0.1 的最小关系如下：

```text
用户需求
  -> 文档与规则层
  -> 协作工作流层
  -> Agent 协作层
  -> 代码与文档结果

接入与引导层
  -> 把以上最小骨架写入项目
  -> 检查这些骨架是否仍然一致
```

更直白地说：

- 文档与规则层定义项目默认规则、文档路由和项目策略
- 协作工作流层定义 PIR、profiles 与 `superpowers` 如何协同
- Agent 协作层定义主 agent / 查询 agent / 执行 agent 如何分工
- 接入与引导层负责把这套东西装进项目，并用 `verify` 做结构一致性检查

当前 `verify` 已最少覆盖：

- `.codex/config.toml` 中的 `plan / dev / review`
- `.harness/project-policy.json`
- `.harness/components.lock.json`
- `.harness/runtime-contract.json`
- `AGENTS.md`
- `documents/README.md`
- `full` 模式下的 `documents/standards/ai-collaboration/README.md`
- `skills/harness-project-policy/SKILL.md`
- `debug_mode=on` 时的 `.harness/logs/latest.json`

---

## 8. 0.1 不包含的架构层

以下内容属于长期方向，但不进入 0.1：

- 生命周期内核层
- task object 层
- runtime control plane 层
- diagnostics 子系统
- host-agnostic core/runtime 分离实现

这些内容未来可以继续演进，但当前先不放入 0.1 架构主线。

---

## 9. 一句话总结

**Harness 0.1 的最小架构，是由文档与规则层、协作工作流层、Agent 协作层、接入与引导层组成的最小 Codex-first 协作骨架；当前实现已将这些层落到项目级配置、受管 `superpowers`、运行时契约和最小校验命令中。**
