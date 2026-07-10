import { TrendingUp, TrendingDown } from 'lucide-react'
import { ReactNode } from 'react'

interface MetricCardProps {
  icon: ReactNode
  label: string
  value: number | string
  unit: string
  trend: 'up' | 'down'
}

export function MetricCard({ icon, label, value, unit, trend }: MetricCardProps) {
  const trendColor = trend === 'up' ? 'text-safe-emerald' : 'text-risk-amber'
  const TrendIcon = trend === 'up' ? TrendingUp : TrendingDown

  return (
    <div className="bg-gradient-to-br from-card to-card/60 border border-border rounded-lg p-5 hover:border-muted-foreground transition-all hover:shadow-lg hover:shadow-safe-emerald/10">
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 bg-background rounded-lg flex items-center justify-center text-muted-foreground">
          {icon}
        </div>
        <TrendIcon className={`w-4 h-4 ${trendColor}`} />
      </div>

      <p className="text-sm text-muted-foreground mb-2">{label}</p>

      <div className="space-y-1">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold tracking-tight">{value}</span>
          <span className="text-xs text-muted-foreground">{unit}</span>
        </div>
      </div>
    </div>
  )
}
