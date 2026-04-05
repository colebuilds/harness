# Harness Project Policy

Before entering the `superpowers` workflow, read:

- `/.harness/project-policy.json`
- `/.harness/runtime-contract.json`
- `/.harness/runtime-state.json`

## Required policy inputs

- `developer_language`
- `document_mode`
- `debug_mode`

## Execution rules

- Non-business text defaults to the configured developer language
- Route documents according to the selected document mode
- When `debug_mode=on`, execution summaries must include agent orchestration details
- When `task_state=awaiting_restate`, only produce the restated requirement, scope, constraints, and open questions
- When `task_state=awaiting_execution_gate`, only produce the execution confirmation summary, risks, and implementation boundary
- Only when `execution_approved=true` may the agent modify code, generate patches, or run implementation commands
- Before any code development, the agent must check the current git branch
- If the current branch is `main` or `master`, the agent must switch to a work branch before implementation unless explicitly approved otherwise
- `复述需求` enters `Planner` by default and may use the query agent first
- `开始执行` enters `Implementer` by default and may split bounded execution agents when needed
- Review requests enter `Reviewer` by default
- This skill injects project policy only; it does not replace `superpowers`

## Gate enforcement

- If `task_state=awaiting_restate`:
- Only produce the restated requirement; do not jump to implementation steps or code changes
- If `task_state=awaiting_execution_gate`:
- Only produce the execution confirmation summary; do not start implementation

## Minimum debug summary fields

- `current_phase`
- `used_query_agent`
- `used_execution_agents`
- `execution_agent_boundaries`
- `phase_transitions`
- `final_owner`
