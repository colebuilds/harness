# Harness Project Policy

在进入 `superpowers` 工作流之前，先读取 `/.harness/project-policy.json`。

## 必须应用的项目策略

- `developer_language`
- `document_mode`
- `debug_mode`

## 执行要求

- 非业务文本默认使用开发者语言
- 文档按当前文档模式路由
- 当 `debug_mode=on` 时，执行摘要必须包含 agent 调度信息
- `复述需求` 默认进入 `Planner`，并优先允许查询 agent 收集上下文
- `开始执行` 默认进入 `Implementer`，必要时允许拆分执行 agent
- review 请求默认进入 `Reviewer`
- 本 skill 只负责项目策略注入，不替代 `superpowers`

## Debug 摘要最少字段

- `current_phase`
- `used_query_agent`
- `used_execution_agents`
- `execution_agent_boundaries`
- `phase_transitions`
- `final_owner`
