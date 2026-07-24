// 資格マスターデータ（管理者が手動で追加・更新する静的データ）。
//
// 各資格:
//   id            一意なキー（進捗の保存キーにも使う。変更すると保存済み進捗と紐付かなくなる点に注意）
//   name          表示名
//   category      categories.js の id
//   prerequisites 前提となる資格 id の配列（複数指定可 = DAG。空配列なら起点）
//
// prerequisites は「その資格の前段として想定される資格」を表す。取得の強制ではなく、
// ツリー上の並び順・依存線の描画に使う。
export const qualifications = [
  {
    id: 'it-passport',
    name: 'ITパスポート',
    category: 'it-national',
    prerequisites: [],
  },
  {
    id: 'fe',
    name: '基本情報技術者',
    category: 'it-national',
    prerequisites: ['it-passport'],
  },
  {
    id: 'ap',
    name: '応用情報技術者',
    category: 'it-national',
    prerequisites: ['fe'],
  },
  // 応用情報の上位（高度試験）。複数が並列で分岐する。
  {
    id: 'pm',
    name: 'プロジェクトマネージャ',
    category: 'it-national',
    prerequisites: ['ap'],
  },
  {
    id: 'db',
    name: 'データベーススペシャリスト',
    category: 'it-national',
    prerequisites: ['ap'],
  },
  {
    id: 'nw',
    name: 'ネットワークスペシャリスト',
    category: 'it-national',
    prerequisites: ['ap'],
  },
  {
    id: 'sc',
    name: '情報処理安全確保支援士',
    category: 'it-national',
    prerequisites: ['ap'],
  },
]

export const qualificationMap = new Map(qualifications.map((q) => [q.id, q]))
