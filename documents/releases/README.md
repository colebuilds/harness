---
title: Harness 发布验收记录目录说明
type: guide
status: draft
owner: cole
scope: 发布前人工验收记录的归档约定
applies_to: human, ai-agent
---

# Harness 发布验收记录目录说明

## 1. 目录定位

本目录用于存放每次 PR 合并前或版本发布前的人工验收记录。

这里不是模板目录，而是：

- 实际验收记录归档目录
- 发布前人工确认的长期证据

---

## 2. 命名约定

建议文件名格式：

```text
YYYY-MM-DD-<version-or-pr>-release-verification.md
```

例如：

- `2026-04-04-v0.1.0-release-verification.md`
- `2026-04-04-pr-12-release-verification.md`

---

## 3. 内容来源

每次记录应基于以下模板生成：

- `documents/release-verification-template.md`

可参考：

- `documents/release-verification-example.md`

---

## 4. 最低要求

每份发布验收记录至少应包含：

- 基本信息
- 自动化前置结果
- 初始化结果确认
- `复述需求` 验收
- `开始执行` 验收
- Planner / Debug / Review 工作流验收
- 异常与偏差记录
- 最终结论

---

## 5. PR 填写要求

如果通过 Pull Request 合并：

- PR 描述中的 `record path` 应指向本目录中的实际文件
- 不要只写“已验证”，要有可追溯记录

---

## 6. 一句话原则

**模板用于指导，`documents/releases/` 用于留痕。**
