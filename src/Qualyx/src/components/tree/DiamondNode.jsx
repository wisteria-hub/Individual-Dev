import { useCallback, useEffect, useRef, useState } from 'react'
import { centerOf, DIAMOND_SIZE } from '../../domain/nodeGeometry.js'
import { formatAcquiredDate } from '../../utils/formatDate.js'

const FILL_MS = 1200 // 満タンまでの長押し時間
const DRAIN_MS = 500 // 離してから空になるまでの時間

// ひし形の頂点（中心基準）。上→左→下→右 の順で左回り(CCW)に一周する。
const H = DIAMOND_SIZE / 2
const DIAMOND_POINTS = `0,${-H} ${-H},0 0,${H} ${H},0`
const GAUGE_PATH = `M 0 ${-H} L ${-H} 0 L 0 ${H} L ${H} 0 Z`
const PERIMETER = 4 * Math.hypot(H, H)

export default function DiamondNode({
  node,
  acquired,
  acquiredAt,
  onAcquire,
  onShowInfo,
}) {
  const { cx, cy } = centerOf(node)
  const [progress, setProgress] = useState(acquired ? 1 : 0)

  const progressRef = useRef(acquired ? 1 : 0)
  const modeRef = useRef('idle') // 'fill' | 'drain' | 'idle'
  const lastTsRef = useRef(0)
  const rafRef = useRef(0)
  const onAcquireRef = useRef(onAcquire)
  onAcquireRef.current = onAcquire

  // 獲得状態が変わったらゲージを満タン固定にする。
  useEffect(() => {
    if (acquired) {
      modeRef.current = 'idle'
      progressRef.current = 1
      setProgress(1)
    }
  }, [acquired])

  useEffect(() => () => cancelAnimationFrame(rafRef.current), [])

  const loop = useCallback((ts) => {
    const last = lastTsRef.current || ts
    const dt = ts - last
    lastTsRef.current = ts

    let p = progressRef.current
    if (modeRef.current === 'fill') {
      p = Math.min(1, p + dt / FILL_MS)
    } else if (modeRef.current === 'drain') {
      p = Math.max(0, p - dt / DRAIN_MS)
    }
    progressRef.current = p
    setProgress(p)

    if (modeRef.current === 'fill' && p >= 1) {
      modeRef.current = 'idle'
      onAcquireRef.current(node.id)
      return
    }
    if (modeRef.current === 'drain' && p <= 0) {
      modeRef.current = 'idle'
      lastTsRef.current = 0
      return
    }
    rafRef.current = requestAnimationFrame(loop)
  }, [node.id])

  const startFill = useCallback(() => {
    modeRef.current = 'fill'
    lastTsRef.current = 0
    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(loop)
  }, [loop])

  const startDrain = useCallback(() => {
    // リリース時はまず fill を止める。まだ進んでいない（0）なら何も減らさず idle に戻す。
    if (progressRef.current <= 0) {
      modeRef.current = 'idle'
      lastTsRef.current = 0
      cancelAnimationFrame(rafRef.current)
      return
    }
    modeRef.current = 'drain'
    lastTsRef.current = 0
    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(loop)
  }, [loop])

  const handlePointerDown = (e) => {
    if (acquired) return
    e.currentTarget.setPointerCapture?.(e.pointerId)
    startFill()
  }

  const handleRelease = () => {
    if (acquired) return
    startDrain()
  }

  const dashOffset = PERIMETER * (1 - progress)
  const pressing = progress > 0 && !acquired

  return (
    <g
      className="qx-node"
      transform={`translate(${cx}, ${cy})`}
      role="button"
      tabIndex={0}
      aria-label={acquired ? `${node.name}（獲得済み）` : node.name}
      style={{ cursor: 'pointer', touchAction: 'none' }}
      onPointerDown={handlePointerDown}
      onPointerUp={handleRelease}
      onPointerCancel={handleRelease}
      onClick={() => acquired && onShowInfo(node.id)}
      onContextMenu={(e) => e.preventDefault()}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          if (acquired) onShowInfo(node.id)
        }
      }}
    >
      {/* 獲得済みの外周グロー */}
      {acquired && (
        <polygon
          className="qx-diamond-glow"
          points={DIAMOND_POINTS}
          transform={`scale(1.18)`}
        />
      )}

      {/* ひし形本体 */}
      <polygon
        className="qx-diamond"
        points={DIAMOND_POINTS}
        data-acquired={acquired}
        data-pressing={pressing}
      />

      {/* 長押しゲージ（左回りに伸びる線） */}
      <path
        className="qx-gauge"
        d={GAUGE_PATH}
        fill="none"
        strokeDasharray={PERIMETER}
        strokeDashoffset={dashOffset}
        data-acquired={acquired}
      />

      {/* 中央マーク */}
      <text
        className="qx-diamond-mark"
        y="1"
        textAnchor="middle"
        dominantBaseline="central"
      >
        {acquired ? '✦' : '◆'}
      </text>

      {/* 資格名 */}
      <text
        className="qx-node-label"
        y={H + 22}
        textAnchor="middle"
        data-acquired={acquired}
      >
        {node.name}
      </text>

      {/* 取得日 */}
      {acquired && acquiredAt && (
        <text className="qx-node-date" y={H + 40} textAnchor="middle">
          {formatAcquiredDate(acquiredAt)}
        </text>
      )}
    </g>
  )
}
