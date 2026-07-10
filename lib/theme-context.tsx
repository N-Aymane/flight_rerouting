'use client'

import React, { createContext, useContext, useCallback, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Get stored theme, defaulting to light
    const storedTheme = localStorage.getItem('theme') as Theme | null
    const initialTheme = storedTheme || 'light'
    
    setTheme(initialTheme)
    applyTheme(initialTheme)
    setMounted(true)
  }, [])

  const applyTheme = useCallback((newTheme: Theme) => {
    const html = document.documentElement
    
    // Remove both classes first to ensure clean state
    html.classList.remove('light', 'dark')
    
    // Add the appropriate class
    html.classList.add(newTheme)
    
    // Update CSS variables
    localStorage.setItem('theme', newTheme)
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light'
      applyTheme(newTheme)
      return newTheme
    })
  }, [applyTheme])

  // Ensure theme is applied when it changes
  useEffect(() => {
    if (mounted) {
      applyTheme(theme)
    }
  }, [theme, mounted, applyTheme])

  if (!mounted) {
    return <>{children}</>
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    return { theme: 'light' as Theme, toggleTheme: () => {} }
  }
  return context
}
