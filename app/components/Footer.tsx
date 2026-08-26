import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto px-4 py-8 text-sm text-slate-500">
      <div className="mx-auto flex max-w-5xl flex-col gap-2">
        <p className="font-medium text-slate-700">国境データベース</p>
        <nav className="flex flex-wrap gap-4">
          <Link href="#">このサイトについて</Link>
          <Link href="#">プライバシーポリシー</Link>
          <Link href="#">情報募集中</Link>
        </nav>
        <p className="mt-4 text-xs text-slate-400">
          本サイトの情報は目安です。渡航前に必ず外務省海外安全ホームページ・各国大使館等で最新情報をご確認ください。
        </p>
      </div>
    </footer>
  );
}
