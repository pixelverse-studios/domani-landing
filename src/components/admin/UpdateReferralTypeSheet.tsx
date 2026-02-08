'use client'

import { useState } from 'react'
import { Sheet } from './Sheet'
import { WaitlistEntry } from '@/hooks/useWaitlist'

interface UpdateReferralTypeSheetProps {
  isOpen: boolean
  onClose: () => void
  selectedEntries: WaitlistEntry[]
  onSubmit: (referralType: string) => void
  isLoading?: boolean
}

// Referral type options for the dropdown
const REFERRAL_TYPE_OPTIONS = [
  { value: 'early_adopter', label: 'Early Adopter' },
  { value: 'friends_family', label: 'Friends & Family' },
  { value: 'beta_tester', label: 'Beta' },
] as const

export function UpdateReferralTypeSheet({
  isOpen,
  onClose,
  selectedEntries,
  onSubmit,
  isLoading = false,
}: UpdateReferralTypeSheetProps) {
  const [selectedType, setSelectedType] = useState<string>('early_adopter')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedType) {
      onSubmit(selectedType)
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      setSelectedType('early_adopter') // Reset to default
      onClose()
    }
  }

  return (
    <Sheet
      isOpen={isOpen}
      onClose={handleClose}
      title="Update Referral Type"
      width="md"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Info Section */}
        <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
          <p className="text-sm text-blue-800">
            You are about to update the referral type for{' '}
            <span className="font-semibold">{selectedEntries.length}</span>{' '}
            selected {selectedEntries.length === 1 ? 'entry' : 'entries'}.
          </p>
        </div>

        {/* Selected Emails Preview */}
        {selectedEntries.length <= 5 && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Selected Entries:
            </label>
            <div className="space-y-1">
              {selectedEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="text-sm text-gray-600 truncate"
                >
                  {entry.email}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Referral Type Dropdown */}
        <div className="space-y-2">
          <label
            htmlFor="referral-type"
            className="block text-sm font-medium text-gray-700"
          >
            New Referral Type
          </label>
          <select
            id="referral-type"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            disabled={isLoading}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {REFERRAL_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Warning for Large Updates */}
        {selectedEntries.length > 10 && (
          <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-4">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> You are updating a large number of entries.
              This action cannot be undone.
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={handleClose}
            disabled={isLoading}
            className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-700 hover:bg-gray-50:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading || !selectedType}
            className="flex-1 rounded-lg bg-primary-600 px-4 py-2.5 text-white hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="h-4 w-4 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Updating...
              </span>
            ) : (
              'Update Referral Type'
            )}
          </button>
        </div>
      </form>
    </Sheet>
  )
}