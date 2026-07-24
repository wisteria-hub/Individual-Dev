// 進捗の永続化: localStorage 実装。
// 保存形式: { [qualificationId]: acquiredAt(ISO文字列) }  — キーが存在すれば「獲得済み」。
// 将来 API 実装（progressStore.api.js）へ差し替える前提で、非同期の同一シグネチャで公開する。

const STORAGE_KEY = 'qualyx-progress-v2'

// localStorage が使えない環境（プライベートモード等）向けのメモリ内フォールバック。
let memoryFallback = {}
let useMemory = false

function readRaw() {
  if (useMemory) return { ...memoryFallback }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    if (parsed && typeof parsed === 'object') {
      const clean = {}
      for (const [id, acquiredAt] of Object.entries(parsed)) {
        if (typeof acquiredAt === 'string') clean[id] = acquiredAt
      }
      return clean
    }
    return {}
  } catch (err) {
    console.warn('[Qualyx] 進捗の読み込みに失敗しました。メモリ内で継続します。', err)
    useMemory = true
    return { ...memoryFallback }
  }
}

function writeRaw(data) {
  memoryFallback = { ...data }
  if (useMemory) return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (err) {
    console.warn('[Qualyx] 進捗の保存に失敗しました。メモリ内で継続します。', err)
    useMemory = true
  }
}

export async function getAllProgress() {
  return readRaw()
}

// 資格を獲得済みにする。acquiredAt を省略した場合は呼び出し側で日時を渡す想定。
export async function acquire(id, acquiredAt) {
  const data = readRaw()
  data[id] = acquiredAt
  writeRaw(data)
  return data
}

// 獲得を取り消す（現状UIからは未使用。将来用に用意）。
export async function release(id) {
  const data = readRaw()
  delete data[id]
  writeRaw(data)
  return data
}

export async function resetProgress() {
  writeRaw({})
  return {}
}
