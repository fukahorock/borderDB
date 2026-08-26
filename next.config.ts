import type { NextConfig } from "next";

// GitHub Pagesのプロジェクトページ（fukahorock.github.io/borderDB/）はサブパス配下になるため、
// CI（GitHub Actions）でのビルド時のみ basePath を付与する。ローカル開発時はルート直下のまま。
// 将来サブドメイン等に移行する場合は、このbasePathを空にするだけでよい（全体仕様書6.1）。
const isGithubActions = process.env.GITHUB_ACTIONS === "true";
const basePath = isGithubActions ? "/borderDB" : "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  // CSSのbackground-image等、Next.jsが自動でbasePathを付与しない箇所で使う
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
