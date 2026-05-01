"use client";

import { useEffect, useState } from "react";

import {
  STREAK_BONUS_XP,
  dateKey,
  evaluateBadges,
  getCardGameConfig,
  type LearningProgress,
  type QuizResultSummary,
} from "@/lib/gamification";
import { createDefaultLearningProgress, loadLearningProgress, normalizeLearningProgress, persistLearningProgress } from "@/lib/progress-store";
import type { Card } from "@/lib/types";

function updateStreak(progress: LearningProgress, today: string) {
  if (progress.lastActiveDate === today) {
    return { streakDays: progress.streakDays, streakBonusApplied: false };
  }

  const previousDate = progress.lastActiveDate ? new Date(progress.lastActiveDate) : null;
  const currentDate = new Date(today);
  let nextStreak = 1;

  if (previousDate) {
    const dayDiff = Math.round((currentDate.getTime() - previousDate.getTime()) / (1000 * 60 * 60 * 24));
    nextStreak = dayDiff === 1 ? progress.streakDays + 1 : 1;
  }

  progress.streakDays = nextStreak;
  progress.lastActiveDate = today;
  return { streakDays: nextStreak, streakBonusApplied: true };
}

function markCardCompleted(progress: LearningProgress, cardSlug: string) {
  if (!progress.completedCardSlugs.includes(cardSlug)) {
    progress.completedCardSlugs = [...progress.completedCardSlugs, cardSlug];
  }
}

type LearningProgressShellProps = {
  card: Card;
};

