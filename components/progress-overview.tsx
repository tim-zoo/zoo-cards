"use client";

import { useEffect, useMemo, useState } from "react";

import { dateKey, getUnlockedBadges, type LearningProgress } from "@/lib/gamification";
import { createDefaultLearningProgress, loadLearningProgress } from "@/lib/progress-store";

type ProgressOverviewProps = {
  totalCards: number;
  compact?: boolean;
};

export function ProgressOverview({ totalCards, compact = false }: ProgressOverviewProps) {
  const [progress, setProgress] = useState<LearningProgress>(createDefaultLearningProgress());

  useEffect(() => {
    setProgress(loadLearningProgress());
  }, []);

  const todayCount = progress.dailyCompletions[dateKey()] ?? 0;
  const completedCount = progress.completedCardSlugs.length;
  const completionPercent = totalCards > 0 ? Math.round((completedCount / totalCards) * 100) : 0;
  const badges = useMemo(() => getUnlockedBadges(progress), [progress]);

  if (compact) {
    return (
      <div className="progress-compact-shell">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">my progress</p>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-600">
            <span className="reward-badge reward-badge-muted">XP {progress.xp}</span>
            <span className="reward-badge reward-badge-muted">streak {progress.streakDays}</span>
            <span className="reward-badge reward-badge-muted">today {todayCount}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="surface p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="eyebrow">my progress</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">今天已经学到哪了</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
            这是一套轻量进度面板，帮助用户看到自己不是“只看了一眼”，而是在一点点积累。
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <div className="rounded-[1.25rem] bg-amber-50 px-3 py-3 sm:px-4">
            <p className="text-[10px] uppercase tracking-[0.18em] text-amber-700 sm:text-xs">xp</p>
            <p className="mt-2 text-xl font-semibold text-amber-950 sm:text-2xl">{progress.xp}</p>
          </div>
          <div className="rounded-[1.25rem] bg-emerald-50 px-3 py-3 sm:px-4">
            <p className="text-[10px] uppercase tracking-[0.18em] text-emerald-700 sm:text-xs">streak</p>
            <p className="mt-2 text-xl font-semibold text-emerald-950 sm:text-2xl">{progress.streakDays}</p>
          </div>
          <div className="rounded-[1.25rem] bg-sky-50 px-3 py-3 sm:px-4">
            <p className="text-[10px] uppercase tracking-[0.18em] text-sky-700 sm:text-xs">today</p>
            <p className="mt-2 text-xl font-semibold text-sky-950 sm:text-2xl">{todayCount}</p>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[1.5rem] border border-slate-200 bg-white/80 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-slate-700">卡片完成进度</p>
            <span className="text-sm font-medium text-slate-500">{completedCount} / {totalCards}</span>
          </div>
          <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600" style={{ width: `${completionPercent}%` }} />
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-600">当前已完成 {completionPercent}% 的首批卡片学习闭环。</p>
        </div>

        <div className="rounded-[1.5rem] border border-slate-200 bg-white/80 p-4">
          <p className="text-sm font-medium text-slate-700">已解锁徽章</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {badges.length ? (
              badges.map((badge) => (
                <span key={badge.id} className="reward-badge">
                  {badge.title}
                </span>
              ))
            ) : (
              <span className="text-sm text-slate-500">还没解锁，先完成第一道题就能点亮第一枚。</span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
