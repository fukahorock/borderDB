import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";

const DATA_DIR = path.join(process.cwd(), "data", "checkpoints");

export interface CheckpointName {
  local: string[];
  ja: string;
  en: string;
}

export interface CheckpointData {
  slug: string;
  country: string;
  /** 座標未確定の場合は null（全体仕様書2.9、データ収集中は珍しくない）。 */
  coords: [number, number] | null;
  source_map_url: string;
  /** 未確認の場合は null。 */
  visa_on_arrival: boolean | null;
  name: CheckpointName;
}

export const getAllCheckpoints = cache(async (): Promise<CheckpointData[]> => {
  const files = await readdir(DATA_DIR);
  const jsonFiles = files.filter((file) => file.endsWith(".json"));

  return Promise.all(
    jsonFiles.map(async (file) => {
      const raw = await readFile(path.join(DATA_DIR, file), "utf-8");
      return JSON.parse(raw) as CheckpointData;
    }),
  );
});

/** キーは `${国コード}-${slug}`（全体仕様書2.10のファイル命名と一致）。 */
export const getCheckpointMap = cache(async (): Promise<Map<string, CheckpointData>> => {
  const checkpoints = await getAllCheckpoints();
  return new Map(checkpoints.map((cp) => [`${cp.country}-${cp.slug}`, cp]));
});
