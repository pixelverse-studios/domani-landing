export interface Benefit {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  statistic: {
    value: number
    suffix: string
    label: string
  }
  citation: {
    authors: string
    year: number
    title: string
    journal?: string
    url?: string
  }
  visual?: React.ReactNode
}