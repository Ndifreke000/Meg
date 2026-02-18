'use client'

import { createContext, useContext, useState, useEffect } from 'react'

type Theme = 'light' | 'dark' | 'blue' | 'green'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// Complete theme definitions with all CSS variables
const themeConfigs = {
  light: {
    '--bg-primary': '#faf9f7',
    '--bg-secondary': '#f5f3f0',
    '--bg-tertiary': '#ede9e4',
    '--text-primary': '#1f2937',
    '--text-secondary': '#6b7280',
    '--border-color': '#e5dfd7',
    '--accent-color': '#2563eb',
    '--accent-secondary': '#f97316',
    '--accent-tertiary': '#14b8a6',
  },
  dark: {
    '--bg-primary': '#1a1a1a',
    '--bg-secondary': '#252525',
    '--bg-tertiary': '#323232',
    '--text-primary': '#f5f3f0',
    '--text-secondary': '#b8b4af',
    '--border-color': '#3d3d3d',
    '--accent-color': '#3b82f6',
    '--accent-secondary': '#f97316',
    '--accent-tertiary': '#14b8a6',
  },
  blue: {
    '--bg-primary': '#eff6ff',
    '--bg-secondary': '#dbeafe',
    '--bg-tertiary': '#bfdbfe',
    '--text-primary': '#1e40af',
    '--text-secondary': '#1e3a8a',
    '--border-color': '#93c5fd',
    '--accent-color': '#2563eb',
    '--accent-secondary': '#3b82f6',
    '--accent-tertiary': '#60a5fa',
  },
  green: {
    '--bg-primary': '#f0fdf4',
    '--bg-secondary': '#dcfce7',
    '--bg-tertiary': '#bbf7d0',
    '--text-primary': '#166534',
    '--text-secondary': '#15803d',
    '--border-color': '#86efac',
    '--accent-color': '#16a34a',
    '--accent-secondary': '#22c55e',
    '--accent-tertiary': '#4ade80',
  },
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      const savedTheme = localStorage.getItem('theme') as Theme
      if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'blue' || savedTheme === 'green')) {
        setTheme(savedTheme)
        applyTheme(savedTheme)
      } else {
        applyTheme('light')
      }
    } catch (error) {
      console.warn('[v0] Failed to load theme:', error)
      applyTheme('light')
    }
  }, [])

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement
    
    // Remove existing theme classes
    root.classList.remove('theme-light', 'theme-dark', 'theme-blue', 'theme-green')
    
    // Apply new theme class
    root.classList.add(`theme-${newTheme}`)
    
    // Set all CSS variables
    const config = themeConfigs[newTheme]
    Object.entries(config).forEach(([key, value]) => {
      root.style.setProperty(key, value)
    })
    
    console.log('[v0] Theme applied:', newTheme)
  }

  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme)
    applyTheme(newTheme)
    try {
      localStorage.setItem('theme', newTheme)
      console.log('[v0] Theme saved to localStorage:', newTheme)
    } catch (error) {
      console.warn('[v0] Failed to save theme:', error)
    }
  }

  if (!mounted) {
    return <div style={{ backgroundColor: '#faf9f7' }}>{children}</div>
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}
