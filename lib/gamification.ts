import type { Card, LearningPath } from "@/lib/types";

export type QuizType = "single" | "boolean";

export interface QuizOption {
  id: string;
  label: string;
  text: string;
}

export interface CardQuiz {
  question: string;
  type: QuizType;
  options: QuizOption[];
  correctOptionId: string;
  explanationCorrect: string;
  explanationWrong: string;
  retryHint: string;
}

export interface CardReward {
  readXp: number;
  correctXp: number;
  retryCorrectXp: number;
}

export interface CardGameConfig {
  cardSlug: string;
  quiz: CardQuiz;
  reward: CardReward;
}

export interface TodayPick {
  cardSlug: string;
  reason: string;
}

export interface BadgeDefinition {
  id: string;
  title: string;
  description: string;
}

export interface LearningProgress {
  xp: number;
  streakDays: number;
  lastActiveDate: string | null;
  dailyCompletions: Record<string, number>;
  completedCardSlugs: string[];
  quizAttempts: Record<string, number>;
  quizCorrectMap: Record<string, boolean>;
  unlockedBadgeIds: string[];
  lastTodayPickCardSlug: string | null;
}

export interface QuizResultSummary {
  correct: boolean;
  solvedOnRetry: boolean;
  gainedXp: number;
  streakDays: number;
  unlockedBadges: BadgeDefinition[];
}

export const DEFAULT_REWARD: CardReward = {
  readXp: 5,
  correctXp: 10,
  retryCorrectXp: 5,
};

export const STREAK_BONUS_XP = 10;

export const BADGES: BadgeDefinition[] = [
  {
    id: "first-quiz",
    title: "初次答题",
    description: "完成第一次学后小测。",
  },
  {
    id: "three-day-streak",
    title: "连续 3 天学习",
    description: "连续 3 天完成至少一次学习互动。",
  },
  {
    id: "first-path-finished",
    title: "第一条路径完成",
    description: "完整走完一条探索路径中的全部步骤。",
  },
  {
    id: "threat-basics-collector",
    title: "AI 安全新朋友",
    description: "完成 3 张 Threat Basics 主题卡片的小测。",
  },
];

const GAME_CONFIGS: CardGameConfig[] = [
  {
    cardSlug: "prompt-injection",
    reward: DEFAULT_REWARD,
    quiz: {
      question: "关于 Prompt Injection，下面哪种理解更接近它的本质？",
      type: "single",
      options: [
        { id: "a", label: "A", text: "它本质上是模型参数被远程篡改。" },
        { id: "b", label: "B", text: "它主要是上下文控制被恶意输入劫持。" },
        { id: "c", label: "C", text: "它只会影响回答语气，不会影响真实行为。" },
      ],
      correctOptionId: "b",
      explanationCorrect: "对，Prompt Injection 首先是上下文优先级与控制权问题。危险之处在于模型可能把恶意指令当成当前更该遵循的内容。",
      explanationWrong: "差一点。Prompt Injection 的关键不是参数被改，也不是只影响语言风格，而是恶意输入改变了模型在当前上下文里的行为判断。",
      retryHint: "回想这张卡里那句重点，它首先是什么问题？",
    },
  },
  {
    cardSlug: "tool-abuse",
    reward: DEFAULT_REWARD,
    quiz: {
      question: "为什么 Tool Abuse 往往比“模型答错了”更危险？",
      type: "single",
      options: [
        { id: "a", label: "A", text: "因为它可能把语言层风险放大成真实操作。" },
        { id: "b", label: "B", text: "因为工具调用一定会泄露系统提示。" },
        { id: "c", label: "C", text: "因为只要有工具，攻击就一定成功。" },
      ],
      correctOptionId: "a",
      explanationCorrect: "对。真正的风险升级点在于模型不只是“说错”，而是可能“做错”，把输入变成真实动作。",
      explanationWrong: "还差一点。工具调用并不等于必然泄露或必然成功，核心问题是语言层输入会借道工具链，转成真实操作风险。",
      retryHint: "想想这张卡强调的那句，不是让模型说错，而是让模型怎么样？",
    },
  },
  {
    cardSlug: "guardrails",
    reward: DEFAULT_REWARD,
    quiz: {
      question: "下面哪种说法最符合 Guardrails 在产品中的作用？",
      type: "single",
      options: [
        { id: "a", label: "A", text: "只要写好一条系统提示，就等于有了 Guardrails。" },
        { id: "b", label: "B", text: "Guardrails 是输入、决策、输出和工具调用前后共同工作的多层护栏。" },
        { id: "c", label: "C", text: "Guardrails 主要是给页面加免责声明。" },
      ],
      correctOptionId: "b",
      explanationCorrect: "对，Guardrails 不是单点拦截器，而是一套多层防护机制，重点在组合与协同。",
      explanationWrong: "这张卡想强调的误区正好在这里，安全不是靠一条万能 prompt，而是靠输入前后、工具前后等多层约束共同完成。",
      retryHint: "回想卡片最后那句引用，安全不是靠什么单独完成的？",
    },
  },
];

