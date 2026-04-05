# Harness Project Policy

在进入 `superpowers` 工作流之前，先读取：

- `/.harness/project-policy.json`
- `/.harness/runtime-contract.json`
- `/.harness/runtime-state.json`

## 必须应用的项目策略

- `developer_language`
- `document_mode`
- `debug_mode`

## 执行要求

- 非业务文本默认使用开发者语言
- 文档按当前文档模式路由
- 当 `debug_mode=on` 时，执行摘要必须包含 agent 调度信息
- 当 `task_state=awaiting_restate` 时，只能输出需求复述、范围、约束与待确认点
- 当 `task_state=awaiting_execution_gate` 时，只能输出执行前确认摘要、风险与实施边界
- 只有当 `execution_approved=true` 时，才允许修改代码、生成补丁、执行实现性命令
- 在开始任何代码开发前，必须先检查当前 git 分支
- 若当前分支是 `main` / `master`，默认先切出工作分支，未获准前不得直接开发
- `复述需求` 默认进入 `Planner`，并优先允许查询 agent 收集上下文
- `开始执行` 默认进入 `Implementer`，必要时允许拆分执行 agent
- review 请求默认进入 `Reviewer`
- 本 skill 只负责项目策略注入，不替代 `superpowers`

## Gate Enforcement

- 如果 `task_state=awaiting_restate`：
- 只能输出需求复述，不能直接给出实现步骤或代码修改
- 如果 `task_state=awaiting_execution_gate`：
- 只能输出执行前确认摘要，不能直接开始实现

## Debug 摘要最少字段

- `current_phase`
- `used_query_agent`
- `used_execution_agents`
- `execution_agent_boundaries`
- `phase_transitions`
- `final_owner`
