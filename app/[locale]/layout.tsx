import { notFound } from "next/navigation";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { getFromToMap } from "@/lib/borders";

// フェーズ1は日本語のみ表示（全体仕様書4.4）。/en/ はフェーズ2で有効化する。
export const SUPPORTED_LOCALES = ["ja"] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export const dynamicParams = false;

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!SUPPORTED_LOCALES.includes(locale as SupportedLocale)) {
    notFound();
  }

  const fromToMap = await getFromToMap();
  const originCountries = Object.keys(fromToMap);

  return (
    <div className="flex min-h-full flex-col">
      <Header locale={locale} originCountries={originCountries} />
      <main className="flex flex-1 flex-col">{children}</main>
      <Footer />
    </div>
  );
}
