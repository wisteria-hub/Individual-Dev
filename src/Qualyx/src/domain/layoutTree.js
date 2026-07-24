// グラフ（ノード/エッジ）からSVG描画用の座標を計算する。
//
// レベル(縦の段) = そのノードに至る全前提のレベルの最大値 + 1（前提が無ければ 0）。
// 同一レベル内は category → id 順で安定ソートし、横方向に等間隔で並べる。

const DEFAULTS = {
  nodeWidth: 150, // ひし形＋資格名ラベルを収めるセル幅
  nodeHeight: 104, // ひし形＋ラベル＋取得日を収めるセル高
  gapX: 28, // 同レベル内ノードの横間隔
  gapY: 56, // レベル間の縦間隔
  paddingX: 48,
  paddingY: 48,
}

export function layoutTree(graph, options = {}) {
  const opts = { ...DEFAULTS, ...options }
  const { nodes, edges } = graph

  const incoming = new Map(nodes.map((n) => [n.id, []]))
  const outgoing = new Map(nodes.map((n) => [n.id, []]))
  for (const edge of edges) {
    outgoing.get(edge.from)?.push(edge.to)
    incoming.get(edge.to)?.push(edge.from)
  }

  const level = assignLevels(nodes, incoming, outgoing)

  // レベルごとにノードをまとめる
  const byLevel = new Map()
  for (const node of nodes) {
    const lv = level.get(node.id)
    if (!byLevel.has(lv)) byLevel.set(lv, [])
    byLevel.get(lv).push(node)
  }

  const positions = new Map()
  const sortedLevels = [...byLevel.keys()].sort((a, b) => a - b)
  const step = opts.nodeWidth + opts.gapX

  for (const lv of sortedLevels) {
    const row = byLevel.get(lv)
    row.sort(
      (a, b) =>
        a.category.localeCompare(b.category) || a.id.localeCompare(b.id),
    )
    row.forEach((node, i) => {
      positions.set(node.id, {
        x: opts.paddingX + i * step,
        y: opts.paddingY + lv * (opts.nodeHeight + opts.gapY),
        width: opts.nodeWidth,
        height: opts.nodeHeight,
        level: lv,
      })
    })
  }

  const maxRowCount = Math.max(...[...byLevel.values()].map((r) => r.length), 1)
  const width = opts.paddingX * 2 + maxRowCount * step - opts.gapX
  const height =
    opts.paddingY * 2 +
    (sortedLevels.length || 1) * (opts.nodeHeight + opts.gapY) -
    opts.gapY

  const positionedNodes = nodes.map((n) => ({ ...n, ...positions.get(n.id) }))
  const positionedEdges = edges.map((e) => ({
    ...e,
    fromPos: positions.get(e.from),
    toPos: positions.get(e.to),
  }))

  return { nodes: positionedNodes, edges: positionedEdges, width, height, opts }
}

// トポロジカル順にレベルを確定する（Kahn法ベース）。
function assignLevels(nodes, incoming, outgoing) {
  const level = new Map(nodes.map((n) => [n.id, 0]))
  const indegree = new Map(nodes.map((n) => [n.id, incoming.get(n.id).length]))
  const queue = nodes.filter((n) => indegree.get(n.id) === 0).map((n) => n.id)

  while (queue.length) {
    const id = queue.shift()
    for (const next of outgoing.get(id) ?? []) {
      level.set(next, Math.max(level.get(next), level.get(id) + 1))
      indegree.set(next, indegree.get(next) - 1)
      if (indegree.get(next) === 0) queue.push(next)
    }
  }

  return level
}
