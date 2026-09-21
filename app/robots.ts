import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

// 静的エクスポート（output: 'export'）では明示的にforce-staticを指定する必要がある。
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
