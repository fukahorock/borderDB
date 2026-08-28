interface PageHeroProps {
  title: string;
}

/** サブページ用の小さめジャンボトロン（トップページの背景写真・グラデーションを流用）。 */
export function PageHero({ title }: PageHeroProps) {
  return (
    <section
      className="bg-slate-900 bg-cover bg-center px-4 pb-16 pt-20 text-center text-white"
      style={{
        backgroundImage:
          "linear-gradient(rgba(15,23,42,0.85), rgba(15,23,42,0.95)), url(/hero/top.jpg)",
      }}
    >
      <h1 className="text-4xl font-bold sm:text-5xl">{title}</h1>
    </section>
  );
}
