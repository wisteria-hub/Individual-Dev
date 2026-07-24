# CLAUDE.md — Qualyx

このファイルは Claude Code（および別PC・別セッションのClaude）が本プロジェクトを引き継ぐための要約です。作業前に必ず目を通してください。

---

## ⚠️ 最重要: 開発場所とリポジトリの二重管理

**このマシンでは日本語を含むパスの配下で Node.js (v22) がアクセス違反 (`0xC0000005`) でクラッシュします。**
`require()` レベルで落ちるため、`npm install` / `npm run dev` / `vite` が一切動きません（社内セキュリティではなく、Nodeのパス処理起因）。

そのため運用を次のように分けています:

| 用途 | 場所 |
|---|---|
| **開発（npm run dev 等）** | `C:\dev\Qualyx` … ASCIIパス。ここでのみNodeが動く。 |
| **リポジトリ正本（git）** | `Individual-Dev` リポジトリの `src/Qualyx`（日本語パス配下） |

- git 操作自体は日本語パスでも動く（Nodeを使わないため）。
- **開発は必ず `C:\dev\Qualyx` で行い**、コミット時に `Individual-Dev/src/Qualyx` へ内容を同期する（`node_modules` / `dist` / `.git` は除外してコピー）。
- 別PCで作業する場合、パスにASCIIのみのクローン先（例 `C:\dev\Individual-Dev`）を使えば、この二重管理は不要になる可能性が高い（そのマシンで `npm run dev` が動くか最初に確認すること）。

関連メモリ: `env-japanese-path-node-crash`, `project-qualyx`

---

## プロジェクト概要

**Qualyx** … 資格（Qualification）の取得状況を、宇宙をモチーフにしたスキルツリーで可視化する個人開発Webアプリ。
ITパスポート→基本情報→応用情報→上位資格 のように、下位資格が上位資格の前提条件になっている依存関係（DAG）を表示し、資格を「獲得」していく。

- 名前の由来: Qualification の造語。命名検討の末 `Qualyx` に決定（"x" の響き重視。同名の別SaaSは存在するが個人開発なので許容）。

## 技術スタック

- **React 19 + Vite 8（JavaScript、TypeScript不使用）**
- Lint: **oxlint**（`npm run lint`）
- スタイル: プレーンCSS（`src/index.css` にトークン、`src/App.css` に本体）。ダーク固定の宇宙テーマ。
- 永続化: **localStorage のみ**（バックエンドなし）。将来のログイン付きマルチユーザー化を見据え、永続化は `src/progress/progressStore.js` で抽象化済み（`progressStore.local.js` を `progressStore.api.js` に差し替えれば利用側は無改修）。

## コマンド（`C:\dev\Qualyx` で実行）

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run lint
```

## アーキテクチャ / 主要ファイル

- `src/data/qualifications.js` … 資格マスター（フラット配列）。`{ id, name, category, prerequisites: [id...] }`。**資格追加はここに追記するだけ**（管理者=開発者が手動で拡充する運用。ユーザーがUIから追加する機能は無い）。
- `src/data/categories.js` … カテゴリ定義 `{ id, label }`。
- `src/domain/buildGraph.js` … マスター→ノード/エッジ変換。循環・欠損参照を検出し `console.warn`（落とさず継続）。
- `src/domain/layoutTree.js` … トポロジカル順で level を算出しSVG座標を割当。
- `src/domain/nodeGeometry.js` … ひし形ノードの中心・頂点計算（エッジ描画とノード描画で共有）。
- `src/domain/dependents.js` … ある資格を（推移的に）前提とする上位資格の算出。**取り消しの連鎖**に使用。
- `src/progress/` … 進捗の状態管理と永続化。`ProgressContext.jsx`（Provider）/ `useProgress.js`（フック）/ `progressStore*.js`。
- `src/components/tree/` … `SkillTreeCanvas`（SVG全体）/ `DiamondNode`（ひし形＋長押し）/ `DependencyEdge`（星座線）/ `CategoryFilter`。
- `src/components/common/CongratsModal.jsx` … 獲得お祝い / 取得済み情報 / 取り消し確認ポップアップ。
- `src/components/layout/` … `Header`（タイトル・獲得数カウンタ・リセット）/ `Footer`。

## データモデル（進捗）

- localStorageキー: `qualyx-progress-v2`
- 形式: `{ [qualificationId]: acquiredAt(ISO文字列) }` … **キーの有無が「獲得済みか」を表す**（2状態: 未獲得 / 獲得済み）。
- localStorage が使えない環境ではメモリ内フォールバック（`console.warn`）。

## 主な機能・仕様（UX）

- **長押しで獲得**: ひし形を長押し(約1.2秒)すると、隅から金色のゲージが**左回り(上→左→下→右)**に伸びる。満タンで獲得。
  - **途中で離すとゲージが減っていく**（獲得されない）。※ リリース時に必ず fill を停止する実装（`DiamondNode.jsx` の `startDrain`）。過去、離しても獲得まで進むバグを修正済み。
- **獲得時演出**: 紙吹雪エフェクト＋「資格取得おめでとうございます！」ポップアップ。**取得日**を表示。
- **獲得済みタップ**: 情報ポップアップ（取得日）を再表示。
- **取り消し**: 情報ポップアップ内の「この資格を取り消す」→ 確認ステップ。
  - **取り消すと、それを前提とする上位資格も連鎖的に取り消される**。確認画面で、実際に一緒に消える獲得済みの上位資格名を一覧表示して注意喚起する。
- **カテゴリ絞り込み**、**獲得数カウンタ (n/total)**、**リセット**。
- 背景は規則的な点が2レイヤーで浮遊（宇宙）。前提資格を獲得すると、つながる星座線が緑に灯る。

## 設計上の決定（経緯の要約）

- ステータスは当初「未着手/学習中/取得済み」の3段階案だったが、**長押しで獲得する体験に合わせ「未獲得/獲得済み」の2状態**に決定。
- ツリー描画は依存ライブラリ（dagre等）を使わず**自前SVG**（ノード数が多くない前提）。
- スタイルは他プロジェクト(MyPortfolio)の規約には縛られず、宇宙テーマとして独自に実装。

## サンプルデータの方針

- 資格名は公開されている試験名のみ。**個人情報・実データは一切含めない**（架空値のみ）。組織のヘルスケア系ルールにも準拠。

---

_最終更新: 2026-07-24 / 作成: Claude (Opus 4.8) と yyato の対話による個人開発_