const GAME_CONFIG_MAP = new Map(GAME_CONFIGS.map((item) => [item.cardSlug, item]));

export const DEFAULT_PROGRESS: LearningProgress = {
  xp: 0,
  streakDays: 0,
  lastActiveDate: null,
  dailyCompletions: {},
  completedCardSlugs: [],
  quizAttempts: {},
  quizCorrectMap: {},
  unlockedBadgeIds: [],
  lastTodayPickCardSlug: null,
};

export function getCardGameConfig(cardSlug: string) {
  return GAME_CONFIG_MAP.get(cardSlug);
}

export function getCardReward(cardSlug: string) {
  return GAME_CONFIG_MAP.get(cardSlug)?.reward ?? DEFAULT_REWARD;
}

export function getFeaturedTodayPicks(cards: Card[]): TodayPick[] {
  const manualOrder = ["prompt-injection", "tool-abuse", "guardrails"];
  const bySlug = new Map(cards.map((card) => [card.slug, card]));

  return manualOrder
    .filter((slug) => bySlug.has(slug))
    .map((slug, index) => ({
      cardSlug: slug,
      reason:
        index === 0
          ? "先理解输入如何劫持模型判断。"
          : index === 1
            ? "再看风险如何顺着工具链变成真实动作。"
            : "最后把视角切回防御侧，理解为什么需要多层护栏。",
    }));
}

export function resolveTodayPick(cards: Card[], progress?: LearningProgress | null) {
  const manualPicks = getFeaturedTodayPicks(cards);
  const seen = new Set(progress?.completedCardSlugs ?? []);

  const firstUnseenManual = manualPicks.find((pick) => !seen.has(pick.cardSlug));
  if (firstUnseenManual) return firstUnseenManual;

  const unseenCard = cards.find((card) => !seen.has(card.slug));
  if (unseenCard) {
    return {
      cardSlug: unseenCard.slug,
      reason: "还没学过这张，适合拿来做今天的一次轻量推进。",
    } satisfies TodayPick;
  }

  const fallback = manualPicks[0] ?? (cards[0] ? { cardSlug: cards[0].slug, reason: "从这张开始，重新热个身。" } : null);
  return fallback;
}

export function getTodayPickCard(cards: Card[], progress?: LearningProgress | null) {
  const pick = resolveTodayPick(cards, progress);
  if (!pick) return null;
  const card = cards.find((item) => item.slug === pick.cardSlug);
  if (!card) return null;
  return { card, reason: pick.reason };
}

export function getPathCompletion(pathItem: LearningPath, progress: LearningProgress | null) {
  const completed = new Set(progress?.completedCardSlugs ?? []);
  const completedSteps = pathItem.steps.filter((step) => completed.has(step.cardSlug)).length;
  const totalSteps = pathItem.steps.length;

  return {
    completedSteps,
    totalSteps,
    percent: totalSteps === 0 ? 0 : Math.round((completedSteps / totalSteps) * 100),
    done: totalSteps > 0 && completedSteps === totalSteps,
  };
}

export function getUnlockedBadges(progress: LearningProgress | null) {
  const unlocked = new Set(progress?.unlockedBadgeIds ?? []);
  return BADGES.filter((badge) => unlocked.has(badge.id));
}

export function evaluateBadges(progress: LearningProgress): BadgeDefinition[] {
  const unlocked = new Set(progress.unlockedBadgeIds);
  const newBadges: BadgeDefinition[] = [];

  const addBadge = (badgeId: string) => {
    if (unlocked.has(badgeId)) return;
    const badge = BADGES.find((item) => item.id === badgeId);
    if (!badge) return;
    unlocked.add(badgeId);
    newBadges.push(badge);
  };

  if (Object.keys(progress.quizCorrectMap).length >= 1) addBadge("first-quiz");
  if (progress.streakDays >= 3) addBadge("three-day-streak");

  const threatBasicsCount = ["prompt-injection", "tool-abuse", "guardrails"]
    .filter((slug) => progress.quizCorrectMap[slug])
    .length;
  if (threatBasicsCount >= 3) addBadge("threat-basics-collector");

  const pathDefinitions: Array<{ id: string; steps: string[] }> = [
    { id: "first-path-finished", steps: ["prompt-injection", "tool-abuse", "guardrails"] },
  ];
  pathDefinitions.forEach((pathItem) => {
    if (pathItem.steps.every((slug) => progress.completedCardSlugs.includes(slug))) {
      addBadge(pathItem.id);
    }
  });

  progress.unlockedBadgeIds = Array.from(unlocked);
  return newBadges;
}

export function dateKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}
