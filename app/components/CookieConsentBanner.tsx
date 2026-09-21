"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { loadGoogleAnalytics } from "@/lib/analytics";

const COOKIE_CONSENT_KEY = "cookie-consent";
type ConsentValue = "granted" | "denied";

export function CookieConsentBanner({ locale }: { locale: string }) {
  // サーバー側は常に非表示扱い（hydrationミスマッチ回避のため、マウント後にlocalStorageを確認する）
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let consent: string | null = null;
    try {
      consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    } catch (e) {
      // localStorageが使えない環境（プライベートモード等）ではバナーを出さずGAも読み込まない
      return;
    }

    if (consent === "granted") {
      loadGoogleAnalytics();
    } else if (consent !== "denied") {
      setVisible(true);
    }
  }, []);

  function saveConsent(value: ConsentValue) {
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, value);
    } catch (e) {
      // 保存に失敗してもバナーは閉じる（次回訪問時は再度表示されうる）
    }
    setVisible(false);
    if (value === "granted") {
      loadGoogleAnalytics();
    }
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t-2 border-emerald-600 bg-white px-4 py-4 shadow-[0_-6px_20px_rgba(0,0,0,0.15)] dark:border-emerald-500 dark:bg-slate-900 dark:shadow-[0_-6px_20px_rgba(0,0,0,0.5)]">
      <div className="mx-auto flex max-w-5xl flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-200">
          当サイトでは、アクセス解析のためにCookieを使用しています。詳しくは
          <Link
            href={`/${locale}/privacy`}
            className="font-medium text-emerald-700 underline-offset-2 hover:underline dark:text-emerald-400"
          >
            プライバシーポリシー
          </Link>
          をご確認ください。
        </p>
        <div className="flex w-full shrink-0 gap-2 sm:w-auto">
          <button
            type="button"
            onClick={() => saveConsent("denied")}
            className="flex-1 rounded-md border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 sm:flex-none dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            同意しない
          </button>
          <button
            type="button"
            onClick={() => saveConsent("granted")}
            className="flex-1 rounded-md bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-800 sm:flex-none dark:bg-emerald-600 dark:hover:bg-emerald-700"
          >
            同意する
          </button>
        </div>
      </div>
    </div>
  );
}
