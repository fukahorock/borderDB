"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export interface RandomEntry {
  href: string;
  origin: string;
  dest: string;
  originCountry: string;
  destCountry: string;
}

const CARD_COUNT = 3;

function pickRandom<T>(list: T[], count: number): T[] {
  const shuffled = [...list].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function RandomBorders({ entries }: { entries: RandomEntry[] }) {
  const router = useRouter();
  const [picks, setPicks] = useState<RandomEntry[] | null>(null);

  useEffect(() => {
    setPicks(pickRandom(entries, CARD_COUNT));
  }, [entries]);

  function jumpToRandom() {
    if (entries.length === 0) return;
    const entry = entries[Math.floor(Math.random() * entries.length)];
    router.push(entry.href);
  }

  return (
    <>
      {/* PC: ランダムな国境を3件カード表示 */}
      <div className="hidden gap-3 sm:grid sm:grid-cols-3">
        {(picks ?? Array.from({ length: CARD_COUNT })).map((entry, i) =>
          entry ? (
            <Link
              key={entry.href}
              href={entry.href}
              className="rounded-lg border border-slate-200 p-3 text-sm transition hover:border-emerald-600 hover:shadow-sm dark:border-slate-700 dark:hover:border-emerald-500"
            >
              <p className="font-medium text-slate-900 dark:text-slate-100">
                {entry.origin} ⇔ {entry.dest}
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {entry.originCountry} - {entry.destCountry}
              </p>
            </Link>
          ) : (
            <div
              key={i}
              className="h-[74px] animate-pulse rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800"
            />
          ),
        )}
      </div>

      {/* モバイル: ランダムな1件へ飛ぶボタン */}
      <button
        type="button"
        onClick={jumpToRandom}
        className="flex w-full items-center justify-center gap-2 rounded-md border border-slate-300 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 sm:hidden dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
      >
        <span aria-hidden>🎲</span>
        ランダムな国境に飛ぶ
      </button>
    </>
  );
}
