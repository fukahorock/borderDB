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
  open: "border-emerald-500 text-emerald-700 dark:border-emerald-400 dark:text-emerald-400",
  closed: "border-red-500 text-red-700 dark:border-red-400 dark:text-red-400",
  needs_verification: "border-amber-500 text-amber-700 dark:border-amber-400 dark:text-amber-400",
};

/** ステータスバッジの色分け（open=緑／closed=赤／needs_verification=黄）。背景は塗らず枠線・文字色のみで表現する（ダークモードでの視認性優先）。 */
export function statusBadgeClasses(status: string): string {
  return (
    STATUS_BADGE_CLASSES[status] ??
    "border-slate-300 text-slate-700 dark:border-slate-600 dark:text-slate-300"
  );
}

const FRESHNESS_BADGE_CLASSES: Record<Freshness, string> = {
  recent: "border-emerald-400 text-emerald-700 dark:border-emerald-500 dark:text-emerald-400",
  normal: "border-slate-300 text-slate-600 dark:border-slate-600 dark:text-slate-300",
  stale: "border-amber-500 text-amber-700 dark:border-amber-400 dark:text-amber-300",
  unknown: "border-slate-200 text-slate-500 dark:border-slate-700 dark:text-slate-400",
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
