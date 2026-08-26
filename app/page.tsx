import { redirect } from "next/navigation";

// ルート `/` アクセス時は言語プレフィックス付きURLへ誘導する（全体仕様書3.2）。
// フェーズ1は日本語のみのため常に /ja/ へ。ブラウザ言語判定はフェーズ2で検討。
export default function RootPage() {
  redirect("/ja");
}
