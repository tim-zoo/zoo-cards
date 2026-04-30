import type { PathDifficulty } from "@/lib/types";

const CATEGORY_LABELS: Record<string, string> = {
  "Threat Basics": "风险基础",
  "Defense Patterns": "防护模式",
};

export function formatCategoryLabel(category: string) {
  return CATEGORY_LABELS[category] ?? category;
}

export function formatDifficultyLabel(difficulty?: PathDifficulty) {
  if (difficulty === "easy") return "轻松入门";
  if (difficulty === "medium") return "进阶阅读";
  if (difficulty === "deep") return "深入理解";
  return "自由探索";
}
