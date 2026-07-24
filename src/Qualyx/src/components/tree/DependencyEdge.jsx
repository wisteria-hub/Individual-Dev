// 前提資格(from) → 各資格(tos) をつなぐ星座のような線。
// from の下頂点から真下へ降りて水平の母線に合流し、そこから各 to の真上へ垂直に落とす。
//
// 幹（trunk）・母線（bus）・各垂直線（drop）を「1本の path に1回ずつ」だけ描く。
// 個別 path を重ねると半透明の線が加算されて重なり部分が濃くなるため、それを避ける。
export default function DependencyEdge({ from, tos, lit }) {
  if (!from || !tos?.length) return null

  // 母線の高さ = from と「一番近い子」の中間。子は母線から下へ垂直に落とす。
  const minToY = Math.min(...tos.map((t) => t.y))
  const busY = (from.y + minToY) / 2

  const xs = [from.x, ...tos.map((t) => t.x)]
  const minX = Math.min(...xs)
  const maxX = Math.max(...xs)

  const parts = [
    // 幹: from から母線まで（1回だけ）
    `M ${from.x} ${from.y} L ${from.x} ${busY}`,
  ]
  // 母線: 子が複数あるときだけ水平線を引く（1回だけ）
  if (maxX - minX > 0.5) {
    parts.push(`M ${minX} ${busY} L ${maxX} ${busY}`)
  }
  // 各垂直線: 母線から各 to へ（子ごとに1回だけ）
  for (const to of tos) {
    parts.push(`M ${to.x} ${busY} L ${to.x} ${to.y}`)
  }

  return (
    <path className="qx-edge" d={parts.join(' ')} fill="none" data-lit={lit} />
  )
}
