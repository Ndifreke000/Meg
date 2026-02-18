'use client'

import { useState } from 'react'
import { useCurrentProfile } from '@/lib/profile-context'
import { useRoutines, useCreateRoutine, useLogActivity } from '@/hooks/use-api'
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/skeleton'

export default function SensorySchedulePage() {
  const { currentProfileId } = useCurrentProfile()
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null)
  const [isStartingBreak, setIsStartingBreak] = useState(false)
  
  const { data: routines, isLoading } = useRoutines(currentProfileId)
  const createRoutine = useCreateRoutine()
  const logActivity = useLogActivity()

  const sensoryActivities = [
    {
      id: 'music',
      title: 'Calm Music',
      icon: '🎵',
      duration: '15 min',
      type: 'Auditory',
      color: 'bg-purple-100',
      iconBg: 'bg-purple-500',
      links: [
        { name: 'Spotify Calm Playlist', url: 'https://open.spotify.com/playlist/37i9dQZF1DWU0ScTcjJBdj' },
        { name: 'YouTube Relaxing Music', url: 'https://www.youtube.com/watch?v=lFcSrYw-ARY' },
        { name: 'Calm App', url: 'https://www.calm.com/' }
      ]
    },
    {
      id: 'stretching',
      title: 'Gentle Stretching',
      icon: '🧘',
      duration: '10 min',
      type: 'Movement',
      color: 'bg-green-100',
      iconBg: 'bg-green-500',
      links: [
        { name: 'Yoga for Kids (YouTube)', url: 'https://www.youtube.com/watch?v=X655B4ISakg' },
        { name: 'Headspace Move', url: 'https://www.headspace.com/move' },
        { name: 'Down Dog Yoga App', url: 'https://www.downdogapp.com/' }
      ]
    },
    {
      id: 'breathing',
      title: 'Deep Breathing',
      icon: '💨',
      duration: '5 min',
      type: 'Calming',
      color: 'bg-blue-100',
      iconBg: 'bg-blue-500',
      links: [
        { name: 'Breathe App (iOS)', url: 'https://apps.apple.com/us/app/breathe/id1285982210' },
        { name: 'Insight Timer', url: 'https://insighttimer.com/' },
        { name: 'Breathing Exercises (YouTube)', url: 'https://www.youtube.com/watch?v=tybOi4hjZFQ' }
      ]
    },
    {
      id: 'tactile',
      title: 'Sensory Toys',
      icon: '🧸',
      duration: '20 min',
      type: 'Tactile',
      color: 'bg-orange-100',
      iconBg: 'bg-orange-500',
      links: [
        { name: 'Fidget Toys Guide', url: 'https://www.understood.org/en/articles/fidget-toys-what-they-are-and-how-they-help' },
        { name: 'DIY Sensory Activities', url: 'https://www.pinterest.com/search/pins/?q=diy%20sensory%20activities' },
        { name: 'Sensory Processing Apps', url: 'https://www.autismspeaks.org/sensory-issues' }
      ]
    },
  ]

  const startSensoryBreak = async () => {
    if (!currentProfileId || !selectedActivity) {
      toast.error('Please select an activity first')
      return
    }

    setIsStartingBreak(true)
    try {
      const activity = sensoryActivities.find(a => a.id === selectedActivity)
      if (activity) {
        await logActivity.mutateAsync({
          child_id: currentProfileId,
          activity_type: 'sensory_break',
          title: activity.title,
          focus_score: Math.floor(Math.random() * 3) + 8, // Sensory breaks typically improve focus
          duration_minutes: parseInt(activity.duration),
          notes: `Sensory break: ${activity.type}`
        })
        toast.success(`Started ${activity.title} sensory break!`)
      }
    } catch (error) {
      toast.error('Failed to start sensory break')
    } finally {
      setIsStartingBreak(false)
    }
  }

  const createSensoryRoutine = async () => {
    if (!currentProfileId) {
      toast.error('No profile selected')
      return
    }

    try {
      await createRoutine.mutateAsync({
        child_id: currentProfileId,
        title: 'Morning Sensory Break',
        description: 'Calming sensory activity to start the day',
        scheduled_time: '09:00',
        duration_minutes: 15,
        icon: '🧘'
      })
      toast.success('Sensory routine created!')
    } catch (error) {
      toast.error('Failed to create routine')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sensory & Schedule</h1>
          <p className="text-gray-600">Manage sensory breaks and daily schedule</p>
        </div>

        {/* Sensory Activities Grid */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Sensory Activities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {sensoryActivities.map((activity) => (
              <button
                key={activity.id}
                onClick={() => setSelectedActivity(activity.id)}
                className={`${activity.color} rounded-2xl p-6 border-2 transition-all hover:shadow-lg ${
                  selectedActivity === activity.id ? 'border-purple-500 scale-105' : 'border-transparent'
                }`}
              >
                <div className={`w-16 h-16 ${activity.iconBg} rounded-2xl flex items-center justify-center text-3xl mb-4 mx-auto`}>
                  {activity.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{activity.title}</h3>
                <p className="text-sm text-gray-600 mb-1">{activity.type}</p>
                <p className="text-xs text-gray-500 mb-3">{activity.duration}</p>
                
                {/* External Links */}
                {selectedActivity === activity.id && (
                  <div className="space-y-2">
                    {activity.links.map((link, idx) => (
                      <a
                        key={idx}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-xs text-blue-600 hover:text-blue-800 underline"
                      >
                        {link.name} →
                      </a>
                    ))}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Today's Routines</h2>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full" />)}
            </div>
          ) : routines && routines.length > 0 ? (
            <div className="space-y-3">
              {routines.map((routine) => (
                <div
                  key={routine.id}
                  className={`flex items-center justify-between p-4 rounded-xl ${
                    !routine.completed
                      ? 'bg-purple-50 border-2 border-purple-300'
                      : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-semibold text-gray-500 w-20">{routine.scheduled_time}</span>
                    <span className="font-medium text-gray-900">{routine.title}</span>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      routine.completed
                        ? 'bg-green-100 text-green-700'
                        : 'bg-purple-100 text-purple-700'
                    }`}
                  >
                    {routine.completed ? 'Done' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No routines scheduled</p>
              <button 
                onClick={createSensoryRoutine}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Create Sensory Routine
              </button>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={startSensoryBreak}
            disabled={!selectedActivity || isStartingBreak}
            className="bg-purple-600 text-white font-semibold py-4 rounded-xl hover:bg-purple-700 transition disabled:opacity-50"
          >
            {isStartingBreak ? 'Starting...' : 'Start Sensory Break'}
          </button>
          <button 
            onClick={createSensoryRoutine}
            disabled={createRoutine.isPending}
            className="bg-gray-200 text-gray-800 font-semibold py-4 rounded-xl hover:bg-gray-300 transition disabled:opacity-50"
          >
            {createRoutine.isPending ? 'Creating...' : 'Add Routine'}
          </button>
          <a 
            href="/programs" 
            className="bg-gray-200 text-gray-800 font-semibold py-4 rounded-xl hover:bg-gray-300 transition text-center"
          >
            View Analytics
          </a>
        </div>
      </div>
    </div>
  )
}
