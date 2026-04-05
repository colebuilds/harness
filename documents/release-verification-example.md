---
title: Harness 发布人工验收记录示例
type: example
status: draft
owner: cole
scope: 发布前人工验收记录的参考写法
applies_to: human, ai-agent
---

# Harness 发布人工验收记录示例

## 1. 基本信息

- 日期：2026-04-04
- 验收人：cole
- 分支 / 提交：`feature/product-regression`
- 目标版本：`0.1.0`
- 测试目录：`/tmp/harness-test`
- 关联 PR / 任务：`#12`

---

## 2. 自动化前置结果

- `pnpm verify`：
  - [x] 通过
  - 备注：typecheck、test、build、publint 全部通过

- `pnpm check:product`：
  - [x] 通过
  - 备注：使用 `HARNESS_TEST_DIR=/tmp/harness-test`

- CI：
  - [x] 通过
  - 备注：`verify` job 通过

---

## 3. 初始化结果确认

- [x] 成功执行 `harness-codex init`
- [x] `.codex/config.toml` 存在
- [x] `.harness/project-policy.json` 存在
- [x] `.harness/components.lock.json` 存在
- [x] `.harness/runtime-contract.json` 存在
- [x] `AGENTS.md` 存在
- [x] `documents/README.md` 存在
- [x] `/.harness/superpowers/*` 存在
- [x] `skills/harness-project-policy/SKILL.md` 存在

备注：

- 初始化后的骨架与 0.1 预期一致
- 重复执行会先备份再替换受管产物

---

## 4. 分析闸门验收

测试输入：

```text
复述需求：给这个项目新增一个最小登录页，只做页面骨架和路由接入，不接真实接口
```

结果确认：

- [x] 先分析，不直接改代码
- [x] 明确目标
- [x] 明确边界
- [x] 明确风险
- [x] 明确执行计划

备注：

- 输出先进入 Planner 风格
- 没有越过分析阶段直接开始实现

---

## 5. 执行闸门验收

测试输入：

```text
开始执行
```

结果确认：

- [x] 在此之后才进入执行阶段
- [x] 执行前确认信息完整

备注：

- 执行前展示了目标、边界、计划和风险信息

---

## 6. Planner / Debug / Review 工作流验收

### 6.1 Planner

测试输入：

```text
复述需求：先帮我梳理这个需求边界，再给我一个分步骤执行计划
```

结果确认：

- [x] 输出以边界和计划为主
- [x] 没有直接进入实现

备注：

- 输出结构稳定，符合 Planner 预期

### 6.2 Debug

测试输入：

```text
复述需求：某个页面出现回归 bug，请先复现、找根因，再给修复计划
```

结果确认：

- [x] 强调复现
- [x] 强调证据
- [x] 强调根因
- [x] 没有盲改

备注：

- 输出符合 debug mode 预期

### 6.3 Review

测试输入：

```text
请对刚刚的实现做 review，重点找 bug、风险、遗漏测试
```

结果确认：

- [x] findings 优先
- [x] 风险明确
- [x] 测试缺口明确

备注：

- 输出顺序符合 review 场景要求

---

## 7. 异常与偏差记录

- 是否发现异常：
  - [x] 否
  - [ ] 是

- 异常描述：

无

- 是否阻塞发布：
  - [x] 否
  - [ ] 是

- 修复建议：

无阻塞项

---

## 8. 最终结论

- [x] 允许合并
- [x] 允许发布
- [ ] 不允许合并
- [ ] 不允许发布

结论说明：

当前版本的 CLI、初始化骨架、产品回归、文档入口与工作流行为均符合 0.1 预期，可进入合并与发布流程。
