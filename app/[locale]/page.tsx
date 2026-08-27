import Link from "next/link";
import { SearchForm } from "@/app/components/SearchForm";
import { RandomBorders, type RandomEntry } from "@/app/components/RandomBorders";
import { countryLabel } from "@/lib/countries";
import { checkpointDisplayName, freshness } from "@/lib/format";
import { getAllDirections, getFromToMap, getJoinedBorders, sortByRecentlyUpdated } from "@/lib/borders";

// ルートlayout.tsxのdefault title/description/OGPをそのまま使う（トップページ用の上書きは不要）

export default async function TopPage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;

  const [borders, fromToMap, directions] = await Promise.all([
    getJoinedBorders(),
    getFromToMap(),
    getAllDirections(),
  ]);
  const recentBorders = sortByRecentlyUpdated(borders).slice(0, 3);

  const randomEntries: RandomEntry[] = directions.map((d) => ({
    href: `/${locale}/${d.from.toLowerCase()}-to-${d.to.toLowerCase()}/${
      d.border.checkpoints[d.from].slug
    }-${d.border.checkpoints[d.to].slug}`,
    origin: checkpointDisplayName(d.border.checkpoints[d.from]),
    dest: checkpointDisplayName(d.border.checkpoints[d.to]),
    originCountry: countryLabel(d.from),
    destCountry: countryLabel(d.to),
  }));

  return (
    <>
      <section
        className="bg-slate-900 bg-cover bg-center px-4 pb-20 pt-24 text-center text-white"
        style={{
          backgroundImage:
            "linear-gradient(rgba(15,23,42,0.85), rgba(15,23,42,0.95)), url(/hero/top.jpg)",
        }}
      >
        <h1 className="text-4xl font-bold sm:text-5xl">国境データベース</h1>
        <p className="mt-4 text-lg font-bold text-slate-200">
          陸路と船で越える、世界の国境の歩き方
        </p>

        <div className="mx-auto mt-10 w-full max-w-3xl rounded-2xl bg-white p-6 shadow-xl sm:p-8 dark:bg-slate-900">
          <SearchForm fromToMap={fromToMap} locale={locale} size="lg" />
        </div>
      </section>

      <section className="border-b border-slate-200 px-4 py-6 dark:border-slate-800">
        <div className="mx-auto flex max-w-3xl items-center justify-center rounded border border-dashed border-slate-300 py-8 text-sm text-slate-400 dark:border-slate-700 dark:text-slate-500">
          広告枠
        </div>
      </section>

      <section className="border-b border-slate-200 px-4 py-8 dark:border-slate-800">
        <h2 className="mx-auto mb-3 max-w-5xl text-sm font-semibold text-slate-500 dark:text-slate-400">
          最近更新された国境
        </h2>
        <div className="mx-auto grid max-w-5xl gap-3 sm:grid-cols-3">
          {recentBorders.map((border) => {
            const [a, b] = border.countries;
            const fresh = freshness(border.status_updated);
            return (
              <Link
                key={border.id}
                href={`/${locale}/${a.toLowerCase()}-to-${b.toLowerCase()}/${
                  border.checkpoints[a].slug
                }-${border.checkpoints[b].slug}`}
                className="rounded-lg border border-slate-200 p-3 text-sm transition hover:border-emerald-600 hover:shadow-sm dark:border-slate-700 dark:hover:border-emerald-500"
              >
                <p className="font-medium text-slate-900 dark:text-slate-100">
                  {checkpointDisplayName(border.checkpoints[a])} ⇔{" "}
                  {checkpointDisplayName(border.checkpoints[b])}
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {countryLabel(a)} - {countryLabel(b)}
                </p>
                <p
                  className={`mt-1 text-xs ${
                    fresh.level === "stale"
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-slate-400 dark:text-slate-500"
                  }`}
                >
                  {fresh.label}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="border-b border-slate-200 px-4 py-8 dark:border-slate-800">
        <h2 className="mx-auto mb-3 max-w-5xl text-sm font-semibold text-slate-500 dark:text-slate-400">
          次はここを旅してみない？
        </h2>
        <div className="mx-auto max-w-5xl">
          <RandomBorders entries={randomEntries} />
        </div>
      </section>

      <section className="px-4 py-5">
        <Link
          href="#"
          className="mx-auto flex max-w-3xl items-center justify-between rounded-md bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
        >
          <span>最新情報、募集中</span>
          <span aria-hidden>›</span>
        </Link>
      </section>
    </>
  );
}
