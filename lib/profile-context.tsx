'use client'

import { createContext, useContext, useState, useEffect } from 'react'

interface ProfileContextType {
  currentProfileId: string | null
  setCurrentProfileId: (id: string | null) => void
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined)

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [currentProfileId, setCurrentProfileId] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    setMounted(true)
    try {
      const stored = localStorage.getItem('currentProfileId')
      if (stored) setCurrentProfileId(stored)
    } catch (error) {
      console.warn('Failed to load profile from localStorage:', error)
    }
  }, [])

  // Save to localStorage when changed
  useEffect(() => {
    if (!mounted) return
    
    try {
      if (currentProfileId) {
        localStorage.setItem('currentProfileId', currentProfileId)
      } else {
        localStorage.removeItem('currentProfileId')
      }
    } catch (error) {
      console.warn('Failed to save profile to localStorage:', error)
    }
  }, [currentProfileId, mounted])

  return (
    <ProfileContext.Provider value={{ currentProfileId, setCurrentProfileId }}>
      {children}
    </ProfileContext.Provider>
  )
}

export function useCurrentProfile() {
  const context = useContext(ProfileContext)
  if (!context) {
    throw new Error('useCurrentProfile must be used within ProfileProvider')
  }
  return context
}
