'use client'

import { useState } from 'react'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  Row,
} from '@tanstack/react-table'
import {
  ArrowUpDown,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  X,
  Download,
  Filter,
  MoreHorizontal,
  Check,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  searchKey?: string
  searchPlaceholder?: string
  enableRowSelection?: boolean
  onRowSelectionChange?: (rows: Row<TData>[]) => void
  onExport?: () => void
  isLoading?: boolean
  emptyMessage?: string
  // Server-side pagination props
  serverSidePagination?: boolean
  totalRows?: number
  currentPage?: number
  pageSize?: number
  totalPages?: number
  onPageChange?: (page: number) => void
  onPageSizeChange?: (pageSize: number) => void
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  searchPlaceholder = 'Search...',
  enableRowSelection = false,
  onRowSelectionChange,
  onExport,
  isLoading = false,
  emptyMessage = 'No results found.',
  serverSidePagination = false,
  totalRows = 0,
  currentPage = 1,
  pageSize = 10,
  totalPages = 1,
  onPageChange,
  onPageSizeChange,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState('')

  const table = useReactTable({
    data,
    columns: enableRowSelection
      ? [
          {
            id: 'select',
            header: ({ table }) => (
              <div className="px-1">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-primary focus:ring-primary"
                  checked={table.getIsAllPageRowsSelected()}
                  onChange={(e) => table.toggleAllPageRowsSelected(!!e.target.checked)}
                  aria-label="Select all"
                />
              </div>
            ),
            cell: ({ row }) => (
              <div className="px-1">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-primary focus:ring-primary"
                  checked={row.getIsSelected()}
                  onChange={(e) => row.toggleSelected(!!e.target.checked)}
                  aria-label="Select row"
                />
              </div>
            ),
            enableSorting: false,
            enableHiding: false,
            size: 40,
          },
          ...columns,
        ]
      : columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: serverSidePagination ? undefined : getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: serverSidePagination ? undefined : getFilteredRowModel(),
    manualPagination: serverSidePagination,
    manualFiltering: serverSidePagination,
    pageCount: serverSidePagination ? totalPages : undefined,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: (updater) => {
      setRowSelection(updater)
      if (onRowSelectionChange) {
        const newSelection = typeof updater === 'function' ? updater(rowSelection) : updater
        const selectedRows = table.getFilteredSelectedRowModel().rows
        onRowSelectionChange(selectedRows)
      }
    },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: 'includesString',
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
      ...(serverSidePagination && {
        pagination: {
          pageIndex: currentPage - 1,
          pageSize: pageSize,
        },
      }),
    },
  })

  return (
    <div className="space-y-4">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        {/* Search */}
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="h-10 w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          {globalFilter && (
            <button
              onClick={() => setGlobalFilter('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {/* Export Button */}
          {onExport && (
            <button
              onClick={onExport}
              className="flex items-center gap-2 h-10 px-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium transition-colors"
            >
              <Download className="h-4 w-4" />
              Export
            </button>
          )}

          {/* Column Visibility Dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-2 h-10 px-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium transition-colors">
              <Filter className="h-4 w-4" />
              Columns
              <ChevronDown className="h-4 w-4" />
            </button>
            <div className="absolute right-0 mt-2 w-48 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              <div className="p-2">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => (
                    <label
                      key={column.id}
                      className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-primary focus:ring-primary"
                        checked={column.getIsVisible()}
                        onChange={(e) => column.toggleVisibility(!!e.target.checked)}
                      />
                      <span className="text-sm capitalize">
                        {column.id.replace(/_/g, ' ')}
                      </span>
                    </label>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Rows Info */}
      {enableRowSelection && Object.keys(rowSelection).length > 0 && (
        <div className="flex items-center justify-between px-4 py-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
          <span className="text-sm text-primary-600 dark:text-primary-400">
            {Object.keys(rowSelection).length} of {table.getFilteredRowModel().rows.length} row(s) selected
          </span>
          <button
            onClick={() => setRowSelection({})}
            className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
          >
            Clear selection
          </button>
        </div>
      )}

      {/* Table */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                {table.getHeaderGroups().map((headerGroup) => (
                  headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="h-12 px-6 text-left align-middle font-medium text-sm text-gray-700 dark:text-gray-300"
                      style={{
                        width: header.column.getSize(),
                      }}
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          className={cn(
                            'flex items-center gap-2',
                            header.column.getCanSort() && 'cursor-pointer select-none hover:text-gray-900 dark:hover:text-gray-100'
                          )}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {header.column.getCanSort() && (
                            <ArrowUpDown className="h-4 w-4 text-gray-400" />
                          )}
                        </div>
                      )}
                    </th>
                  ))
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                // Loading skeleton
                Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index} className="border-b border-gray-200 dark:border-gray-700">
                    {table.getHeaderGroups()[0].headers.map((header) => (
                      <td key={header.id} className="h-14 px-6">
                        <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className={cn(
                      'border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors',
                      row.getIsSelected() && 'bg-primary-50/50 dark:bg-primary-900/10'
                    )}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="h-14 px-6 text-sm text-gray-900 dark:text-gray-100"
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length + (enableRowSelection ? 1 : 0)}
                    className="h-32 text-center text-gray-500 dark:text-gray-400"
                  >
                    {emptyMessage}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <span>Showing</span>
          <select
            value={serverSidePagination ? pageSize : table.getState().pagination.pageSize}
            onChange={(e) => {
              const newPageSize = Number(e.target.value)
              if (serverSidePagination && onPageSizeChange) {
                onPageSizeChange(newPageSize)
              } else {
                table.setPageSize(newPageSize)
              }
            }}
            className="h-8 w-20 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {[10, 20, 30, 40, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <span>
            of {serverSidePagination ? totalRows : table.getFilteredRowModel().rows.length} result(s)
          </span>
        </div>

        <div className="flex items-center gap-1">
          {serverSidePagination ? (
            <>
              <button
                onClick={() => onPageChange?.(1)}
                disabled={currentPage === 1}
                className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronsLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => onPageChange?.(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {/* Page Numbers */}
              <div className="flex items-center gap-1 px-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Page {currentPage} of {totalPages}
                </span>
              </div>

              <button
                onClick={() => onPageChange?.(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => onPageChange?.(totalPages)}
                disabled={currentPage === totalPages}
                className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronsRight className="h-4 w-4" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
                className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronsLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {/* Page Numbers */}
              <div className="flex items-center gap-1 px-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Page {table.getState().pagination.pageIndex + 1} of{' '}
                  {table.getPageCount()}
                </span>
              </div>

              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
                className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronsRight className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}