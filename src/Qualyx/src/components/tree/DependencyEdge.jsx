// 前提資格(from) → 資格(to) をつなぐ星座のような線。
// from の下頂点から to の上頂点へ、緩やかな曲線を引く。
export default function DependencyEdge({ from, to, lit }) {
  if (!from || !to) return null

  const midY = (from.y + to.y) / 2
  const d = `M ${from.x} ${from.y} C ${from.x} ${midY}, ${to.x} ${midY}, ${to.x} ${to.y}`

  return <path className="qx-edge" d={d} fill="none" data-lit={lit} />
}
