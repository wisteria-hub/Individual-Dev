import { qualifications } from '../data/qualifications.js'

// 「ある資格を前提とする資格（＝上位資格）」の隣接マップを1度だけ構築する。
// prereq(下位) -> [その prereq を前提に持つ資格(上位)] の対応。
const childrenMap = (() => {
  const m = new Map()
  for (const q of qualifications) {
    for (const pre of q.prerequisites ?? []) {
      if (!m.has(pre)) m.set(pre, [])
      m.get(pre).push(q.id)
    }
  }
  return m
})()

// 指定した資格を（直接・間接に）前提とする上位資格の id をすべて返す（自分自身は含まない）。
export function getTransitiveDependents(id) {
  const result = new Set()
  const stack = [...(childrenMap.get(id) ?? [])]
  while (stack.length) {
    const cur = stack.pop()
    if (result.has(cur)) continue
    result.add(cur)
    for (const child of childrenMap.get(cur) ?? []) stack.push(child)
  }
  return [...result]
}
