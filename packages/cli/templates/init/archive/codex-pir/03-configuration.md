---
title: Codex PIR 配置说明
type: guide
status: draft
owner: cole
scope: Codex 配置、Profile、AGENTS.md、MCP 与项目约定
applies_to: human, ai-agent
---

# Codex PIR 配置说明

## 1. 文档定位

本文档用于说明如何将 Codex PIR 协作体系落地到实际的 Codex 使用环境中。

本文档重点回答的问题是：

- 哪些配置属于 Codex 官方能力
- 哪些约定属于项目私有结构
- `config.toml`、`AGENTS.md`、Skills、Prompts 分别放什么
- 如何设计 `plan / dev / review` 三个核心 Profile
- 前端项目推荐使用哪些配置和 MCP
- 当前这些配置在整体产品中处于哪一层

本文档不负责说明：

- 三个角色的职责边界
- 功能开发、Bug 修复、复杂任务的完整流程
- 各角色的 Prompt 正文

这些内容分别由 `01-roles.md`、`02-workflows.md`、`04-prompts.md` 负责。

---

## 2. 当前文档的边界

这篇文档描述的是：

**当前 `adapter-codex` 发行版中的配置落地方式。**

它不等于未来所有宿主共享的通用配置文档。

也就是说：

- 这里的 `config.toml`
- 这里的 `plan / dev / review`
- 这里的 `AGENTS.md` 组织方式
- 这里的 Codex skills / prompts 接入方式

都优先服务于：

- 当前 `Codex Harness`
- 当前 `adapter-codex`
- 当前 Codex-first 工作骨架

长期来看，`Harness` 作为产品本体应保持宿主无关；但当前这篇配置文档，明确是：

**Codex 适配层配置说明。**

---

## 3. 配置分层原则

PIR 的落地必须分层，否则规则、配置、流程、提示词会混在一起。

推荐分成四层：

### 3.1 Codex 运行配置层

负责 Codex 的运行方式，例如：

- 模型
- 审批策略
- 沙箱模式
- MCP
- Profiles

主要承载位置：

- `~/.codex/config.toml`
- `<repo>/.codex/config.toml`

### 3.2 项目协作规则层

负责定义项目内的硬规则，例如：

- 哪些目录不能碰
- 代码改动前要先做什么
- 哪些文档必须看
- 项目私有 prompts / skills 如何使用

主要承载位置：

- `AGENTS.md`

### 3.3 Skills 层

负责定义任务执行方式与工作流约束，例如：

- 规划怎么做
- 实现怎么做
- Debug 怎么做
- Review 怎么做

Skills 解决的是“如何执行”。

### 3.4 Prompts 层

负责定义角色在不同阶段的输出模板和表达结构，例如：

- Planner Prompt
- Implementer Prompt
- Reviewer Prompt
- Debug Prompt
- Orchestration Prompt

Prompts 解决的是“如何组织思考和输出”。

---

## 4. 用户级配置

用户级配置通常放在：

- `~/.codex/config.toml`

它适合承载跨项目通用配置，例如：

- 默认模型
- 默认审批策略
- 默认沙箱策略
- 常用 MCP
- 全局默认 Profile
- 可信项目列表

用户级配置不适合承载：

- 单个项目特有的目录规则
- 某个项目的 UI 规范
- 某个项目私有 prompts 的触发方式

这些应放到项目规则层，而不是全局配置层。

---

## 5. 项目级配置

项目级配置通常放在：

- `<repo>/.codex/config.toml`

它适合承载该项目专用的运行配置，例如：

- 项目默认 Profile
- 项目专用 MCP
- 项目内附加可写目录
- 与当前项目栈密切相关的搜索或工具设置

项目级配置应尽量聚焦运行参数，而不是承载长篇行为规则。

项目级 `.codex/config.toml` 生效的前提通常包括：

- 项目路径已被 Codex 视为可信项目
- 当前环境支持 project-scoped config

---

## 6. AGENTS.md 的职责

`AGENTS.md` 是 PIR 落地中最重要的项目规则入口。

它适合定义：

- 项目级协作规则
- 修改前置要求
- 目录边界
- 文档路由
- 审查要求
- 项目内 prompts / skills 的使用约定

`AGENTS.md` 应重点说明：

- 当前项目推荐的角色切换方式
- 当前项目需要遵守的流程
- 哪些任务必须先分析
- 哪些类型任务优先使用哪些 skill
- 项目内 prompts 目录如何使用
- 项目内 skill 目录如何使用

`AGENTS.md` 不适合放：

- 大量可复用 prompt 正文
- 全量 `config.toml` 字段说明
- 与当前项目无关的通用方法论长文

---

## 7. Profiles 设计

PIR 推荐至少设计三个核心 Profile：

- `plan`
- `dev`
- `review`

Profile 解决的是运行模式问题，不解决角色定义问题。

### 7.1 `plan`

适用阶段：

- `Planner`

建议特征：

- 只读
- 高推理
- 可查资料
- 不进入代码修改

典型目标：

- 产出计划
- 拆解复杂任务
- 收集上下文
- 形成实施边界

### 7.2 `dev`

适用阶段：

- `Implementer`

建议特征：

- 工作区可写
- 正常推理强度
- 可执行必要命令
- 可运行最小必要验证

典型目标：

- 实现功能
- 修复 bug
- 补测试
- 验证代码修改

