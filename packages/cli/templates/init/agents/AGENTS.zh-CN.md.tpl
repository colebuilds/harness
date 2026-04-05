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
