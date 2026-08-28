import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BorderMap } from "@/app/components/BorderMap";
import { ShareButton } from "@/app/components/ShareButton";
import { countryNameJa, flagEmoji } from "@/lib/countries";
import {
  difficultyStars,
  freshness,
  renderHint,
  statusLabelJa,
  transportStyleLabel,
  visaLabel,
} from "@/lib/format";
import { getAllDirections, type Direction } from "@/lib/borders";
import type { CheckpointData } from "@/lib/checkpoints";
import { OGP_IMAGE, SITE_URL } from "@/lib/seo";
import { buildUpdateRequestFormUrl } from "@/lib/links";
import { AD_SLOTS_ENABLED } from "@/lib/ads";

function parseFromTo(fromTo: string): { from: string; to: string } | null {
  if (fromTo.length !== 8 || fromTo.slice(2, 6) !== "-to-") return null;
  return { from: fromTo.slice(0, 2).toUpperCase(), to: fromTo.slice(6, 8).toUpperCase() };
}

async function findDirection(from: string, to: string, checkpoints: string): Promise<Direction | undefined> {
  const directions = await getAllDirections();
  return directions.find((d) => {
    if (d.from !== from || d.to !== to) return false;
    const slug = `${d.border.checkpoints[from].slug}-${d.border.checkpoints[to].slug}`;
    return slug === checkpoints;
  });
}

/** 英語名・現地語表記の併記（例：「Bavet / បាវិត」）。ググりやすさのために表示する。 */
function nameDetails(cp: CheckpointData): string | null {
  const parts = [cp.name.en, ...cp.name.local].filter(Boolean);
  return parts.length ? parts.join(" / ") : null;
}

