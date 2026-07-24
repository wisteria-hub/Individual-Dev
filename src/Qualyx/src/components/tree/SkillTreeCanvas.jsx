import { bottomVertex, topVertex } from '../../domain/nodeGeometry.js'
import DependencyEdge from './DependencyEdge.jsx'
import DiamondNode from './DiamondNode.jsx'

// ツリー全体をSVGで描画する。背景（宇宙）はCSSで別レイヤーに敷くため、SVGは透過。
// 背景をドラッグすると pan だけコンテンツ(<g>)を平行移動し、視点を動かせる。
export default function SkillTreeCanvas({
  layout,
  isAcquired,
  acquiredAt,
  onAcquire,
  onShowInfo,
  containerRef,
  pan,
  scale,
  surfaceProps,
  isPanning,
}) {
  const { nodes, edges } = layout
  const nodeById = new Map(nodes.map((n) => [n.id, n]))

  // 同じ前提資格(from)から出るエッジをまとめる。母線・幹を1本のpathで描くことで、
  // 半透明の線が重なって濃くなるのを防ぐ。
  const edgeGroups = new Map()
  for (const edge of edges) {
    if (!edgeGroups.has(edge.from)) edgeGroups.set(edge.from, [])
    edgeGroups.get(edge.from).push(edge.to)
  }

  return (
    <div
      className="qx-canvas-viewport"
      ref={containerRef}
      data-panning={isPanning}
      {...surfaceProps}
    >
      <svg
        className="qx-canvas"
        width="100%"
        height="100%"
        role="group"
        aria-label="資格スキルツリー（背景をドラッグで移動）"
      >
        <g transform={`translate(${pan.x}, ${pan.y}) scale(${scale})`}>
          <g>
            {[...edgeGroups.entries()].map(([fromId, toIds]) => {
              const fromNode = nodeById.get(fromId)
              const tos = toIds
                .map((id) => nodeById.get(id))
                .filter(Boolean)
                .map(topVertex)
              return (
                <DependencyEdge
                  key={fromId}
                  from={fromNode && bottomVertex(fromNode)}
                  tos={tos}
                  lit={isAcquired(fromId)}
                />
              )
            })}
          </g>
          <g>
            {nodes.map((node) => (
              <DiamondNode
                key={node.id}
                node={node}
                acquired={isAcquired(node.id)}
                acquiredAt={acquiredAt(node.id)}
                onAcquire={onAcquire}
                onShowInfo={onShowInfo}
              />
            ))}
          </g>
        </g>
      </svg>
    </div>
  )
}
