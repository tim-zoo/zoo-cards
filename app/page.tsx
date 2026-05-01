import Link from "next/link";

import { CardTile } from "@/components/card-tile";
import { ProgressOverview } from "@/components/progress-overview";
import { PathProgressTile } from "@/components/path-progress-tile";
import { getAllCards, getAllPaths, getCategories, getTags } from "@/lib/content";
import { formatCategoryLabel } from "@/lib/display";
import { getFeaturedTodayPicks } from "@/lib/gamification";

export default function HomePage() {
  const cards = getAllCards();
  const paths = getAllPaths();
  const categories = getCategories();
  const tags = getTags().slice(0, 6);
  const todayPicks = getFeaturedTodayPicks(cards)
    .map((pick) => ({ ...pick, card: cards.find((card) => card.slug === pick.cardSlug) }))
    .filter((item): item is { cardSlug: string; reason: string; card: (typeof cards)[number] } => Boolean(item.card));

  return (
    <div className="space-y-12 sm:space-y-14">
      <section className="surface-strong overflow-hidden p-6 sm:p-8 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[1.28fr_0.92fr] lg:items-start">
          <div className="space-y-6">
            <div className="space-y-4">
              <span className="hero-kicker">tim-zoo field guide · 可爱一点，但仍专业</span>
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                把 AI 安全知识，整理成一座更好逛的动物园。
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                zoo-cards 不是一堆冷冰冰的条目，而是一套更轻、更顺手的知识入口。你可以像刷卡片一样快速理解一个概念，也可以沿着“今天学什么”路径一步步建立完整认知。
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/cards" className="button-primary">
                先逛全部卡片
              </Link>
              <Link href="/paths" className="button-secondary">
                走一条探索路径
              </Link>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {tags.map((tag) => (
                <span key={tag} className="tag-chip">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            <div className="hero-metric">
              <p className="text-sm font-medium text-amber-900">当前卡片</p>
              <div className="mt-2 flex items-end justify-between gap-3">
                <p className="text-3xl font-semibold text-amber-950">{cards.length}</p>
                <span className="text-xs uppercase tracking-[0.18em] text-amber-700">ready</span>
              </div>
            </div>
            <div className="hero-metric">
              <p className="text-sm font-medium text-emerald-900">探索路径</p>
              <div className="mt-2 flex items-end justify-between gap-3">
                <p className="text-3xl font-semibold text-emerald-950">{paths.length}</p>
                <span className="text-xs uppercase tracking-[0.18em] text-emerald-700">guided</span>
              </div>
            </div>
            <div className="hero-metric">
              <p className="text-sm font-medium text-sky-900">主题分类</p>
              <div className="mt-2 flex items-end justify-between gap-3">
                <p className="text-3xl font-semibold text-sky-950">{categories.length}</p>
                <span className="text-xs uppercase tracking-[0.18em] text-sky-700">mapped</span>
              </div>
            </div>
            <div className="surface col-span-full space-y-4 p-5">
              <div>
                <p className="eyebrow">today, learn this</p>
                <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">今日导览建议</h2>
              </div>
              <div className="space-y-3">
                {todayPicks.slice(0, 3).map((item) => (
                  <Link key={item.card.slug} href={`/cards/${item.card.slug}`} className="today-pick-card">
                    <div className="flex items-start gap-3">
                      <span className="feature-dot mt-2" />
                      <div>
                        <p className="text-sm font-medium text-slate-900">{item.card.title}</p>
                        <p className="mt-1 text-sm leading-6 text-slate-600">{item.reason}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              {paths[0] ? (
                <Link href={`/paths/${paths[0].slug}`} className="button-ghost">
                  从「{paths[0].title}」开始 →
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <ProgressOverview totalCards={cards.length} />

      <section className="grid gap-4 md:grid-cols-3">
        <article className="surface p-5">
          <p className="eyebrow">browse</p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">像逛展一样浏览</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">用卡片先把知识单元收紧，避免一上来就陷进长文章和大文档里。</p>
        </article>
        <article className="surface p-5">
          <p className="eyebrow">learn</p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">像导览一样学习</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">探索路径负责回答“下一步看什么”，让内容不是散的，而是有节奏地展开。</p>
        </article>
        <article className="surface p-5">
          <p className="eyebrow">share</p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">像产品一样分享</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">从一开始就按 GitHub Pages 的静态站思路建设，让它天然适合展示和传播。</p>
        </article>
      </section>

      <section className="section-shell">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">featured cards</p>
            <h2 className="section-title mt-2">先从这些卡片开始</h2>
            <p className="section-copy mt-3">这一组卡片对应当前最先落下来的 AI 安全基础主题，适合作为首刷入口。</p>
          </div>
          <Link href="/cards" className="button-ghost">
            查看全部 →
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {cards.slice(0, 3).map((card) => (
            <CardTile key={card.slug} card={card} />
          ))}
        </div>
      </section>

      <section className="section-shell">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow">learn by path</p>
            <h2 className="section-title mt-2">今天学什么</h2>
            <p className="section-copy mt-3">路径不是简单的链接列表，而是把“为什么现在看这一步”也一起交给用户。</p>
          </div>
          <div className="surface p-4 text-sm leading-6 text-slate-600 lg:max-w-sm">
            首版先用少量高质量路径原型验证体验，再决定要不要继续扩成更完整的学习地图。
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {paths.map((pathItem) => (
            <PathProgressTile key={pathItem.slug} pathItem={pathItem} />
          ))}
        </div>
      </section>

      <section className="surface-strong p-6 sm:p-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <p className="eyebrow">topic map</p>
            <h2 className="section-title mt-2">分类与标签</h2>
            <p className="section-copy mt-3">分类负责主要浏览入口，标签负责跨主题横向串联。首版先把信息结构收紧，不急着把筛选做复杂。</p>
          </div>
          <div className="space-y-5">
            <div>
              <p className="text-sm font-medium text-slate-500">当前分类</p>
              <div className="mt-3 flex flex-wrap gap-3">
                {categories.map((category) => (
                  <span key={category} className="chip">
                    {formatCategoryLabel(category)}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">当前标签</p>
              <div className="mt-3 flex flex-wrap gap-3">
                {tags.map((tag) => (
                  <span key={tag} className="tag-chip">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
