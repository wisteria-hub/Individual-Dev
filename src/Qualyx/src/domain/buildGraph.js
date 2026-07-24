// 資格マスターデータをノード / エッジのグラフ構造に変換する。
// 存在しない前提資格の参照や循環参照を検出し、console.warn で警告する
// （アプリは落とさず、問題のあるエッジだけ除外して継続する）。

export function buildGraph(qualifications) {
  const idSet = new Set(qualifications.map((q) => q.id))
  const nodes = qualifications.map((q) => ({
    id: q.id,
    name: q.name,
    category: q.category,
    prerequisites: q.prerequisites ?? [],
  }))

  const edges = []
  for (const node of nodes) {
    const seen = new Set()
    for (const prereqId of node.prerequisites) {
      if (!idSet.has(prereqId)) {
        console.warn(
          `[Qualyx] 資格 "${node.id}" の前提 "${prereqId}" が見つかりません。無視します。`,
        )
        continue
      }
      if (prereqId === node.id || seen.has(prereqId)) continue
      seen.add(prereqId)
      // エッジは 前提資格(from) → その資格(to) の向き
      edges.push({ from: prereqId, to: node.id })
    }
  }

  const validEdges = removeCycles(nodes, edges)
  return { nodes, edges: validEdges }
}

// 循環を検出し、循環を構成するエッジを除外して DAG にする。
function removeCycles(nodes, edges) {
  const adjacency = new Map(nodes.map((n) => [n.id, []]))
  for (const edge of edges) {
    adjacency.get(edge.from)?.push(edge)
  }

  const state = new Map() // id -> 'visiting' | 'done'
  const dropped = new Set()

  const visit = (id) => {
    state.set(id, 'visiting')
    for (const edge of adjacency.get(id) ?? []) {
      if (dropped.has(edge)) continue
      const next = edge.to
      if (state.get(next) === 'visiting') {
        console.warn(
          `[Qualyx] 循環参照を検出しました: "${edge.from}" → "${edge.to}"。このエッジを無視します。`,
        )
        dropped.add(edge)
        continue
      }
      if (state.get(next) !== 'done') {
        visit(next)
      }
    }
    state.set(id, 'done')
  }

  for (const node of nodes) {
    if (state.get(node.id) !== 'done') visit(node.id)
  }

  return edges.filter((e) => !dropped.has(e))
}
