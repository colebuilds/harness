# AGENTS.md

## Collaboration Rules

- Analyse before implementation
- Documentation is a first-class project output
- Project files override ad-hoc chat instructions

## Current Project Policy

- Developer language: `{{developer_language_label}}`
- Document mode: `{{document_mode}}`
- Debug mode: `{{debug_mode}}`

## Developer Language Policy

- Non-business text defaults to the developer language
- This includes test descriptions, commit notes, review findings, execution summaries, and project documents
- Business copy, protocol fields, and code identifiers are not forced to follow this rule

## Official Commands

- `复述需求`
- `开始执行`

## Gate Rules

- Before `复述需求` is received, the agent must not enter planning output or code implementation
- When the user describes work directly, first produce the restated requirement, scope, constraints, and open questions
- Before `开始执行` is received, the agent must not modify code, generate patches, or run implementation commands
- Before any code development, the agent must check the current git branch
- If the current branch is `main` or `master`, the agent must not implement on that branch by default and should create or switch to a work branch first
- Review requests enter `Reviewer` and must not be mixed with implementation work

## PIR Phase Semantics

- `复述需求` enters `Planner` by default
- `开始执行` enters `Implementer` by default
- Review requests enter `Reviewer` by default
- `plan / dev / review` profiles define runtime mode only; they do not replace PIR roles

## Superpowers

- The project uses a fully managed `superpowers` distribution
- Managed path: `{{superpowers_managed_path}}`
- Do not treat that directory as a normal customisation point
- Project-specific additions belong in `skills/`

## Runtime Agent Architecture

- The main agent owns orchestration and final integration
- The query agent performs read-only evidence gathering
- Execution agents handle bounded implementation work on demand
- Complex work may use multiple execution agents, but the main agent must close the loop

## Document Routing

- Route documents according to `documents/README.md`
- In `flat` mode, default to `documents/`
- In `full` mode, follow the structured directory responsibilities

## Debug Mode

- When `debug_mode=on`, execution summaries must state:
- Whether the query agent was used
- Whether execution agents were split out
- The boundary owned by each execution agent
- How phases moved and which agent closed the work
