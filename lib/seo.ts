export const SITE_NAME = "国境データベース";
export const SITE_DESCRIPTION = "陸路と船で越える、世界の国境の歩き方";

/**
 * フェーズ1では全ページ共通の1枚（サイトのジャンボトロン背景画像）をOGP画像として使い回す
 * （UI仕様書6章）。openGraph/twitterはページごとに上書きすると丸ごと置き換わる（浅いマージ）ため、
 * 画像を出したいページでは必ずこれをスプレッドする。
 */
export const OGP_IMAGE = {
  url: "/hero/top.jpg",
  width: 2400,
  height: 1350,
  alt: SITE_NAME,
};
