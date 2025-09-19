'use client'

import { useState, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { DataTable } from '@/components/admin/DataTable'
import {
  useWaitlist,
  useDeleteWaitlistEntries,
  useUpdateWaitlistStatus,
  useExportWaitlist,
  WaitlistEntry,
} from '@/hooks/useWaitlist'
import { ColumnDef, Row } from '@tanstack/react-table'
import {
  MoreHorizontal,
  Mail,
  Calendar,
  CheckCircle,
  Clock,
  UserCheck,
  Trash2,
  Download,
  Send,
} from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

// Status badge component
function StatusBadge({ status }: { status: string }) {
  const config = {
    pending: { icon: Clock, label: 'Pending', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' },
    invited: { icon: Mail, label: 'Invited', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' },
    registered: { icon: CheckCircle, label: 'Registered', className: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' },
  }

  const { icon: Icon, label, className } = config[status as keyof typeof config] || config.pending

  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium', className)}>
      <Icon className="h-3 w-3" />
      {label}
    </span>
  )
}

// Action dropdown component
function ActionMenu({
  entry,
  onStatusChange,
  onDelete,
}: {
  entry: WaitlistEntry
  onStatusChange: (status: string) => void
  onDelete: () => void
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg z-20">
            <div className="p-1">
              {entry.status !== 'invited' && (
                <button
                  onClick={() => {
                    onStatusChange('invited')
                    setIsOpen(false)
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-left text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Mail className="h-4 w-4" />
                  Mark as Invited
                </button>
              )}
              {entry.status !== 'registered' && (
                <button
                  onClick={() => {
                    onStatusChange('registered')
                    setIsOpen(false)
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-left text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <UserCheck className="h-4 w-4" />
                  Mark as Registered
                </button>
              )}
              {entry.status !== 'pending' && (
                <button
                  onClick={() => {
                    onStatusChange('pending')
                    setIsOpen(false)
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-left text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Clock className="h-4 w-4" />
                  Mark as Pending
                </button>
              )}
              <div className="h-px bg-gray-200 dark:bg-gray-700 my-1" />
              <button
                onClick={() => {
                  onDelete()
                  setIsOpen(false)
                }}
                className="flex items-center gap-2 w-full px-3 py-2 text-left text-sm rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default function WaitlistPage() {
  const router = useRouter()
  const [page, setPage] = useState(1)
  const [selectedRows, setSelectedRows] = useState<WaitlistEntry[]>([])
  const [statusFilter, setStatusFilter] = useState('all')

  // Queries and mutations
  const { data, isLoading } = useWaitlist({ page, limit: 10, status: statusFilter })
  const deleteEntries = useDeleteWaitlistEntries()
  const updateStatus = useUpdateWaitlistStatus()
  const exportWaitlist = useExportWaitlist()

  // Handle individual status change
  const handleStatusChange = useCallback((entryId: string, status: string) => {
    updateStatus.mutate({ ids: [entryId], status })
  }, [updateStatus])

  // Handle individual delete
  const handleDelete = useCallback((entryId: string) => {
    deleteEntries.mutate([entryId])
  }, [deleteEntries])

  // Handle bulk actions
  const handleBulkStatusChange = useCallback((status: string) => {
    const ids = selectedRows.map(row => row.id)
    updateStatus.mutate({ ids, status })
    setSelectedRows([])
  }, [selectedRows, updateStatus])

  const handleBulkDelete = useCallback(() => {
    const ids = selectedRows.map(row => row.id)
    deleteEntries.mutate(ids)
    setSelectedRows([])
  }, [selectedRows, deleteEntries])

  // Handle export
  const handleExport = useCallback(() => {
    exportWaitlist.mutate({ status: statusFilter === 'all' ? undefined : statusFilter })
  }, [statusFilter, exportWaitlist])

  // Table columns
  const columns = useMemo<ColumnDef<WaitlistEntry>[]>(() => [
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-gray-400" />
          <span className="font-medium">{row.original.email}</span>
        </div>
      ),
    },
    {
      accessorKey: 'firstName',
      header: 'Name',
      cell: ({ row }) => row.original.firstName || '-',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: 'source',
      header: 'Source',
      cell: ({ row }) => row.original.source || 'Direct',
    },
    {
      accessorKey: 'createdAt',
      header: 'Joined',
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
          <Calendar className="h-4 w-4" />
          <span className="text-sm">
            {format(new Date(row.original.createdAt), 'MMM d, yyyy')}
          </span>
        </div>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <ActionMenu
          entry={row.original}
          onStatusChange={(status) => handleStatusChange(row.original.id, status)}
          onDelete={() => handleDelete(row.original.id)}
        />
      ),
    },
  ], [handleStatusChange, handleDelete])

  return (
    <div className="p-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Waitlist Management
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Manage your waitlist subscribers and track signups
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Total Signups</span>
            <Users className="h-4 w-4 text-gray-400" />
          </div>
          <p className="text-2xl font-bold">{data?.total || 0}</p>
        </div>

        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Pending</span>
            <Clock className="h-4 w-4 text-yellow-500" />
          </div>
          <p className="text-2xl font-bold">
            {data?.entries?.filter((e: WaitlistEntry) => e.status === 'pending').length || 0}
          </p>
        </div>

        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Invited</span>
            <Mail className="h-4 w-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold">
            {data?.entries?.filter((e: WaitlistEntry) => e.status === 'invited').length || 0}
          </p>
        </div>

        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Registered</span>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </div>
          <p className="text-2xl font-bold">
            {data?.entries?.filter((e: WaitlistEntry) => e.status === 'registered').length || 0}
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 mb-6 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg w-fit">
        {['all', 'pending', 'invited', 'registered'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-md transition-colors capitalize',
              statusFilter === status
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            )}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Bulk Actions */}
      {selectedRows.length > 0 && (
        <div className="mb-4 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg flex items-center justify-between">
          <span className="text-sm text-primary-600 dark:text-primary-400">
            {selectedRows.length} item(s) selected
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => handleBulkStatusChange('invited')}
              className="flex items-center gap-2 px-3 py-1.5 text-sm bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <Mail className="h-4 w-4" />
              Mark as Invited
            </button>
            <button
              onClick={handleBulkDelete}
              className="flex items-center gap-2 px-3 py-1.5 text-sm bg-white dark:bg-gray-800 rounded border border-red-200 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={data?.entries || []}
        searchPlaceholder="Search by email or name..."
        enableRowSelection={true}
        onRowSelectionChange={(rows) => {
          setSelectedRows(rows.map(r => r.original))
        }}
        onExport={handleExport}
        isLoading={isLoading}
        emptyMessage="No waitlist entries found."
      />
    </div>
  )
}

// Add Users import to the imports at the top
import { Users } from 'lucide-react'