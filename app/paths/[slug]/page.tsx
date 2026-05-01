import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PathDetailProgress } from "@/components/path-detail-progress";
import { getAllPaths, getPathBySlug, getPathSlugs } from "@/lib/content";
import { formatCategoryLabel, formatDifficultyLabel } from "@/lib/display";
import { getCardGameConfig } from "@/lib/gamification";

type RouteProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getPathSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: RouteProps): Promise<Metadata> {
  const { slug } = await params;
  const pathItem = getPathBySlug(slug);
  if (!pathItem) {
    return { title: "路径不存在 | zoo-cards" };
  }

  return {
    title: `${pathItem.title} | zoo-cards`,
    description: pathItem.summary,
  };
}

export default async function PathDetailPage({ params }: RouteProps) {
  const { slug } = await params;
  const pathItem = getPathBySlug(slug);
  if (!pathItem) notFound();

  const nextPath = getAllPaths().find((item) => item.slug !== pathItem.slug);

  return (
    <div className="space-y-8 lg:space-y-10">
      <section className="surface-strong p-6 sm:p-8 lg:p-10">
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
          <Link href="/paths" className="transition hover:text-emerald-700">
            探索路径
          </Link>
          <span>/</span>
          <span className="text-slate-900">{pathItem.title}</span>
        </div>

        <div className="mt-5 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5">
            <p className="eyebrow">learning trail</p>
            <div className="flex flex-wrap items-center gap-3">
              <span className="chip">{pathItem.theme}</span>
              <span className="meta-pill">{formatDifficultyLabel(pathItem.difficulty)}</span>
              {pathItem.durationMinutes ? <span className="meta-pill">约 {pathItem.durationMinutes} 分钟</span> : null}
            </div>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">{pathItem.title}</h1>
            <p className="max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">{pathItem.summary}</p>
            <p className="text-sm text-slate-500">适合：{pathItem.audience}</p>
            <div className="flex flex-wrap gap-3 pt-1">
              <a href="#step-1" className="button-primary">
                从第 1 步开始 →
              </a>
              <Link href="/paths" className="button-secondary">
                返回路径列表
              </Link>
            </div>
          </div>

          <div className="surface space-y-4 p-5">
            <div>
              <p className="eyebrow">what you get</p>
              <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">这条路径会带你搞清什么</h2>
            </div>
            <ul className="space-y-3 text-sm leading-6 text-slate-600">
              {(pathItem.outcomes ?? []).map((outcome) => (
                <li key={outcome} className="flex items-start gap-3">
                  <span className="feature-dot mt-2 shrink-0" />
                  <span>{outcome}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-[1.35fr_0.65fr] lg:items-start">
        <section className="space-y-5">
          {pathItem.steps.map((step, index) => (
            <article id={`step-${index + 1}`} key={`${pathItem.slug}-${step.card.slug}`} className="surface grid gap-5 p-5 md:grid-cols-[88px_1fr] md:p-6">
              <div className="space-y-3">
                <div className="flex h-16 w-16 items-center justify-center rounded-[1.4rem] bg-amber-100 text-lg font-semibold text-amber-950 shadow-sm">
                  {index + 1}
                </div>
                {index < pathItem.steps.length - 1 ? <div className="mx-auto h-12 w-px bg-slate-200" /> : null}
              </div>
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="eyebrow">step {index + 1} / {pathItem.steps.length}</span>
                  <span className="meta-pill">{formatCategoryLabel(step.card.category)}</span>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-emerald-700">为什么这一步</p>
                  <p className="text-sm leading-6 text-slate-600">{step.whyThisStep}</p>
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold tracking-tight text-slate-950">{step.card.title}</h2>
                  <p className="text-sm leading-6 text-slate-600">{step.card.summary}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {step.card.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="tag-chip">
                      #{tag}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-3 pt-1">
                  <Link href={`/cards/${step.card.slug}`} className="button-primary">
                    阅读这张卡片
                  </Link>
                  <a href={`#step-${Math.min(index + 2, pathItem.steps.length)}`} className="button-ghost">
                    {index < pathItem.steps.length - 1 ? "跳到下一步 ↓" : "回看路径总览 ↑"}
                  </a>
                </div>
                {getCardGameConfig(step.card.slug) ? (
                  <div className="rounded-[1.25rem] border border-emerald-100 bg-emerald-50/60 px-4 py-3 text-sm leading-6 text-emerald-950">
                    这一步读完后可以立刻答 1 道小题，拿到 XP 和本日学习进度。
                  </div>
                ) : null}
                {step.nextHint ? <div className="detail-note">下一步提示：{step.nextHint}</div> : null}
              </div>
            </article>
          ))}

          <section className="surface-strong p-6 sm:p-7">
            <p className="eyebrow">after the trail</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">走完这条路径以后</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
              如果你已经把整条路径走完，下一步可以回到卡片库横向扩阅读，或者切到另一条路径，用另一种主题视角重新串起这些知识点。
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/cards" className="button-primary">
                去扩更多卡片
              </Link>
              {nextPath ? (
                <Link href={`/paths/${nextPath.slug}`} className="button-secondary">
                  试试另一条路径
                </Link>
              ) : null}
            </div>
          </section>
        </section>

        <aside id="path-overview" className="space-y-5 lg:sticky lg:top-24">
          <PathDetailProgress pathItem={pathItem} />
        </aside>
      </div>
    </div>
  );
}
