# zoo-cards

一个基于 GitHub Pages 部署的响应式 AI 安全知识卡片网站。

首版定位是 **动物园风格知识卡片站**，在卡片体系之上提供 **“今天学什么”探索路径原型**，让用户既能随手浏览，也能按主题逐步学习。

## 项目目标

- 做出一个好看、能分享、能运行的 MVP
- 优先保证手机和 PC 的良好体验
- 用 `MDX` 驱动知识卡片内容
- 用静态导出方式部署到 GitHub Pages

## 当前已落地的应用骨架

- `Next.js` App Router 应用骨架
- `Tailwind CSS` 基础样式层
- `content/cards/` 路径驱动的示例知识卡片
- `content/paths/` 含时长 / 难度 / 学习收获的探索路径
- 首页、卡片页、卡片详情页、路径页、About 页最小壳子
- 卡片页第一版搜索 / 分类 / 标签筛选
- 可执行的统一验证入口 `scripts/validate.sh`

## 本地开发

```bash
npm install
npm run dev
```

## 验证与构建

```bash
./scripts/validate.sh
```

该脚本当前会执行：
- `npm run typecheck`
- `npm run build`

## GitHub Pages 发布

当前仓库已准备好 GitHub Pages workflow：
- workflow 文件：`.github/workflows/deploy-pages.yml`
- 目标发布地址：`https://tim-zoo.github.io/zoo-cards/`
- workflow 假设默认分支为：`main`

发布方式：
1. 推送到 `main`
2. GitHub Actions 自动构建并部署 Pages
3. 首次发布时，在仓库设置中确认 Pages source 使用 **GitHub Actions**

## 内容目录

- `content/cards/*.mdx` —— 知识卡片内容
- `content/paths/*.json` —— 探索路径配置

## 关键入口

- `AGENTS.md` —— coding agent 快速导航
- `docs/README.md` —— 项目知识索引
- `plans/README.md` —— 计划工作流说明
- `plans/active/` / `plans/archive/` —— 执行计划流转
- `scripts/validate.sh` —— 验证入口

## 当前状态

应用代码骨架、静态导出链路、示例内容和最小页面壳子已经打通，首页视觉、卡片页第一版筛选体验、以及探索路径第一轮导览增强都已落地。当前也已补上 GitHub Pages 自动部署准备，后续可继续推进首次远端发布与更完整的浏览体验。
