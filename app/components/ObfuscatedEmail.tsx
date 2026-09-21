"use client";

import { useEffect, useState } from "react";

/**
 * 文字コード配列でメールアドレスを保持し、静的HTMLには生のアドレス文字列を残さない
 * （単純なスクレイピング・ハーベスト対策）。マウント後（クライアント側）に組み立てて表示する。
 */
const EMAIL_CODES = [
  102, 117, 107, 97, 104, 111, 114, 111, 99, 107, 64, 103, 109, 97, 105, 108, 46, 99, 111, 109,
];

export function ObfuscatedEmail() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    setEmail(String.fromCharCode(...EMAIL_CODES));
  }, []);

  if (!email) {
    return <span aria-hidden>読み込み中…</span>;
  }

  return (
    <a
      href={`mailto:${email}`}
      className="text-emerald-700 underline-offset-2 hover:underline dark:text-emerald-400"
    >
      {email}
    </a>
  );
}
