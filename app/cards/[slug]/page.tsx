import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { LearningProgressShell } from "@/components/learning-progress-shell";
import { MdxContent } from "@/components/mdx-content";
import {
  estimateReadingMinutes,
  extractContentHeadings,
  getAllCards,
  getCardBySlug,
  getCardSlugs,
  getPathsForCardSlug,
  getRelatedCards,
} from "@/lib/content";
import { formatCategoryLabel } from "@/lib/display";

type RouteProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getCardSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: RouteProps): Promise<Metadata> {
  const { slug } = await params;
  const card = getCardBySlug(slug);
  if (!card) {
    return { title: "卡片不存在 | zoo-cards" };
  }

  return {
    title: `${card.title} | zoo-cards`,
    description: card.summary,
  };
}

export default async function CardDetailPage({ params }: RouteProps) {
  const { slug } = await params;
  const card = getCardBySlug(slug);
  if (!card) notFound();

  const relatedCards = getRelatedCards(card);
  const featuredPaths = getPathsForCardSlug(card.slug);
  const headings = extractContentHeadings(card.content);
  const readingMinutes = estimateReadingMinutes(card.content);
  const nextCard = getAllCards().find((item) => item.slug !== card.slug && !relatedCards.some((related) => related.slug === item.slug));

  return (
    <div className="space-y-8 lg:space-y-10">
      <section className="surface-strong p-6 sm:p-8 lg:p-10">
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
          <Link href="/cards" className="transition hover:text-emerald-700">
            全部卡片
          </Link>
          <span>/</span>
          <span className="text-slate-900">{card.title}</span>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-[1.35fr_0.65fr] lg:items-start lg:gap-6">
          <div className="space-y-5">
            <div className="flex flex-wrap gap-3">
              <span className="chip">{formatCategoryLabel(card.category)}</span>
              {card.tags.map((tag) => (
                <span key={tag} className="tag-chip">
                  #{tag}
                </span>
              ))}
            </div>
            <div className="space-y-4">
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">{card.title}</h1>
              <p className="max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">{card.summary}</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {featuredPaths[0] ? (
                <Link href={`/paths/${featuredPaths[0].slug}`} className="button-primary w-full sm:w-auto">
                  顺着路径继续学 →
                </Link>
              ) : null}
              <Link href="/cards" className="button-secondary w-full sm:w-auto">
                返回卡片库
              </Link>
            </div>
          </div>

          <div className="detail-summary-bar">
            <div className="detail-summary-item">
              <span className="detail-summary-label">阅读</span>
              <span className="detail-summary-value">约 {readingMinutes} 分钟</span>
            </div>
            <div className="detail-summary-item">
              <span className="detail-summary-label">导览</span>
              <span className="detail-summary-value">{headings.length} 个章节</span>
            </div>
            <div className="detail-summary-item">
              <span className="detail-summary-label">路径</span>
              <span className="detail-summary-value">{featuredPaths.length} 条相关路径</span>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.55fr_0.85fr] lg:items-start lg:gap-8">
        <article className="surface p-5 sm:p-8">
          <div className="mb-6 flex flex-col gap-2 rounded-[1.5rem] border border-amber-100 bg-amber-50/70 px-4 py-3 text-sm text-amber-950 sm:mb-8 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
            <span className="font-medium">阅读提示</span>
            <span className="text-amber-800/80">先看“这是什么”，再看“为什么重要”，最后记住可直接落到产品设计里的判断。</span>
          </div>

          <MdxContent source={card.content} />

          <LearningProgressShell card={card} />

          <div className="mt-8 rounded-[1.5rem] bg-slate-950 p-4 text-white sm:mt-10 sm:rounded-[1.75rem] sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">after this card</p>
            <h2 className="mt-3 text-xl font-semibold tracking-tight sm:text-2xl">读完这张卡以后怎么继续</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-200 sm:leading-7">
              如果你想继续顺着一个问题往下走，优先去看关联卡片；如果你更想按节奏学，就直接切到路径页，让“下一步看什么”变得明确一点。
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {relatedCards[0] ? (
                <Link href={`/cards/${relatedCards[0].slug}`} className="button-primary w-full bg-white text-slate-950 hover:bg-slate-100 sm:w-auto">
                  继续看关联卡片 →
                </Link>
              ) : null}
              {featuredPaths[0] ? (
                <Link href={`/paths/${featuredPaths[0].slug}`} className="button-secondary w-full border-slate-600 bg-slate-900 text-white hover:border-white hover:text-white sm:w-auto">
                  改走探索路径
                </Link>
              ) : null}
            </div>
          </div>
        </article>

        <aside className="hidden space-y-5 lg:sticky lg:top-24 lg:block">
          {headings.length ? (
            <section className="surface p-5">
              <p className="eyebrow">on this page</p>
              <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">本页导览</h2>
              <ol className="mt-4 space-y-2 text-sm leading-6 text-slate-600">
                {headings.map((heading) => (
                  <li key={heading.id}>
                    <a
                      href={`#${heading.id}`}
                      className={`toc-link ${heading.level === 3 ? "toc-link-nested" : ""}`}
                    >
                      {heading.text}
                    </a>
                  </li>
                ))}
              </ol>
            </section>
          ) : null}

          {featuredPaths.length ? (
            <section className="surface p-5">
              <p className="eyebrow">learn by path</p>
              <h2 className="mt-2 text-xl font-semibold text-slate-900">这张卡出现在这些路径里</h2>
              <div className="mt-4 space-y-3">
                {featuredPaths.map((pathItem) => (
                  <Link key={pathItem.slug} href={`/paths/${pathItem.slug}`} className="detail-link-card">
                    <p className="font-medium text-slate-900">{pathItem.title}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{pathItem.summary}</p>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}

          <section className="surface p-5">
            <p className="eyebrow">related cards</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">继续看什么</h2>
            <div className="mt-4 space-y-3">
              {relatedCards.map((relatedCard) => (
                <Link key={relatedCard.slug} href={`/cards/${relatedCard.slug}`} className="detail-link-card">
                  <p className="font-medium text-slate-900">{relatedCard.title}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{relatedCard.summary}</p>
                </Link>
              ))}
            </div>
          </section>

          {nextCard ? (
            <section className="surface p-5">
              <p className="eyebrow">next pick</p>
              <h2 className="mt-2 text-xl font-semibold text-slate-900">今天顺手再学一个</h2>
              <Link href={`/cards/${nextCard.slug}`} className="mt-4 block rounded-2xl bg-slate-950 p-4 text-white hover:bg-slate-800">
                <p className="font-medium">{nextCard.title}</p>
                <p className="mt-1 text-sm leading-6 text-slate-200">{nextCard.summary}</p>
              </Link>
            </section>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
