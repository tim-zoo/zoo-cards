import Link from "next/link";

import { formatCategoryLabel } from "@/lib/display";
import type { Card } from "@/lib/types";

export function CardTile({ card }: { card: Card }) {
  return (
    <article className="card-tile">
      <div className="flex flex-wrap items-center gap-2">
        <span className="chip">{formatCategoryLabel(card.category)}</span>
        {card.tags.slice(0, 2).map((tag) => (
          <span key={tag} className="tag-chip">
            #{tag}
          </span>
        ))}
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-semibold tracking-tight text-slate-950">
          <Link href={`/cards/${card.slug}`} className="transition hover:text-emerald-700">
            {card.title}
          </Link>
        </h3>
        <p className="text-sm leading-6 text-slate-600">{card.summary}</p>
      </div>
      <div className="mt-auto flex items-center justify-between gap-3 pt-2">
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">knowledge card</span>
        <Link href={`/cards/${card.slug}`} className="card-link">
          打开卡片 →
        </Link>
      </div>
    </article>
  );
}
