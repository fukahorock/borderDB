import type { Metadata } from "next";
import { CONTRIBUTE_FORM_URL } from "@/lib/links";
import { PageHero } from "@/app/components/PageHero";

export const metadata: Metadata = { title: "情報提供のお願い" };

export default function ContributePage() {
  return (
    <>
      <PageHero title="情報提供のお願い" />
      <div className="mx-auto w-full max-w-2xl px-4 py-12">
        <div className="flex flex-col gap-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-900/20">
            <p>
              国境データベースは、実際に国境を越えた方からの情報提供を元に、内容を充実させています。まだ載っていない国境の情報や、掲載中の情報の間違い・古くなった情報など、気づいたことがあれば教えてください。
            </p>
            <p className="mt-3">下記のような情報を歓迎しています。</p>
            <ul className="mt-1 list-disc pl-5">
              <li>まだサイトに載っていない国境の情報</li>
              <li>難易度・交通手段・営業時間・注意点など、実際に通った際の体験談</li>
              <li>「閉鎖された」「再開した」などステータスの変化</li>
              <li>検問所名の表記や、位置情報（Googleマップのピン）の間違いの指摘</li>
            </ul>
            <p className="mt-3">
              いただいた回答は自動でサイトに反映されるわけではなく、運営が内容を確認したうえで掲載します。反映まで少し時間がかかる場合があります。
            </p>
            <p className="mt-3">いたずら投稿対策のため、連絡先の記入は必須です。</p>
          </div>

          <a
            href={CONTRIBUTE_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex w-fit items-center gap-2 rounded-md bg-emerald-700 px-6 py-3 font-medium text-white hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-700"
          >
            フォームを開く
            <span aria-hidden>↗</span>
          </a>
        </div>
      </div>
    </>
  );
}
