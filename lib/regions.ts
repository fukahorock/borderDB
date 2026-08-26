/**
 * 国コード -> 地域名（ナビバーの「国から探す」ツリー用）。
 * 現状データがある国のみ登録。地域が増えたら随時追記する。
 */
const REGION_JA: Record<string, string> = {
  // 東アジア
  CN: "東アジア",
  KR: "東アジア",
  JP: "東アジア",
  // 東南アジア
  KH: "東南アジア",
  VN: "東南アジア",
  TH: "東南アジア",
  MM: "東南アジア",
  LA: "東南アジア",
  ID: "東南アジア",
  MY: "東南アジア",
  SG: "東南アジア",
  BN: "東南アジア",
  TL: "東南アジア",
};

/** 表示順（この配列にない地域名は末尾にアルファベット順で並ぶ）。 */
const REGION_ORDER = ["東アジア", "東南アジア", "南アジア", "中央アジア"];

export function regionJa(code: string): string {
  return REGION_JA[code] ?? "その他";
}

/** 出発国コードの一覧を地域ごとにグルーピングする（ナビバーのツリー表示用）。 */
export function groupByRegion(codes: string[]): { region: string; codes: string[] }[] {
  const map = new Map<string, string[]>();
  for (const code of codes) {
    const region = regionJa(code);
    (map.get(region) ?? map.set(region, []).get(region)!).push(code);
  }
  return Array.from(map.entries())
    .map(([region, list]) => ({ region, codes: list.sort() }))
    .sort((a, b) => {
      const ai = REGION_ORDER.indexOf(a.region);
      const bi = REGION_ORDER.indexOf(b.region);
      if (ai === -1 && bi === -1) return a.region.localeCompare(b.region, "ja");
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });
}
