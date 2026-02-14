'use client'

import { useState } from 'react'

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true)
  const [soundEffects, setSoundEffects] = useState(true)
  const [highContrast, setHighContrast] = useState(false)
  const [largeText, setLargeText] = useState(false)

  const themes = [
    { name: 'Light', color: 'bg-white', selected: true },
    { name: 'Dark', color: 'bg-gray-900', selected: false },
    { name: 'Blue', color: 'bg-blue-500', selected: false },
    { name: 'Green', color: 'bg-green-500', selected: false },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings & Customization</h1>
          <p className="text-gray-600">Personalize your experience</p>
        </div>

        {/* Accessibility Settings */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Accessibility</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-semibold text-gray-900">High Contrast Mode</h3>
                <p className="text-sm text-gray-600">Increase visual contrast for better readability</p>
              </div>
              <button
                onClick={() => setHighContrast(!highContrast)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  highContrast ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    highContrast ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-semibold text-gray-900">Large Text</h3>
                <p className="text-sm text-gray-600">Increase font size throughout the app</p>
              </div>
              <button
                onClick={() => setLargeText(!largeText)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  largeText ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    largeText ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-semibold text-gray-900">Sound Effects</h3>
                <p className="text-sm text-gray-600">Play sounds for interactions and rewards</p>
              </div>
              <button
                onClick={() => setSoundEffects(!soundEffects)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  soundEffects ? 'bg-blue-600' : 'bg-gray-300'
                }`}
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
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Theme</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {themes.map((theme, idx) => (
              <button
                key={idx}
                className={`p-4 rounded-xl border-2 transition-all ${
                  theme.selected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className={`w-full h-16 ${theme.color} rounded-lg mb-2 border border-gray-200`} />
                <p className="text-sm font-semibold text-gray-900">{theme.name}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Notifications</h2>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-semibold text-gray-900">Push Notifications</h3>
              <p className="text-sm text-gray-600">Receive reminders and updates</p>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`w-12 h-6 rounded-full transition-colors ${
                notifications ? 'bg-blue-600' : 'bg-gray-300'
              }`}
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
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Data & Privacy</h2>
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
              <span className="font-medium text-gray-900">Export Data</span>
            </button>
            <button className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
              <span className="font-medium text-gray-900">Privacy Policy</span>
            </button>
            <button className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
              <span className="font-medium text-gray-900">Terms of Service</span>
            </button>
          </div>
        </div>

        {/* Account Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
            Save Changes
          </button>
          <button className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition">
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}
