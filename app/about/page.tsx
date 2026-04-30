export const metadata = {
  title: "关于 | zoo-cards",
};

export default function AboutPage() {
  return (
    <div className="space-y-8">
      <section>
        <p className="eyebrow">about</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-950">关于 zoo-cards</h1>
      </section>

      <section className="surface max-w-3xl p-6 sm:p-8">
        <div className="prose-card">
          <p>
            zoo-cards 是 tim-zoo 下面的一个响应式知识卡片网站实验，目标是把 AI
            安全知识组织成更容易浏览、分享和逐步学习的形式。
          </p>
          <p>
            当前版本优先验证三件事：内容模型是否顺手、GitHub Pages 静态部署是否稳定，以及卡片 + 路径的组合体验是否成立。
          </p>
        </div>
      </section>
    </div>
  );
}
