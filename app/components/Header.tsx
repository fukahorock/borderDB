"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { countryLabel } from "@/lib/countries";
import { groupByRegion } from "@/lib/regions";

interface HeaderProps {
  locale: string;
  /** 出発国一覧（ナビバーの「国から探す」ツリー用）。 */
  originCountries: string[];
}

export function Header({ locale, originCountries }: HeaderProps) {
  const pathname = usePathname();
  const isTop = pathname === `/${locale}`;
  const [open, setOpen] = useState(false);
  const [treeOpen, setTreeOpen] = useState(false);

  const regions = groupByRegion(originCountries);

  return (
    <header
      className={
        isTop
          ? "absolute inset-x-0 top-0 z-20 flex items-center gap-4 px-4 py-4"
          : "relative z-20 flex items-center gap-4 border-b border-slate-200 bg-white px-4 py-3"
      }
    >
      <button
        type="button"
        aria-label="メニュー"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`text-2xl leading-none ${isTop ? "text-white" : "text-slate-700"}`}
      >
        ☰
      </button>
      {!isTop && (
        <Link href={`/${locale}`} className="font-semibold text-slate-900">
          国境データベース
        </Link>
      )}

      {open && (
        <>
          {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */}
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <nav className="absolute left-4 top-full z-20 mt-2 w-72 rounded-lg border border-slate-200 bg-white p-2 text-slate-700 shadow-lg">
            <Link
              href={`/${locale}`}
              className="block rounded-md px-3 py-2 text-sm hover:bg-slate-50"
              onClick={() => setOpen(false)}
            >
              トップ
            </Link>
            <Link
              href={`/${locale}/about`}
              className="block rounded-md px-3 py-2 text-sm hover:bg-slate-50"
              onClick={() => setOpen(false)}
            >
              このサイトについて
            </Link>
            <Link
              href={`/${locale}/privacy`}
              className="block rounded-md px-3 py-2 text-sm hover:bg-slate-50"
              onClick={() => setOpen(false)}
            >
              プライバシーポリシー
            </Link>
            <a
              href="#"
              className="block rounded-md px-3 py-2 text-sm hover:bg-slate-50"
              onClick={() => setOpen(false)}
            >
              情報募集中
            </a>

            <div className="my-2 border-t border-slate-100" />

            <button
              type="button"
              onClick={() => setTreeOpen((v) => !v)}
              className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm font-medium hover:bg-slate-50"
            >
              国から探す
              <span aria-hidden>{treeOpen ? "▾" : "▸"}</span>
            </button>
            {treeOpen && (
              <div className="max-h-64 overflow-y-auto px-1 pb-1">
                {regions.map((r) => (
                  <details key={r.region} open className="px-2 py-1">
                    <summary className="cursor-pointer text-xs font-medium text-slate-400">
                      {r.region}
                    </summary>
                    <div className="mt-1 flex flex-col">
                      {r.codes.map((code) => (
                        <Link
                          key={code}
                          href={`/${locale}/${code.toLowerCase()}`}
                          className="rounded-md px-2 py-1.5 text-sm hover:bg-slate-50"
                          onClick={() => setOpen(false)}
                        >
                          {countryLabel(code)}
                        </Link>
                      ))}
                    </div>
                  </details>
                ))}
              </div>
            )}
          </nav>
        </>
      )}
    </header>
  );
}
