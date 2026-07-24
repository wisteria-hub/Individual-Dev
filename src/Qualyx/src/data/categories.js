// 資格のカテゴリ（分野）定義。
// 新しい分野を追加するときはここに1件足し、qualifications.js の各資格の category に id を指定する。
export const categories = [
  { id: 'it-national', label: '情報処理技術者試験' },
]

export const categoryMap = new Map(categories.map((c) => [c.id, c]))
