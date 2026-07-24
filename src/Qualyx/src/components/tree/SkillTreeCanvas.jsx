import { bottomVertex, topVertex } from '../../domain/nodeGeometry.js'
import DependencyEdge from './DependencyEdge.jsx'
import DiamondNode from './DiamondNode.jsx'

// ツリー全体をSVGで描画する。背景（宇宙）はCSSで別レイヤーに敷くため、SVGは透過。
export default function SkillTreeCanvas({
  layout,
  isAcquired,
  acquiredAt,
  onAcquire,
  onShowInfo,
}) {
  const { nodes, edges, width, height } = layout
  const nodeById = new Map(nodes.map((n) => [n.id, n]))

  return (
    <div className="qx-canvas-scroll">
      <svg
        className="qx-canvas"
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        role="group"
        aria-label="資格スキルツリー"
      >
        <g>
          {edges.map((edge, i) => {
            const fromNode = nodeById.get(edge.from)
            const toNode = nodeById.get(edge.to)
            return (
              <DependencyEdge
                key={`${edge.from}-${edge.to}-${i}`}
                from={fromNode && bottomVertex(fromNode)}
                to={toNode && topVertex(toNode)}
                lit={isAcquired(edge.from)}
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
      </svg>
    </div>
  )
}
