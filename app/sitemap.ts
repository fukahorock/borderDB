import type { MetadataRoute } from "next";
import { getAllDirections, getFromToMap } from "@/lib/borders";
import { SITE_URL } from "@/lib/seo";

// 静的エクスポート（output: 'export'）では明示的にforce-staticを指定する必要がある。
export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [directions, fromToMap] = await Promise.all([getAllDirections(), getFromToMap()]);

  const entries: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/ja`, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/ja/about`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE_URL}/ja/privacy`, changeFrequency: "monthly", priority: 0.2 },
    { url: `${SITE_URL}/ja/contribute`, changeFrequency: "monthly", priority: 0.3 },
  ];

  for (const country of Object.keys(fromToMap)) {
    entries.push({
      url: `${SITE_URL}/ja/${country.toLowerCase()}`,
      changeFrequency: "weekly",
      priority: 0.6,
    });
  }

  const seenPairs = new Set<string>();
  for (const d of directions) {
    const pairKey = `${d.from}-${d.to}`;
    if (!seenPairs.has(pairKey)) {
      seenPairs.add(pairKey);
      entries.push({
        url: `${SITE_URL}/ja/${d.from.toLowerCase()}-to-${d.to.toLowerCase()}`,
        changeFrequency: "weekly",
        priority: 0.6,
      });
    }

    const origin = d.border.checkpoints[d.from];
    const dest = d.border.checkpoints[d.to];
    entries.push({
      url: `${SITE_URL}/ja/${d.from.toLowerCase()}-to-${d.to.toLowerCase()}/${origin.slug}-${dest.slug}`,
      lastModified: d.border.status_updated || undefined,
      changeFrequency: "weekly",
      priority: 0.7,
    });
  }

  return entries;
}
