'use client'

import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { usePathname } from 'next/navigation'

import './globals.css'

const _geist = Geist({ subsets: ['latin'] })
const _geistMono = Geist_Mono({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()

  const navItems = [
    { href: '/', label: '🏠 Home Dashboard' },
    { href: '/daily-wellness', label: '😊 Daily Wellness' },
    { href: '/profiles', label: '👥 Profiles & Setup' },
    { href: '/meal-plan', label: '🍽️ AI Meal Plan' },
    { href: '/sensory-schedule', label: '🎵 Sensory & Schedule' },
    { href: '/programs', label: '📋 Programs & Analytics' },
    { href: '/support-network', label: '🤝 Support Network' },
    { href: '/focus-activities', label: '🎮 Focus Activities' },
    { href: '/ai-chat', label: '💬 AI Assistant' },
  ]

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

  return (
    <html lang="en">
      <body className="font-sans antialiased bg-gray-50">
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar */}
          <aside className="w-64 bg-white border-r border-gray-200 flex flex-col overflow-y-auto flex-shrink-0">
            <div className="p-6">
              <div className="bg-blue-600 text-white rounded-lg px-4 py-2 mb-4 inline-flex items-center gap-2">
                <span className="text-xl">👤</span>
                <span className="font-semibold text-sm">Family Dashboard</span>
              </div>
            </div>

            <nav className="flex-1 px-4 space-y-1">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={`block px-4 py-3 rounded-lg font-medium text-sm transition-colors ${
                    isActive(item.href)
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </a>
              ))}

              <div className="pt-6 mt-6 border-t border-gray-200">
                <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Preferences
                </h3>
                <a
                  href="/settings"
                  className={`block px-4 py-3 rounded-lg font-medium text-sm transition-colors ${
                    isActive('/settings')
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
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
