---
title: Harness 0.1 产品定义
type: design
status: draft
owner: cole
scope: Harness 0.1 的产品本质、边界、目标与非目标
applies_to: human, ai-agent
---

# Harness 0.1 产品定义

## 1. 文档定位

本文档用于定义 `Harness 0.1` 的产品本质、当前边界、核心目标与非目标。

本文档不定义完整长期平台，只定义当前 0.1 最小闭环版本。

---

## 2. 0.1 产品本质

`Harness 0.1` 不是完整的复杂需求执行内核，也不是通用多模型平台。

当前版本更准确的定义是：

**一个可安装、可接入、可开始使用的最小 Codex-first 协作产品。**

它把以下几部分组合在一起：

- 文档规范
- PIR
- 完整受管的 `superpowers` workflow
- 主 agent + 查询 agent + 按需执行 agent
- 基本口令
- 最小接入能力
- 可验证的初始化与检查命令

---

## 3. 当前版本为什么是 Codex-first

当前阶段先只围绕 `Codex` 做第一版，不是因为长期产品只属于 Codex，而是因为 0.1 的目标是先把最小工作骨架做稳。

也就是说，0.1 优先验证的是：

- 用户是否能快速接入
- 接入后是否能稳定协作
- `PIR + superpowers` 是否能形成最小工作流闭环
- 主/子 agent 的最小协作是否足够好用
- 文档是否能作为正式产物进入项目

---

## 4. 0.1 解决的问题

当前版本重点解决以下问题：

### 4.1 项目没有稳定的 AI 协作入口

很多项目即使在使用 AI，也没有统一的项目入口规则。

0.1 通过：

- `.codex/config.toml`
- `.harness/project-policy.json`
- `AGENTS.md`
- `documents/README.md`

建立最小项目级入口。

### 4.2 复杂需求容易直接跳进实现

如果没有正式确认动作，AI 很容易在需求未澄清时直接开始执行。

0.1 用：

- `复述需求`
- `开始执行`
- 执行前确认

建立最小控制闸门。

### 4.3 workflow 不稳定

AI 很容易在分析、规划、实现、review 之间来回漂移。

0.1 用：

- PIR
- `superpowers`

作为最小 workflow 骨架。

### 4.4 文档不是正式产物

很多项目把文档当附属说明。

0.1 明确要求：

- 文档是正式产物
- 需求、设计、交付、演进信息要进入正式目录

### 4.5 初始化后缺少持续校验入口

如果项目只在初始化时生成骨架，但后续没有统一校验入口，这些规则和产物会很快失真。

0.1 通过：

- `harness-codex verify`

把初始化产物、项目策略、运行契约、文档模式与调试摘要重新连成最小校验闭环。

---

## 5. 0.1 核心目标

当前版本只保留以下核心目标：

- 可发布
- 可安装
- 可接入
- 可开始使用
- 有最小文档治理
- 有最小工作流骨架
- 有最小 agent 协作结构
- 有最小口令体系
- 有最小结构校验能力

---

## 6. 0.1 非目标

以下内容明确不属于 0.1：

- 生命周期内核
- task object model
- batch / execution unit
- runtime control plane
- blocked / resume
- diagnostics 闭环
- 多宿主支持
- graph execution engine
- 重型 `doctor / upgrade`
- skill marketplace

---

## 7. 0.1 用户接入后的预期结果

用户执行一次初始化后，项目应至少获得：

- `.codex/config.toml`
- `.harness/project-policy.json`
- `.harness/components.lock.json`
- `.harness/runtime-contract.json`
- `AGENTS.md`
- `documents/README.md`
- `skills/harness-project-policy/SKILL.md`
- `/.harness/superpowers/`

此后，用户应能以以下方式开始工作：

1. 输入需求
2. `复述需求`
3. 分析/规划
4. `开始执行`
5. 输出代码与文档结果

并且用户应能运行：

- `harness-codex verify`

来检查：

- PIR profiles 是否完整
- 项目策略是否合法
- 运行契约是否完整
- 文档模式与目录是否一致
- `debug_mode=on` 时的调试摘要模板是否完整

---

## 8. 一句话总结

**Harness 0.1 的目标不是先做大，而是先做成一个最小、稳定、可交付的 Codex-first 协作产品。**
