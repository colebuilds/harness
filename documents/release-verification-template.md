---
title: Harness 发布人工验收记录模板
type: template
status: draft
owner: cole
scope: PR 合并前或版本发布前的人工作流验收记录模板
applies_to: human, ai-agent
---

# Harness 发布人工验收记录模板

## 1. 基本信息

- 日期：
- 验收人：
- 分支 / 提交：
- 目标版本：
- 测试目录：
- 关联 PR / 任务：

---

## 2. 自动化前置结果

- `pnpm verify`：
  - [ ] 通过
  - 备注：

- `pnpm check:product`：
  - [ ] 通过
  - 备注：

- CI：
  - [ ] 通过
  - 备注：

---

## 3. 初始化结果确认

- [ ] 成功执行 `harness-codex init`
- [ ] `.codex/config.toml` 存在
- [ ] `.harness/project-policy.json` 存在
- [ ] `.harness/components.lock.json` 存在
- [ ] `.harness/runtime-contract.json` 存在
- [ ] `AGENTS.md` 存在
- [ ] `documents/README.md` 存在
- [ ] `/.harness/superpowers/*` 存在
- [ ] `skills/harness-project-policy/SKILL.md` 存在

备注：

---

## 4. 分析闸门验收

测试输入：

```text
复述需求：给这个项目新增一个最小登录页，只做页面骨架和路由接入，不接真实接口
```

结果确认：

- [ ] 先分析，不直接改代码
- [ ] 明确目标
- [ ] 明确边界
- [ ] 明确风险
- [ ] 明确执行计划

备注：

---

## 5. 执行闸门验收

测试输入：

```text
开始执行
```

结果确认：

- [ ] 在此之后才进入执行阶段
- [ ] 执行前确认信息完整

备注：

---

## 6. Planner / Debug / Review 工作流验收

### 6.1 Planner

测试输入：

```text
复述需求：先帮我梳理这个需求边界，再给我一个分步骤执行计划
```

结果确认：

- [ ] 输出以边界和计划为主
- [ ] 没有直接进入实现

备注：

### 6.2 Debug

测试输入：

```text
复述需求：某个页面出现回归 bug，请先复现、找根因，再给修复计划
```

结果确认：

- [ ] 强调复现
- [ ] 强调证据
- [ ] 强调根因
- [ ] 没有盲改

备注：

### 6.3 Review

测试输入：

```text
请对刚刚的实现做 review，重点找 bug、风险、遗漏测试
```

结果确认：

- [ ] findings 优先
- [ ] 风险明确
- [ ] 测试缺口明确

备注：

---

## 7. 异常与偏差记录

- 是否发现异常：
  - [ ] 否
  - [ ] 是

- 异常描述：

- 是否阻塞发布：
  - [ ] 否
  - [ ] 是

- 修复建议：

---

## 8. 最终结论

- [ ] 允许合并
- [ ] 允许发布
- [ ] 不允许合并
- [ ] 不允许发布

结论说明：
