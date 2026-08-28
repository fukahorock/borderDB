import type { Metadata } from "next";
import { PageHero } from "@/app/components/PageHero";

export const metadata: Metadata = { title: "プライバシーポリシー" };

export default function PrivacyPage() {
  return (
    <>
      <PageHero title="プライバシーポリシー" />
      <div className="mx-auto w-full max-w-2xl px-4 py-12">
        <div className="flex flex-col gap-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          <p>
            本ページは、アクセス解析（Google Analytics等）や広告配信（Google AdSense等）を導入するタイミングで、利用ツール・Cookieの使用有無・問い合わせ先などを記載する予定のページです。現時点ではまだ導入していません。
          </p>
        </div>
      </div>
    </>
  );
}
