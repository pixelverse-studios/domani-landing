import { Check, X, Minus } from 'lucide-react'
import type { FeatureComparison } from '@/lib/compare/competitors'

interface ComparisonTableProps {
  features: FeatureComparison[]
  competitorName: string
}

function CellValue({ value }: { value: string | boolean }) {
  if (value === true) return <Check className="mx-auto h-5 w-5 text-primary-600" />
  if (value === false) return <X className="mx-auto h-5 w-5 text-gray-300" />
  return <span>{value}</span>
}

export function ComparisonTable({ features, competitorName }: ComparisonTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b-2 border-primary-100">
            <th className="py-3 pr-4 font-medium text-gray-500">Feature</th>
            <th className="px-4 py-3 text-center font-semibold text-primary-700">Domani</th>
            <th className="px-4 py-3 text-center font-semibold text-gray-700">{competitorName}</th>
          </tr>
        </thead>
        <tbody>
          {features.map((row) => (
            <tr key={row.feature} className="border-b border-gray-100">
              <td className="py-3 pr-4 font-medium text-gray-700">{row.feature}</td>
              <td className="px-4 py-3 text-center text-gray-600">
                <CellValue value={row.domani} />
              </td>
              <td className="px-4 py-3 text-center text-gray-600">
                <CellValue value={row.competitor} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
