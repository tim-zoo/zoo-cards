import Link from "next/link";

import type { LearningPath, PathDifficulty, ResolvedLearningPath } from "@/lib/types";

type PathLike = LearningPath | ResolvedLearningPath;

function getDifficultyLabel(difficulty?: PathDifficulty) {
  if (difficulty === "easy") return "轻松入门";
  if (difficulty === "medium") return "进阶阅读";
  if (difficulty === "deep") return "深入理解";
  return "自由探索";
}

export function PathTile({ pathItem }: { pathItem: PathLike }) {
  return (
    <article className="card-tile">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="chip">{pathItem.theme}</span>
        <div className="flex flex-wrap gap-2">
          <span className="meta-pill">{pathItem.steps.length} steps</span>
          <span className="meta-pill">{getDifficultyLabel(pathItem.difficulty)}</span>
          {pathItem.durationMinutes ? <span className="meta-pill">约 {pathItem.durationMinutes} 分钟</span> : null}
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-semibold tracking-tight text-slate-950">
          <Link href={`/paths/${pathItem.slug}`} className="transition hover:text-emerald-700">
            {pathItem.title}
          </Link>
        </h3>
        <p className="text-sm leading-6 text-slate-600">{pathItem.summary}</p>
        <p className="text-xs text-slate-500">适合：{pathItem.audience}</p>
      </div>
      {pathItem.outcomes?.length ? (
        <ul className="space-y-2 text-sm leading-6 text-slate-600">
          {pathItem.outcomes.slice(0, 2).map((outcome) => (
            <li key={outcome} className="flex items-start gap-3">
              <span className="feature-dot mt-2 shrink-0" />
              <span>{outcome}</span>
            </li>
          ))}
        </ul>
      ) : null}
      <div className="mt-auto flex items-center justify-between gap-3 pt-2">
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">guided trail</span>
        <Link href={`/paths/${pathItem.slug}`} className="card-link">
          开始探索 →
        </Link>
      </div>
    </article>
  );
}
