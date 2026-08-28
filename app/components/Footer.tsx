import Link from "next/link";

export function Footer({ locale }: { locale: string }) {
  return (
    <footer className="mt-auto border-t border-slate-100 px-4 py-8 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
      <div className="mx-auto flex max-w-5xl flex-col gap-2">
        <p className="font-medium text-slate-700 dark:text-slate-200">国境データベース</p>
        <nav className="flex flex-wrap gap-4">
          <Link href={`/${locale}/about`}>このサイトについて</Link>
          <Link href={`/${locale}/privacy`}>プライバシーポリシー</Link>
          <Link href={`/${locale}/contribute`}>情報募集中</Link>
        </nav>
        <p className="mt-4 text-xs text-slate-400 dark:text-slate-500">
          本サイトの情報は目安です。渡航前に必ず外務省海外安全ホームページ・各国大使館等で最新情報をご確認ください。
        </p>
        <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
          &copy; {new Date().getFullYear()} Yu-ki Fukahori
        </p>
      </div>
    </footer>
  );
}
