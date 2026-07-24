import { useState } from 'react'
import { qualificationMap } from '../../data/qualifications.js'
import { categoryMap } from '../../data/categories.js'
import { getTransitiveDependents } from '../../domain/dependents.js'
import { formatAcquiredDate } from '../../utils/formatDate.js'

// 紙吹雪パーティクル（index から角度・距離を決め、乱数なしで放射状に散らす）。
const PARTICLE_COLORS = ['#ffd166', '#8affc1', '#7cc4ff', '#c79bff', '#ff9bce']
const PARTICLES = Array.from({ length: 28 }, (_, i) => {
  const angle = (360 / 28) * i
  const distance = 90 + (i % 5) * 26
  return {
    id: i,
    color: PARTICLE_COLORS[i % PARTICLE_COLORS.length],
    tx: Math.cos((angle * Math.PI) / 180) * distance,
    ty: Math.sin((angle * Math.PI) / 180) * distance,
    delay: (i % 6) * 20,
  }
})

// 資格獲得のお祝い / 取得済み情報のポップアップ。
// 取得済み表示のときは「この資格を取り消す」操作を提供する。
export default function CongratsModal({
  qualificationId,
  acquiredAt,
  isNew,
  isAcquired,
  onRelease,
  onClose,
}) {
  const [confirming, setConfirming] = useState(false)
  const q = qualificationMap.get(qualificationId)
  if (!q) return null
  const category = categoryMap.get(q.category)

  // この資格を取り消すと連鎖的に消える「獲得済みの上位資格」。
  const affected = getTransitiveDependents(qualificationId).filter(isAcquired)
  const affectedNames = affected
    .map((id) => qualificationMap.get(id)?.name)
    .filter(Boolean)

  const handleRelease = () => {
    onRelease(qualificationId)
    onClose()
  }

  return (
    <div className="qx-modal-overlay" onClick={onClose} role="presentation">
      <div
        className="qx-modal"
        role="dialog"
        aria-modal="true"
        aria-label="資格取得"
        onClick={(e) => e.stopPropagation()}
      >
        {isNew && (
          <div className="qx-confetti" aria-hidden="true">
            {PARTICLES.map((p) => (
              <span
                key={p.id}
                className="qx-confetti-piece"
                style={{
                  '--tx': `${p.tx}px`,
                  '--ty': `${p.ty}px`,
                  '--delay': `${p.delay}ms`,
                  background: p.color,
                }}
              />
            ))}
          </div>
        )}

        <button type="button" className="qx-modal-close" onClick={onClose} aria-label="閉じる">
          ×
        </button>

        <div className="qx-modal-badge" data-new={isNew}>
          ✦
        </div>

        <p className="qx-modal-title">
          {isNew ? '資格取得おめでとうございます！' : '取得済みの資格'}
        </p>
        <p className="qx-modal-category">{category?.label ?? q.category}</p>
        <h2 className="qx-modal-name">{q.name}</h2>

        <div className="qx-modal-date">
          <span className="qx-modal-date-label">取得日</span>
          <span className="qx-modal-date-value">
            {formatAcquiredDate(acquiredAt) || '—'}
          </span>
        </div>

        {/* 取り消し（取得直後の祝福表示では出さない） */}
        {!isNew && !confirming && (
          <div className="qx-modal-actions">
            <button
              type="button"
              className="qx-btn-danger"
              onClick={() => setConfirming(true)}
            >
              この資格を取り消す
            </button>
            <p className="qx-modal-caution">
              ⚠ 取り消すと、この資格を前提とする<strong>上位資格も一緒に取り消され</strong>ます。
            </p>
          </div>
        )}

        {/* 取り消し確認 */}
        {confirming && (
          <div className="qx-modal-confirm">
            <p className="qx-confirm-lead">
              「{q.name}」の獲得を取り消しますか？
            </p>

            {affectedNames.length > 0 ? (
              <div className="qx-confirm-affected">
                <p className="qx-modal-caution">
                  ⚠ 以下の上位資格も同時に取り消されます：
                </p>
                <ul>
                  {affectedNames.map((name) => (
                    <li key={name}>{name}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="qx-modal-caution">
                ⚠ この操作は元に戻せません（再度長押しで取得し直せます）。
              </p>
            )}

            <div className="qx-confirm-buttons">
              <button
                type="button"
                className="qx-btn-ghost"
                onClick={() => setConfirming(false)}
              >
                やめる
              </button>
              <button type="button" className="qx-btn-danger" onClick={handleRelease}>
                取り消す
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
