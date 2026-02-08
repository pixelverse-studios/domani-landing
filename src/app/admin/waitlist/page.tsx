'use client'

import { useState, useMemo, useCallback } from 'react'
import { DataTable } from '@/components/admin/DataTable'
import {
  useWaitlist,
  useDeleteWaitlistEntries,
  useUpdateWaitlistStatus,
  useUpdateReferralType,
  useExportWaitlist,
  WaitlistEntry,
} from '@/hooks/useWaitlist'
import { UpdateReferralTypeSheet } from '@/components/admin/UpdateReferralTypeSheet'
import { ColumnDef } from '@tanstack/react-table'
import {
  MoreHorizontal,
  Mail,
  Calendar,
  CheckCircle,
  Clock,
  UserCheck,
  Trash2,
  Tag,
  Users,
} from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

// Status badge component
function StatusBadge({ status }: { status: string }) {
  const config = {
    pending: { icon: Clock, label: 'Pending', className: 'bg-yellow-100 text-yellow-800' },
    invited: { icon: Mail, label: 'Invited', className: 'bg-blue-100 text-blue-800' },
    confirmed: { icon: CheckCircle, label: 'Confirmed', className: 'bg-green-100 text-green-800' },
    registered: { icon: UserCheck, label: 'Registered', className: 'bg-purple-100 text-purple-800' },
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
        className="p-2 rounded-lg hover:bg-gray-100:bg-gray-700 transition-colors"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 rounded-lg border border-gray-200 bg-white shadow-lg z-20">
            <div className="p-1">
              {entry.status !== 'invited' && (
                <button
                  onClick={() => {
                    onStatusChange('invited')
                    setIsOpen(false)
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-left text-sm rounded hover:bg-gray-100:bg-gray-700"
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
                  className="flex items-center gap-2 w-full px-3 py-2 text-left text-sm rounded hover:bg-gray-100:bg-gray-700"
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
                  className="flex items-center gap-2 w-full px-3 py-2 text-left text-sm rounded hover:bg-gray-100:bg-gray-700"
                >
                  <Clock className="h-4 w-4" />
                  Mark as Pending
                </button>
              )}
              <div className="h-px bg-gray-200 my-1" />
              <button
                onClick={() => {
                  onDelete()
                  setIsOpen(false)
                }}
                className="flex items-center gap-2 w-full px-3 py-2 text-left text-sm rounded hover:bg-red-50:bg-red-900/20 text-red-600"
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
  // const [page, setPage] = useState(1)
  // const [pageSize, setPageSize] = useState(1000) // Load all records (adjust if you have more)
  const [selectedRows, setSelectedRows] = useState<WaitlistEntry[]>([])
  const [statusFilter, setStatusFilter] = useState('all')
  const [isReferralSheetOpen, setIsReferralSheetOpen] = useState(false)

  // Queries and mutations
  const { data, isLoading } = useWaitlist({
    page: 1, // Always load first page since we're loading all
    limit: 500, // Load up to 500 records by default
    status: statusFilter
  })
  const deleteEntries = useDeleteWaitlistEntries()
  const updateStatus = useUpdateWaitlistStatus()
  const updateReferralType = useUpdateReferralType()
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

  // Handle bulk referral type update
  const handleBulkReferralTypeUpdate = useCallback((referralType: string) => {
    const ids = selectedRows.map(row => row.id)
    updateReferralType.mutate(
      { ids, referralType },
      {
        onSuccess: () => {
          setSelectedRows([])
          setIsReferralSheetOpen(false)
        },
      }
    )
  }, [selectedRows, updateReferralType])

  // Handle export
  const handleExport = useCallback(() => {
    exportWaitlist.mutate({ status: statusFilter === 'all' ? undefined : statusFilter })
  }, [statusFilter, exportWaitlist])

  // // Handle pagination changes
  // const handlePageChange = useCallback((newPage: number) => {
  //   setPage(newPage)
  //   setSelectedRows([])
  // }, [])

  // const handlePageSizeChange = useCallback((newPageSize: number) => {
  //   setPageSize(newPageSize)
  //   setPage(1) // Reset to first page when changing page size
  //   setSelectedRows([])
  // }, [])

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
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: 'referralType',
      header: 'Referral Type',
      cell: ({ row }) => {
        const type = row.original.referralType || 'website'
        const typeLabels: Record<string, string> = {
          website: 'Website',
          early_adopter: 'Early Adopter',
          friends_family: 'Friends & Family',
          beta_tester: 'Beta Tester',
          vip: 'VIP',
          partner: 'Partner',
          influencer: 'Influencer',
          employee: 'Employee',
          investor: 'Investor',
          press: 'Press',
          other: 'Other'
        }
        return typeLabels[type] || type
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Joined',
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-gray-500">
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
    <div className="flex flex-col h-full p-8 overflow-hidden">
      {/* Page Header */}
      <div className="mb-8 flex-shrink-0">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Waitlist Management
        </h1>
        <p className="text-gray-500">
          Manage your waitlist subscribers and track signups
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 flex-shrink-0">
        <div className="p-6 bg-white rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Total Signups</span>
            <Users className="h-4 w-4 text-gray-400" />
          </div>
          <p className="text-2xl font-bold">{data?.total || 0}</p>
        </div>

        <div className="p-6 bg-white rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Pending</span>
            <Clock className="h-4 w-4 text-yellow-500" />
          </div>
          <p className="text-2xl font-bold">
            {data?.stats?.pending || 0}
          </p>
        </div>

        <div className="p-6 bg-white rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Invited</span>
            <Mail className="h-4 w-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold">
            {data?.stats?.invited || 0}
          </p>
        </div>

        <div className="p-6 bg-white rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Registered</span>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </div>
          <p className="text-2xl font-bold">
            {data?.stats?.registered || 0}
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 mb-6 p-1 bg-gray-100 rounded-lg w-fit flex-shrink-0">
        {['all', 'pending', 'invited', 'registered'].map((status) => (
          <button
            key={status}
            onClick={() => {
              setStatusFilter(status)
              // setPage(1) // Reset to first page when changing filter
              setSelectedRows([]) // Clear selection when changing filter
            }}
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-md transition-colors capitalize',
              statusFilter === status
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900:text-white'
            )}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Bulk Actions */}
      {selectedRows.length > 0 && (
        <div className="mb-4 p-4 bg-primary-50 rounded-lg flex items-center justify-between flex-shrink-0">
          <span className="text-sm text-primary-600">
            {selectedRows.length} item(s) selected
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setIsReferralSheetOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm bg-white rounded border border-gray-200 hover:bg-gray-50:bg-gray-700"
            >
              <Tag className="h-4 w-4" />
              Update Referral Type
            </button>
            <button
              onClick={() => handleBulkStatusChange('invited')}
              className="flex items-center gap-2 px-3 py-1.5 text-sm bg-white rounded border border-gray-200 hover:bg-gray-50:bg-gray-700"
            >
              <Mail className="h-4 w-4" />
              Mark as Invited
            </button>
            <button
              onClick={handleBulkDelete}
              className="flex items-center gap-2 px-3 py-1.5 text-sm bg-white rounded border border-red-200 text-red-600 hover:bg-red-50:bg-red-900/20"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Data Table - Scrollable Container */}
      <div className="flex-1 overflow-auto min-h-0">
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
          serverSidePagination={false}  // Disable server-side pagination
        />
      </div>

      {/* Update Referral Type Sheet */}
      <UpdateReferralTypeSheet
        isOpen={isReferralSheetOpen}
        onClose={() => setIsReferralSheetOpen(false)}
        selectedEntries={selectedRows}
        onSubmit={handleBulkReferralTypeUpdate}
        isLoading={updateReferralType.isPending}
      />
    </div>
  )
}