### 7.3 `review`

适用阶段：

- `Reviewer`

建议特征：

- 只读
- 高推理
- 不执行代码修改
- 输出结构化审查结论

典型目标：

- 识别缺陷
- 识别风险
- 检查测试缺口
- 对照计划进行审查

### 7.4 可选扩展 Profile

如果项目需要，也可以增加：

- `debug`
- `fast-fix`
- `docs`

但在 PIR 中，推荐优先保持三 Profile 稳定，避免过度拆分。

---

## 8. Skills 目录约定

PIR 需要区分官方默认 Skills 和项目私有 Skills。

### 8.1 官方默认 Skills

Codex 官方默认可识别的全局 Skills 目录通常是：

- `~/.codex/skills/*/SKILL.md`

这适合放跨项目复用的 Skills。

### 8.2 项目私有 Skills

若项目中存在以下目录，例如：

- `skills/*/SKILL.md`
- `.repo-local-skills/*/SKILL.md`
- `.agents/skills/*/SKILL.md`

应明确理解：

- 这些不是 Codex 官方默认自动发现目录
- 它们属于项目私有约定
- 是否使用、何时使用，应由 `AGENTS.md` 明确说明

### 8.3 PIR 对项目私有 Skills 的建议

如果项目采用私有 Skills，建议在 `AGENTS.md` 中说明：

- 当前项目的 Skills 目录路径
- 哪些任务命中哪些 Skills
- 项目私有 Skills 只作为补充能力
- 项目私有 Skills 不替代 `AGENTS.md` 的硬规则

---

## 9. MCP 选择原则

MCP 的作用是给 Codex 增加外部能力，而不是替代 PIR 本身。

前端项目建议优先考虑以下能力：

- 文档查询
- 仓库协作
- 浏览器验证
- 页面自动化
- 必要时的联网搜索

推荐原则如下：

### 9.1 少而精

不要一次启用过多 MCP。
应优先保留高频、稳定、可验证的能力。

### 9.2 与任务类型匹配

前端项目常见高价值 MCP 通常包括：

- 浏览器自动化相关
- DevTools 相关
- 仓库和 PR 相关
- 文档检索相关

### 9.3 只给需要的权限

若 MCP 的某些工具可能带来较高风险，应通过审批模式进行收紧，例如：

- 浏览器点击
- 页面输入
- 代码执行
- 页面导航

---

## 10. 推荐最小配置

以下是适合 PIR 的最小配置思路：

### 10.1 用户级配置建议至少包含

- 默认模型
- 默认审批策略
- 默认沙箱模式
- 可信项目列表
- 最常用 MCP
- 默认 Profile

### 10.2 项目级配置建议至少包含

- 项目默认 Profile
- 与当前项目相关的 MCP 补充设置
- 当前项目的搜索和工具策略

### 10.3 AGENTS.md 建议至少包含

- 角色切换约定
- 先分析后实现原则
- 复杂任务的 orchestration 规则
- Bug 修复的 debug 流程约束
- 项目私有 Skills / Prompts 目录约定
- 验证要求
- 文档路由要求

---

## 11. 前端项目增强配置

对于前端项目，PIR 推荐在配置上额外关注以下内容：

### 11.1 浏览器验证能力

前端任务高度依赖页面行为验证，因此建议优先接入：

- 浏览器自动化相关 MCP
- DevTools 相关 MCP

### 11.2 文档与最新资料能力

前端框架、构建工具、测试工具变化较快，因此建议：

- 在需要时启用网页搜索
- 优先参考官方文档
- 对框架行为和配置项以官方资料为准

### 11.3 验证要求

前端 `Implementer` 应优先具备以下验证意识：

- 页面是否能正常加载
- 关键交互是否可用
- 移动端或响应式是否受影响
- 样式是否异常
- 相关 lint / typecheck / test 是否通过

### 11.4 Profile 选择建议

前端项目中：

- 分析需求时优先用 `plan`
- 编写功能或修复 bug 时优先用 `dev`
- 做代码审查时优先用 `review`

---

## 12. 常见误区

### 12.1 把 `config.toml` 当成规则总仓库

错误做法：

- 在 `config.toml` 中写大量流程规则和任务边界

正确做法：

- `config.toml` 只放运行配置
- 流程规则放 `AGENTS.md`
- Prompt 文本放 `prompts/`

### 12.2 认为项目私有 Skills 会被自动发现

错误做法：

- 认为 `skills/*` 或 `.agents/skills/*` 会被 Codex 自动加载

正确做法：

- 将其视为项目私有约定
- 在 `AGENTS.md` 里明确目录和触发规则

### 12.3 把 Profile 当工作流

错误做法：

- 认为切到 `review` profile 就已经自动进入 `Reviewer`

正确做法：

- Profile 只决定运行配置
- 当前阶段仍需要由角色和工作流定义来约束

### 12.4 MCP 配太多

错误做法：

- 把大量低频 MCP 一次性全部打开

正确做法：

- 只启用当前项目真正高频、稳定、有验证价值的 MCP

---

## 13. 一句话总结

PIR 的配置落地原则是：

- `config.toml` 管运行方式
- `AGENTS.md` 管项目规则
- Skills 管执行工作流
- Prompts 管输出结构

同时必须明确：

**这篇文档描述的是当前 `adapter-codex` 的配置落地方式，而不是未来所有宿主共享的统一配置层。**
