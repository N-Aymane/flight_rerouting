import { AlertCircle, AlertTriangle } from 'lucide-react'

interface Flight {
  id: string
  carrier: string
  route: string
  departureTime: string
  disruptionProbability: number
  affectedPassengers: number
  status: 'critical' | 'warning' | 'safe'
}

interface FlightListProps {
  flights: Flight[]
  selectedFlight: Flight
  onSelectFlight: (flight: Flight) => void
}

const statusConfig = {
  critical: {
    bg: 'bg-alert-crimson/10',
    border: 'border-alert-crimson/30',
    badge: 'bg-alert-crimson/20 text-alert-crimson',
    icon: AlertTriangle,
  },
  warning: {
    bg: 'bg-risk-amber/10',
    border: 'border-risk-amber/30',
    badge: 'bg-risk-amber/20 text-risk-amber',
    icon: AlertCircle,
  },
  safe: {
    bg: 'bg-safe-emerald/10',
    border: 'border-safe-emerald/30',
    badge: 'bg-safe-emerald/20 text-safe-emerald',
    icon: AlertCircle,
  },
}

export function FlightList({ flights, selectedFlight, onSelectFlight }: FlightListProps) {
  return (
    <div className="divide-y divide-border">
      {flights.map((flight) => {
        const config = statusConfig[flight.status]
        const StatusIcon = config.icon
        const isSelected = selectedFlight.id === flight.id

        return (
          <div
            key={flight.id}
            onClick={() => onSelectFlight(flight)}
            className={`p-4 cursor-pointer transition-all border-l-4 ${
              isSelected ? `${config.bg} ${config.border} border-l-current` : 'hover:bg-background/50 border-l-transparent'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-foreground">{flight.id}</span>
                  <span className="text-xs text-muted-foreground">{flight.carrier}</span>
                </div>
                <p className="text-sm text-muted-foreground">{flight.route}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">{flight.departureTime}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <StatusIcon className="w-4 h-4" style={{ color: 'currentColor' }} />
                  <span className="text-xs text-muted-foreground">Disruption Risk</span>
                </div>

                {/* Disruption Probability Badge */}
                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${config.badge} flex items-center gap-1`}>
                  {flight.status === 'critical' && <span className="w-1.5 h-1.5 bg-current rounded-full animate-pulse" />}
                  {flight.disruptionProbability}%
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{flight.affectedPassengers} passengers</span>
                <div className="w-16 h-1.5 bg-background rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      flight.status === 'critical'
                        ? 'bg-alert-crimson'
                        : flight.status === 'warning'
                          ? 'bg-risk-amber'
                          : 'bg-safe-emerald'
                    }`}
                    style={{
                      width: `${flight.disruptionProbability}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
