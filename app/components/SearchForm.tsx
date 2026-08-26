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
    ? "rounded-lg border border-slate-300 bg-white px-4 py-3 text-base text-slate-900"
    : "rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900";
  const labelClass = isLg
    ? "flex flex-1 flex-col gap-1.5 text-left text-sm font-medium text-slate-600"
    : "flex flex-1 flex-col gap-1 text-sm text-slate-600";
  const buttonClass = isLg
    ? "rounded-lg bg-emerald-700 px-8 py-3 text-base font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
    : "rounded-md bg-emerald-700 px-6 py-2 font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-300";

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

      <label className={labelClass}>
        到着国
        <select
          value={to}
          onChange={(e) => setTo(e.target.value)}
          disabled={!from}
          className={`${selectClass} disabled:bg-slate-100 disabled:text-slate-400`}
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
