import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "ページが見つかりません" };

// ルート直下のnot-found.tsxは、静的エクスポート時に out/404.html として書き出され、
// GitHub Pagesが未マッチのURLに対して常にこのファイルを返す（[locale]配下のHeader/Footerは
// 使えないため、最低限の見た目を自前で用意する）。
export default function NotFound() {
  return (
    <div className="flex min-h-full flex-col items-center justify-center gap-4 px-4 py-24 text-center">
      <p className="text-5xl">🧭</p>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
        ページが見つかりません
      </h1>
      <p className="max-w-md text-sm text-slate-500 dark:text-slate-400">
        お探しのページは移動または削除された可能性があります。URLをご確認いただくか、トップページからやり直してください。
      </p>
      <Link
        href="/ja"
        className="mt-2 inline-flex items-center gap-2 rounded-md bg-emerald-700 px-6 py-3 font-medium text-white hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-700"
      >
        トップページへ戻る
      </Link>
    </div>
  );
}