// [fromTo] はページ（page.tsx）であり、その generateStaticParams は自身のルートにしか
// 使われず子ルートには伝播しないため（レイアウトではないため）、fromTo と checkpoints の
// 両方をここで一括生成する（generateStaticParams「複数の動的セグメント」のボトムアップ方式）。
export async function generateStaticParams() {
  const directions = await getAllDirections();
  return directions.map((d) => ({
    fromTo: `${d.from.toLowerCase()}-to-${d.to.toLowerCase()}`,
    checkpoints: `${d.border.checkpoints[d.from].slug}-${d.border.checkpoints[d.to].slug}`,
  }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/[fromTo]/[checkpoints]">): Promise<Metadata> {
  const { fromTo, checkpoints } = await params;
  const parsed = parseFromTo(fromTo);
  if (!parsed) return {};
  const direction = await findDirection(parsed.from, parsed.to, checkpoints);
  if (!direction) return {};
  const { from, to, border } = direction;
  const a = border.checkpoints[from].name.ja;
  const b = border.checkpoints[to].name.ja;
  const title = `${a}⇔${b}の国境越え情報`;
  const description = `${countryNameJa(from)}から${countryNameJa(to)}へ、${a}を陸路・船で越える方法をまとめました。`;
  return {
    title,
    description,
    openGraph: { title, description, type: "article", images: [OGP_IMAGE] },
    twitter: { card: "summary_large_image", title, description, images: [OGP_IMAGE.url] },
  };
}

export default async function DetailPage({
  params,
}: PageProps<"/[locale]/[fromTo]/[checkpoints]">) {
  const { locale, fromTo, checkpoints } = await params;
  const parsed = parseFromTo(fromTo);
  if (!parsed) notFound();
  const { from, to } = parsed;

  const direction = await findDirection(from, to, checkpoints);
  if (!direction) notFound();
  const { border } = direction;

  const originCp = border.checkpoints[from];
  const destCp = border.checkpoints[to];
  const reverseFromTo = `${to.toLowerCase()}-to-${from.toLowerCase()}`;
  const reverseCheckpoints = `${destCp.slug}-${originCp.slug}`;

  // タブの左右は現在の閲覧方向によらず、国境レコードのcountries順（固定）で決める。
  // こうしないと、タブを切り替えるたびに左右の表示が入れ替わってしまう。
  const [countryA, countryB] = border.countries;
  const cpA = border.checkpoints[countryA];
  const cpB = border.checkpoints[countryB];
  const isForward = from === countryA;
  const tabAtoB = {
    fromTo: `${countryA.toLowerCase()}-to-${countryB.toLowerCase()}`,
    checkpoints: `${cpA.slug}-${cpB.slug}`,
  };
  const tabBtoA = {
    fromTo: `${countryB.toLowerCase()}-to-${countryA.toLowerCase()}`,
    checkpoints: `${cpB.slug}-${cpA.slug}`,
  };

  const stars = difficultyStars(border.difficulty[from]);
  const fresh = freshness(border.status_updated);
  const hintFrom = border.i18n.ja?.hint_from?.[from] ?? "";
  const trivia = border.i18n.ja?.trivia ?? "";
  const needsWarning = border.status === "closed" || border.status === "needs_verification";
  const originDetails = nameDetails(originCp);
  const destDetails = nameDetails(destCp);

  const updateRequestFormUrl = buildUpdateRequestFormUrl(
    `${SITE_URL}/${locale}/${fromTo}/${checkpoints}`,
  );

  const mapPoints = [
    originCp.coords && { coords: originCp.coords, label: originCp.name.ja, color: "#059669" },
    destCp.coords && { coords: destCp.coords, label: destCp.name.ja, color: "#dc2626" },
  ].filter((p): p is { coords: [number, number]; label: string; color: string } => Boolean(p));

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8">
      {/* 1. パンくずリスト */}
      <nav className="mb-4 flex flex-wrap items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
        <Link href={`/${locale}`} className="hover:text-emerald-700 dark:hover:text-emerald-400">
          トップ
        </Link>
        <span>›</span>
        <Link
          href={`/${locale}/${from.toLowerCase()}`}
          className="hover:text-emerald-700 dark:hover:text-emerald-400"
        >
          {countryNameJa(from)}
        </Link>
        <span>›</span>
        <Link
          href={`/${locale}/${to.toLowerCase()}`}
          className="hover:text-emerald-700 dark:hover:text-emerald-400"
        >
          {countryNameJa(to)}
        </Link>
        <span>›</span>
        <span className="text-slate-700 dark:text-slate-300">
          {originCp.name.ja}⇔{destCp.name.ja}
        </span>
      </nav>

      {/* 2. 検問所名／ステータス */}
      <div className="mb-1 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {flagEmoji(from)} {originCp.name.ja} → {flagEmoji(to)} {destCp.name.ja}
          </h1>
          {(originDetails || destDetails) && (
            <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
              {originDetails ?? originCp.name.ja}
              <span className="mx-1">→</span>
              {destDetails ?? destCp.name.ja}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            {statusLabelJa(border.status)}
          </span>
          <ShareButton title={`${originCp.name.ja}⇔${destCp.name.ja}の国境越え情報`} />
        </div>
      </div>
      <p
        className={`mb-6 mt-2 text-xs ${
          fresh.level === "stale"
            ? "text-amber-600 dark:text-amber-400"
            : "text-slate-400 dark:text-slate-500"
        }`}
      >
        {fresh.label}
      </p>

      {needsWarning && (
        <div className="mb-6 rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
          この国境は現在「{statusLabelJa(border.status)}」の状態です。渡航前に必ず最新情報をご確認ください。
        </div>
      )}

      {/* 3. 国別の固定情報 */}
      <div className="mb-6 flex flex-col gap-2 rounded-lg border border-slate-200 p-4 text-sm dark:border-slate-700">
        <p>
          アライバルビザ（{countryNameJa(from)}入国）：{visaLabel(originCp.visa_on_arrival)}
        </p>
        <p>
          アライバルビザ（{countryNameJa(to)}入国）：{visaLabel(destCp.visa_on_arrival)}
        </p>
        <a
          href={`https://www.google.com/maps/dir/?api=1&origin=${originCp.coords?.[0]},${originCp.coords?.[1]}&destination=${destCp.coords?.[0]},${destCp.coords?.[1]}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 inline-block w-fit rounded-md border border-slate-300 px-3 py-1.5 text-emerald-700 hover:bg-emerald-50 dark:border-slate-600 dark:text-emerald-400 dark:hover:bg-emerald-900/30"
        >
          Googleマップで見る
        </a>
      </div>

      {AD_SLOTS_ENABLED && (
        <div className="mb-6 flex items-center justify-center rounded border border-dashed border-slate-300 py-8 text-sm text-slate-400 dark:border-slate-700 dark:text-slate-500">
          広告枠
        </div>
      )}

      {/* 4. 方向切り替えタブ／リンク */}
      {/* replace を使い、タブ切り替えを履歴に積まない（ブラウザバックで検索結果に一発で戻れるように） */}
      <div className="mb-6 hidden gap-1 rounded-lg bg-slate-100 p-1 sm:flex dark:bg-slate-800">
        {isForward ? (
          <span className="flex-1 rounded-md bg-white px-4 py-2 text-center text-sm font-semibold text-emerald-700 shadow-sm dark:bg-slate-700 dark:text-emerald-400">
            {flagEmoji(countryA)}{cpA.name.ja}→{flagEmoji(countryB)}{cpB.name.ja}
          </span>
        ) : (
          <Link
            href={`/${locale}/${tabAtoB.fromTo}/${tabAtoB.checkpoints}`}
            replace
            className="flex-1 rounded-md px-4 py-2 text-center text-sm text-slate-500 hover:bg-white/60 dark:text-slate-400 dark:hover:bg-slate-700/60"
          >
            {flagEmoji(countryA)}{cpA.name.ja}→{flagEmoji(countryB)}{cpB.name.ja}
          </Link>
        )}
        {!isForward ? (
          <span className="flex-1 rounded-md bg-white px-4 py-2 text-center text-sm font-semibold text-emerald-700 shadow-sm dark:bg-slate-700 dark:text-emerald-400">
            {flagEmoji(countryB)}{cpB.name.ja}→{flagEmoji(countryA)}{cpA.name.ja}
          </span>
        ) : (
          <Link
            href={`/${locale}/${tabBtoA.fromTo}/${tabBtoA.checkpoints}`}
            replace
            className="flex-1 rounded-md px-4 py-2 text-center text-sm text-slate-500 hover:bg-white/60 dark:text-slate-400 dark:hover:bg-slate-700/60"
          >
            {flagEmoji(countryB)}{cpB.name.ja}→{flagEmoji(countryA)}{cpA.name.ja}
          </Link>
        )}
      </div>
      <div className="mb-6 sm:hidden">
        <Link
          href={`/${locale}/${reverseFromTo}/${reverseCheckpoints}`}
          replace
          className="text-sm text-emerald-700 underline dark:text-emerald-400"
        >
          逆方向（{flagEmoji(to)}{destCp.name.ja}→{flagEmoji(from)}{originCp.name.ja}）の情報はこちら
        </Link>
      </div>

      {/* 5. 方向依存の基本情報 */}
      <div className="mb-8 flex flex-wrap gap-6 text-sm">
        <p>
          <span className="text-slate-500 dark:text-slate-400">難易度：</span>
          <span className="font-medium">{stars ?? "評価未定"}</span>
          {stars && (
            <span className="ml-1 text-xs text-slate-400 dark:text-slate-500">（編集者評価）</span>
          )}
        </p>
        <p>
          <span className="text-slate-500 dark:text-slate-400">移動：</span>
          <span className="font-medium">{transportStyleLabel(border.transport_style[from])}</span>
        </p>
      </div>

      {/* 6. hint_from */}
      {hintFrom && (
        <section className="mb-8">
          <h2 className="mb-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
            {originCp.name.ja}を経由して{countryNameJa(to)}に入る方法
          </h2>
          <p
            className="text-sm leading-relaxed text-slate-700 dark:text-slate-300"
            dangerouslySetInnerHTML={{ __html: renderHint(hintFrom) }}
          />
        </section>
      )}

      {/* 7. trivia */}
      {trivia && (
        <section className="mb-8 border-t border-slate-100 pt-4 dark:border-slate-800">
          <p
            className="text-sm leading-relaxed text-slate-500 dark:text-slate-400"
            dangerouslySetInnerHTML={{ __html: renderHint(trivia) }}
          />
        </section>
      )}

      {/* 8. 地図 */}
      <section>
        <BorderMap points={mapPoints} />
      </section>

      {/* 10. 更新情報を送るリンク */}
      <div className="mt-6 border-t border-slate-100 pt-4 dark:border-slate-800">
        <a
          href={updateRequestFormUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-emerald-700 underline dark:text-emerald-400"
        >
          この国境の情報が古い・間違っている場合はこちら
        </a>
      </div>
    </div>
  );
}
