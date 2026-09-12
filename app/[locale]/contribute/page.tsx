import type { Metadata } from "next";
import { CONTRIBUTE_FORM_URL, UPDATE_REQUEST_FORM_URL } from "@/lib/links";
import { PageHero } from "@/app/components/PageHero";

export const metadata: Metadata = { title: "情報提供のお願い" };

export default function ContributePage() {
  return (
    <>
      <PageHero title="情報提供のお願い" />
      <div className="mx-auto w-full max-w-2xl px-4 py-12">
        <div className="flex flex-col gap-6 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-900/20">
            <p>
              国境データベースは、実際に国境を越えた方からの情報提供を元に、内容を充実させています。載っていない国境や、直したほうがいい情報があれば教えてください。
            </p>
            <p className="mt-3">
              いただいた回答は自動でサイトに反映されるわけではなく、運営が内容を確認したうえで掲載します。反映まで少し時間がかかる場合があります。いたずら投稿対策のため、連絡先の記入は必須です。
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-3 rounded-lg border border-slate-200 p-4 dark:border-slate-700">
              <div>
                <h2 className="font-semibold text-slate-900 dark:text-slate-100">新規の情報はこちら</h2>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  まだサイトに載っていない国境の情報をお持ちの方
                </p>
              </div>
              <a
                href={CONTRIBUTE_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto inline-flex w-fit items-center gap-2 rounded-md bg-emerald-700 px-5 py-2.5 font-medium text-white hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-700"
              >
                フォームを開く
                <span aria-hidden>↗</span>
              </a>
            </div>

            <div className="flex flex-col gap-3 rounded-lg border border-slate-200 p-4 dark:border-slate-700">
              <div>
                <h2 className="font-semibold text-slate-900 dark:text-slate-100">すでにある国境の情報提供</h2>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  掲載中の情報の間違い・古くなった情報（ステータス変化、体験談の追加など）
                </p>
              </div>
              <a
                href={UPDATE_REQUEST_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto inline-flex w-fit items-center gap-2 rounded-md bg-emerald-700 px-5 py-2.5 font-medium text-white hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-700"
              >
                フォームを開く
                <span aria-hidden>↗</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
