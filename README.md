# borderDB

国境越えを趣味にしている人向けの、検索・閲覧できるデータベースサイト。陸路・船で越えられる国境の情報をまとめています。

仕様は [`docs/`](../docs) を参照してください（全体仕様書・UI仕様書・データ管理ツール仕様書）。

## 公開URL

https://fukahorock.github.io/borderDB/

`main`ブランチにpushすると、GitHub Actionsが自動でビルド・デプロイする（`.github/workflows/deploy.yml`）。

## 開発（ローカル確認用）

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) はローカルでの動作確認用。ここでの表示が公開サイトに反映されるわけではなく、pushして初めてGitHub Actions側で改めてビルドされ公開される。

## データ

- `data/borders/` … 国境レコード（1件＝1ファイル）
- `data/checkpoints/` … チェックポイントマスタ（検問所・港の実データ。国境レコード間で使い回される）

データ構造の詳細は全体仕様書2章・2.10を参照。

## ビルド

```bash
npm run build
```

静的サイトとして `out/` に出力されます（`output: 'export'`）。
