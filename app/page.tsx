'use client'

import { useEffect, useMemo, useState } from 'react'
import { AlertTriangle, TrendingUp, Users, DollarSign, CheckCircle2, Zap } from 'lucide-react'
import { TopNavigation } from '@/components/TopNavigation'
import { MetricCard } from '@/components/MetricCard'
import { FlightList } from '@/components/FlightList'
import { FlightDetailsPanel } from '@/components/FlightDetailsPanel'
import { fetchPredictedFlights, type FlightApiInput } from '@/lib/model-api'

type FlightStatus = 'critical' | 'warning' | 'safe'

interface Flight {
  id: string
  carrier: string
  route: string
  departureTime: string
  disruptionProbability: number
  affectedPassengers: number
  status: FlightStatus
}

// Mock data for flights
const mockFlights: Flight[] = [
  {
    id: 'RAM101',
    carrier: 'RAM',
    route: 'CMN → JFK',
    departureTime: '14:30',
    disruptionProbability: 85,
    affectedPassengers: 284,
    status: 'critical',
  },
  {
    id: 'RAM202',
    carrier: 'RAM',
    route: 'CMN → LHR',
    departureTime: '16:15',
    disruptionProbability: 45,
    affectedPassengers: 156,
    status: 'warning',
  },
  {
    id: 'RAM303',
    carrier: 'RAM',
    route: 'RAK → CDG',
    departureTime: '18:45',
    disruptionProbability: 65,
    affectedPassengers: 198,
    status: 'warning',
  },
  {
    id: 'RAM404',
    carrier: 'RAM',
    route: 'CMN → AMS',
    departureTime: '13:00',
    disruptionProbability: 12,
    affectedPassengers: 145,
    status: 'safe',
  },
  {
    id: 'RAM505',
    carrier: 'RAM',
    route: 'RAK → BCN',
    departureTime: '19:30',
    disruptionProbability: 73,
    affectedPassengers: 212,
    status: 'warning',
  },
]

// Mock passenger data
const mockPassengers = [
  { id: 'P001', ticketClass: 'First', loyaltyStatus: 'Platinum' },
  { id: 'P002', ticketClass: 'Business', loyaltyStatus: 'Gold' },
  { id: 'P003', ticketClass: 'Business', loyaltyStatus: 'Gold' },
  { id: 'P004', ticketClass: 'Economy', loyaltyStatus: 'Silver' },
  { id: 'P005', ticketClass: 'Economy', loyaltyStatus: 'None' },
  { id: 'P006', ticketClass: 'First', loyaltyStatus: 'Platinum' },
  { id: 'P007', ticketClass: 'Business', loyaltyStatus: 'Silver' },
  { id: 'P008', ticketClass: 'Economy', loyaltyStatus: 'Gold' },
]

export default function Page() {
  const [flights, setFlights] = useState<Flight[]>(mockFlights)
  const [selectedFlight, setSelectedFlight] = useState<Flight>(mockFlights[0])
  const [hub, setHub] = useState('Casablanca CMN')
  const [modelStatus, setModelStatus] = useState('Connecting to model...')

  useEffect(() => {
    let active = true

    const loadPredictions = async () => {
      const requestFlights: FlightApiInput[] = mockFlights.map((flight) => ({
        flight_id: flight.id,
        carrier: flight.carrier,
        route: flight.route,
        departure_time: flight.departureTime,
        hub,
        affected_passengers: flight.affectedPassengers,
        features: {
          disruption_probability_hint: flight.disruptionProbability / 100,
          passenger_count: flight.affectedPassengers,
        },
      }))

      try {
        const response = await fetchPredictedFlights(requestFlights)

        if (!active) {
          return
        }

        const nextFlights = response.flights.map((flight, index) => ({
          ...mockFlights[index],
          disruptionProbability: Math.round(flight.delay_probability * 100),
          status: flight.status,
        }))

        setFlights(nextFlights)
        setSelectedFlight((currentFlight) => nextFlights.find((flight) => flight.id === currentFlight.id) ?? nextFlights[0])
        setModelStatus(response.model_ready && !response.used_fallback ? `Model live: ${response.source}` : `Fallback mode: ${response.source}`)
      } catch {
        if (!active) {
          return
        }

        setFlights(mockFlights)
        setSelectedFlight(mockFlights[0])
        setModelStatus('Fallback mode: backend unavailable')
      }
    }

    void loadPredictions()

    return () => {
      active = false
    }
  }, [hub])

  // Calculate metrics
  const metrics = useMemo(() => {
    const criticalAlerts = flights.filter((f) => f.status === 'critical').length
    const affectedPassengers = flights.reduce((sum, f) => sum + f.affectedPassengers, 0)
    const protectedMargin = 87.3
    const automatedRebookings = 256

    return {
      disruptionAlerts: criticalAlerts,
      affectedPassengers,
      protectedMargin,
      automatedRebookings,
    }
  }, [flights])

  // Financial penalties calculation
  const financialData = useMemo(() => {
    if (!selectedFlight) return null

    const euPenalty = selectedFlight.disruptionProbability > 70 ? 28500 : selectedFlight.disruptionProbability > 40 ? 18000 : 9000
    const hotelCost = selectedFlight.affectedPassengers * 85
    const churnPenalty = selectedFlight.affectedPassengers * 245

    const totalStandard = euPenalty + hotelCost + churnPenalty
    const optimizedCost = Math.round(totalStandard * 0.42)

    return {
      euPenalty,
      hotelCost,
      churnPenalty,
      totalStandard,
      optimizedCost,
      savings: totalStandard - optimizedCost,
    }
  }, [selectedFlight])

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* TOP NAVIGATION & STATS */}
      <TopNavigation hub={hub} setHub={setHub} modelStatus={modelStatus} />

      {/* METRICS BAR */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="max-w-8xl mx-auto px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              icon={<AlertTriangle className="w-5 h-5" />}
              label="Total Disruption Risk Alerts"
              value={metrics.disruptionAlerts}
              unit="Stage 1"
              trend="up"
            />
            <MetricCard
              icon={<Users className="w-5 h-5" />}
              label="Affected Moroccan Passengers"
              value={metrics.affectedPassengers}
              unit="active manifests"
              trend="down"
            />
            <MetricCard
              icon={<DollarSign className="w-5 h-5" />}
              label="Protected Profit Margin"
              value={metrics.protectedMargin}
              unit="%"
              trend="up"
            />
            <MetricCard
              icon={<CheckCircle2 className="w-5 h-5" />}
              label="Total Automated Rebookings"
              value={metrics.automatedRebookings}
              unit="Stage 2 success"
              trend="up"
            />
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-8xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT PANEL - FLIGHT PREDICTION */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-lg overflow-hidden flex flex-col h-full">
              <div className="bg-gradient-to-r from-card to-card/50 border-b border-border px-6 py-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-risk-amber" />
                <h2 className="text-lg font-semibold">
                  Stage 1: AI Flight Delay Prediction
                </h2>
              </div>

              <div className="overflow-y-auto flex-1 max-h-[600px]">
                <FlightList
                  flights={flights}
                  selectedFlight={selectedFlight}
                  onSelectFlight={setSelectedFlight}
                />
              </div>
            </div>
          </div>

          {/* RIGHT PANEL - FINANCIAL OPTIMIZATION */}
          <div className="lg:col-span-2">
            {selectedFlight && (
              <FlightDetailsPanel
                flight={selectedFlight}
                passengers={mockPassengers}
                financialData={financialData}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
