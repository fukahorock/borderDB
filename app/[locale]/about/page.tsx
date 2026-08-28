import type { Metadata } from "next";
import { PageHero } from "@/app/components/PageHero";

export const metadata: Metadata = { title: "このサイトについて" };

export default function AboutPage() {
  return (
    <>
      <PageHero title="このサイトについて" />
      <div className="mx-auto w-full max-w-2xl px-4 py-12">
        <div className="flex flex-col gap-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          <p>
            国境データベースは、国境越えを趣味にしている人向けの、検索・閲覧できるデータベースサイトです。陸路（徒歩・車両・鉄道・橋）と、一般客が乗船できる旅客船での国境越えを対象にしています。
          </p>
          <p>
            対象は、外国籍者が正規の出入国審査を経て通行できる「インターナショナル・ボーダー」のみです。国境地域の住民など限定された対象者のみ通行可能なローカル国境は対象外としています。
          </p>
          <p>
            掲載している情報（難易度・所要時間・注意点など）は、運営が個人ブログや独立系トラベルメディアなどの情報を元にまとめた目安です。現地の状況は変動するため、渡航前に必ず外務省海外安全ホームページ・各国大使館等で最新情報をご確認ください。
          </p>
        </div>
      </div>
    </>
  );
}
