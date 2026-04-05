---
title: Codex PIR 安装与项目接入
type: guide
status: draft
owner: cole
scope: Codex-first 发行版的安装、初始化、校验与升级入口
applies_to: human, ai-agent
---

# Codex PIR 安装与项目接入

## 1. 文档定位

本文档用于说明当前 `Codex Harness` 第一版发行形态中，用户如何将 Codex PIR 工作骨架接入到自己的项目中。

本文档重点回答的问题是：

- 用户如何安装当前版本
- 项目接入后会得到什么
- `init / doctor / upgrade` 分别承担什么职责
- 哪些文件是产品写入的
- 哪些文件是项目后续自行演进的

本文档描述的是：

**当前 `adapter-codex` 的接入方式。**

---

## 2. 当前接入目标

当前接入目标不是让用户手工复制一堆配置，而是逐步收敛为正式命令面。

理想形态应为：

```bash
pnpm dlx harness-codex init
pnpm dlx harness-codex doctor
pnpm dlx harness-codex upgrade
```

其中第一阶段最重要的是：

- `init`

它负责建立项目中的最小可用 Codex 工作骨架。

---

## 3. 用户接入后应获得什么

当用户将当前版本接入自己的项目后，预期应获得：

- Codex 项目级配置入口
- 项目级 `AGENTS.md` 入口规则
- `PIR` 角色与 workflow 约定
- `plan / dev / review` profile 约定
- 文档产物化规则
- skill workflow 接入约定
- 当前项目的 Codex-first 工作方式

一句话说：

用户接入后，得到的不是“一个模型”，而是：

**一套让 Codex 在项目中稳定拆解复杂需求、持续执行并沉淀文档的工作骨架。**

---

## 4. `init` 的职责

`init` 是当前最重要的初始化命令。

它的职责应包括：

### 4.1 检测项目环境

至少检测：

- 当前是否为受支持项目目录
- 当前是否已有相关 Codex 配置
- 当前是否已有项目级规则入口
- 当前是否已有文档目录与工程治理结构

### 4.2 写入或合并项目级配置

例如：

- `.codex/config.toml`
- 必要的 profile 默认值
- 项目级运行参数

### 4.3 建立项目级入口规则

例如：

- `AGENTS.md`
- 项目私有 skills / prompts 的路由说明
- 文档路由说明

### 4.4 接入工作流与模板

例如：

- `codex-pir` 约定
- skill workflow 约定
- requirement / design / delivery / evolution 文档模板

### 4.5 输出下一步使用说明

初始化完成后，应明确告诉用户：

- 现在已经接入了什么
- 下一步怎么开始用
- 哪些目录是项目级资产
- 哪些内容后续可继续定制

---

## 5. `doctor` 的职责

`doctor` 用于检查项目当前是否仍处于健康接入状态。

它的职责应包括：

- 检查关键文件是否存在
- 检查关键配置是否缺失
- 检查项目级入口是否有效
- 检查 skills / prompts / 文档模板是否缺失
- 输出修复建议

它不负责重建整个项目，而负责：

**告诉用户当前接入是否完整。**

---

## 6. `upgrade` 的职责

`upgrade` 用于把产品的新版本变更同步到已有项目中。

它的职责应包括：

- 更新模板
- 更新默认规则
- 更新配置默认值
- 更新文档骨架
- 提示哪些部分需要人工确认

它不应默认无脑覆盖用户自定义内容，而应：

- 尽量合并
- 尽量提示差异
- 尽量保护项目私有修改

---

## 7. 接入后会写入哪些内容

当前版本接入项目后，通常会涉及以下类型内容。

### 7.1 配置类

例如：

- `.codex/config.toml`
- profile 默认值
- 必要的运行参数

### 7.2 项目规则类

例如：

- `AGENTS.md`
- 项目级入口规则
- 文档路由规则

### 7.3 文档模板类

例如：

- requirement 文档模板
- design 文档模板
- delivery 文档模板
- evolution 文档模板

### 7.4 workflow / skill 约定类

例如：

- skill 使用说明
- role -> skill mapping
- 本地 skill 接入目录约定

---

## 8. 哪些属于产品写入，哪些属于项目演进

这条边界必须清楚。

### 8.1 属于产品写入的内容

通常包括：

- 初始配置骨架
- 初始 `AGENTS.md` 模板
- 初始文档模板
- 初始 skill / prompt 路由约定

### 8.2 属于项目后续演进的内容

通常包括：

- 项目私有规则
- 项目私有文档
- 项目私有 skills
- 项目私有 prompt 细化
- 项目实际 requirement / design / delivery / evolution 产物

也就是说：

产品负责建立骨架，项目负责在骨架内演进。

---

## 9. 当前阶段的接入原则

### 9.1 先保证开箱可用

当前最优先目标不是接入选项特别多，而是：

- 初始化后能直接工作
- 角色与 workflow 能直接使用
- 文档与规则能直接落地

### 9.2 先服务 Codex-first

当前接入不追求多宿主通用入口，而优先围绕：

- Codex 配置
- Codex 项目规则入口
- Codex-first workflow

### 9.3 先建立正式骨架，再做深度定制

当前阶段更重要的是：

- 统一入口
- 统一骨架
- 统一规则

而不是一开始就暴露过多高级扩展点。

---

## 10. 一句话总结

**当前安装与项目接入的目标，是把 `adapter-codex` 的工作骨架稳定写进用户项目：先通过 `init` 建立最小可用系统，再通过 `doctor` 和 `upgrade` 支撑后续校验与演进。**
