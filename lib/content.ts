import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

import type { Card, LearningPath, PathDifficulty, ResolvedLearningPath } from "@/lib/types";

const ROOT = process.cwd();
const CARD_DIR = path.join(ROOT, "content", "cards");
const PATH_DIR = path.join(ROOT, "content", "paths");

function readFile(filePath: string) {
  return fs.readFileSync(filePath, "utf8");
}

function readDir(filePath: string) {
  return fs.readdirSync(filePath).sort();
}

function assertString(value: unknown, field: string, fileName: string) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${fileName}: field \`${field}\` must be a non-empty string`);
  }
  return value.trim();
}

function assertStringArray(value: unknown, field: string, fileName: string) {
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string" || item.trim() === "")) {
    throw new Error(`${fileName}: field \`${field}\` must be a string array`);
  }
  return value.map((item) => item.trim());
}

function assertOptionalDifficulty(value: unknown, field: string, fileName: string): PathDifficulty | undefined {
  if (value === undefined) return undefined;
  if (value === "easy" || value === "medium" || value === "deep") return value;
  throw new Error(`${fileName}: field \`${field}\` must be one of easy | medium | deep`);
}

function assertOptionalNumber(value: unknown, field: string, fileName: string) {
  if (value === undefined) return undefined;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  throw new Error(`${fileName}: field \`${field}\` must be a number`);
}

export function getAllCards(): Card[] {
  const files = readDir(CARD_DIR).filter((file) => file.endsWith(".mdx"));

  const cards = files.map((fileName) => {
    const filePath = path.join(CARD_DIR, fileName);
    const source = readFile(filePath);
    const { data, content } = matter(source);
    const slug = fileName.replace(/\.mdx$/, "");

    const card: Card = {
      slug,
      title: assertString(data.title, "title", fileName),
      summary: assertString(data.summary, "summary", fileName),
      category: assertString(data.category, "category", fileName),
      tags: assertStringArray(data.tags ?? [], "tags", fileName),
      status: (data.status ?? "published") as Card["status"],
      relatedCardSlugs: assertStringArray(data.relatedCardSlugs ?? [], "relatedCardSlugs", fileName),
      order: typeof data.order === "number" ? data.order : 999,
      content: content.trim(),
    };

    return card;
  });

  const slugs = new Set(cards.map((card) => card.slug));
  cards.forEach((card) => {
    card.relatedCardSlugs.forEach((relatedSlug) => {
      if (!slugs.has(relatedSlug)) {
        throw new Error(`Card \`${card.slug}\` references missing related card \`${relatedSlug}\``);
      }
    });
  });

  return cards
    .filter((card) => card.status === "published")
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
}

export function getCardSlugs() {
  return getAllCards().map((card) => card.slug);
}

export function getCardBySlug(slug: string) {
  return getAllCards().find((card) => card.slug === slug);
}

export function getCategories() {
  return Array.from(new Set(getAllCards().map((card) => card.category)));
}

export function getTags() {
  return Array.from(new Set(getAllCards().flatMap((card) => card.tags))).sort();
}

export function getRelatedCards(card: Card) {
  const cardsBySlug = new Map(getAllCards().map((item) => [item.slug, item]));
  return card.relatedCardSlugs
    .map((slug) => cardsBySlug.get(slug))
    .filter((item): item is Card => Boolean(item));
}

function parseLearningPath(fileName: string): LearningPath {
  const filePath = path.join(PATH_DIR, fileName);
  const raw = JSON.parse(readFile(filePath)) as LearningPath;

  return {
    slug: assertString(raw.slug, "slug", fileName),
    title: assertString(raw.title, "title", fileName),
    summary: assertString(raw.summary, "summary", fileName),
    audience: assertString(raw.audience, "audience", fileName),
    theme: assertString(raw.theme, "theme", fileName),
    difficulty: assertOptionalDifficulty(raw.difficulty, "difficulty", fileName),
    durationMinutes: assertOptionalNumber(raw.durationMinutes, "durationMinutes", fileName),
    outcomes: raw.outcomes ? assertStringArray(raw.outcomes, "outcomes", fileName) : undefined,
    steps: Array.isArray(raw.steps)
      ? raw.steps.map((step, index) => ({
          cardSlug: assertString(step?.cardSlug, `steps[${index}].cardSlug`, fileName),
          whyThisStep: assertString(step?.whyThisStep, `steps[${index}].whyThisStep`, fileName),
          nextHint: typeof step?.nextHint === "string" ? step.nextHint.trim() : undefined,
        }))
      : (() => {
          throw new Error(`${fileName}: field \`steps\` must be an array`);
        })(),
  };
}

export function getAllPaths(): LearningPath[] {
  return readDir(PATH_DIR)
    .filter((file) => file.endsWith(".json"))
    .map(parseLearningPath);
}

export function getPathSlugs() {
  return getAllPaths().map((pathItem) => pathItem.slug);
}

export function getPathBySlug(slug: string): ResolvedLearningPath | undefined {
  const pathItem = getAllPaths().find((item) => item.slug === slug);
  if (!pathItem) return undefined;

  const cardsBySlug = new Map(getAllCards().map((card) => [card.slug, card]));

  return {
    ...pathItem,
    steps: pathItem.steps.map((step) => {
      const card = cardsBySlug.get(step.cardSlug);
      if (!card) {
        throw new Error(`Path \`${slug}\` references missing card \`${step.cardSlug}\``);
      }

      return {
        ...step,
        card,
      };
    }),
  };
}
