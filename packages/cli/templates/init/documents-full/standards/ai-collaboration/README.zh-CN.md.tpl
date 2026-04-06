# AI Collaboration

本目录用于存放当前项目必须遵守的 AI 协作补充规则。

## 当前运行时 Agent 架构

- 主 agent：负责调度、阶段推进和最终收口
- 查询 agent：负责只读查证与上下文收集
- 执行 agent：按需承接边界清晰的实现任务

## 当前约束

- `复述需求` 默认进入 `Planner`
- `开始执行` 默认进入 `Implementer`
- review 请求默认进入 `Reviewer`
- 项目策略由 `skills/harness-project-policy/` 先读取

## Debug 模式

当 `debug_mode=on` 时，执行摘要必须显式说明：

- 是否调用了查询 agent
- 是否拆分了执行 agent
- 每个执行 agent 的任务边界
- 阶段如何流转以及最终由谁收口
