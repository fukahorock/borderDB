import type { TransportStyle } from "@/lib/borders";
import type { CheckpointData } from "@/lib/checkpoints";

/** カード等での表示用：「バベット（Bavet）」のように日本語名＋英語名を併記する。 */
export function checkpointDisplayName(cp: Pick<CheckpointData, "name">): string {
  return cp.name.en ? `${cp.name.ja}（${cp.name.en}）` : cp.name.ja;
}

/** ★評価表示（UI仕様書2.3）。1〜5の数値を★/☆のUnicode文字列に変換する。未評価は null。 */
export function difficultyStars(level: number | null): string | null {
  if (level === null) return null;
  const filled = Math.min(5, Math.max(0, Math.round(level)));
  return "★".repeat(filled) + "☆".repeat(5 - filled);
}

export type Freshness = "recent" | "normal" | "stale" | "unknown";

/** 情報の鮮度バッジ（UI仕様書2.4）。1年超で警告、3ヶ月以内は安心表示。 */
export function freshness(
  statusUpdated: string | undefined,
  now: Date = new Date(),
): { level: Freshness; label: string } {
  if (!statusUpdated) {
    return { level: "unknown", label: "確認日不明" };
  }

  const updated = new Date(statusUpdated);
  const months =
    (now.getFullYear() - updated.getFullYear()) * 12 +
    (now.getMonth() - updated.getMonth());

  if (months > 12) {
    return { level: "stale", label: `最終確認から${months}ヶ月` };
  }
  if (months <= 3) {
    return { level: "recent", label: "最近確認済み" };
  }
  return { level: "normal", label: `最終確認から${months}ヶ月` };
}

const STATUS_LABEL_JA: Record<string, string> = {
  open: "通行可",
  closed: "閉鎖中",
  needs_verification: "要確認",
};

export function statusLabelJa(status: string): string {
  return STATUS_LABEL_JA[status] ?? status;
}

const STATUS_BADGE_CLASSES: Record<string, string> = {
  open: "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-700",
  closed:
    "bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700",
  needs_verification:
    "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700",
};

/** ステータスバッジの色分け（open=緑／closed=赤／needs_verification=黄）。一目で通行可否がわかるようにする。 */
export function statusBadgeClasses(status: string): string {
  return (
    STATUS_BADGE_CLASSES[status] ??
    "bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600"
  );
}

const FRESHNESS_BADGE_CLASSES: Record<Freshness, string> = {
  recent:
    "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800",
  normal:
    "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
  stale:
    "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700",
  unknown:
    "bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
};

/** 鮮度バッジの色分け。staleは警告として強調する。 */
export function freshnessBadgeClasses(level: Freshness): string {
  return FRESHNESS_BADGE_CLASSES[level];
}

export function visaLabel(visaOnArrival: boolean | null): string {
  if (visaOnArrival === null) return "要確認";
  return visaOnArrival ? "取得可能" : "事前取得が必要";
}

const TRANSPORT_STYLE_LABEL_JA: Record<TransportStyle, string> = {
  through: "通しで移動可",
  transfer: "国境で乗り換え",
  no_public_transport: "公共交通なし",
  other: "その他（詳細は下記参照）",
};

export function transportStyleLabel(style: TransportStyle | null): string {
  if (style === null) return "要確認";
  return TRANSPORT_STYLE_LABEL_JA[style];
}

/**
 * hint_from / trivia / status_note の軽量記法パーサー（全体仕様書2.7）。
 * 表示前に必ずHTMLエスケープしてから変換し、XSSを防ぐ。
 */
export function renderHint(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/^# (.+)$/gm, '<strong class="hint-heading">$1</strong>')
    .replace(/\*\*(.+?)\*\*/g, "<b>$1</b>")
    .replace(/~~(.+?)~~/g, "<s>$1</s>")
    .replace(/\*(.+?)\*/g, "<i>$1</i>")
    .replace(/_(.+?)_/g, "<i>$1</i>")
    .replace(
      /\[(.+?)\]\((https?:\/\/.+?)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer nofollow">$1</a>',
    )
    .replace(/\n/g, "<br>");
}
