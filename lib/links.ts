/** 新規追加用の情報提供Googleフォーム（全体仕様書5.1参照）。実際のフォームはここでのみ管理する。 */
export const CONTRIBUTE_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSe7P716v4rqhFAg0_3uTNi98ShZ6ZGlmNLNlatY_nUM6ayngw/viewform?usp=dialog";

/** 更新用（差し替え要望）Googleフォーム（全体仕様書5.1参照）。「更新してほしいページのURL」の質問にprefillする。 */
const UPDATE_REQUEST_FORM_BASE_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSdDuOSOKrM5alzoma5FN-9iVsE2F4PV0TJt7DwAtW3MB6k_HA/viewform";
const UPDATE_REQUEST_FORM_URL_ENTRY_ID = "183317908";

/** 閲覧中の詳細ページURLをprefillした更新用フォームのURLを組み立てる（UI仕様書2.2「更新情報を送るリンクの仕様」参照）。 */
export function buildUpdateRequestFormUrl(pageUrl: string): string {
  const params = new URLSearchParams({
    usp: "pp_url",
    [`entry.${UPDATE_REQUEST_FORM_URL_ENTRY_ID}`]: pageUrl,
  });
  return `${UPDATE_REQUEST_FORM_BASE_URL}?${params.toString()}`;
}
