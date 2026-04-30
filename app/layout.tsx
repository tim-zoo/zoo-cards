import type { Metadata } from "next";
import Link from "next/link";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://tim-zoo.github.io/zoo-cards/"),
  title: {
    default: "zoo-cards | 动物园风格 AI 安全知识卡片站",
    template: "%s",
  },
  description: "动物园风格的 AI 安全知识卡片站，支持按路径逐步探索。",
  openGraph: {
    title: "zoo-cards | 动物园风格 AI 安全知识卡片站",
    description: "一个基于 GitHub Pages 的响应式 AI 安全知识卡片站，支持按路径逐步探索。",
    url: "https://tim-zoo.github.io/zoo-cards/",
    siteName: "zoo-cards",
    locale: "zh_CN",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "zoo-cards | 动物园风格 AI 安全知识卡片站",
    description: "一个基于 GitHub Pages 的响应式 AI 安全知识卡片站，支持按路径逐步探索。",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>
        <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-6 sm:px-6 lg:px-8">
          <header className="surface sticky top-4 z-10 mb-8 flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-xl shadow-sm">🦊</div>
              <div>
                <Link href="/" className="text-lg font-semibold tracking-tight text-slate-950">
                  zoo-cards
                </Link>
                <p className="mt-1 text-sm text-slate-600">动物园风格 AI 安全知识卡片站</p>
              </div>
            </div>
            <nav className="flex flex-wrap gap-2">
              <Link href="/cards" className="nav-link">
                卡片
              </Link>
              <Link href="/paths" className="nav-link">
                探索路径
              </Link>
              <Link href="/about" className="nav-link">
                关于
              </Link>
              <a href="https://github.com/tim-zoo" className="nav-link" target="_blank" rel="noreferrer">
                tim-zoo ↗
              </a>
            </nav>
          </header>

          <main className="flex-1">{children}</main>

          <footer className="mt-12 border-t border-slate-200/70 py-6 text-sm text-slate-500">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p>Built for GitHub Pages, mobile-first, and plan-driven iteration.</p>
              <p className="text-slate-400">zoo-cards · AI security field guide</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
