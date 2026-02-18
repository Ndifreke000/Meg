'use client'

import { useMemo } from 'react'
import { useCurrentProfile } from '@/lib/profile-context'
import { useAnalytics, useActivities, useMoodHistory } from '@/hooks/use-api'
import { Skeleton } from '@/components/ui/skeleton'

export default function ProgramsPage() {
  const { currentProfileId } = useCurrentProfile()
  
  const { data: analytics, isLoading: analyticsLoading } = useAnalytics(currentProfileId || undefined)
  const { data: activities, isLoading: activitiesLoading } = useActivities(currentProfileId || undefined)
  const { data: moodHistory, isLoading: moodLoading } = useMoodHistory(currentProfileId || undefined)

  // Calculate program progress based on real data
  const focusActivities = activities?.filter(a => a.activity_type.includes('focus')) || []
  const socialActivities = activities?.filter(a => a.activity_type.includes('social')) || []
  const emotionalActivities = activities?.filter(a => a.activity_type.includes('emotional')) || []

  const programs = useMemo(() => [
    {
      title: 'Focus Builder',
      description: 'Cognitive activities to improve attention span',
      progress: focusActivities.length > 0 ? Math.min((focusActivities.length / 16) * 100, 100) : 0,
      sessions: focusActivities.length,
      totalSessions: 16,
      color: 'bg-blue-500',
    },
    {
      title: 'Social Skills',
      description: 'Interactive exercises for communication',
      progress: socialActivities.length > 0 ? Math.min((socialActivities.length / 20) * 100, 100) : 0,
      sessions: socialActivities.length,
      totalSessions: 20,
      color: 'bg-green-500',
    },
    {
      title: 'Emotional Regulation',
      description: 'Techniques for managing emotions',
      progress: emotionalActivities.length > 0 ? Math.min((emotionalActivities.length / 10) * 100, 100) : 0,
      sessions: emotionalActivities.length,
      totalSessions: 10,
      color: 'bg-purple-500',
    },
  ], [focusActivities.length, socialActivities.length, emotionalActivities.length])

  // Generate weekly stats from real data
  const weeklyStats = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - i))
    const dayName = date.toLocaleDateString('en', { weekday: 'short' })
    
    const dayActivities = activities?.filter(a => {
      const activityDate = new Date(a.logged_at)
      return activityDate.toDateString() === date.toDateString()
    }) || []
    
    const dayMoods = moodHistory?.filter(m => {
      const moodDate = new Date(m.logged_at)
      return moodDate.toDateString() === date.toDateString()
    }) || []
    
    const avgFocus = dayActivities.length > 0 
      ? dayActivities.reduce((sum, a) => sum + (a.focus_score || 0), 0) / dayActivities.length
      : 0
    
    const avgMood = dayMoods.length > 0
      ? dayMoods.reduce((sum, m) => sum + (m.energy_level || 0), 0) / dayMoods.length
      : 0
    
    return {
      day: dayName,
      focus: Math.round(avgFocus),
      mood: Math.round(avgMood)
    }
  })

  const achievements = [
    { 
      title: '7-Day Streak', 
      icon: '🔥', 
      earned: activities && activities.length >= 7
    },
    { 
      title: 'Focus Master', 
      icon: '🎯', 
      earned: focusActivities.length >= 5
    },
    { 
      title: 'Social Star', 
      icon: '⭐', 
      earned: socialActivities.length >= 3
    },
    { 
      title: 'Calm Champion', 
      icon: '🧘', 
      earned: emotionalActivities.length >= 2
    },
  ]

  if (!currentProfileId) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">No Profile Selected</h1>
          <p className="text-gray-600 mb-6">Please select a profile to view programs and analytics</p>
          <a href="/profiles" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Go to Profiles
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Programs & Analytics</h1>
          <p className="text-gray-600">Track progress across therapeutic programs</p>
        </div>

        {/* Active Programs */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Active Programs</h2>
          {activitiesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-48 w-full" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {programs.map((program, idx) => (
                <div key={idx} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition">
                  <h3 className="font-bold text-gray-900 mb-2">{program.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{program.description}</p>
                  
                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{Math.round(program.progress)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`${program.color} h-2 rounded-full transition-all`}
                        style={{ width: `${program.progress}%` }}
                      />
                    </div>
                  </div>

                  <p className="text-sm text-gray-600">
                    {program.sessions} of {program.totalSessions} sessions completed
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Weekly Analytics */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Weekly Analytics</h2>
          
          {moodLoading || activitiesLoading ? (
            <Skeleton className="h-48 w-full mb-4" />
          ) : (
            <>
              {/* Simple Bar Chart */}
              <div className="flex items-end justify-between gap-2 h-48 mb-4">
                {weeklyStats.map((stat, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full flex flex-col gap-1">
                      <div
                        className="bg-blue-500 rounded-t"
                        style={{ height: `${Math.max(stat.focus * 10, 5)}px` }}
                        title={`Focus: ${stat.focus}`}
                      />
                      <div
                        className="bg-green-500 rounded-t"
                        style={{ height: `${Math.max(stat.mood * 10, 5)}px` }}
                        title={`Mood: ${stat.mood}`}
                      />
                    </div>
                    <span className="text-xs text-gray-600 font-medium">{stat.day}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-6 justify-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded" />
                  <span className="text-sm text-gray-600">Focus Score</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded" />
                  <span className="text-sm text-gray-600">Mood Score</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Achievements */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Achievements</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {achievements.map((achievement, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl text-center ${
                  achievement.earned ? 'bg-yellow-50 border-2 border-yellow-300' : 'bg-gray-100'
                }`}
              >
                <div className={`text-4xl mb-2 ${!achievement.earned && 'opacity-30'}`}>
                  {achievement.icon}
                </div>
                <p className={`text-sm font-semibold ${achievement.earned ? 'text-gray-900' : 'text-gray-400'}`}>
                  {achievement.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
