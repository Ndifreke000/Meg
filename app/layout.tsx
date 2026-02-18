'use client'

import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { QueryProvider } from '@/lib/query-provider'
import { ProfileProvider } from '@/lib/profile-context'
import { AuthProvider } from '@/lib/auth-context'
import { ThemeProvider } from '@/lib/theme-context'
import { Toaster } from '@/components/ui/sonner'

import './globals.css'

const _geist = Geist({ subsets: ['latin'] })
const _geistMono = Geist_Mono({ subsets: ['latin'] })

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { logout, user } = useAuth()

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
    { href: '/emergency', label: '🚨 Emergency' },
    { href: '/medications', label: '💊 Medications' },
    { href: '/reports', label: '📊 Reports' },
    { href: '/offline', label: '📱 Offline Mode' },
  ]

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

  const handleSignOut = () => {
    logout()
    window.location.href = '/login'
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 flex flex-col overflow-y-auto flex-shrink-0" style={{backgroundColor: 'var(--bg-secondary)', borderRight: '1px solid var(--border-color)'}}>
        <div className="p-6">
          <div className="rounded-lg px-4 py-2 mb-4 inline-flex items-center gap-2" style={{backgroundColor: 'var(--accent-color)', color: '#FFFFFF'}}>
            <span className="text-xl">🏥</span>
            <span className="font-semibold text-sm">Yosellins</span>
          </div>
          {user && (
            <p className="text-sm" style={{color: 'var(--text-secondary)'}}>Welcome, {user.full_name}</p>
          )}
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`block px-4 py-3 rounded-lg font-medium text-sm transition-colors ${
                isActive(item.href)
                  ? 'text-blue-600 bg-blue-50'
                  : 'hover:opacity-80'
              }`}
              style={{
                color: isActive(item.href) ? 'var(--accent-color)' : 'var(--text-primary)',
                backgroundColor: isActive(item.href) ? 'var(--bg-tertiary)' : 'transparent'
              }}
            >
              {item.label}
            </a>
          ))}

          <div className="pt-6 mt-6" style={{borderTop: '1px solid var(--border-color)'}}>
            <h3 className="px-4 text-xs font-semibold uppercase tracking-wider mb-3" style={{color: 'var(--text-secondary)'}}>
              Preferences
            </h3>
            <a
              href="/settings"
              className={`block px-4 py-3 rounded-lg font-medium text-sm transition-colors ${
                isActive('/settings')
                  ? 'text-blue-600 bg-blue-50'
                  : 'hover:opacity-80'
              }`}
              style={{
                color: isActive('/settings') ? 'var(--accent-color)' : 'var(--text-primary)',
                backgroundColor: isActive('/settings') ? 'var(--bg-tertiary)' : 'transparent'
              }}
            >
              ⚙️ Customization
            </a>
          </div>
        </nav>

        <div className="p-4" style={{borderTop: '1px solid var(--border-color)'}}>
          <button 
            onClick={handleSignOut}
            className="w-full px-4 py-2 rounded-lg text-sm font-medium hover:opacity-80 transition"
            style={{backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)'}}
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  )
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased" style={{backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)'}}>
        <QueryProvider>
          <AuthProvider>
            <ProfileProvider>
              <ThemeProvider>
                <LayoutContent>{children}</LayoutContent>
                <Toaster />
              </ThemeProvider>
            </ProfileProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
