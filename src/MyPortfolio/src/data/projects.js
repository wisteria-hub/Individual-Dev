// =========================================================
// Works / Projects 掲載データ
// - image を指定するとサムネイル画像を表示、null の場合は
//   ProjectThumbnailPlaceholder（自作SVGモック）を表示します。
// - liveUrl が null の場合は「準備中」バッジを表示します。
// - featured: true のカードは大きめ＆3Dチルト演出（メリハリ用）。
// =========================================================

export const projects = [
  {
    id: 'daytime-schedule',
    title: '1日スケジュール可視化アプリ',
    subtitle: 'DayTime Schedule',
    description:
      '1日の予定を時計盤・タイムライン上で可視化するWebアプリ。期間別集計、テンプレート機能、日またぎ操作に対応し、ライト/ダーク/パステル/手書き風の複数テーマを切り替えられます。単一HTMLファイルで完結する軽量構成。',
    tags: ['Vue.js', 'Vanilla JS', 'Single-file HTML', 'CSS Variables'],
    // 公開デプロイは未実施（別タスク）。実URLに差し替えてください。
    repoUrl: 'https://github.com/example/Individual-Dev/blob/main/src/DayTimeShedule/index.html',
    liveUrl: null,
    image: null, // 後日スクショを assets/images に置いて差し替え
    placeholder: 'clock', // Placeholderの見た目バリエーション
    featured: true,
    year: '2026',
  },
  {
    id: 'portfolio',
    title: 'ポートフォリオサイト',
    subtitle: 'This Website',
    description:
      'React + Vite + Framer Motion で構築した、動きのあるインタラクティブなポートフォリオ。スクロール連動アニメーション、ダーク/ライトテーマ、レスポンシブ対応を白黒基調のデザインでまとめています。',
    tags: ['React', 'Vite', 'Framer Motion', 'CSS Modules'],
    repoUrl: 'https://github.com/example/Individual-Dev/tree/main/src/MyPortfolio',
    liveUrl: null,
    image: null,
    placeholder: 'grid',
    featured: true,
    year: '2026',
  },
  {
    id: 'sample-a',
    title: 'サンプルプロジェクト A',
    subtitle: 'Coming soon',
    description:
      'ここに制作物の説明が入ります。data/projects.js を編集して、実際のプロジェクト内容・技術スタック・リンクに差し替えてください。',
    tags: ['JavaScript', 'API'],
    repoUrl: 'https://github.com/example',
    liveUrl: null,
    image: null,
    placeholder: 'dots',
    featured: false,
    year: '—',
  },
  {
    id: 'sample-b',
    title: 'サンプルプロジェクト B',
    subtitle: 'Coming soon',
    description:
      'ここに制作物の説明が入ります。カードは自動でグリッド配置され、画面幅に応じて列数が変わります。',
    tags: ['Python', 'Automation'],
    repoUrl: 'https://github.com/example',
    liveUrl: null,
    image: null,
    placeholder: 'wave',
    featured: false,
    year: '—',
  },
]
