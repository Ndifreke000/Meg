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

  const navSections = [
    {
      label: 'Main',
      items: [
        { href: '/', label: 'Home Dashboard' }
      ]
    },
    {
      label: 'My Child',
      items: [
        { href: '/profiles', label: 'Profiles & Setup' },
        { href: '/daily-wellness', label: 'Daily Wellness' },
        { href: '/medications', label: 'Medications' }
      ]
    },
    {
      label: 'Activities',
      items: [
        { href: '/focus-activities', label: 'Focus Activities' },
        { href: '/sensory-schedule', label: 'Sensory & Schedule' },
        { href: '/programs', label: 'Programs & Analytics' },
        { href: '/ai-chat', label: 'AI Assistant' }
      ]
    },
    {
      label: 'Health & Care',
      items: [
        { href: '/meal-plan', label: 'AI Meal Plan' },
        { href: '/support-network', label: 'Support Network' },
        { href: '/reports', label: 'Reports' },
        { href: '/emergency', label: 'Emergency' }
      ]
    }
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

        <nav className="flex-1 px-4 space-y-6 overflow-y-auto">
          {navSections.map((section) => (
            <div key={section.label}>
              <h3 className="px-3 text-xs font-semibold uppercase tracking-widest mb-2" style={{color: 'var(--text-secondary)'}}>
                {section.label}
              </h3>
              <div className="space-y-1">
                {section.items.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="block px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 hover:scale-105"
                    style={{
                      color: isActive(item.href) ? '#ffffff' : 'var(--text-primary)',
                      backgroundColor: isActive(item.href) ? 'var(--accent-color)' : 'transparent',
                      fontWeight: isActive(item.href) ? '600' : '500'
                    }}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          ))}

          <div className="pt-2" style={{borderTop: '1px solid var(--border-color)'}}>
            <h3 className="px-3 text-xs font-semibold uppercase tracking-widest mb-2" style={{color: 'var(--text-secondary)'}}>
              Preferences
            </h3>
            <a
              href="/settings"
              className="block px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 hover:scale-105"
              style={{
                color: isActive('/settings') ? '#ffffff' : 'var(--text-primary)',
                backgroundColor: isActive('/settings') ? 'var(--accent-color)' : 'transparent',
                fontWeight: isActive('/settings') ? '600' : '500'
              }}
            >
              Customization
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
    <html lang="en" style={{
      '--bg-primary': '#faf9f7',
      '--bg-secondary': '#f5f3f0',
      '--bg-tertiary': '#ede9e4',
      '--text-primary': '#1f2937',
      '--text-secondary': '#6b7280',
      '--border-color': '#e5dfd7',
      '--accent-color': '#2563eb',
      '--accent-secondary': '#f97316',
      '--accent-tertiary': '#14b8a6',
    } as any}>
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
