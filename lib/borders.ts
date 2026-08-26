import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import { getCheckpointMap, type CheckpointData } from "@/lib/checkpoints";

const DATA_DIR = path.join(process.cwd(), "data", "borders");

export type TransportStyle =
  | "through"
  | "transfer"
  | "no_public_transport"
  | "other";

export type BorderStatus = "open" | "closed" | "needs_verification";

export interface BorderI18nBlock {
  hint_from: Record<string, string>;
  trivia: string;
  status_note: string;
}

/** 国境レコード（全体仕様書2.4）。checkpoints は国コード -> チェックポイントslugの参照のみを持つ。 */
export interface BorderData {
  id: string;
  countries: [string, string];
  checkpoints: Record<string, string>;
  /** 未確認の場合は null。 */
  transport_style: Record<string, TransportStyle | null>;
  status: BorderStatus;
  /** 未確認の場合は空文字。 */
  status_updated: string;
  /** 未評価の場合は null。 */
  difficulty: Record<string, number | null>;
  difficulty_source: string;
  i18n: Record<string, BorderI18nBlock>;
}

/** ビルド時に国境レコード＋チェックポイントマスタを結合したもの（全体仕様書2.10）。 */
export interface JoinedBorder extends Omit<BorderData, "checkpoints"> {
  checkpoints: Record<string, CheckpointData>;
}

export const getAllBorders = cache(async (): Promise<BorderData[]> => {
  const files = await readdir(DATA_DIR);
  const jsonFiles = files.filter((file) => file.endsWith(".json"));

  return Promise.all(
    jsonFiles.map(async (file) => {
      const raw = await readFile(path.join(DATA_DIR, file), "utf-8");
      return JSON.parse(raw) as BorderData;
    }),
  );
});

export const getJoinedBorders = cache(async (): Promise<JoinedBorder[]> => {
  const [borders, checkpointMap] = await Promise.all([
    getAllBorders(),
    getCheckpointMap(),
  ]);

  return borders.map((border) => {
    const checkpoints: Record<string, CheckpointData> = {};
    for (const [country, slug] of Object.entries(border.checkpoints)) {
      const cp = checkpointMap.get(`${country}-${slug}`);
      if (!cp) {
        throw new Error(
          `チェックポイントマスタが見つかりません: ${country}-${slug}（国境レコード ${border.id}）`,
        );
      }
      checkpoints[country] = cp;
    }
    return { ...border, checkpoints };
  });
});

export function sortByRecentlyUpdated<T extends { status_updated: string }>(
  borders: T[],
): T[] {
  return [...borders].sort((a, b) =>
    (b.status_updated ?? "").localeCompare(a.status_updated ?? ""),
  );
}

/**
 * 出発国コード -> 到着国コード一覧。UI仕様書1.5の通り、データ構造には持たせず
 * ビルド時に全JSONの countries を走査して動的に生成する。
 */
export const getFromToMap = cache(async (): Promise<Record<string, string[]>> => {
  const borders = await getAllBorders();
  const map: Record<string, Set<string>> = {};

  for (const border of borders) {
    const [a, b] = border.countries;
    (map[a] ??= new Set()).add(b);
    (map[b] ??= new Set()).add(a);
  }

  return Object.fromEntries(
    Object.entries(map).map(([code, set]) => [code, Array.from(set).sort()]),
  );
});

export interface Direction {
  from: string;
  to: string;
  border: JoinedBorder;
}

/** 1件の国境レコードから、方向の数だけ（2方向）Directionを生成する（全体仕様書3.2）。 */
export const getAllDirections = cache(async (): Promise<Direction[]> => {
  const borders = await getJoinedBorders();
  const directions: Direction[] = [];
  for (const border of borders) {
    const [a, b] = border.countries;
    directions.push({ from: a, to: b, border });
    directions.push({ from: b, to: a, border });
  }
  return directions;
});
