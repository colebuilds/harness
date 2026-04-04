---
title: Harness 0.1 Superpowers 接入说明
type: design
status: draft
owner: cole
scope: Harness 0.1 中 superpowers 的最小接入方式与使用边界
applies_to: human, ai-agent
---

# Harness 0.1 Superpowers 接入说明

## 1. 文档定位

本文档用于说明 `Harness 0.1` 如何接入 `superpowers`，以及它在系统中的最小职责边界。

---

## 2. 当前接入方式

当前 0.1 采用的是：

- 仓库内 vendored 接入
- 作为 workflow / skill 来源
- 不直接把它提升为内核

仓库中的实际位置为：

- `vendor/superpowers/`

---

## 3. 当前定位

`superpowers` 当前在 `Harness 0.1` 中的定位是：

- workflow library
- skill enhancement layer
- PIR 的阶段工作流来源

它不是：

- 生命周期内核
- 任务对象系统
- 运行态控制面
- 复杂编排内核

---

## 4. 当前使用方式

当前 0.1 建议按以下方式使用：

- `复述需求` 之后
  - 进入 `Planner`
  - 优先参考：
    - `skills/brainstorming`
    - `skills/writing-plans`
- `开始执行` 之后
  - 进入 `Implementer`
  - 优先参考：
    - `skills/executing-plans`
    - `skills/systematic-debugging`
- `Reviewer` 场景
  - 优先参考：
    - `skills/requesting-code-review`
    - `skills/receiving-code-review`

---

## 5. 当前最小原则

0.1 当前只做：

- 把 `superpowers` 接进仓库
- 在文档与规则中建立正式引用
- 在初始化模板中保留接入说明

  0.1 当前不做：

- 自动安装远程 skill
- skill marketplace
- 完整 skill 选择器
- 重型 skill 编排系统

---

## 6. 一句话总结

**Harness 0.1 当前将 `superpowers` 作为仓库内 vendored workflow 来源接入，用于补强 PIR 的阶段工作流，而不是作为内核系统。**
