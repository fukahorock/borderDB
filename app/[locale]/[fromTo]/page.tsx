import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SearchForm } from "@/app/components/SearchForm";
import { countryLabel, countryNameJa } from "@/lib/countries";
import { checkpointDisplayName, difficultyStars, statusLabelJa, transportStyleLabel } from "@/lib/format";
import { getAllDirections, getFromToMap, type JoinedBorder } from "@/lib/borders";
import type { CheckpointData } from "@/lib/checkpoints";
import { OGP_IMAGE } from "@/lib/seo";

interface DestinationEntry {
  border: JoinedBorder;
  checkpoint: CheckpointData;
  toCountry: string;
}

interface Group {
  key: string;
  origin: CheckpointData;
  destinations: DestinationEntry[];
}

interface ParsedFromTo {
  from: string;
  /** null の場合は出発国のみ指定（パンくずリストからの「この国から出発できる国境一覧」）。 */
  to: string | null;
}

function parseFromTo(fromTo: string): ParsedFromTo | null {
  // 国コードは常にISO 3166-1 alpha-2（2文字）のため "xx-to-yy" は常に8文字で一意に分解できる
  if (fromTo.length === 8 && fromTo.slice(2, 6) === "-to-") {
    return { from: fromTo.slice(0, 2).toUpperCase(), to: fromTo.slice(6, 8).toUpperCase() };
  }
  if (fromTo.length === 2) {
    return { from: fromTo.toUpperCase(), to: null };
  }
  return null;
}

export async function generateStaticParams() {
  const directions = await getAllDirections();
  const seen = new Set<string>();
  const params: { fromTo: string }[] = [];
  for (const d of directions) {
    const pairKey = `${d.from.toLowerCase()}-to-${d.to.toLowerCase()}`;
    if (!seen.has(pairKey)) {
      seen.add(pairKey);
      params.push({ fromTo: pairKey });
    }
    const originKey = d.from.toLowerCase();
    if (!seen.has(originKey)) {
      seen.add(originKey);
      params.push({ fromTo: originKey });
    }
  }
  return params;
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/[fromTo]">): Promise<Metadata> {
  const { fromTo } = await params;
  const parsed = parseFromTo(fromTo);
  if (!parsed) return {};
  const title = parsed.to
    ? `${countryNameJa(parsed.from)}→${countryNameJa(parsed.to)}の国境一覧`
    : `${countryNameJa(parsed.from)}から出発する国境一覧`;
  return {
    title,
    openGraph: { title, type: "website", images: [OGP_IMAGE] },
    twitter: { card: "summary_large_image", title, images: [OGP_IMAGE.url] },
  };
}

export default async function ResultsPage({
  params,
}: PageProps<"/[locale]/[fromTo]">) {
  const { locale, fromTo } = await params;
  const parsed = parseFromTo(fromTo);
  if (!parsed) notFound();
  const { from, to } = parsed;

  const [directions, fromToMap] = await Promise.all([getAllDirections(), getFromToMap()]);
  const matches = directions.filter((d) => d.from === from && (to === null || d.to === to));
  if (matches.length === 0) notFound();

  // UI仕様書1.7.1: 出発チェックポイント単位でグルーピングする
  const groups = new Map<string, Group>();
  for (const d of matches) {
    const origin = d.border.checkpoints[from];
    const dest = d.border.checkpoints[d.to];
    const key = `${from}-${origin.slug}`;
    if (!groups.has(key)) groups.set(key, { key, origin, destinations: [] });
    groups.get(key)!.destinations.push({ border: d.border, checkpoint: dest, toCountry: d.to });
  }
  const groupList = Array.from(groups.values());
  for (const g of groupList) {
    g.destinations.sort((a, b) => a.checkpoint.name.ja.localeCompare(b.checkpoint.name.ja, "ja"));
  }
  const groupedCards = groupList.filter((g) => g.destinations.length >= 2);
  const normalCards = groupList.filter((g) => g.destinations.length === 1);

  return (
    <>
      <section className="border-b border-slate-200 px-4 py-6">
        <div className="mx-auto flex max-w-5xl flex-col gap-4">
          <h1 className="text-xl font-semibold text-slate-900">
            {to
              ? `${countryLabel(from)} → ${countryLabel(to)} の国境（${matches.length}件）`
              : `${countryLabel(from)} から出発できる国境（${matches.length}件）`}
          </h1>
          <SearchForm
            fromToMap={fromToMap}
            locale={locale}
            initialFrom={from}
            initialTo={to ?? ""}
            submitLabel="再検索"
          />
        </div>
      </section>

      <section className="px-4 py-8">
        <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-3">
          {groupedCards.map((g) => (
            <div key={g.key} className="rounded-lg border border-slate-200 p-4 sm:col-span-3">
              <p className="font-medium text-slate-900">
                {checkpointDisplayName(g.origin)}
                <span className="mx-2 text-slate-400">⇔</span>
                {g.destinations.map((d, i) => (
                  <span key={d.checkpoint.slug}>
                    {i > 0 && <span className="text-slate-400">、</span>}
                    <Link
                      href={`/${locale}/${from.toLowerCase()}-to-${d.toCountry.toLowerCase()}/${g.origin.slug}-${d.checkpoint.slug}`}
                      className="text-emerald-700 underline-offset-2 hover:underline"
                    >
                      {checkpointDisplayName(d.checkpoint)}
                    </Link>
                    {!to && (
                      <span className="ml-1 text-xs text-slate-400">
                        （{countryLabel(d.toCountry)}）
                      </span>
                    )}
                  </span>
                ))}
              </p>
            </div>
          ))}

          {normalCards.map((g) => {
            const d = g.destinations[0];
            const stars = difficultyStars(d.border.difficulty[from]);
            return (
              <Link
                key={g.key}
                href={`/${locale}/${from.toLowerCase()}-to-${d.toCountry.toLowerCase()}/${g.origin.slug}-${d.checkpoint.slug}`}
                className="rounded-lg border border-slate-200 p-4 transition hover:border-emerald-600 hover:shadow-sm"
              >
                <p className="font-medium text-slate-900">
                  {checkpointDisplayName(g.origin)} ⇔ {checkpointDisplayName(d.checkpoint)}
                </p>
                {!to && (
                  <p className="mt-1 text-xs text-slate-400">{countryLabel(d.toCountry)}</p>
                )}
                <p className="mt-2 text-sm text-slate-600">
                  {stars ?? "評価未定"}
                  <span className="ml-2 text-xs text-slate-400">
                    {transportStyleLabel(d.border.transport_style[from])}
                  </span>
                </p>
                <span className="mt-2 inline-block rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                  {statusLabelJa(d.border.status)}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="border-t border-slate-200 px-4 py-5">
        <Link
          href="#"
          className="mx-auto flex max-w-3xl items-center justify-between rounded-md bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
        >
          <span>この検索結果にない国境の情報をお持ちの方はこちら</span>
          <span aria-hidden>›</span>
        </Link>
      </section>
    </>
  );
}
