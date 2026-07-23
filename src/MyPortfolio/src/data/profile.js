// =========================================================
// プロフィール情報（プレースホルダー）
// ※ すべて架空の値です。実データに差し替えてご利用ください。
//    公開リポジトリのため、電話番号・住所など公開したくない情報は入れないでください。
// =========================================================

export const profile = {
  name: '山田 太郎',
  nameEn: 'Taro Yamada',
  // ヒーローで1文字ずつ出す短いキャッチ
  role: 'Frontend / Web Application Developer',
  tagline: '動くもので、伝える。',
  // Aboutの本文（段落ごとに配列要素）
  about: [
    'Webアプリケーションの設計・実装を中心に活動しているエンジニアです。使う人が「気持ちいい」と感じる操作感と、丁寧に作り込まれたUIにこだわっています。',
    'アイデアを素早く形にするプロトタイピングから、保守しやすいコードへの整理まで、一連の流れを一人で回せることが強みです。最近はインタラクションデザインとフロントエンドのパフォーマンス改善に注力しています。',
  ],
  // Aboutのカウントアップ指標（架空）
  stats: [
    { label: '制作したプロジェクト', value: 12, suffix: '+' },
    { label: '開発歴', value: 4, suffix: '年' },
    { label: 'コーヒー / 日', value: 3, suffix: '杯' },
  ],
  location: 'Tokyo, Japan',
  email: 'test@example.com',
  // SNS/連絡先（url は架空。実URLに差し替えてください）
  socials: [
    { key: 'github', label: 'GitHub', url: 'https://github.com/example' },
    { key: 'x', label: 'X (Twitter)', url: 'https://x.com/example' },
    { key: 'linkedin', label: 'LinkedIn', url: 'https://www.linkedin.com/in/example' },
  ],
}
