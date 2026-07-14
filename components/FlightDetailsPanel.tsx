import { Zap, Users, DollarSign, TrendingUp } from 'lucide-react'
import { formatCurrency } from '@/lib/formatters'

interface Flight {
  id: string
  carrier: string
  route: string
  departureTime: string
  disruptionProbability: number
  affectedPassengers: number
  status: 'critical' | 'warning' | 'safe'
}

interface Passenger {
  id: string
  ticketClass: string
  loyaltyStatus: string
}

interface FinancialData {
  euPenalty: number
  hotelCost: number
  churnPenalty: number
  totalStandard: number
  optimizedCost: number
  savings: number
}

interface FlightDetailsPanelProps {
  flight: Flight
  passengers: Passenger[]
  financialData: FinancialData | null
}

const loyaltyColors = {
  Platinum: 'bg-gradient-to-r from-yellow-400 to-yellow-200 text-background',
  Gold: 'bg-gradient-to-r from-yellow-500 to-orange-400 text-background',
  Silver: 'bg-gradient-to-r from-gray-300 to-gray-100 text-background',
  None: 'bg-muted text-muted-foreground',
}

const classColors = {
  First: 'bg-safe-emerald/15 text-safe-emerald border-safe-emerald/30',
  Business: 'bg-risk-amber/15 text-risk-amber border-risk-amber/30',
  Economy: 'bg-muted/50 text-muted-foreground border-muted/30',
}

export function FlightDetailsPanel({
  flight,
  passengers,
  financialData,
}: FlightDetailsPanelProps) {
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="bg-card border border-border rounded-lg p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">{flight.id} - {flight.route}</h2>
            <p className="text-muted-foreground">
              Departure: {flight.departureTime} • Passengers: {flight.affectedPassengers}
            </p>
          </div>
          <button className="px-6 py-2 bg-safe-emerald hover:bg-safe-emerald/90 text-background font-semibold rounded-lg transition-colors flex items-center gap-2">
            <Zap className="w-4 h-4" />
            OPTIMIZE CHANNELS
          </button>
        </div>
      </div>

      {/* PASSENGER MANIFEST */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-card to-card/50 border-b border-border px-6 py-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-risk-amber" />
          <h3 className="text-lg font-semibold">Passenger Manifest Overview</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-background/30">
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Passenger ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Ticket Class</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Loyalty Status</th>
              </tr>
            </thead>
            <tbody>
              {passengers.map((passenger, idx) => (
                <tr key={passenger.id} className={idx % 2 === 0 ? 'bg-background/20' : ''}>
                  <td className="px-6 py-3 text-sm font-medium">{passenger.id}</td>
                  <td className="px-6 py-3">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${
                        classColors[passenger.ticketClass as keyof typeof classColors]
                      }`}
                    >
                      {passenger.ticketClass}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        loyaltyColors[passenger.loyaltyStatus as keyof typeof loyaltyColors]
                      }`}
                    >
                      {passenger.loyaltyStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FINANCIAL BREAKDOWN & OPTIMIZATION */}
      {financialData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Financial Penalty Breakdown */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center gap-2 mb-6">
              <DollarSign className="w-5 h-5 text-risk-amber" />
              <h3 className="text-lg font-semibold">Financial Penalty Live Breakdown</h3>
            </div>

            <div className="space-y-4">
              <div className="pb-4 border-b border-border/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">EU261/Regulatory Cash Penalties</span>
                  <span className="text-sm font-semibold">{formatCurrency(financialData.euPenalty)}</span>
                </div>
                <p className="text-xs text-muted-foreground">Distance-based compensation</p>
              </div>

              <div className="pb-4 border-b border-border/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Overnight Care Cost</span>
                  <span className="text-sm font-semibold">{formatCurrency(financialData.hotelCost)}</span>
                </div>
                <p className="text-xs text-muted-foreground">Hotel rooms + food vouchers</p>
              </div>

              <div className="pb-4 border-b border-border/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Predicted Customer Churn Penalty</span>
                  <span className="text-sm font-semibold">{formatCurrency(financialData.churnPenalty)}</span>
                </div>
                <p className="text-xs text-muted-foreground">Elite loyalty impact weighted</p>
              </div>

              <div className="pt-4 border-t border-border/50">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">Total Standard Mitigation</span>
                  <span className="text-lg font-bold text-alert-crimson">{formatCurrency(financialData.totalStandard)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Optimized Redirection Output */}
          <div className="bg-card border border-border rounded-lg p-6 flex flex-col">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-safe-emerald" />
              <h3 className="text-lg font-semibold">Optimized Redirection Output</h3>
            </div>

            <div className="flex-1 flex flex-col gap-4">
              {/* Left Side - Standard */}
              <div className="flex-1">
                <p className="text-xs text-muted-foreground mb-3 font-semibold uppercase">Standard Mitigation Cost</p>
                <div className="bg-background/50 border border-border rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-foreground mb-2">
                    {formatCurrency(financialData.totalStandard)}
                  </div>
                  <p className="text-xs text-muted-foreground">Blind rebooking rule</p>
                </div>
              </div>

              <div className="flex items-center justify-center text-muted-foreground">→</div>

              {/* Right Side - AI Optimized (Emerald Highlight) */}
              <div className="flex-1">
                <p className="text-xs text-safe-emerald mb-3 font-semibold uppercase">AI Optimized Rebooking Path</p>
                <div className="bg-gradient-to-br from-safe-emerald/20 to-safe-emerald/10 border-2 border-safe-emerald rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-safe-emerald mb-2">
                    {formatCurrency(financialData.optimizedCost)}
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">Minimal loss route</p>
                  <div className="text-sm font-semibold text-safe-emerald">
                    💾 Save {formatCurrency(financialData.savings)}
                  </div>
                </div>
              </div>
            </div>

            {/* Efficiency Percentage */}
            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Cost Reduction</span>
                <span className="text-lg font-bold text-safe-emerald">
                  {Math.round((financialData.savings / financialData.totalStandard) * 100)}%
                </span>
              </div>
              <div className="w-full h-2 bg-background rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-safe-emerald to-safe-emerald/60"
                  style={{ width: `${(financialData.savings / financialData.totalStandard) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
