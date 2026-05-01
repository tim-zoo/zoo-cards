import {
  DEFAULT_PROGRESS,
  type LearningProgress,
} from "@/lib/gamification";

export const LEARNING_PROGRESS_STORAGE_KEY = "zoo-cards.learning-progress.v1";

function cloneDefaultProgress(): LearningProgress {
  return {
    ...DEFAULT_PROGRESS,
    dailyCompletions: { ...DEFAULT_PROGRESS.dailyCompletions },
    completedCardSlugs: [...DEFAULT_PROGRESS.completedCardSlugs],
    quizAttempts: { ...DEFAULT_PROGRESS.quizAttempts },
    quizCorrectMap: { ...DEFAULT_PROGRESS.quizCorrectMap },
    unlockedBadgeIds: [...DEFAULT_PROGRESS.unlockedBadgeIds],
  };
}

export function normalizeLearningProgress(raw: Partial<LearningProgress> | null | undefined): LearningProgress {
  const base = cloneDefaultProgress();
  if (!raw) return base;

  return {
    xp: typeof raw.xp === "number" ? raw.xp : base.xp,
    streakDays: typeof raw.streakDays === "number" ? raw.streakDays : base.streakDays,
    lastActiveDate: typeof raw.lastActiveDate === "string" ? raw.lastActiveDate : base.lastActiveDate,
    dailyCompletions: raw.dailyCompletions ?? base.dailyCompletions,
    completedCardSlugs: raw.completedCardSlugs ?? base.completedCardSlugs,
    quizAttempts: raw.quizAttempts ?? base.quizAttempts,
    quizCorrectMap: raw.quizCorrectMap ?? base.quizCorrectMap,
    unlockedBadgeIds: raw.unlockedBadgeIds ?? base.unlockedBadgeIds,
    lastTodayPickCardSlug: raw.lastTodayPickCardSlug ?? base.lastTodayPickCardSlug,
  };
}

export function loadLearningProgress() {
  if (typeof window === "undefined") return cloneDefaultProgress();
  try {
    const raw = window.localStorage.getItem(LEARNING_PROGRESS_STORAGE_KEY);
    if (!raw) return cloneDefaultProgress();
    return normalizeLearningProgress(JSON.parse(raw) as LearningProgress);
  } catch {
    return cloneDefaultProgress();
  }
}

export function persistLearningProgress(progress: LearningProgress) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LEARNING_PROGRESS_STORAGE_KEY, JSON.stringify(progress));
}

export function createDefaultLearningProgress() {
  return cloneDefaultProgress();
}
