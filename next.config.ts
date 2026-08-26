import type { NextConfig } from "next";

// border.rock54.net の独自ドメインでルート直下配信するため、basePathは不要
// （GitHub Pagesのデフォルトドメイン/borderDB/ 配下だった時期の名残の設定は撤去）。
const nextConfig: NextConfig = {
  output: "export",
};

export default nextConfig;
