'use client'

import { ChevronDown, Activity, Moon, Sun } from 'lucide-react'
import { useTheme } from '@/lib/theme-context'

interface TopNavigationProps {
  hub: string
  setHub: (hub: string) => void
}

export function TopNavigation({ hub, setHub }: TopNavigationProps) {
  const hubs = ['Casablanca CMN', 'Marrakech RAK', 'Fez FEZ', 'Tangier TNG']
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-8xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* LEFT: Logo and Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-safe-emerald to-safe-emerald/60 rounded-lg flex items-center justify-center">
            <Activity className="w-6 h-6 text-background" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">RAM-IRROPS</h1>
            <p className="text-xs text-muted-foreground">Predictive Passenger Redirection</p>
          </div>
        </div>

        {/* CENTER: Status */}
        <div className="flex items-center gap-3 px-4 py-2 bg-background/50 rounded-lg border border-border">
          <div className="w-2 h-2 bg-safe-emerald rounded-full animate-pulse" />
          <span className="text-sm font-medium">System Active</span>
        </div>

        {/* RIGHT: Hub Selector and Theme Toggle */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm text-muted-foreground">Hub:</label>
            <div className="relative inline-block">
              <select
                value={hub}
                onChange={(e) => setHub(e.target.value)}
                className="appearance-none bg-background border border-border rounded-lg px-4 py-2 pr-8 text-foreground cursor-pointer hover:border-muted-foreground transition-colors"
              >
                {hubs.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-muted-foreground" />
            </div>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg border border-border bg-background hover:bg-card transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4 text-foreground" />
            ) : (
              <Sun className="w-4 h-4 text-foreground" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
