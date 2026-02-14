'use client'

import { useState } from 'react'

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
  })

  const [preferences, setPreferences] = useState({
    theme: 'light',
    language: 'english',
    timeFormat: '12h',
  })

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Customization & Settings</h1>
          <p className="text-gray-600">Manage preferences and system configuration</p>
        </div>

        {/* Display Settings */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Display Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <label className="text-gray-700 font-medium">Theme</label>
              <select
                value={preferences.theme}
                onChange={(e) => setPreferences({ ...preferences, theme: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="auto">Auto</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <label className="text-gray-700 font-medium">Language</label>
              <select
                value={preferences.language}
                onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="english">English</option>
                <option value="spanish">Spanish</option>
                <option value="french">French</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <label className="text-gray-700 font-medium">Time Format</label>
              <select
                value={preferences.timeFormat}
                onChange={(e) => setPreferences({ ...preferences, timeFormat: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="12h">12-hour</option>
                <option value="24h">24-hour</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Notification Preferences</h2>
          <div className="space-y-3">
            {[
              { key: 'email', label: 'Email Notifications', description: 'Receive updates via email' },
              { key: 'sms', label: 'SMS Alerts', description: 'Receive urgent alerts via text' },
              { key: 'push', label: 'Push Notifications', description: 'Receive app notifications' },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-700">{item.label}</p>
                  <p className="text-xs text-gray-600">{item.description}</p>
                </div>
                <button
                  onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key as keyof typeof notifications] })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications[item.key as keyof typeof notifications] ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications[item.key as keyof typeof notifications] ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Privacy & Security */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Privacy & Security</h2>
          <div className="space-y-3">
            <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
              <p className="font-medium text-gray-700">Change Password</p>
              <p className="text-xs text-gray-600 mt-1">Update your account password</p>
            </button>
            <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
              <p className="font-medium text-gray-700">Two-Factor Authentication</p>
              <p className="text-xs text-gray-600 mt-1">Enable additional security</p>
            </button>
            <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
              <p className="font-medium text-gray-700">Data Privacy Policy</p>
              <p className="text-xs text-gray-600 mt-1">Review how your data is used</p>
            </button>
          </div>
        </div>

        {/* Account Management */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Account Management</h2>
          <div className="space-y-3">
            <button className="w-full px-4 py-3 bg-orange-50 text-orange-600 font-semibold rounded-lg hover:bg-orange-100 transition">
              Export My Data
            </button>
            <button className="w-full px-4 py-3 bg-red-50 text-red-600 font-semibold rounded-lg hover:bg-red-100 transition">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
