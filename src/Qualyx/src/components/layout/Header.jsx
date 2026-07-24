// アプリ見出しと、獲得数カウンタ、進捗リセット。
export default function Header({ acquiredCount, totalCount, onReset }) {
  return (
    <header className="qx-header">
      <div className="qx-header-title">
        <h1>Qualyx</h1>
        <p>資格のオブジェクトを長押しして獲得しよう</p>
      </div>
      <div className="qx-header-tools">
        <div className="qx-counter" aria-label="獲得数">
          <span className="qx-counter-value">{acquiredCount}</span>
          <span className="qx-counter-sep">/</span>
          <span className="qx-counter-total">{totalCount}</span>
        </div>
        <button type="button" className="qx-reset" onClick={onReset}>
          リセット
        </button>
      </div>
    </header>
  )
}
