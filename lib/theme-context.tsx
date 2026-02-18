'use client'

import { createContext, useContext, useState, useEffect } from 'react'

type Theme = 'light' | 'dark' | 'blue' | 'green'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      const savedTheme = localStorage.getItem('theme') as Theme
      if (savedTheme) {
        setTheme(savedTheme)
        applyTheme(savedTheme)
      }
    } catch (error) {
      console.warn('Failed to load theme:', error)
    }
  }, [])

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement
    
    // Remove existing theme classes
    root.classList.remove('theme-light', 'theme-dark', 'theme-blue', 'theme-green')
    
    // Apply new theme
    root.classList.add(`theme-${newTheme}`)
    
    // Set CSS variables
    switch (newTheme) {
      case 'dark':
        root.style.setProperty('--bg-primary', '#0f172a')
        root.style.setProperty('--bg-secondary', '#1e293b')
        root.style.setProperty('--text-primary', '#f8fafc')
        root.style.setProperty('--text-secondary', '#cbd5e1')
        break
      case 'blue':
        root.style.setProperty('--bg-primary', '#eff6ff')
        root.style.setProperty('--bg-secondary', '#dbeafe')
        root.style.setProperty('--text-primary', '#1e40af')
        root.style.setProperty('--text-secondary', '#3730a3')
        break
      case 'green':
        root.style.setProperty('--bg-primary', '#f0fdf4')
        root.style.setProperty('--bg-secondary', '#dcfce7')
        root.style.setProperty('--text-primary', '#166534')
        root.style.setProperty('--text-secondary', '#15803d')
        break
      default: // light
        root.style.setProperty('--bg-primary', '#ffffff')
        root.style.setProperty('--bg-secondary', '#f8fafc')
        root.style.setProperty('--text-primary', '#0f172a')
        root.style.setProperty('--text-secondary', '#475569')
    }
  }

  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme)
    applyTheme(newTheme)
    try {
      localStorage.setItem('theme', newTheme)
    } catch (error) {
      console.warn('Failed to save theme:', error)
    }
  }

  if (!mounted) return null

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