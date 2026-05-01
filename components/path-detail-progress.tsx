"use client";

import { useEffect, useMemo, useState } from "react";

import { getPathCompletion, type LearningProgress } from "@/lib/gamification";
import { createDefaultLearningProgress, loadLearningProgress } from "@/lib/progress-store";
import type { ResolvedLearningPath } from "@/lib/types";

type PathDetailProgressProps = {
  pathItem: ResolvedLearningPath;
};

export function PathDetailProgress({ pathItem }: PathDetailProgressProps) {
  const [progress, setProgress] = useState<LearningProgress>(createDefaultLearningProgress());

  useEffect(() => {
    setProgress(loadLearningProgress());
  }, []);

  const completion = useMemo(() => getPathCompletion(pathItem, progress), [pathItem, progress]);
  const completedSet = useMemo(() => new Set(progress.completedCardSlugs), [progress.completedCardSlugs]);
  const nextPendingStep = pathItem.steps.find((step) => !completedSet.has(step.card.slug)) ?? null;

  return (
    <>
      <section className="surface space-y-4 p-4 sm:p-5">
        <div>
          <p className="eyebrow">path progress</p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">这条路径现在走到哪了</h2>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:grid-cols-1">
          <div className="rounded-2xl bg-amber-50 p-3 sm:p-4">
            <p className="text-xs text-amber-900 sm:text-sm">已完成步骤</p>
            <p className="mt-2 text-lg font-semibold text-amber-950 sm:text-2xl">{completion.completedSteps}/{completion.totalSteps}</p>
          </div>
          <div className="rounded-2xl bg-emerald-50 p-3 sm:p-4">
            <p className="text-xs text-emerald-900 sm:text-sm">完成度</p>
            <p className="mt-2 text-lg font-semibold text-emerald-950 sm:text-2xl">{completion.percent}%</p>
          </div>
          <div className="rounded-2xl bg-sky-50 p-3 sm:p-4">
            <p className="text-xs text-sky-900 sm:text-sm">当前状态</p>
            <p className="mt-2 text-base font-semibold text-sky-950 sm:text-lg">{completion.done ? "已走完" : "继续中"}</p>
          </div>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-gradient-to-r from-amber-300 to-emerald-500" style={{ width: `${completion.percent}%` }} />
        </div>
        <p className="text-sm leading-6 text-slate-600">
          {completion.done
            ? "这条路径已经完整走完，可以切到另一条路径，或者回到卡片库横向扩展。"
            : nextPendingStep
              ? `下一步建议从「${nextPendingStep.card.title}」继续。`
              : "你已经开始这条路径了，继续往下推进就会更有整体感。"}
        </p>
      </section>

      <section className="surface p-4 sm:p-5">
        <p className="eyebrow">step status</p>
        <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">每一步完成情况</h2>
        <ol className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
          {pathItem.steps.map((step, index) => {
            const done = completedSet.has(step.card.slug);
            return (
              <li key={step.card.slug}>
                <a href={`#step-${index + 1}`} className="toc-link flex items-center justify-between gap-3">
                  <div>
                    <span className="mr-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">step {index + 1}</span>
                    <span className="font-medium text-slate-900">{step.card.title}</span>
                  </div>
                  <span className={`step-status-pill ${done ? "step-status-pill-done" : "step-status-pill-pending"}`}>
                    {done ? "已完成" : "待学习"}
                  </span>
                </a>
              </li>
            );
          })}
        </ol>
      </section>
    </>
  );
}
