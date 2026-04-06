{
  "generated_at": "{{generated_at}}",
  "developer_language": "{{developer_language}}",
  "document_mode": "{{document_mode}}",
  "debug_mode": "{{debug_mode}}",
  "profiles": {
    "plan": "Planner",
    "dev": "Implementer",
    "review": "Reviewer"
  },
  "gates": {
    "restate_gate": {
      "command": "复述需求",
      "required_before": [
        "planning",
        "implementation"
      ]
    },
    "execution_gate": {
      "command": "开始执行",
      "required_before": [
        "implementation"
      ]
    }
  },
  "execution_guards": {
    "protected_branches": [
      "main",
      "master"
    ],
    "default_action": "require_feature_branch_before_implementation",
    "push_policy": "forbid_direct_push_to_protected_branches"
  },
  "commands": {
    "复述需求": {
      "pir_phase": "Planner",
      "profile": "plan",
      "preferred_superpowers_skills": [
        "brainstorming",
        "writing-plans"
      ],
      "runtime_agents": [
        "main_agent",
        "query_agent"
      ]
    },
    "开始执行": {
      "pir_phase": "Implementer",
      "profile": "dev",
      "preferred_superpowers_skills": [
        "executing-plans",
        "systematic-debugging"
      ],
      "runtime_agents": [
        "main_agent",
        "execution_agents"
      ]
    },
    "review_request": {
      "pir_phase": "Reviewer",
      "profile": "review",
      "preferred_superpowers_skills": [
        "requesting-code-review",
        "receiving-code-review"
      ],
      "runtime_agents": [
        "main_agent"
      ]
    }
  },
  "runtime_agent_architecture": {
    "main_agent": "orchestration_and_closeout",
    "query_agent": "read_only_context_gathering",
    "execution_agents": "bounded_implementation_workers"
  },
  "managed_superpowers_path": "{{superpowers_managed_path}}"
}
