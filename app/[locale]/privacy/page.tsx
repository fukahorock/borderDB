import type { Metadata } from "next";
import { PageHero } from "@/app/components/PageHero";
import { ObfuscatedEmail } from "@/app/components/ObfuscatedEmail";

export const metadata: Metadata = { title: "プライバシーポリシー" };

export default function PrivacyPage() {
  return (
    <>
      <PageHero title="プライバシーポリシー" />
      <div className="mx-auto w-full max-w-2xl px-4 py-12">
        <div className="flex flex-col gap-6 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          <div>
            <p className="text-xs text-slate-400 dark:text-slate-500">最終更新日：2026年9月21日</p>
            <p className="mt-3">
              本サイト「国境データベース」（以下「当サイト」、運営者：フカホリユウキ）は、利用者のプライバシーを尊重し、以下の方針で運営します。
            </p>
          </div>

          <section>
            <h2 className="mb-2 text-base font-semibold text-slate-900 dark:text-slate-100">
              アクセス解析について
            </h2>
            <ul className="list-disc space-y-1 pl-5">
              <li>当サイトでは、サイトの利用状況を把握するためにアクセス解析ツール（Google Analytics）を使用しています。</li>
              <li>初回アクセス時にCookieの使用に関する同意確認バナーを表示し、同意いただいた場合のみアクセス解析を行います。同意されない場合、Google Analyticsによるデータ収集は行われません。</li>
              <li>Google Analyticsはデータ収集のためにCookieを使用します。</li>
              <li>このデータは匿名で収集されており、個人を特定するものではありません。</li>
              <li>この機能はCookieを無効にすることで収集を拒否することが可能です。詳しくはお使いのブラウザの設定をご確認ください。</li>
              <li>Google Analyticsの利用規約・プライバシーポリシーについては、Googleのサイトをご確認ください。</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-slate-900 dark:text-slate-100">
              広告について
            </h2>
            <ul className="list-disc space-y-1 pl-5">
              <li>当サイトでは、将来的にGoogle AdSense等の第三者配信の広告サービスを利用する場合があります。</li>
              <li>広告配信事業者は、利用者の興味に応じた広告を表示するためにCookieを使用することがあります。</li>
              <li>Cookieを無効にする方法や、Googleが使用するCookieについては「広告設定」をご確認ください。</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-slate-900 dark:text-slate-100">
              免責事項
            </h2>
            <ul className="list-disc space-y-1 pl-5">
              <li>当サイトのコンテンツ・情報については、できる限り正確な情報を掲載するよう努めていますが、正確性や安全性を保証するものではありません。</li>
              <li>当サイトの情報を利用したことで生じた損害について、当サイトは一切の責任を負いません。渡航前に必ず外務省海外安全ホームページ・各国大使館等で最新情報をご確認ください。</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-slate-900 dark:text-slate-100">
              著作権について
            </h2>
            <ul className="list-disc space-y-1 pl-5">
              <li>当サイトで掲載している文章・画像等の著作権は、運営者または各権利者に帰属します。</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-slate-900 dark:text-slate-100">
              プライバシーポリシーの変更について
            </h2>
            <ul className="list-disc space-y-1 pl-5">
              <li>当サイトは、個人情報に関して適用される日本の法令を遵守するとともに、本ポリシーの内容を適宜見直し、改善していきます。</li>
              <li>本ポリシーは予告なく変更されることがあります。</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-slate-900 dark:text-slate-100">
              お問い合わせ
            </h2>
            <p>本ポリシーに関するお問い合わせは、下記の窓口までご連絡ください。</p>
            <p className="mt-2">
              運営者：フカホリユウキ
              <br />
              メールアドレス：<ObfuscatedEmail />
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
