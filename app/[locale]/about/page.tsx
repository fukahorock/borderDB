import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/app/components/PageHero";
import { AMAZON_WISHLIST_URL } from "@/lib/links";

export const metadata: Metadata = { title: "このサイトについて" };

export default async function AboutPage({ params }: PageProps<"/[locale]/about">) {
  const { locale } = await params;

  return (
    <>
      <PageHero title="このサイトについて" />
      <div className="mx-auto w-full max-w-2xl px-4 py-12">
        <div className="flex flex-col gap-8 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          <section>
            <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-slate-100">
              このサイトについて
            </h2>
            <div className="flex flex-col gap-4">
              <p>
                国境データベースは、陸路や船で国をまたいで移動したい人のための、検索・閲覧できるデータベースサイトです。徒歩・車両・鉄道での陸路越境や、橋を渡っての移動、一般客が乗船できる旅客船での国境越えを対象にしています（飛行機での移動は対象外です）。
              </p>
              <p>
                対象は、外国籍者が正規の出入国審査を経て通行できる「インターナショナル・ボーダー」のみです。国境地域の住民など限定された対象者のみ通行可能なローカル国境は対象外としています。
              </p>
              <p>
                掲載している情報（難易度・注意点など）は、運営が個人的に集めたデータと、実際に国境を越えた方々からいただいた投稿をもとにまとめたものです。内容の正確性を保証するものではありませんので、渡航の際は必ずご自身で最新の情報を確認し、自己責任でご判断ください。
              </p>
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-slate-100">
              運営者について
            </h2>
            <div className="flex flex-col gap-4">
              <p className="font-medium text-slate-900 dark:text-slate-100">フカホリユウキ</p>
              <p>本業はマンガ原作者、趣味は競馬と国境越え。</p>
              <p>好きな国はベトナム。苦手なのは韓国（スタンプがシール式なのだけがちょっと寂しい）。</p>
              <p>このサイト、実はフカホリがひとりで作って、ひとりで運営しています。</p>
              <div className="flex flex-col gap-2">
                <p>知っている国境情報があれば教えてください。</p>
                <Link
                  href={`/${locale}/contribute`}
                  className="mt-1 inline-flex w-fit items-center gap-2 rounded-md bg-emerald-700 px-5 py-2.5 font-medium text-white hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-700"
                >
                  国境情報を教える
                  <span aria-hidden>→</span>
                </Link>
              </div>
              <div className="flex flex-col gap-2">
                <p>「応援したい！」という方は、こちらから何か贈ってもらえると喜びます。</p>
                <a
                  href={AMAZON_WISHLIST_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex w-fit items-center gap-2 rounded-md bg-emerald-700 px-5 py-2.5 font-medium text-white hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-700"
                >
                  ほしい物リストを見る
                  <span aria-hidden>↗</span>
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
