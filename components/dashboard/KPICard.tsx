import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface KPICardProps {
  title: string
  value: number | string
  icon: React.ReactNode
  trend?: number
  trendLabel?: string
  subtitle?: string
}

export function KPICard({
  title,
  value,
  icon,
  trend,
  trendLabel,
  subtitle,
}: KPICardProps) {
  const isPositive = trend !== undefined && trend >= 0
  const trendColor = isPositive ? 'text-green-600' : 'text-red-600'
  const trendBgColor = isPositive ? 'bg-green-50' : 'bg-red-50'

  return (
    <Card className="border border-gray-200 bg-white hover:shadow-2xl hover:scale-105 hover:border-black transition-all duration-300 cursor-pointer">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-medium text-gray-700">{title}</CardTitle>
        <div className="text-gray-400 group-hover:text-black transition-colors duration-300">{icon}</div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-3xl font-bold text-black">{value}</div>
        {trend !== undefined && (
          <div className={`flex items-center gap-2 text-sm ${trendColor}`}>
            {isPositive ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            <span className={`font-semibold px-2 py-1 rounded ${trendBgColor}`}>
              {isPositive ? '+' : ''}{trend}% {trendLabel || 'vs last period'}
            </span>
          </div>
        )}
        {subtitle && (
          <p className="text-xs text-gray-500">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  )
}
