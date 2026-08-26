import type { Metadata } from "next";
import Link from "next/link";
import { SearchForm } from "@/app/components/SearchForm";
import { countryLabel } from "@/lib/countries";
import { checkpointDisplayName, freshness } from "@/lib/format";
import { getFromToMap, getJoinedBorders, sortByRecentlyUpdated } from "@/lib/borders";

export const metadata: Metadata = {
  title: "国境データベース",
};

export default async function TopPage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;

  const [borders, fromToMap] = await Promise.all([
    getJoinedBorders(),
    getFromToMap(),
  ]);
  const recentBorders = sortByRecentlyUpdated(borders).slice(0, 3);

  return (
    <>
      <section
        className="bg-slate-900 bg-cover bg-center px-4 pb-20 pt-24 text-center text-white"
        style={{
          backgroundImage: `linear-gradient(rgba(15,23,42,0.6), rgba(15,23,42,0.8)), url(${
            process.env.NEXT_PUBLIC_BASE_PATH ?? ""
          }/hero/top.jpg)`,
        }}
      >
        <h1 className="text-4xl font-bold sm:text-5xl">国境データベース</h1>
        <p className="mt-4 text-lg text-slate-300">
          陸路と船で越える、世界の国境の歩き方
        </p>

        <div className="mx-auto mt-10 w-full max-w-3xl rounded-2xl bg-white p-6 shadow-xl sm:p-8">
          <SearchForm fromToMap={fromToMap} locale={locale} size="lg" />
        </div>
      </section>

      <section className="border-b border-slate-200 px-4 py-6">
        <div className="mx-auto flex max-w-3xl items-center justify-center rounded border border-dashed border-slate-300 py-8 text-sm text-slate-400">
          広告枠
        </div>
      </section>

      <section className="border-b border-slate-200 px-4 py-8">
        <h2 className="mx-auto mb-3 max-w-5xl text-sm font-semibold text-slate-500">
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
                className="rounded-lg border border-slate-200 p-3 text-sm transition hover:border-emerald-600 hover:shadow-sm"
              >
                <p className="font-medium text-slate-900">
                  {checkpointDisplayName(border.checkpoints[a])} ⇔{" "}
                  {checkpointDisplayName(border.checkpoints[b])}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {countryLabel(a)} - {countryLabel(b)}
                </p>
                <p
                  className={`mt-1 text-xs ${
                    fresh.level === "stale" ? "text-amber-600" : "text-slate-400"
                  }`}
                >
                  {fresh.label}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="px-4 py-5">
        <Link
          href="#"
          className="mx-auto flex max-w-3xl items-center justify-between rounded-md bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
        >
          <span>最新情報、募集中</span>
          <span aria-hidden>›</span>
        </Link>
      </section>
    </>
  );
}
