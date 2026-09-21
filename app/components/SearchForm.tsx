"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { countryLabel } from "@/lib/countries";

interface SearchFormProps {
  fromToMap: Record<string, string[]>;
  locale: string;
  initialFrom?: string;
  initialTo?: string;
  submitLabel?: string;
  size?: "md" | "lg";
}

export function SearchForm({
  fromToMap,
  locale,
  initialFrom = "",
  initialTo = "",
  submitLabel = "検索",
  size = "md",
}: SearchFormProps) {
  const router = useRouter();
  const fromOptions = useMemo(() => Object.keys(fromToMap).sort(), [fromToMap]);

  const [from, setFrom] = useState(initialFrom);
  const [to, setTo] = useState(initialTo);

  const toOptions = from ? (fromToMap[from] ?? []) : [];

  function handleFromChange(value: string) {
    setFrom(value);
    setTo("");
  }

  function handleSwap() {
    setFrom(to);
    setTo(from);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!from) return;
    // 到着国が未選択の場合は、出発国から出発できる国境一覧（国単位の一覧ページ）へ
    const path = to
      ? `/${locale}/${from.toLowerCase()}-to-${to.toLowerCase()}`
      : `/${locale}/${from.toLowerCase()}`;
    router.push(path);
  }

  const isLg = size === "lg";
  const selectClass = isLg
    ? "rounded-lg border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
    : "rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100";
  const labelClass = isLg
    ? "flex flex-1 flex-col gap-1.5 text-left text-sm font-medium text-slate-600 dark:text-slate-300"
    : "flex flex-1 flex-col gap-1 text-sm text-slate-600 dark:text-slate-300";
  const buttonClass = isLg
    ? "rounded-lg bg-emerald-700 px-8 py-3 text-base font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300 dark:bg-emerald-600 dark:disabled:bg-slate-700"
    : "rounded-md bg-emerald-700 px-6 py-2 font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-300 dark:bg-emerald-600 dark:disabled:bg-slate-700";

  return (
    <form
      onSubmit={handleSubmit}
      className={`mx-auto flex w-full flex-col gap-3 sm:flex-row sm:items-end ${
        isLg ? "max-w-2xl" : "max-w-2xl px-4"
      }`}
    >
      <label className={labelClass}>
        出発国
        <select
          value={from}
          onChange={(e) => handleFromChange(e.target.value)}
          className={selectClass}
        >
          <option value="">選択してください</option>
          {fromOptions.map((code) => (
            <option key={code} value={code}>
              {countryLabel(code)}
            </option>
          ))}
        </select>
      </label>

      <button
        type="button"
        onClick={handleSwap}
        disabled={!from || !to}
        aria-label="出発国と到着国を入れ替え"
        title="出発国と到着国を入れ替え"
        className={`flex shrink-0 items-center justify-center self-center rounded-full border border-slate-300 text-slate-500 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-600 dark:text-slate-400 dark:hover:bg-slate-800 ${
          isLg ? "h-11 w-11 text-lg" : "h-9 w-9"
        }`}
      >
        <span aria-hidden className="inline-block rotate-90 sm:rotate-0">
          ⇄
        </span>
      </button>

      <label className={labelClass}>
        到着国
        <select
          value={to}
          onChange={(e) => setTo(e.target.value)}
          disabled={!from}
          className={`${selectClass} disabled:bg-slate-100 disabled:text-slate-400 dark:disabled:bg-slate-900 dark:disabled:text-slate-500`}
        >
          <option value="">選択してください</option>
          {toOptions.map((code) => (
            <option key={code} value={code}>
              {countryLabel(code)}
            </option>
          ))}
        </select>
      </label>

      <button type="submit" disabled={!from} className={buttonClass}>
        {submitLabel}
      </button>
    </form>
  );
}
