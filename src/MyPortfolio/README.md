# MyPortfolio

React + Vite + Framer Motion で構築した、白黒基調のインタラクティブなポートフォリオサイト。

## 特徴

- スクロール連動アニメーション（Framer Motion）
- ダーク / ライトテーマ切替（OS設定に追従・localStorage永続化）
- レスポンシブ対応（モバイル / タブレット / デスクトップ）
- `prefers-reduced-motion` に対応（酔いやすい演出を自動縮退）
- フォント自己ホスト（外部リクエスト無し）

## セットアップ

```bash
npm install      # 依存関係のインストール
npm run dev      # 開発サーバー起動（http://localhost:5173）
npm run build    # 本番ビルド（dist/ に出力）
npm run preview  # ビルド成果物をローカル確認（http://localhost:4173）
```

## 内容の差し替え方

表示内容はすべて `src/data/` 以下に集約しています。コンポーネントを触らずに更新できます。

| ファイル | 内容 |
| --- | --- |
| `src/data/profile.js` | 氏名・肩書・自己紹介・連絡先・SNS |
| `src/data/skills.js` | スキル一覧（カテゴリ別） |
| `src/data/projects.js` | Works に表示する制作物 |

> ⚠️ 現在はすべて**架空のプレースホルダー**（例: 山田太郎 / test@example.com）です。
> 公開リポジトリのため、電話番号・住所など公開したくない情報は入力しないでください。

### プロジェクトのサムネイル画像

`src/data/projects.js` の各エントリで `image: null` の場合は自作のSVGプレースホルダーを表示します。
実際のスクリーンショットは `src/assets/images/` に置き、`image` フィールドにパスを指定すると差し替えられます。

## ディレクトリ構成

```
src/
├─ components/  layout/(Header, Nav, Footer 等) / sections/(Hero, About...) / common/(汎用)
├─ data/        表示内容（差し替え用）
├─ hooks/       useTheme / usePrefersReducedMotion / useCountUp
└─ styles/      variables.css(デザイントークン) 他
```

## スコープ外（今後の課題）

- お問い合わせフォームのバックエンド送信（現状は mailto + コピーのみ）
- デプロイ設定（GitHub Pages / Vercel 等）
- SEO / OGP・アクセス解析・テスト
