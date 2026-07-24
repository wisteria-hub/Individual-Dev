import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

// キャンバスの視点操作（パン＋ズーム）を管理するフック。
//
// - containerRef … 操作を受け付ける要素（ビューポート）に付与する。
// - pan …  現在のオフセット {x, y}（px）。コンテンツの<g>と背景の点に適用する。
// - scale … 現在の拡大率。コンテンツの<g>の scale と背景の点の密度に使う。
// - surfaceProps … ビューポート要素に spread するポインタハンドラ群。
// - isPanning … ドラッグ中か（カーソル切り替え用）。
//
// ・背景をドラッグ → パン（ノード上は長押し獲得を優先するので除外）。
// ・マウスホイール → カーソル位置を中心にズーム。

// パン/ズームしても最低これだけはコンテンツを画面内に残す（見失い防止）。
const KEEP_VISIBLE = 120
const MIN_SCALE = 0.4
const MAX_SCALE = 2.5

export function usePan(contentWidth, contentHeight) {
  const containerRef = useRef(null)
  const [view, setView] = useState({ x: 0, y: 0, scale: 1 })
  const [isPanning, setIsPanning] = useState(false)

  // 最新の view をイベントハンドラから同期的に読むための ref。
  const viewRef = useRef(view)
  const sizeRef = useRef({ w: 0, h: 0 })
  const draggingRef = useRef(false)
  const startRef = useRef({ x: 0, y: 0 })
  const startPanRef = useRef({ x: 0, y: 0 })
  const initializedRef = useRef(false)

  const commit = useCallback((next) => {
    viewRef.current = next
    setView(next)
  }, [])

  const clamp = useCallback(
    (x, y, scale) => {
      const { w, h } = sizeRef.current
      if (!w || !h) return { x, y }
      // 拡大率を反映したコンテンツ実寸で、画面内に KEEP_VISIBLE 以上残す。
      const cw = contentWidth * scale
      const ch = contentHeight * scale
      const minX = KEEP_VISIBLE - cw
      const maxX = w - KEEP_VISIBLE
      const minY = KEEP_VISIBLE - ch
      const maxY = h - KEEP_VISIBLE
      return {
        x: Math.min(maxX, Math.max(minX, x)),
        y: Math.min(maxY, Math.max(minY, y)),
      }
    },
    [contentWidth, contentHeight],
  )

  // コンテンツを中央（横）・上寄せ（縦）・等倍に配置する初期ビュー。
  const centered = useCallback(() => {
    const { w, h } = sizeRef.current
    const x = (w - contentWidth) / 2
    const y = contentHeight < h ? (h - contentHeight) / 2 : 32
    const c = clamp(x, y, 1)
    return { x: c.x, y: c.y, scale: 1 }
  }, [contentWidth, contentHeight, clamp])

  // コンテナのサイズを監視。初回計測時とフィルタ変更時に中央へ寄せる。
  useLayoutEffect(() => {
    const el = containerRef.current
    if (!el) return
    const measure = () => {
      const rect = el.getBoundingClientRect()
      sizeRef.current = { w: rect.width, h: rect.height }
      if (!initializedRef.current && rect.width && rect.height) {
        initializedRef.current = true
        commit(centered())
      }
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [centered, commit])

  // コンテンツの寸法が変わったら（カテゴリ絞り込み等）中央へ寄せ直す。
  useEffect(() => {
    initializedRef.current = false
    if (sizeRef.current.w && sizeRef.current.h) {
      initializedRef.current = true
      commit(centered())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentWidth, contentHeight])

  // マウスホイールでカーソル位置を中心にズーム。
  // （React の onWheel は passive になり preventDefault できないため native で登録）
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const onWheel = (e) => {
      e.preventDefault()
      const rect = el.getBoundingClientRect()
      const mx = e.clientX - rect.left
      const my = e.clientY - rect.top
      const cur = viewRef.current
      const factor = Math.exp(-e.deltaY * 0.0015)
      const newScale = Math.min(
        MAX_SCALE,
        Math.max(MIN_SCALE, cur.scale * factor),
      )
      if (newScale === cur.scale) return
      // カーソル下のワールド座標が動かないよう pan を補正する。
      const k = newScale / cur.scale
      const nx = mx - (mx - cur.x) * k
      const ny = my - (my - cur.y) * k
      const c = clamp(nx, ny, newScale)
      commit({ x: c.x, y: c.y, scale: newScale })
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [clamp, commit])

  const onPointerDown = useCallback((e) => {
    // ノードやボタン上ならパンしない（長押し獲得・クリックを優先）。
    if (e.target.closest?.('.qx-node, button')) return
    if (e.button && e.button !== 0) return
    draggingRef.current = true
    startRef.current = { x: e.clientX, y: e.clientY }
    startPanRef.current = { x: viewRef.current.x, y: viewRef.current.y }
    e.currentTarget.setPointerCapture?.(e.pointerId)
    setIsPanning(true)
  }, [])

  const onPointerMove = useCallback(
    (e) => {
      if (!draggingRef.current) return
      const dx = e.clientX - startRef.current.x
      const dy = e.clientY - startRef.current.y
      const cur = viewRef.current
      const c = clamp(startPanRef.current.x + dx, startPanRef.current.y + dy, cur.scale)
      commit({ ...cur, x: c.x, y: c.y })
    },
    [clamp, commit],
  )

  const endDrag = useCallback((e) => {
    if (!draggingRef.current) return
    draggingRef.current = false
    e.currentTarget?.releasePointerCapture?.(e.pointerId)
    setIsPanning(false)
  }, [])

  const surfaceProps = {
    onPointerDown,
    onPointerMove,
    onPointerUp: endDrag,
    onPointerCancel: endDrag,
  }

  return {
    containerRef,
    pan: { x: view.x, y: view.y },
    scale: view.scale,
    surfaceProps,
    isPanning,
  }
}
