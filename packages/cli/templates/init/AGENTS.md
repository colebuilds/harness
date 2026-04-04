# AGENTS.md

## 1. 文档定位

本文件是当前项目的 AI 协作入口规则。

## 2. 默认工作原则

- 先分析，后实现
- 复杂需求先拆解，再进入执行
- 文档是正式产物，不是附属说明
- 规则以项目文件为准，不以单次对话为准

## 3. 正式口令

当前项目只保留两个正式口令：

- `复述需求`
- `开始执行`

## 4. 复述需求

`复述需求` 需要确认：

- 目标理解
- 当前边界
- 关键约束
- 待确认点

## 5. 开始执行

`开始执行` 是唯一正式执行闸门。

在进入执行前，系统应先展示执行前确认：

- 目标
- 边界
- 计划
- 风险 / 待确认点

## 6. 文档产物要求

当前项目中的需求、设计、交付与演进信息应按 `documents/README.md` 进入正式目录。

## 7. Codex 工作手册

当前项目的 Codex 工作手册位于：

- `documents/codex-pir/`

## 8. Superpowers Workflow

当前项目默认已接入 `superpowers` 作为 workflow 增强层。

优先使用：

- `brainstorming`
- `writing-plans`
- `executing-plans`
- `systematic-debugging`
- `requesting-code-review`
- `receiving-code-review`
