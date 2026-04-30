# AGENTS.md

这个仓库是按适合 agent 协作的方式初始化的。

## 先看哪里

1. 先读 `docs/README.md`，了解文档怎么组织。
2. 再读 `docs/project-context.md`，弄清项目背景和目标。
3. 如需了解整体推进方向，先看 `plans/project-plan.md`。
4. 如需规划较大任务，再看 `plans/README.md`。
5. 改完东西后，跑 `scripts/validate.sh`。

## 基本约定

- 这个文件只做导航，不写成长篇手册。
- 能长期复用的信息写进 `docs/` 和 `plans/`，不要只留在聊天里。
- 小任务和小项目不强制先写计划。
- 中大型任务是否先写执行计划，由后续 code agent 结合任务复杂度判断，并先征求用户确认。
- 如果决定采用计划驱动开发，正在执行的计划放在 `plans/active/`，完成后归档到 `plans/archive/done/`，放弃或停止的归档到 `plans/archive/abandoned/`。
- 执行计划文件名建议使用英文 kebab-case，并带三位序号，例如 `001-init-code-frame.md`；文件内容写中文。
- `plans/project-plan.md` 用来记录项目宏观计划，不替代具体执行计划。
- 需要人拍板的地方要明确写出来，不要自己脑补。
