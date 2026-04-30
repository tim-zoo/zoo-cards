# 执行计划

## 基本信息

- 状态：done
- 创建时间：2026-04-30 15:49 CST
- 最近更新时间：2026-04-30 15:52 CST
- 相关文件：
  - `.github/workflows/deploy-pages.yml`
  - `next.config.mjs`
  - `package.json`
  - `README.md`

## 背景

001 到 004 已经把站点骨架、首页、卡片浏览和探索路径都做到了可静态导出。现在最值得补的是自动部署链路，让这个项目一旦推到 GitHub，就能直接发布到 GitHub Pages 给园长看。

## 目标

- 为 `tim-zoo/zoo-cards` 准备 GitHub Pages 自动部署工作流
- 确保构建阶段对 project pages 的 basePath 处理正确
- 明确本地到远端的最短发布路径
- 保持当前静态导出能力稳定

## 非目标

- 本计划不做自定义域名
- 不引入额外托管平台
- 不在本阶段优化 SEO 细节
- 不直接 push 到远端，除非园长明确确认

## 当前状态

本阶段已完成：
- 已新增 `.github/workflows/deploy-pages.yml`
- workflow 已按 `main` 分支触发并使用 GitHub Actions 发布 Pages
- README 已补充 Pages 发布说明与目标地址
- 本地分支已从 `master` 调整为 `main`
- `./scripts/validate.sh` 已再次验证通过

本阶段仍未完成但不属于 005 本地准备范围：
- 远端仓库尚未创建或绑定
- 首次 push 尚未执行
- GitHub 仓库中的 Pages source 还需要在首次发布时确认使用 GitHub Actions

## 设计思路

### 1. 先把自动部署准备好
优先把 workflow 配到“推上去就能发”的程度。

### 2. 明确 project pages 场景
如果仓库发布到 `https://tim-zoo.github.io/zoo-cards/`，构建时必须带正确 `basePath`。

### 3. 保持本地和远端边界清楚
本计划可以把本地配置全部准备好，但真正创建远端仓库、push、发布，仍属于外部动作，需要园长确认。

## 实施步骤

### Step 1，准备 GitHub Pages workflow
- 创建构建与部署 workflow
- 配置 Pages 权限和 artifact 上传
- 使用 Actions 部署到 Pages

### Step 2，收拢分支与仓库假设
- 将本地默认分支调整为 `main`
- 约定目标仓库为 `tim-zoo/zoo-cards`

### Step 3，补 README 发布说明
- 写清本地运行
- 写清部署假设
- 写清 push 后的发布路径

### Step 4，验证本地构建
- 跑 `./scripts/validate.sh`
- 确认 workflow 所需构建环境与当前项目一致

## 验证方案

本计划完成后，至少应满足：
- 仓库具备 GitHub Pages 自动部署 workflow
- README 说明清楚发布路径和前提
- 本地构建继续通过
- 园长一旦确认 push，就可以进入远端仓库创建/推送/Pages 发布动作

## 风险与回滚

### 主要风险
- project pages 的 basePath 配错
- GitHub Pages 源设置与 workflow 方式不一致
- 本地分支名与远端默认分支预期不一致

### 控制方式
- 构建时显式传入 `NEXT_PUBLIC_BASE_PATH=/zoo-cards`
- 使用官方 Pages Actions 流程，而不是手工分支产物
- 本地分支统一到 `main`

## 决策日志

- 2026-04-30：005 确认为“GitHub Pages 自动部署接入”
- 2026-04-30：本地分支统一调整为 `main`
- 2026-04-30：Pages workflow 使用官方 Actions 上传与部署流程
- 2026-04-30：本地构建再次验证通过，静态导出稳定

## 下一步

005 已完成。下一步如果园长确认 push，就继续做：
- 创建 `tim-zoo/zoo-cards` 远端仓库
- 首次 commit
- 首次 push
- 确认 Pages 发布成功
