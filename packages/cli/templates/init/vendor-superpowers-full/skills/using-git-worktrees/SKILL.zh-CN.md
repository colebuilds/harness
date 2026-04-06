---
name: using-git-worktrees
description: 在为一项已批准的工作开始实施前使用，通过 worktree 创建隔离开发环境。
---

# 使用 Git Worktree 进行隔离开发

## 目标

为即将开始的实现创建独立工作区，避免污染当前目录或主分支。

## 基本原则

- 不要直接在主工作区里实现较大任务
- 每项正式工作默认应有独立分支 / worktree
- 在进入实现前确认基线可运行

## 推荐流程

1. 选择分支名
2. 创建新的 git worktree
3. 在新 worktree 中安装 / 校验依赖
4. 运行基线测试，确认当前环境是干净的
5. 之后再开始写代码

## 需要确认的事项

- 分支命名清晰
- worktree 路径明确
- 当前 baseline 能通过最小验证
- 新工作区与旧工作区互不污染

## 红旗

- 用户未同意就直接在 `main/master` 上改
- 不验证基线是否可运行
- 多个任务共用同一个脏工作区
- 在不清楚当前分支状态时开始工作

## 与其他 skill 的关系

- `brainstorming` 批准设计后，通常进入本 skill
- `writing-plans` 依赖一个稳定的工作环境
- `finishing-a-development-branch` 负责最后收尾
