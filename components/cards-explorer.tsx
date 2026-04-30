"use client";

import { useMemo, useState } from "react";

import { CardTile } from "@/components/card-tile";
import { formatCategoryLabel } from "@/lib/display";
import type { Card } from "@/lib/types";

type CardsExplorerProps = {
  cards: Card[];
};

export function CardsExplorer({ cards }: CardsExplorerProps) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeTag, setActiveTag] = useState<string>("all");

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    cards.forEach((card) => {
      counts.set(card.category, (counts.get(card.category) ?? 0) + 1);
    });

    return Array.from(counts.entries()).map(([name, count]) => ({ name, count }));
  }, [cards]);

  const tags = useMemo(() => {
    const counts = new Map<string, number>();
    cards.forEach((card) => {
      card.tags.forEach((tag) => {
        counts.set(tag, (counts.get(tag) ?? 0) + 1);
      });
    });

    return Array.from(counts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  }, [cards]);

  const filteredCards = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    return cards.filter((card) => {
      const matchesCategory = activeCategory === "all" || card.category === activeCategory;
      const matchesTag = activeTag === "all" || card.tags.includes(activeTag);
      const haystack = `${card.title} ${card.summary} ${card.tags.join(" ")} ${card.category}`.toLowerCase();
      const matchesQuery = keyword === "" || haystack.includes(keyword);

      return matchesCategory && matchesTag && matchesQuery;
    });
  }, [activeCategory, activeTag, cards, query]);

  const hasFilters = query.trim() !== "" || activeCategory !== "all" || activeTag !== "all";

  return (
    <div className="space-y-8">
      <section className="surface-strong p-6 sm:p-8">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <p className="eyebrow">card library</p>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">全部知识卡片</h1>
            <p className="max-w-2xl text-base leading-7 text-slate-600">
              先用分类把知识点收住，再用标签和关键词把入口切细。当前版本优先验证浏览路径是否顺手，而不是堆一套重搜索系统。
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            <div className="hero-metric">
              <p className="text-sm font-medium text-amber-900">当前卡片</p>
              <p className="mt-2 text-3xl font-semibold text-amber-950">{cards.length}</p>
            </div>
            <div className="hero-metric">
              <p className="text-sm font-medium text-emerald-900">分类数</p>
              <p className="mt-2 text-3xl font-semibold text-emerald-950">{categories.length}</p>
            </div>
            <div className="hero-metric">
              <p className="text-sm font-medium text-sky-900">标签数</p>
              <p className="mt-2 text-3xl font-semibold text-sky-950">{tags.length}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="surface p-5 sm:p-6">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <div>
              <label htmlFor="card-search" className="text-sm font-medium text-slate-700">
                搜索卡片
              </label>
              <input
                id="card-search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="试试输入 prompt、guardrails、agent..."
                className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
              />
            </div>

            <div>
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-slate-700">分类筛选</p>
                {activeCategory !== "all" ? (
                  <button type="button" onClick={() => setActiveCategory("all")} className="text-xs font-medium text-emerald-700 hover:text-emerald-900">
                    清空分类
                  </button>
                ) : null}
              </div>
              <div className="mt-3 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setActiveCategory("all")}
                  className={`filter-pill ${activeCategory === "all" ? "filter-pill-active" : ""}`}
                >
                  全部分类
                </button>
                {categories.map((category) => (
                  <button
                    key={category.name}
                    type="button"
                    onClick={() => setActiveCategory(category.name)}
                    className={`filter-pill ${activeCategory === category.name ? "filter-pill-active" : ""}`}
                  >
                    {formatCategoryLabel(category.name)}
                    <span className="ml-2 text-[11px] text-slate-400">{category.count}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-slate-700">标签筛选</p>
              {activeTag !== "all" ? (
                <button type="button" onClick={() => setActiveTag("all")} className="text-xs font-medium text-emerald-700 hover:text-emerald-900">
                  清空标签
                </button>
              ) : null}
            </div>
            <div className="mt-3 flex flex-wrap gap-3">
              <button type="button" onClick={() => setActiveTag("all")} className={`filter-pill ${activeTag === "all" ? "filter-pill-active" : ""}`}>
                全部标签
              </button>
              {tags.map((tag) => (
                <button
                  key={tag.name}
                  type="button"
                  onClick={() => setActiveTag(tag.name)}
                  className={`filter-pill ${activeTag === tag.name ? "filter-pill-active" : ""}`}
                >
                  #{tag.name}
                  <span className="ml-2 text-[11px] text-slate-400">{tag.count}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">results</p>
            <h2 className="section-title mt-2">当前结果</h2>
            <p className="section-copy mt-3">
              现在显示 <span className="font-semibold text-slate-900">{filteredCards.length}</span> / {cards.length} 张卡片。
            </p>
          </div>
          {hasFilters ? (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setActiveCategory("all");
                setActiveTag("all");
              }}
              className="button-secondary"
            >
              清空全部筛选
            </button>
          ) : null}
        </div>

        {filteredCards.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredCards.map((card) => (
              <CardTile key={card.slug} card={card} />
            ))}
          </div>
        ) : (
          <div className="surface p-8 text-center sm:p-10">
            <p className="eyebrow">empty state</p>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">没有匹配到卡片</h3>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-600">
              你可以换一个关键词，或者把分类 / 标签筛选清掉一点。首版内容还不多，适合先用更宽松的条件浏览。
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setActiveCategory("all");
                setActiveTag("all");
              }}
              className="button-primary mt-6"
            >
              回到全部卡片
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
