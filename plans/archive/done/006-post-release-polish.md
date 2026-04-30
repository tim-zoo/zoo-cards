# 小改动计划

## 基本信息

- 状态：done
- 创建时间：2026-04-30 16:07 CST
- 最近更新时间：2026-04-30 16:35 CST
- 相关文件：
  - `app/layout.tsx`
  - `app/page.tsx`
  - `app/cards/[slug]/page.tsx`
  - `components/card-tile.tsx`
  - `components/cards-explorer.tsx`
  - `components/path-tile.tsx`
  - `app/paths/[slug]/page.tsx`
  - `lib/display.ts`

## 目标

做一轮上线后巡检小修，优先解决用户可感知但改动范围较小的问题。

## 约束

- 不改内容模型
- 不引入新依赖
- 保持现有构建与静态导出稳定

## 可能改动的文件

- 页面 metadata
- 分类/难度文案展示
- 少量首页与详情页展示文案

## 验证方式

- `./scripts/validate.sh`
- 抽查首页、卡片页与路径页静态文案输出

## 风险

- 改动虽然小，但会触发多页面静态重建
- 分类显示替换需要保持各处一致

## 完成结果

- 修复首页默认 metadata，补齐更明确的中文标题与站点描述
- 增加 `metadataBase` 与基础 Open Graph / Twitter metadata
- 新增 `lib/display.ts` 统一分类与路径难度展示文案
- 将用户可见分类文案从中英混用统一为中文：`Threat Basics` → `风险基础`，`Defense Patterns` → `防护模式`
- 已覆盖首页、卡片列表、卡片详情、路径列表、路径详情的对应展示

## 验证结果

- `./scripts/validate.sh` 通过
- 静态导出产物抽查通过：首页、卡片页、路径页 title 与中文分类文案均已正确输出

## 下一步

经园长确认后，commit、push，并等待 GitHub Pages 自动部署完成。