export function LearningProgressShell({ card }: LearningProgressShellProps) {
  const config = getCardGameConfig(card.slug);
  const [progress, setProgress] = useState<LearningProgress>(createDefaultLearningProgress());
  const [selectedOptionId, setSelectedOptionId] = useState<string>("");
  const [result, setResult] = useState<QuizResultSummary | null>(null);
  const [feedback, setFeedback] = useState<string>("");
  const [showQuiz, setShowQuiz] = useState(false);

  useEffect(() => {
    const nextProgress = loadLearningProgress();
    setProgress(nextProgress);
  }, []);

  const attempts = config ? progress.quizAttempts[card.slug] ?? 0 : 0;
  const alreadySolved = Boolean(config && progress.quizCorrectMap[card.slug]);
  const canRetry = Boolean(config && attempts === 1 && !alreadySolved);

  if (!config) return null;

  const activeConfig = config;

  function handleSubmit() {
    if (!selectedOptionId) return;

    const today = dateKey();
    const nextProgress = normalizeLearningProgress(progress);
    nextProgress.quizAttempts[card.slug] = (nextProgress.quizAttempts[card.slug] ?? 0) + 1;

    const isCorrect = selectedOptionId === activeConfig.quiz.correctOptionId;

    if (!isCorrect) {
      persistLearningProgress(nextProgress);
      setProgress(nextProgress);
      setFeedback(nextProgress.quizAttempts[card.slug] >= 2 ? activeConfig.quiz.explanationWrong : activeConfig.quiz.retryHint);
      setResult({
        correct: false,
        solvedOnRetry: false,
        gainedXp: 0,
        streakDays: nextProgress.streakDays,
        unlockedBadges: [],
      });
      return;
    }

    const { streakDays, streakBonusApplied } = updateStreak(nextProgress, today);
    markCardCompleted(nextProgress, card.slug);
    nextProgress.quizCorrectMap[card.slug] = true;
    nextProgress.dailyCompletions[today] = (nextProgress.dailyCompletions[today] ?? 0) + 1;
    nextProgress.lastTodayPickCardSlug = card.slug;

    const solvedOnRetry = nextProgress.quizAttempts[card.slug] > 1;
    let gainedXp = activeConfig.reward.readXp + (solvedOnRetry ? activeConfig.reward.retryCorrectXp : activeConfig.reward.correctXp);
    if (streakBonusApplied) {
      gainedXp += STREAK_BONUS_XP;
    }
    nextProgress.xp += gainedXp;

    const newBadges = evaluateBadges(nextProgress);

    persistLearningProgress(nextProgress);
    setProgress(nextProgress);
    setFeedback(activeConfig.quiz.explanationCorrect);
    setResult({
      correct: true,
      solvedOnRetry,
      gainedXp,
      streakDays,
      unlockedBadges: newBadges,
    });
  }

  const todayCount = progress.dailyCompletions[dateKey()] ?? 0;

  return (
    <section className="surface mt-10 space-y-5 p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="eyebrow">learn & reward</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">学完来一题</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
            先用 10 到 30 秒确认自己抓住了重点。答对会拿到 XP，答错也可以根据提示再试一次。
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-[1.25rem] bg-amber-50 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.18em] text-amber-700">xp</p>
            <p className="mt-2 text-2xl font-semibold text-amber-950">{progress.xp}</p>
          </div>
          <div className="rounded-[1.25rem] bg-emerald-50 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.18em] text-emerald-700">streak</p>
            <p className="mt-2 text-2xl font-semibold text-emerald-950">{progress.streakDays}</p>
          </div>
          <div className="rounded-[1.25rem] bg-sky-50 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.18em] text-sky-700">today</p>
            <p className="mt-2 text-2xl font-semibold text-sky-950">{todayCount}</p>
          </div>
        </div>
      </div>

      <div className="learning-progress-panel">
        <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="chip">+{activeConfig.reward.readXp + activeConfig.reward.correctXp} XP</span>
              <span className="meta-pill">支持 1 次重试</span>
              {alreadySolved ? <span className="meta-pill">已完成</span> : null}
            </div>

            {!showQuiz ? (
              <button type="button" onClick={() => setShowQuiz(true)} className="button-primary">
                {alreadySolved ? "回看这道题" : "开始答题"}
              </button>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">问题</p>
                  <p className="mt-2 text-lg font-semibold text-slate-950">{activeConfig.quiz.question}</p>
                </div>
                <div className="space-y-3">
                  {activeConfig.quiz.options.map((option) => {
                    const active = selectedOptionId === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setSelectedOptionId(option.id)}
                        className={`quiz-option ${active ? "quiz-option-active" : ""}`}
                      >
                        <span className="quiz-option-label">{option.label}</span>
                        <span>{option.text}</span>
                      </button>
                    );
                  })}
                </div>
                <div className="flex flex-wrap gap-3">
                  <button type="button" onClick={handleSubmit} disabled={!selectedOptionId} className="button-primary disabled:opacity-50">
                    提交答案
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedOptionId("");
                      setFeedback("");
                      setResult(null);
                    }}
                    className="button-secondary"
                  >
                    重选
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4 rounded-[1.5rem] border border-slate-200 bg-white/80 p-4">
            <div>
              <p className="text-sm font-medium text-slate-500">即时反馈</p>
              <div className="mt-3 rounded-[1.25rem] bg-slate-50 px-4 py-4 text-sm leading-7 text-slate-600">
                {feedback || "答完之后，这里会立刻告诉你为什么对，或者提示你漏掉了哪个关键点。"}
              </div>
            </div>

            {result ? (
              <div className="rounded-[1.25rem] border border-emerald-100 bg-emerald-50/70 px-4 py-4 text-sm text-emerald-950">
                <p className="font-medium">{result.correct ? "这次抓住重点了。" : canRetry ? "差一点，再试一次。" : "这题先记住关键点就好。"}</p>
                <ul className="mt-3 space-y-2 text-emerald-900/90">
                  {result.correct ? <li>+{result.gainedXp} XP 已到账</li> : null}
                  {result.correct ? <li>当前 streak：{result.streakDays} 天</li> : null}
                  {result.correct && result.solvedOnRetry ? <li>这是通过重试答对的，也算一次有效学习。</li> : null}
                  {!result.correct && canRetry ? <li>你还有 1 次重试机会。</li> : null}
                </ul>
                {result.unlockedBadges.length ? (
                  <div className="mt-4 space-y-2">
                    <p className="text-xs uppercase tracking-[0.18em] text-emerald-700">new badges</p>
                    <div className="flex flex-wrap gap-2">
                      {result.unlockedBadges.map((badge) => (
                        <span key={badge.id} className="reward-badge">
                          {badge.title}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null}

            <div>
              <p className="text-sm font-medium text-slate-500">已解锁徽章</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {progress.unlockedBadgeIds.length ? (
                  progress.unlockedBadgeIds.map((badgeId) => (
                    <span key={badgeId} className="reward-badge reward-badge-muted">
                      {badgeId}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-slate-500">还没解锁，先完成第一题就有机会拿到第一枚。</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
