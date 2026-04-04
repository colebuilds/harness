---
name: executing-plans
description: 当你已有书面实现计划，并准备在单独会话中执行它时使用。
---

# 按计划执行

## 概览

加载计划、严格审阅、逐项执行、完成后汇报。

**开场必须说明：**  
“我正在使用 executing-plans skill 来实现这份计划。”

**注意：**  
告诉你的 human partner：如果平台支持子代理（例如 Claude Code 或 Codex），Superpowers 与子代理配合时效果会明显更好。若可用，应优先使用 `subagent-driven-development`。

## 第一步：加载并审阅计划

1. 读取计划文件
2. 严格审阅，找出问题或疑问
3. 如果有重大问题，先和 human partner 讨论
4. 如果没有问题，创建 TodoWrite 并开始执行

## 第二步：执行任务

对每个任务：

1. 标记为 `in_progress`
2. 严格照计划中的每一步执行
3. 按计划运行验证
4. 验证通过后标记为 `completed`

## 第三步：完成开发

所有任务完成且验证通过后：

- 说明：  
  “我正在使用 finishing-a-development-branch skill 来完成这项工作。”
- 必须使用 `superpowers:finishing-a-development-branch`

## 何时应停止并寻求帮助

以下情况必须立刻停下：

- 被缺依赖、测试失败、指令不清等问题阻塞
- 计划本身存在关键缺口
- 你不理解某条指令
- 验证反复失败

不要靠猜测硬推。

## 何时回到审阅阶段

如果：

- human partner 更新了计划
- 基本方案需要重想

就回到“加载并审阅计划”。

## 牢记

- 先批判性审阅
- 严格照计划执行
- 不跳过验证
- 计划引用 skill 时必须调用
- 一旦被阻塞就停下，不要猜
- 未经明确同意，不要在 `main/master` 上实施

## 与其他 skill 的关系

- `using-git-worktrees` - 在开始前设置隔离工作区
- `writing-plans` - 用来生成本 skill 执行的计划
- `finishing-a-development-branch` - 在实现结束后做收尾
