'use client'

import { useState } from 'react'
import { useProfiles, useLogMood, useRoutines, useUpdateRoutineStatus, useAIInsights } from '@/hooks/use-api'
import { useCurrentProfile } from '@/lib/profile-context'
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/skeleton'

export default function Page() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  
  const { data: profiles, isLoading: profilesLoading } = useProfiles()
  const { currentProfileId, setCurrentProfileId } = useCurrentProfile()
  
  // Use selected profile or fallback to first profile
  const currentProfile = profiles?.find(p => p.id === currentProfileId) || profiles?.[0]
  
  // Auto-select first profile if none selected
  if (profiles && profiles.length > 0 && !currentProfileId && currentProfile) {
    try {
      setCurrentProfileId(currentProfile.id)
    } catch (error) {
      console.error('Failed to set current profile:', error)
    }
  }
  
  const { data: routines, isLoading: routinesLoading } = useRoutines(currentProfile?.id)
  const { data: insights, isLoading: insightsLoading } = useAIInsights(currentProfile?.id)
  const logMood = useLogMood()
  const updateRoutineStatus = useUpdateRoutineStatus()

  const moods = [
    { label: 'Happy', color: 'bg-emerald-100' },
    { label: 'Energetic', color: 'bg-orange-100' },
    { label: 'Calm', color: 'bg-blue-100' },
    { label: 'Upset', color: 'bg-rose-100' },
  ]

  const handleMoodSelect = async (mood: string) => {
    setSelectedMood(mood)
    if (!currentProfile) {
      toast.error('No profile found. Please create a profile first.')
      return
    }

    try {
      await logMood.mutateAsync({
        child_id: currentProfile.id,
        mood,
        energy_level: 7,
      })
      toast.success(`Mood logged: ${mood}`)
    } catch (error) {
      console.error('Failed to log mood:', error)
      toast.error('Failed to log mood. Please try again.')
    }
  }

  const handleToggleRoutine = async (routineId: string, completed: boolean) => {
    try {
      await updateRoutineStatus.mutateAsync({ routineId, completed: !completed })
      toast.success(completed ? 'Routine marked incomplete' : 'Routine completed!')
    } catch (error) {
      console.error('Failed to update routine:', error)
      toast.error('Failed to update routine. Please try again.')
    }
  }

  if (profilesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-8">
        <Skeleton className="h-12 w-64 mb-4" />
        <Skeleton className="h-32 w-full mb-4" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (!currentProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Welcome to Health-AI</h1>
          <p className="text-gray-600 mb-6">Let's set up your first profile to get started</p>
          <a
            href="/profiles"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mb-4"
          >
            Create Your First Profile
          </a>
          <div className="mt-8 p-6 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">What you'll set up:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Child's basic information</li>
              <li>• Special needs and preferences</li>
              <li>• Emergency contacts</li>
              <li>• Daily routines</li>
            </ul>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{backgroundColor: 'var(--bg-primary)'}}>
      {/* Header */}
      <div className="px-8 pt-8 pb-8">
        <div className="flex items-start justify-between mb-4">
          <div className="bg-orange-100 rounded-full px-4 py-2 inline-block">
            <span className="text-orange-500 font-semibold text-sm">12 Day Streak</span>
          </div>
          <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center flex-shrink-0">
            <div className="w-10 h-10 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
          </div>
        </div>
        <h1 className="text-4xl font-bold" style={{color: 'var(--text-primary)'}}>Good Morning, {currentProfile.name}!</h1>
      </div>

      {/* How are you feeling section */}
      <div className="px-8 mb-8">
        <h2 className="text-2xl font-bold mb-6" style={{color: 'var(--text-primary)'}}>How are you feeling?</h2>
        <div className="flex justify-between gap-3">
          {moods.map((mood) => (
            <button
              key={mood.label}
              onClick={() => handleMoodSelect(mood.label)}
              disabled={logMood.isPending}
              className="flex flex-col items-center gap-3 flex-1"
            >
              <div
                className={`w-20 h-20 rounded-full transition-transform ${
                  selectedMood === mood.label ? 'ring-2 scale-110' : ''
                } ${logMood.isPending ? 'opacity-50' : ''}`}
                style={{
                  backgroundColor: selectedMood === mood.label ? 'var(--accent-color)' : 'var(--bg-tertiary)',
                  borderColor: selectedMood === mood.label ? 'var(--accent-color)' : 'transparent',
                  borderWidth: selectedMood === mood.label ? '2px' : '0'
                }}
              />
              <span className="text-sm" style={{color: 'var(--text-secondary)'}}>{mood.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* AI Insights */}
      {insightsLoading ? (
        <div className="px-8 mb-8">
          <Skeleton className="h-32 w-full" />
        </div>
      ) : insights && insights.length > 0 ? (
        <div className="px-8 mb-8">
          <div className="border-2 rounded-3xl p-6" style={{backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)'}}>
            <div className="flex gap-4">
              <div className="w-16 h-16 rounded-2xl flex-shrink-0" style={{backgroundColor: 'var(--accent-color)'}} />
              <div className="flex-1">
                <h3 className="text-lg font-bold mb-2" style={{color: 'var(--accent-color)'}}>MedGemma Insight</h3>
                <p className="text-base leading-relaxed" style={{color: 'var(--text-primary)'}}>{insights[0].message}</p>
                {insights[0].recommendations.length > 0 && (
                  <ul className="mt-3 space-y-1">
                    {insights[0].recommendations.map((rec, idx) => (
                      <li key={idx} className="text-sm" style={{color: 'var(--text-secondary)'}}>• {rec}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Today's Routine */}
      <div className="px-8 pb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold" style={{color: 'var(--text-primary)'}}>Today's Routine</h2>
          <a href="/daily-wellness" className="font-semibold" style={{color: 'var(--accent-color)'}}>
            See all
          </a>
        </div>

        {routinesLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        ) : routines && routines.length > 0 ? (
          <div className="space-y-4">
            {routines.slice(0, 3).map((routine, index) => (
              <div
                key={routine.id}
                className="flex gap-4 p-4 rounded-2xl border-2 transition-all"
                style={{
                  backgroundColor: !routine.completed ? 'var(--bg-secondary)' : 'var(--bg-tertiary)',
                  borderColor: !routine.completed ? 'var(--accent-color)' : 'var(--border-color)'
                }}
              >
                {/* Timeline */}
                <div className="flex flex-col items-center flex-shrink-0">
                  <span className="text-sm font-medium w-12 text-center" style={{color: 'var(--text-secondary)'}}>
                    {routine.scheduled_time}
                  </span>
                  <div className="w-2 h-2 rounded-full mt-3 mb-3" style={{backgroundColor: 'var(--accent-color)'}} />
                  {index < 2 && <div className="w-0.5 h-12 bg-gray-200" />}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <div className="w-14 h-14 bg-slate-300 rounded-2xl flex items-center justify-center text-xl flex-shrink-0">
                          {routine.icon || '📋'}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold" style={{color: 'var(--text-primary)'}}>{routine.title}</h3>
                          <p className="text-sm" style={{color: 'var(--text-secondary)'}}>
                            {routine.duration_minutes ? `${routine.duration_minutes} min` : 'No duration'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Toggle button */}
                    <button
                      onClick={() => handleToggleRoutine(routine.id, routine.completed)}
                      disabled={updateRoutineStatus.isPending}
                      className={`w-12 h-12 rounded-full flex-shrink-0 transition-colors ${
                        routine.completed
                          ? ''
                          : 'border-4 hover:border-gray-400'
                      } ${updateRoutineStatus.isPending ? 'opacity-50' : ''}`}
                      style={{
                        backgroundColor: routine.completed ? '#10b981' : 'transparent',
                        borderColor: routine.completed ? '#10b981' : 'var(--border-color)'
                      }}
                    >
                      {routine.completed && (
                        <span className="text-white text-xl">✓</span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12" style={{color: 'var(--text-secondary)'}}>
            <p>No routines yet. Create one to get started!</p>
          </div>
        )}
      </div>
    </div>
  )
}
