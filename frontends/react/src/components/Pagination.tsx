interface Props {
  page: number
  pageCount: number
  pageSize: number
  onPage: (p: number) => void
  onPageSize: (n: number) => void
}

const PAGE_SIZES = [15, 25, 50, 100]

export default function Pagination({ page, pageCount, pageSize, onPage, onPageSize }: Props) {
  if (pageCount <= 1 && PAGE_SIZES.indexOf(pageSize) === 0) return null

  return (
    <div className="flex items-center justify-between mt-8 pt-4 border-t border-edge">
      <div className="flex items-center gap-2 text-sm text-muted">
        <span>Per page</span>
        <select
          value={pageSize}
          onChange={e => onPageSize(Number(e.target.value))}
          className="bg-surface border border-edge rounded px-2 py-1 text-sm text-paper focus:outline-none focus:border-accent"
        >
          {PAGE_SIZES.map(n => <option key={n} value={n}>{n}</option>)}
        </select>
      </div>

      {pageCount > 1 && (
        <div className="flex items-center gap-3">
          <button
            disabled={page === 1}
            onClick={() => onPage(page - 1)}
            className="px-3 py-1 rounded bg-surface border border-edge text-sm text-paper disabled:opacity-30 hover:border-accent hover:text-accent transition-colors"
          >
            ←
          </button>
          <span className="text-sm text-muted tabular-nums">{page} / {pageCount}</span>
          <button
            disabled={page === pageCount}
            onClick={() => onPage(page + 1)}
            className="px-3 py-1 rounded bg-surface border border-edge text-sm text-paper disabled:opacity-30 hover:border-accent hover:text-accent transition-colors"
          >
            →
          </button>
        </div>
      )}
    </div>
  )
}
