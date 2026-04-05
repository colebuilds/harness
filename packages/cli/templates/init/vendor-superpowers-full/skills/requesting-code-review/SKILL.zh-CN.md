---
name: requesting-code-review
description: 在完成任务、实现重要功能或合并前使用，以验证当前工作是否满足要求。
---

# 发起代码评审

派发 `superpowers:code-reviewer` 子代理，在问题扩散前先发现问题。

reviewer 应只拿到精确构造的评审上下文，而不是你的整段会话历史。  
这样既能让 reviewer 聚焦于结果物，也能保留你的主会话上下文。

**核心原则：**  
尽早 review，频繁 review。

## 何时必须发起 review

**必须：**

- 在子代理驱动开发中，每个任务之后
- 完成一个重要功能之后
- 合并到主干之前

**可选但有价值：**

- 你卡住的时候
- 重构之前
- 修完复杂 bug 之后

## 如何发起

### 1. 获取 git SHAs

```bash
BASE_SHA=$(git rev-parse HEAD~1)  # 或 origin/main
HEAD_SHA=$(git rev-parse HEAD)
```

### 2. 派发 `code-reviewer`

使用 `requesting-code-review/code-reviewer.md` 模板，填入：

- `{WHAT_WAS_IMPLEMENTED}` - 你刚做了什么
- `{PLAN_OR_REQUIREMENTS}` - 计划或要求是什么
- `{BASE_SHA}` - 起始提交
- `{HEAD_SHA}` - 当前提交
- `{DESCRIPTION}` - 简短说明

### 3. 根据反馈行动

- `Critical` - 立即修
- `Important` - 继续前必须修
- `Minor` - 可以记录后续处理
- 如果 reviewer 判断错误，可以用技术依据反驳

## 示例

你刚完成 Task 2 后：

- 获取 `BASE_SHA` / `HEAD_SHA`
- 派 reviewer
- 根据结果修复问题
- 再继续下一个任务

## 与其他工作流的关系

### 子代理驱动开发

- 每个任务后都 review
- 在问题累计前修掉

### 执行计划

- 每 3 个任务或每一批次后 review

### 临时开发

- 至少在合并前 review
- 卡住时也可以 review

## 红旗

**绝不要：**

- 因为“这个很简单”就跳过 review
- 忽视 `Critical`
- 带着未修复的 `Important` 继续推进
- 对合理的技术反馈强行争论

如果 reviewer 错了：

- 用技术理由回应
- 展示代码或测试证据
- 必要时请求澄清
