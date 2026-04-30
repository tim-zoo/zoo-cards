import Link from "next/link";

export default function NotFound() {
  return (
    <div className="surface mx-auto max-w-xl p-8 text-center">
      <p className="eyebrow">not found</p>
      <h1 className="mt-3 text-3xl font-semibold text-slate-950">这条小路还没修好</h1>
      <p className="mt-4 text-slate-600">你访问的页面不存在，或者对应内容还没有被放进动物园。</p>
      <Link href="/" className="mt-6 inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800">
        回到首页
      </Link>
    </div>
  );
}
