import { Check, X } from 'lucide-react'
import type { FeatureComparison } from '@/lib/compare/competitors'
import { cn } from '@/lib/utils'

interface ComparisonTableProps {
  features: FeatureComparison[]
  competitorName: string
}

function CellValue({ value, highlight }: { value: string | boolean; highlight?: boolean }) {
  if (value === true) {
    return <Check className={cn('mx-auto h-5 w-5', highlight ? 'text-primary-600' : 'text-gray-400')} />
  }
  if (value === false) {
    return <X className="mx-auto h-4 w-4 text-gray-200" />
  }
  return (
    <span className={cn('text-[13px] font-medium', highlight ? 'text-primary-700' : 'text-gray-500')}>
      {value}
    </span>
  )
}

export function ComparisonTable({ features, competitorName }: ComparisonTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr>
            <th className="pb-3 pr-6 text-left text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400">
              Feature
            </th>
            <th className="pb-3 px-4 text-center text-[11px] font-semibold uppercase tracking-[0.1em] text-primary-600">
              Domani
            </th>
            <th className="pb-3 px-4 text-center text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400">
              {competitorName}
            </th>
          </tr>
        </thead>
        <tbody>
          {features.map((row, i) => (
            <tr key={row.feature}>
              <td className={cn(
                'py-3.5 pr-6 font-medium text-gray-700',
                i < features.length - 1 && 'border-b border-gray-50'
              )}>
                {row.feature}
              </td>
              <td className={cn(
                'bg-primary-50/30 px-4 py-3.5 text-center',
                i < features.length - 1 && 'border-b border-primary-100/30'
              )}>
                <CellValue value={row.domani} highlight />
              </td>
              <td className={cn(
                'px-4 py-3.5 text-center',
                i < features.length - 1 && 'border-b border-gray-50'
              )}>
                <CellValue value={row.competitor} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
