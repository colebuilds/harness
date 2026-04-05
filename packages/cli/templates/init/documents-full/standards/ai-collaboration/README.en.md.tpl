# AI Collaboration

Use this directory for project-specific AI collaboration rules.

## Runtime Agent Architecture

- Main agent: orchestration, phase control, and final closeout
- Query agent: read-only evidence gathering and context lookup
- Execution agents: bounded implementation workers on demand

## Current Rules

- `复述需求` enters `Planner` by default
- `开始执行` enters `Implementer` by default
- Review requests enter `Reviewer` by default
- Project policy is applied first through `skills/harness-project-policy/`

## Debug Mode

When `debug_mode=on`, execution summaries must explicitly state:

- whether the query agent was used
- whether execution agents were split out
- the boundary owned by each execution agent
- how phases moved and who closed the work
