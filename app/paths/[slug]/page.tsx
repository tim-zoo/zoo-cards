import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getPathBySlug, getPathSlugs } from "@/lib/content";
import { formatCategoryLabel, formatDifficultyLabel } from "@/lib/display";

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

  return (
    <div className="space-y-8 lg:space-y-10">
      <section className="surface-strong p-6 sm:p-8 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-4">
            <p className="eyebrow">learning trail</p>
            <div className="flex flex-wrap items-center gap-3">
              <span className="chip">{pathItem.theme}</span>
              <span className="meta-pill">{formatDifficultyLabel(pathItem.difficulty)}</span>
              {pathItem.durationMinutes ? <span className="meta-pill">约 {pathItem.durationMinutes} 分钟</span> : null}
            </div>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">{pathItem.title}</h1>
            <p className="max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">{pathItem.summary}</p>
            <p className="text-sm text-slate-500">适合：{pathItem.audience}</p>
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
                <div className="space-y-2">
                  <p className="text-sm font-medium text-emerald-700">为什么这一步</p>
                  <p className="text-sm leading-6 text-slate-600">{step.whyThisStep}</p>
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold tracking-tight text-slate-950">{step.card.title}</h2>
                  <p className="text-sm leading-6 text-slate-600">{step.card.summary}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="chip">{formatCategoryLabel(step.card.category)}</span>
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
                  {step.nextHint ? <p className="text-sm leading-6 text-slate-500">下一步提示：{step.nextHint}</p> : null}
                </div>
              </div>
            </article>
          ))}
        </section>

        <aside className="space-y-5 lg:sticky lg:top-24">
          <section className="surface p-5">
            <p className="eyebrow">path overview</p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">快速总览</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-2xl bg-amber-50 p-4">
                <p className="text-sm text-amber-900">步骤数</p>
                <p className="mt-2 text-2xl font-semibold text-amber-950">{pathItem.steps.length}</p>
              </div>
              <div className="rounded-2xl bg-emerald-50 p-4">
                <p className="text-sm text-emerald-900">难度</p>
                <p className="mt-2 text-lg font-semibold text-emerald-950">{formatDifficultyLabel(pathItem.difficulty)}</p>
              </div>
              <div className="rounded-2xl bg-sky-50 p-4">
                <p className="text-sm text-sky-900">时长</p>
                <p className="mt-2 text-2xl font-semibold text-sky-950">{pathItem.durationMinutes ?? "-"}</p>
              </div>
            </div>
          </section>

          <section className="surface p-5">
            <p className="eyebrow">jump in</p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">这条路径怎么走</h2>
            <ol className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
              {pathItem.steps.map((step, index) => (
                <li key={step.card.slug}>
                  <a href={`#step-${index + 1}`} className="block rounded-2xl border border-slate-200 px-4 py-3 transition hover:border-emerald-200 hover:bg-emerald-50/50">
                    <span className="mr-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">step {index + 1}</span>
                    <span className="font-medium text-slate-900">{step.card.title}</span>
                  </a>
                </li>
              ))}
            </ol>
          </section>
        </aside>
      </div>
    </div>
  );
}
