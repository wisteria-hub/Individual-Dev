import { motion } from 'framer-motion'

/**
 * スクリーンショット未撮影のプロジェクト用の、白黒SVGモックサムネイル。
 * variant により見た目を変える。'clock' は針がゆっくり回る演出付き
 * （DayTimeShedule のテーマ性に合わせたもの）。
 * reduced-motion 時はアニメーションを止める。
 */
export default function ProjectThumbnailPlaceholder({ variant = 'grid', reduced = false }) {
  const common = {
    width: '100%',
    height: '100%',
    viewBox: '0 0 400 260',
    preserveAspectRatio: 'xMidYMid slice',
    role: 'img',
    'aria-label': 'プロジェクトのサムネイル（準備中のプレースホルダー）',
  }

  return (
    <svg {...common} xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="260" fill="var(--color-bg-elev)" />
      {variant === 'clock' && <ClockArt reduced={reduced} />}
      {variant === 'grid' && <GridArt />}
      {variant === 'dots' && <DotsArt />}
      {variant === 'wave' && <WaveArt reduced={reduced} />}
    </svg>
  )
}

function ClockArt({ reduced }) {
  const ticks = Array.from({ length: 12 })
  return (
    <g stroke="var(--color-text)" fill="none">
      <circle cx="200" cy="130" r="78" strokeWidth="2" opacity="0.9" />
      {ticks.map((_, i) => {
        const angle = (i / 12) * Math.PI * 2
        const x1 = 200 + Math.sin(angle) * 70
        const y1 = 130 - Math.cos(angle) * 70
        const x2 = 200 + Math.sin(angle) * 78
        const y2 = 130 - Math.cos(angle) * 78
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth="2" opacity="0.55" />
      })}
      {/* 時針 */}
      <line x1="200" y1="130" x2="200" y2="90" strokeWidth="4" strokeLinecap="round" />
      {/* 分針（ゆっくり回転） */}
      <motion.line
        x1="200"
        y1="130"
        x2="200"
        y2="72"
        strokeWidth="3"
        strokeLinecap="round"
        style={{ originX: '200px', originY: '130px' }}
        animate={reduced ? {} : { rotate: 360 }}
        transition={reduced ? {} : { duration: 24, ease: 'linear', repeat: Infinity }}
      />
      <circle cx="200" cy="130" r="4" fill="var(--color-text)" />
    </g>
  )
}

function GridArt() {
  const cells = Array.from({ length: 6 * 4 })
  return (
    <g>
      {cells.map((_, i) => {
        const col = i % 6
        const row = Math.floor(i / 6)
        return (
          <rect
            key={i}
            x={30 + col * 60}
            y={30 + row * 55}
            width="46"
            height="40"
            rx="6"
            fill="none"
            stroke="var(--color-text)"
            strokeWidth="1.5"
            opacity={0.18 + ((col + row) % 3) * 0.22}
          />
        )
      })}
    </g>
  )
}

function DotsArt() {
  const dots = Array.from({ length: 7 * 5 })
  return (
    <g fill="var(--color-text)">
      {dots.map((_, i) => {
        const col = i % 7
        const row = Math.floor(i / 7)
        return (
          <circle
            key={i}
            cx={40 + col * 55}
            cy={40 + row * 45}
            r={2 + ((col * row) % 4)}
            opacity={0.2 + ((col + row) % 4) * 0.18}
          />
        )
      })}
    </g>
  )
}

function WaveArt({ reduced }) {
  return (
    <g stroke="var(--color-text)" fill="none" strokeWidth="2">
      {[0, 1, 2].map((k) => (
        <motion.path
          key={k}
          d={`M -20 ${120 + k * 24} Q 80 ${80 + k * 24} 200 ${120 + k * 24} T 420 ${120 + k * 24}`}
          opacity={0.6 - k * 0.15}
          animate={reduced ? {} : { d: [
            `M -20 ${120 + k * 24} Q 80 ${80 + k * 24} 200 ${120 + k * 24} T 420 ${120 + k * 24}`,
            `M -20 ${120 + k * 24} Q 80 ${150 + k * 24} 200 ${120 + k * 24} T 420 ${120 + k * 24}`,
            `M -20 ${120 + k * 24} Q 80 ${80 + k * 24} 200 ${120 + k * 24} T 420 ${120 + k * 24}`,
          ] }}
          transition={reduced ? {} : { duration: 6 + k, ease: 'easeInOut', repeat: Infinity }}
        />
      ))}
    </g>
  )
}
