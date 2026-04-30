export type CardStatus = "draft" | "published";
export type PathDifficulty = "easy" | "medium" | "deep";

export interface Card {
  slug: string;
  title: string;
  summary: string;
  category: string;
  tags: string[];
  status: CardStatus;
  relatedCardSlugs: string[];
  order: number;
  content: string;
}

export interface PathStep {
  cardSlug: string;
  whyThisStep: string;
  nextHint?: string;
}

export interface LearningPath {
  slug: string;
  title: string;
  summary: string;
  audience: string;
  theme: string;
  difficulty?: PathDifficulty;
  durationMinutes?: number;
  outcomes?: string[];
  steps: PathStep[];
}

export interface ResolvedPathStep extends PathStep {
  card: Card;
}

export interface ResolvedLearningPath extends Omit<LearningPath, "steps"> {
  steps: ResolvedPathStep[];
}
