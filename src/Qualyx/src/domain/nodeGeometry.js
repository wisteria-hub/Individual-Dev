// ひし形ノードの幾何。レイアウトのセル(x,y,width,height)からひし形の中心・頂点を求める。
// SkillTreeCanvas（エッジ描画）と DiamondNode（ノード描画）で共通利用する。

export const DIAMOND_SIZE = 56 // ひし形の対角線の長さ（正方形を45度回転したときの幅）
const CENTER_Y_OFFSET = 32 // セル上端からひし形中心までの距離

export function centerOf(node) {
  return {
    cx: node.x + node.width / 2,
    cy: node.y + CENTER_Y_OFFSET,
  }
}

export function topVertex(node) {
  const { cx, cy } = centerOf(node)
  return { x: cx, y: cy - DIAMOND_SIZE / 2 }
}

export function bottomVertex(node) {
  const { cx, cy } = centerOf(node)
  return { x: cx, y: cy + DIAMOND_SIZE / 2 }
}
