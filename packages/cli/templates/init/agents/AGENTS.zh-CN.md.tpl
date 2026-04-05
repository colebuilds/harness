# AGENTS.md

## 项目协作原则

- 先分析，后实现
- 文档是正式产物
- 规则以项目文件为准，不以临时对话为准

## 当前项目策略

- 开发者语言：`{{developer_language_label}}`
- 文档模式：`{{document_mode}}`
- 调试模式：`{{debug_mode}}`

## 开发者语言规则

- 非业务文本默认使用开发者语言
- 包括测试描述、提交说明、review 结论、执行摘要和正式文档
- 业务文案、协议字段和代码标识符不强制受此规则约束

## 正式口令

- `复述需求`
- `开始执行`

## Gate 门禁规则

- 未收到 `复述需求` 前，不得进入规划产出和代码实现
- 用户直接描述需求时，默认先输出需求复述、范围、约束与待确认点
- 未收到 `开始执行` 前，不得修改代码、生成补丁、执行实现性命令
- 在做任何代码开发前，必须先检查当前 git 分支
- 若当前分支是 `main` / `master`，默认不得直接实施代码修改，应先切出工作分支
- review 请求默认进入 `Reviewer`，不得与实现阶段混用

## PIR 阶段语义

- `复述需求` 默认进入 `Planner`
- `开始执行` 默认进入 `Implementer`
- review 请求默认进入 `Reviewer`
- `plan / dev / review` profiles 只负责运行模式，不等同于角色本身

## Superpowers

- 项目使用完整受管 `superpowers`
- 受管目录：`{{superpowers_managed_path}}`
- 不应把该目录作为日常定制修改点
- 项目私有扩展放在 `skills/`

## 运行时 Agent 架构

- 主 agent 负责调度与收口
- 查询 agent 负责只读查证
- 执行 agent 按需承接边界清晰的实现任务
- 复杂任务允许拆分多个执行 agent，但必须由主 agent 汇总

## 文档路由

- 文档按 `documents/README.md` 归档
- `flat` 模式下默认放在 `documents/`
- `full` 模式下按目录职责归档

## 调试模式

- 当 `debug_mode=on` 时，执行摘要必须说明：
- 是否调用了查询 agent
- 是否拆分了执行 agent
- 每个执行 agent 承担了什么边界
- 当前阶段如何流转以及最终由谁收口
