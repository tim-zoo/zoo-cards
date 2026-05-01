"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { formatDifficultyLabel } from "@/lib/display";
import { getPathCompletion, type LearningProgress } from "@/lib/gamification";
import { createDefaultLearningProgress, loadLearningProgress } from "@/lib/progress-store";
import type { LearningPath, ResolvedLearningPath } from "@/lib/types";

type PathLike = LearningPath | ResolvedLearningPath;

export function PathProgressTile({ pathItem }: { pathItem: PathLike }) {
  const [progress, setProgress] = useState<LearningProgress>(createDefaultLearningProgress());

  useEffect(() => {
    setProgress(loadLearningProgress());
  }, []);

  const completion = getPathCompletion(pathItem, progress);

  return (
    <article className="card-tile">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="chip">{pathItem.theme}</span>
        <div className="flex flex-wrap gap-2">
          <span className="meta-pill">{pathItem.steps.length} steps</span>
          <span className="meta-pill">{formatDifficultyLabel(pathItem.difficulty)}</span>
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
      <div className="rounded-[1.25rem] border border-slate-200 bg-white/80 p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-medium text-slate-700">路径进度</p>
          <span className="text-sm font-medium text-slate-500">{completion.completedSteps}/{completion.totalSteps}</span>
        </div>
        <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-gradient-to-r from-amber-300 to-emerald-500" style={{ width: `${completion.percent}%` }} />
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-600">{completion.done ? "这条路径已经走完了，可以切换另一条视角继续扩展。" : `已经完成 ${completion.percent}% ，还可以继续往下走。`}</p>
      </div>
      <div className="mt-auto flex items-center justify-between gap-3 pt-2">
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">guided trail</span>
        <Link href={`/paths/${pathItem.slug}`} className="card-link">
          {completion.done ? "回顾路径 →" : "继续探索 →"}
        </Link>
      </div>
    </article>
  );
}
