'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useTheme } from '@/lib/theme-context'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function SettingsPage() {
  const { logout, user } = useAuth()
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  
  const [notifications, setNotifications] = useState(true)
  const [soundEffects, setSoundEffects] = useState(true)
  const [highContrast, setHighContrast] = useState(false)
  const [largeText, setLargeText] = useState(false)

  // Load settings from localStorage
  useEffect(() => {
    try {
      const settings = localStorage.getItem('userSettings')
      if (settings) {
        const parsed = JSON.parse(settings)
        setNotifications(parsed.notifications ?? true)
        setSoundEffects(parsed.soundEffects ?? true)
        setHighContrast(parsed.highContrast ?? false)
        setLargeText(parsed.largeText ?? false)
      }
    } catch (error) {
      console.warn('Failed to load settings:', error)
    }
  }, [])

  // Save settings to localStorage
  const saveSettings = () => {
    try {
      const settings = {
        notifications,
        soundEffects,
        highContrast,
        largeText
      }
      localStorage.setItem('userSettings', JSON.stringify(settings))
      toast.success('Settings saved successfully!')
    } catch (error) {
      console.error('Failed to save settings:', error)
      toast.error('Failed to save settings. Please try again.')
    }
  }

  const handleSignOut = () => {
    logout()
    toast.success('Signed out successfully')
    router.push('/login')
  }

  const exportData = () => {
    try {
      const data = {
        user,
        settings: { notifications, soundEffects, highContrast, largeText, theme },
        exportDate: new Date().toISOString()
      }
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `health-ai-data-${new Date().toISOString().split('T')[0]}.json`
      a.click()
      URL.revokeObjectURL(url)
      toast.success('Data exported successfully!')
    } catch (error) {
      console.error('Failed to export data:', error)
      toast.error('Failed to export data. Please try again.')
    }
  }

  const themes = [
    { name: 'Light', value: 'light' as const, color: 'bg-white', selected: theme === 'light' },
    { name: 'Telegram', value: 'dark' as const, color: 'bg-blue-500', selected: theme === 'dark' },
    { name: 'Discord', value: 'blue' as const, color: 'bg-indigo-500', selected: theme === 'blue' },
    { name: 'Spotify', value: 'green' as const, color: 'bg-green-500', selected: theme === 'green' },
  ]

  return (
    <div className="min-h-screen p-8" style={{backgroundColor: 'var(--bg-primary)'}}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{color: 'var(--text-primary)'}}>Settings & Customization</h1>
          <p style={{color: 'var(--text-secondary)'}}>Personalize your experience</p>
        </div>

        {/* Accessibility Settings */}
        <div className="rounded-xl p-6 mb-6" style={{backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)'}}>
          <h2 className="text-xl font-bold mb-4" style={{color: 'var(--text-primary)'}}>Accessibility</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg" style={{backgroundColor: 'var(--bg-tertiary)'}}>
              <div>
                <h3 className="font-semibold" style={{color: 'var(--text-primary)'}}>High Contrast Mode</h3>
                <p className="text-sm" style={{color: 'var(--text-secondary)'}}>Increase visual contrast for better readability</p>
              </div>
              <button
                onClick={() => setHighContrast(!highContrast)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  highContrast ? 'bg-blue-600' : ''
                }`}
                style={{
                  backgroundColor: highContrast ? 'var(--accent-color)' : '#d1d5db'
                }}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    highContrast ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg" style={{backgroundColor: 'var(--bg-tertiary)'}}>
              <div>
                <h3 className="font-semibold" style={{color: 'var(--text-primary)'}}>Large Text</h3>
                <p className="text-sm" style={{color: 'var(--text-secondary)'}}>Increase font size throughout the app</p>
              </div>
              <button
                onClick={() => setLargeText(!largeText)}
                className={`w-12 h-6 rounded-full transition-colors`}
                style={{
                  backgroundColor: largeText ? 'var(--accent-color)' : '#d1d5db'
                }}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    largeText ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg" style={{backgroundColor: 'var(--bg-tertiary)'}}>
              <div>
                <h3 className="font-semibold" style={{color: 'var(--text-primary)'}}>Sound Effects</h3>
                <p className="text-sm" style={{color: 'var(--text-secondary)'}}>Play sounds for interactions and rewards</p>
              </div>
              <button
                onClick={() => setSoundEffects(!soundEffects)}
                className={`w-12 h-6 rounded-full transition-colors`}
                style={{
                  backgroundColor: soundEffects ? 'var(--accent-color)' : '#d1d5db'
                }}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    soundEffects ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Theme Selection */}
        <div className="rounded-xl border border-gray-200 p-6 mb-6" style={{backgroundColor: 'var(--bg-secondary)'}}>
          <h2 className="text-xl font-bold mb-4" style={{color: 'var(--text-primary)'}}>Theme</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {themes.map((themeOption, idx) => (
              <button
                key={idx}
                onClick={() => setTheme(themeOption.value)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  themeOption.selected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className={`w-full h-16 ${themeOption.color} rounded-lg mb-2 border border-gray-200`} />
                <p className="text-sm font-semibold text-gray-900">{themeOption.name}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="rounded-xl p-6 mb-6" style={{backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)'}}>
          <h2 className="text-xl font-bold mb-4" style={{color: 'var(--text-primary)'}}>Notifications</h2>
          
          <div className="flex items-center justify-between p-4 rounded-lg" style={{backgroundColor: 'var(--bg-tertiary)'}}>
            <div>
              <h3 className="font-semibold" style={{color: 'var(--text-primary)'}}>Push Notifications</h3>
              <p className="text-sm" style={{color: 'var(--text-secondary)'}}>Receive reminders and updates</p>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`w-12 h-6 rounded-full transition-colors`}
              style={{
                backgroundColor: notifications ? 'var(--accent-color)' : '#d1d5db'
              }}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  notifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Data & Privacy */}
        <div className="rounded-xl p-6 mb-6" style={{backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)'}}>
          <h2 className="text-xl font-bold mb-4" style={{color: 'var(--text-primary)'}}>Data & Privacy</h2>
          <div className="space-y-3">
            <button 
              onClick={exportData}
              className="w-full text-left px-4 py-3 rounded-lg hover:opacity-80 transition"
              style={{backgroundColor: 'var(--bg-tertiary)'}}
            >
              <span className="font-medium" style={{color: 'var(--text-primary)'}}>Export Data</span>
            </button>
            <a 
              href="https://aws.amazon.com/compliance/data-privacy-faq/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block w-full text-left px-4 py-3 rounded-lg hover:opacity-80 transition"
              style={{backgroundColor: 'var(--bg-tertiary)'}}
            >
              <span className="font-medium" style={{color: 'var(--text-primary)'}}>Privacy Policy</span>
            </a>
            <button className="w-full text-left px-4 py-3 rounded-lg hover:opacity-80 transition" style={{backgroundColor: 'var(--bg-tertiary)'}}>
              <span className="font-medium" style={{color: 'var(--text-primary)'}}>Terms of Service</span>
            </button>
          </div>
        </div>

        {/* Account Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            onClick={saveSettings}
            className="px-6 py-3 text-white font-semibold rounded-lg hover:opacity-90 transition"
            style={{backgroundColor: 'var(--accent-color)'}}
          >
            Save Changes
          </button>
          <button 
            onClick={handleSignOut}
            className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}
