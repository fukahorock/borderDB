/**
 * 国コード -> 地域名（ナビバーの「国から探す」ツリー用）。
 * 現状データがある国のみ登録。地域が増えたら随時追記する。
 */
const REGION_JA: Record<string, string> = {
  KH: "アジア",
  VN: "アジア",
  TH: "アジア",
  MM: "アジア",
  LA: "アジア",
  CN: "アジア",
  ID: "アジア",
  MY: "アジア",
  SG: "アジア",
  BN: "アジア",
  TL: "アジア",
  KR: "アジア",
  JP: "アジア",
};

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
    .sort((a, b) => a.region.localeCompare(b.region, "ja"));
}
