# 内容模型

首版先围绕 5 类核心对象建模。

## 1. Card

表示一个可独立浏览、可被分享的知识卡片。

建议最小字段：
- `slug`：稳定唯一标识
- `title`：标题
- `summary`：一句话摘要
- `category`：主分类
- `tags`：标签列表
- `status`：如 draft / published
- `relatedCardSlugs`：相关推荐
- `order` 或 `publishedAt`：排序辅助字段
- `content`：正文内容（MDX）

### Card 不变量
- `slug` 必须唯一
- `title` 允许调整，但 `slug` 应尽量稳定
- `relatedCardSlugs` 中引用的卡片必须存在
- `category` 应来自受控集合，而不是任意字符串漂移

## 2. Category

表示用户浏览时的一级主题分组。

建议字段：
- `slug`
- `name`
- `description`
- `order`

### 作用
- 承担主要浏览入口
- 帮助首页和列表页组织信息

## 3. Tag

表示跨分类的主题标签。

建议字段：
- `slug`
- `name`
- `description`（可选）

### 作用
- 用于横向关联内容
- 支持更细粒度筛选和探索

## 4. Path

表示一条“今天学什么”式探索路径。

建议字段：
- `slug`
- `title`
- `summary`
- `audience`：适合谁
- `theme`：路径主题
- `difficulty`：路径难度（如 easy / medium / deep）
- `durationMinutes`：预计阅读时长
- `outcomes`：读完会得到什么
- `stepSlugs`：步骤顺序

### Path 不变量
- 每个步骤都必须指向真实卡片
- 步骤顺序要有明确学习意图
- `outcomes` 如果存在，应是面向用户的清晰学习收获，而不是内部备注
- 首版不追求自动生成路径，先人工设计高质量路径

## 5. PathStep

PathStep 可以显式建模，也可以先作为 Path 内的结构化项存在。

建议字段：
- `cardSlug`
- `whyThisStep`：为什么现在看这一步
- `nextHint`：下一步提示

### 作用
- 让路径不是简单链接列表，而是具备学习引导感

## 对首页和页面的直接影响

- 首页会围绕 Category、Tag、Path、推荐 Card 组织内容
- 卡片详情页会消费 Card 和 relatedCardSlugs
- 路径页会消费 Path / PathStep 结构

## 当前明确不做

- 不做用户个人学习进度模型
- 不做评论、收藏、评分等交互模型
- 不做多作者协作审批流模型
- 不做复杂图谱节点和边的通用模型

## 后续可能演进

如果内容规模变大，可以再考虑：
- 抽出共享 frontmatter schema
- 引入更明确的 content index
- 为路径增加难度等级、预估时长、前置知识等字段
