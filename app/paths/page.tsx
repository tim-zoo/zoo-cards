import { PathTile } from "@/components/path-tile";
import { getAllPaths } from "@/lib/content";

export const metadata = {
  title: "探索路径 | zoo-cards",
};

export default function PathsPage() {
  const paths = getAllPaths();
  const totalMinutes = paths.reduce((sum, pathItem) => sum + (pathItem.durationMinutes ?? 0), 0);

  return (
    <div className="space-y-10 sm:space-y-12">
      <section className="surface-strong p-6 sm:p-8 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            <p className="eyebrow">today, learn this</p>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">探索路径</h1>
            <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              路径页不只是把卡片排成顺序，而是把“适合谁、先看什么、为什么现在看这一步”一起交给用户。当前版本先用少量高质量路径，验证导览体验是否成立。
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            <div className="hero-metric">
              <p className="text-sm font-medium text-amber-900">当前路径</p>
              <p className="mt-2 text-3xl font-semibold text-amber-950">{paths.length}</p>
            </div>
            <div className="hero-metric">
              <p className="text-sm font-medium text-emerald-900">覆盖步骤</p>
              <p className="mt-2 text-3xl font-semibold text-emerald-950">{paths.reduce((sum, pathItem) => sum + pathItem.steps.length, 0)}</p>
            </div>
            <div className="hero-metric">
              <p className="text-sm font-medium text-sky-900">预计时长</p>
              <p className="mt-2 text-3xl font-semibold text-sky-950">{totalMinutes || "-"}</p>
              <p className="mt-1 text-xs text-sky-700">分钟</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="surface p-5">
          <p className="eyebrow">choose</p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">先按主题选</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">先看你更关心“AI 安全入门”还是“Agent 工具风险”，不要急着一口气全读。</p>
        </article>
        <article className="surface p-5">
          <p className="eyebrow">follow</p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">再按步骤走</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">每一步都明确写出“为什么现在看它”，让路径不是目录，而是导览。</p>
        </article>
        <article className="surface p-5">
          <p className="eyebrow">expand</p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">最后再扩阅读</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">把路径读完之后，再跳到相关卡片延伸，而不是一开始就把内容摊太散。</p>
        </article>
      </section>

      <section className="space-y-5">
        <div>
          <p className="eyebrow">guided trails</p>
          <h2 className="section-title mt-2">当前可选路径</h2>
          <p className="section-copy mt-3">每条路径都试着回答同一个问题：如果你今天只想学一小段，最顺的入口应该是什么。</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {paths.map((pathItem) => (
            <PathTile key={pathItem.slug} pathItem={pathItem} />
          ))}
        </div>
      </section>
    </div>
  );
}
