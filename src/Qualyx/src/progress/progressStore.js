// 進捗永続化の抽象境界。
// 現状は localStorage 実装を再エクスポートするだけ。
// 将来ログイン付きマルチユーザー化する際は、ここを progressStore.api.js に差し替えれば
// 利用側（ProgressContext / コンポーネント）は変更不要。
export {
  getAllProgress,
  acquire,
  release,
  resetProgress,
} from './progressStore.local.js'
