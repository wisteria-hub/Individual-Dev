import { categories } from '../../data/categories.js'

// カテゴリ（分野）による絞り込み。「すべて」+ 各カテゴリのボタン。
export default function CategoryFilter({ value, onChange }) {
  return (
    <div className="qx-category-filter" role="group" aria-label="分野で絞り込み">
      <button
        type="button"
        className="qx-category-option"
        data-active={value == null}
        onClick={() => onChange(null)}
      >
        すべて
      </button>
      {categories.map((c) => (
        <button
          key={c.id}
          type="button"
          className="qx-category-option"
          data-active={value === c.id}
          onClick={() => onChange(c.id)}
        >
          {c.label}
        </button>
      ))}
    </div>
  )
}
