/**
 * Google Analytics（gtag.js）の動的読み込み・初期化。
 * Cookie同意バナーで同意が得られた場合のみ呼び出す（「同意する」ボタン、または次回訪問時に
 * localStorageの同意状態がgrantedだった場合の自動読み込み）。
 * 測定IDは環境変数で管理し、未設定の場合はGA自体を読み込まない。
 */

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

let gaLoaded = false;

export function loadGoogleAnalytics(): void {
  if (typeof window === "undefined") return;
  if (!GA_MEASUREMENT_ID) return; // 未設定なら読み込まない安全策
  if (gaLoaded) return;
  gaLoaded = true;

  const script = document.createElement("script");
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  script.async = true;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer!.push(args);
  };
  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID);
}
