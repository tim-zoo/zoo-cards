import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { MdxContent } from "@/components/mdx-content";
import { getAllCards, getCardBySlug, getCardSlugs, getRelatedCards } from "@/lib/content";
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
  const nextCard = getAllCards().find((item) => item.slug !== card.slug && !relatedCards.some((related) => related.slug === item.slug));

  return (
    <div className="grid gap-8 lg:grid-cols-[1.6fr_0.8fr]">
      <article className="surface p-6 sm:p-8">
        <div className="flex flex-wrap gap-3">
          <span className="chip">{formatCategoryLabel(card.category)}</span>
          {card.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800">
              #{tag}
            </span>
          ))}
        </div>
        <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-950">{card.title}</h1>
        <p className="mt-4 text-base leading-7 text-slate-600">{card.summary}</p>
        <div className="mt-8">
          <MdxContent source={card.content} />
        </div>
      </article>

      <aside className="space-y-6">
        <section className="surface p-5">
          <p className="eyebrow">related cards</p>
          <h2 className="mt-2 text-xl font-semibold text-slate-900">继续看什么</h2>
          <div className="mt-4 space-y-3">
            {relatedCards.map((relatedCard) => (
              <Link key={relatedCard.slug} href={`/cards/${relatedCard.slug}`} className="block rounded-2xl border border-slate-200 p-4 hover:border-emerald-400 hover:bg-emerald-50/40">
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
  );
}
