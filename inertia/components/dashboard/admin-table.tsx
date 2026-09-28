import type { ReactNode } from 'react'
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Search,
  X,
} from 'lucide-react'

export type AdminSortDirection = 'asc' | 'desc'

interface AdminTableToolbarProps {
  search: string
  onSearchChange: (value: string) => void
  placeholder: string
  onReset: () => void
  hasActiveFilters?: boolean
  children?: ReactNode
}

export function AdminTableToolbar({
  search,
  onSearchChange,
  placeholder,
  onReset,
  hasActiveFilters = Boolean(search),
  children,
}: Readonly<AdminTableToolbarProps>) {
  return (
    <div className="flex flex-col gap-3 border-b border-neutral-200 bg-neutral-50/70 p-4 dark:border-neutral-800 dark:bg-neutral-800/30 lg:flex-row lg:items-center">
      <div className="relative min-w-0 flex-1">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500 dark:text-neutral-400"
        />
        <input
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={placeholder}
          aria-label={placeholder}
          className="w-full rounded-xl border border-neutral-300 bg-white py-2.5 pr-9 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-500 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:placeholder:text-neutral-400"
          style={{ paddingLeft: '2.6rem' }}
        />
        {search && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            aria-label="Hapus pencarian"
            title="Hapus pencarian"
            className="absolute right-2 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
      <button
        type="button"
        onClick={onReset}
        disabled={!hasActiveFilters}
        className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl border border-neutral-300 bg-white px-3 py-2.5 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-45 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        Reset Filter
      </button>
    </div>
  )
}

interface AdminSortButtonProps {
  label: string
  active: boolean
  direction: AdminSortDirection
  onClick: () => void
}

export function AdminSortButton({
  label,
  active,
  direction,
  onClick,
}: Readonly<AdminSortButtonProps>) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 text-left font-semibold text-neutral-800 transition hover:text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 dark:text-neutral-200 dark:hover:text-emerald-400"
    >
      {label}
      {active ? (
        direction === 'asc' ? (
          <ArrowUp aria-hidden="true" className="h-3.5 w-3.5" />
        ) : (
          <ArrowDown aria-hidden="true" className="h-3.5 w-3.5" />
        )
      ) : (
        <ArrowUpDown aria-hidden="true" className="h-3.5 w-3.5 text-neutral-400" />
      )}
    </button>
  )
}

interface AdminTablePaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  pageSize: number
  itemLabel: string
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
}

function getPageItems(currentPage: number, totalPages: number): Array<number | 'ellipsis'> {
  if (totalPages <= 6) return Array.from({ length: totalPages }, (_, index) => index + 1)

  const pages: Array<number | 'ellipsis'> = [1]
  if (currentPage > 3) pages.push('ellipsis')
  for (
    let page = Math.max(2, currentPage - 1);
    page <= Math.min(totalPages - 1, currentPage + 1);
    page++
  ) {
    pages.push(page)
  }
  if (currentPage < totalPages - 2) pages.push('ellipsis')
  pages.push(totalPages)
  return pages
}

export function AdminTablePagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  itemLabel,
  onPageChange,
  onPageSizeChange,
}: Readonly<AdminTablePaginationProps>) {
  const safeTotalPages = Math.max(totalPages, 1)
  const from = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const to = Math.min(currentPage * pageSize, totalItems)

  return (
    <div className="flex flex-col gap-3 border-t border-neutral-200 bg-neutral-50/50 px-4 py-3.5 text-sm text-neutral-700 dark:border-neutral-800 dark:bg-neutral-800/30 dark:text-neutral-300 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-3">
        <span>
          Menampilkan{' '}
          <strong className="text-neutral-950 dark:text-white">
            {from}-{to}
          </strong>{' '}
          dari <strong className="text-neutral-950 dark:text-white">{totalItems}</strong>{' '}
          {itemLabel}
        </span>
        <label className="inline-flex items-center gap-2 whitespace-nowrap">
          <span className="text-neutral-600 dark:text-neutral-400">Baris per halaman</span>
          <select
            value={pageSize}
            onChange={(event) => onPageSizeChange(Number(event.target.value))}
            aria-label="Jumlah baris per halaman"
            className="rounded-lg border border-neutral-300 bg-white px-2 py-1.5 text-sm font-semibold text-neutral-800 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={18}>18</option>
            <option value={25}>25</option>
          </select>
        </label>
      </div>
      <div className="flex items-center gap-1.5 self-end sm:self-auto">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage <= 1}
          aria-label="Halaman sebelumnya"
          className="inline-flex h-9 items-center gap-1 rounded-lg border border-neutral-300 bg-white px-2.5 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Sebelumnya</span>
        </button>
        <div className="flex items-center gap-1">
          {getPageItems(currentPage, safeTotalPages).map((page, index) =>
            page === 'ellipsis' ? (
              <span key={`ellipsis-${index}`} className="px-1 text-neutral-500">
                …
              </span>
            ) : (
              <button
                key={page}
                type="button"
                onClick={() => onPageChange(page)}
                aria-label={`Buka halaman ${page}`}
                aria-current={currentPage === page ? 'page' : undefined}
                className={`h-9 min-w-9 rounded-lg px-2 text-sm font-bold transition ${
                  currentPage === page
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800'
                }`}
              >
                {page}
              </button>
            )
          )}
        </div>
        <button
          type="button"
          onClick={() => onPageChange(Math.min(safeTotalPages, currentPage + 1))}
          disabled={currentPage >= safeTotalPages}
          aria-label="Halaman berikutnya"
          className="inline-flex h-9 items-center gap-1 rounded-lg border border-neutral-300 bg-white px-2.5 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
        >
          <span className="hidden sm:inline">Selanjutnya</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
