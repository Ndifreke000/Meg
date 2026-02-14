import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'

import './globals.css'

const _geist = Geist({ subsets: ['latin'] })
const _geistMono = Geist_Mono({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'v0 App',
  description: 'Created with v0',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-gray-50">
        <div className="flex h-screen">
          {/* Sidebar */}
          <aside className="w-64 bg-white border-r border-gray-200 flex flex-col overflow-y-auto">
            <div className="p-6">
              <div className="bg-blue-600 text-white rounded-lg px-4 py-2 mb-4 inline-flex items-center gap-2">
                <span className="text-xl">👤</span>
                <span className="font-semibold text-sm">Family Dashboard</span>
              </div>
            </div>

            <nav className="flex-1 px-4 space-y-1">
              <a
                href="/"
                className="block px-4 py-3 rounded-lg text-blue-600 bg-blue-50 font-medium text-sm"
              >
                🏠 Home Dashboard
              </a>
              <a
                href="/daily-wellness"
                className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 font-medium text-sm"
              >
                😊 Daily Wellness
              </a>
              <a
                href="/profiles"
                className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 font-medium text-sm"
              >
                👥 Profiles & Setup
              </a>
              <a
                href="/meal-plan"
                className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 font-medium text-sm"
              >
                🍽️ AI meal Plan - Gel
              </a>
              <a
                href="/sensory-schedule"
                className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 font-medium text-sm"
              >
                🎵 Sensory & schedule
              </a>
              <a
                href="/programs"
                className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 font-medium text-sm"
              >
                📋 Programs & analytics
              </a>
              <a
                href="/support-network"
                className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 font-medium text-sm"
              >
                🤝 Group coordination
              </a>

              <div className="pt-6 mt-6 border-t border-gray-200">
                <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Preferences
                </h3>
                <a
                  href="/settings"
                  className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 font-medium text-sm"
                >
                  ⚙️ Customization
                </a>
              </div>
            </nav>

            <div className="p-4 border-t border-gray-200">
              <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">
                Sign out
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </body>
    </html>
  )
}
