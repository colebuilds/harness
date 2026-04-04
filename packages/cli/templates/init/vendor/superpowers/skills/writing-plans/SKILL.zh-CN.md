---
name: writing-plans
description: 当你已有 spec 或多步骤任务需求、但还未动代码时使用。
---

# 编写实现计划

## 概览

编写完整的实现计划，假设执行工程师对代码库几乎没有上下文、判断力一般、测试能力也一般。  
把他需要知道的所有信息都写进去：要改哪些文件、要写什么代码、如何测试、需要查哪些文档。  
任务要拆成小而明确的步骤。坚持 DRY、YAGNI、TDD 和频繁提交。

**开场必须说明：**  
“我正在使用 writing-plans skill 来创建 implementation plan。”

**上下文：**  
这个 skill 应在独立 worktree 中使用（由 `brainstorming` 创建）。

**计划保存位置：**

- `docs/superpowers/plans/YYYY-MM-DD-<feature-name>.md`

## 范围检查

如果 spec 覆盖了多个相互独立的子系统，就应该先拆成多个 plan。  
每个 plan 都应独立产出可工作的、可测试的软件。

## 文件结构先行

在定义任务之前，先梳理会创建或修改哪些文件，以及每个文件负责什么。

- 文件应有清晰职责和明确接口
- 文件尽量小而聚焦
- 经常一起变化的文件应放在一起
- 在已有代码库里遵循现有模式
- 如果正在修改的大文件已经失控，把拆分写进 plan 是合理的

## 任务粒度

**每一步只做一个动作（2-5 分钟）：**

- 写失败测试
- 运行它，确认失败
- 写最小实现
- 再运行测试，确认通过
- 提交

## 计划文档头部

每份计划必须以以下头部开头：

```markdown
# [Feature Name] Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** [一句话描述本计划构建什么]

**Architecture:** [2-3 句说明方案]

**Tech Stack:** [关键技术/库]

---
```

## 任务结构

````markdown
### Task N: [组件名]

**Files:**

- Create: `exact/path/to/file.py`
- Modify: `exact/path/to/existing.py:123-145`
- Test: `tests/exact/path/to/test.py`

- [ ] **Step 1: Write the failing test**

```python
def test_specific_behavior():
    result = function(input)
    assert result == expected
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pytest tests/path/test.py::test_name -v`
Expected: FAIL with "function not defined"

- [ ] **Step 3: Write minimal implementation**

```python
def function(input):
    return expected
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pytest tests/path/test.py::test_name -v`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add tests/path/test.py src/path/file.py
git commit -m "feat: add specific feature"
```
````

## 不允许占位符

以下内容都是计划失败，不要写：

- `TBD`、`TODO`、`implement later`
- “补适当的错误处理”
- “处理边界情况”
- “为上面内容写测试”但不给出真实测试代码
- “类似 Task N”这种跳转式说明
- 只描述动作、不展示代码
- 后续任务引用了前面未定义的类型、函数或方法

## 始终记住

- 永远写精确文件路径
- 代码步骤必须附完整代码
- 命令必须精确，且给出预期输出
- 遵守 DRY、YAGNI、TDD、频繁提交

## 自检

写完整份计划后，做一次自检：

1. **Spec 覆盖检查** - spec 中每条需求都能映射到 plan 里的某个任务吗？
2. **占位符扫描** - 是否出现上面“不允许”的红旗内容？
3. **类型一致性** - 后续任务中的函数名、类型名、字段名是否和前面一致？

有问题就直接修正，不要停在“先记录问题”。

## 执行交接

保存计划后，要给用户两个执行选项：

**“Plan 已完成并保存到 `docs/superpowers/plans/<filename>.md`。有两种执行方式：**

**1. Subagent-Driven（推荐）** - 每个任务派一个全新子代理执行，任务间自动 review，迭代快  
**2. Inline Execution** - 在当前会话中用 `executing-plans` 按批次执行，并设置检查点

**请选择。”**

如果用户选择：

- **Subagent-Driven**
  - 必须使用 `superpowers:subagent-driven-development`

- **Inline Execution**
  - 必须使用 `superpowers:executing-plans`
