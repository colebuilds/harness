# Harness Project Policy

Before entering the `superpowers` workflow, read `/.harness/project-policy.json`.

## Required policy inputs

- `developer_language`
- `document_mode`
- `debug_mode`

## Execution rules

- Non-business text defaults to the configured developer language
- Route documents according to the selected document mode
- When `debug_mode=on`, execution summaries must include agent orchestration details
- `复述需求` enters `Planner` by default and may use the query agent first
- `开始执行` enters `Implementer` by default and may split bounded execution agents when needed
- Review requests enter `Reviewer` by default
- This skill injects project policy only; it does not replace `superpowers`

## Minimum debug summary fields

- `current_phase`
- `used_query_agent`
- `used_execution_agents`
- `execution_agent_boundaries`
- `phase_transitions`
- `final_owner`
