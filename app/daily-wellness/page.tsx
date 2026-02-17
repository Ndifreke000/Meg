'use client'

import { useCurrentProfile } from '@/lib/profile-context'
import { useRoutines, useActivities, useLogActivity, useAnalytics } from '@/hooks/use-api'
import { useState } from 'react'
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/skeleton'

export default function DailyWellnessPage() {
  const { currentProfileId } = useCurrentProfile()
  const [isLoggingActivity, setIsLoggingActivity] = useState(false)
  
  const { data: routines, isLoading: routinesLoading } = useRoutines(currentProfileId)
  const { data: activities, isLoading: activitiesLoading } = useActivities(currentProfileId)
  const { data: analytics, isLoading: analyticsLoading } = useAnalytics(currentProfileId)
  const logActivity = useLogActivity()

  const handleLogActivity = async () => {
    if (!currentProfileId) {
      toast.error('No profile selected')
      return
    }

    setIsLoggingActivity(true)
    try {
      await logActivity.mutateAsync({
        child_id: currentProfileId,
        activity_type: 'wellness_check',
        title: 'Daily Wellness Check',
        focus_score: Math.floor(Math.random() * 10) + 1,
        duration_minutes: 5,
        notes: 'Completed daily wellness assessment'
      })
      toast.success('Activity logged successfully!')
    } catch (error) {
      toast.error('Failed to log activity')
    } finally {
      setIsLoggingActivity(false)
    }
  }

  if (!currentProfileId) {
    return (
      <div className="min-h-screen bg-gray-50 px-8 py-8 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">No Profile Selected</h1>
          <p className="text-gray-600 mb-6">Please select a profile to view daily wellness data</p>
          <a href="/profiles" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Go to Profiles
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 px-8 py-8">
      <div>
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Daily Wellness Check</h1>
          <p className="text-gray-600">Track daily routines, wellness metrics, and therapeutic sessions</p>
        </div>

        {/* Analytics Summary */}
        {analyticsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-24 w-full" />)}
          </div>
        ) : analytics ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <p className="text-gray-600 text-sm mb-2">Average Focus Score</p>
              <p className="text-3xl font-bold text-gray-900">{analytics.avg_focus_score?.toFixed(1) ?? '0.0'}/10</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <p className="text-gray-600 text-sm mb-2">Routines Completed</p>
              <p className="text-3xl font-bold text-gray-900">{analytics.routines_completed ?? 0}</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <p className="text-gray-600 text-sm mb-2">Total Activities</p>
              <p className="text-3xl font-bold text-gray-900">{analytics.total_activities ?? 0}</p>
            </div>
          </div>
        ) : null}

        {/* Today's Routines */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Today's Routines</h2>
          {routinesLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full" />)}
            </div>
          ) : routines && routines.length > 0 ? (
            <div className="space-y-3">
              {routines.map((routine) => (
                <div key={routine.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{routine.icon || '📋'}</span>
                    <div>
                      <span className="font-medium text-gray-900">{routine.title}</span>
                      <p className="text-sm text-gray-500">{routine.scheduled_time}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    routine.completed
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {routine.completed ? 'Completed' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No routines found. Create some routines to get started!</p>
          )}
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activities</h2>
          {activitiesLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full" />)}
            </div>
          ) : activities && activities.length > 0 ? (
            <div className="space-y-3">
              {activities.slice(0, 5).map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <span className="font-medium text-gray-900">{activity.title}</span>
                    <p className="text-sm text-gray-500">{activity.activity_type}</p>
                  </div>
                  <div className="text-right">
                    {activity.focus_score && (
                      <p className="font-semibold text-gray-900">Focus: {activity.focus_score}/10</p>
                    )}
                    <p className="text-xs text-gray-500">
                      {new Date(activity.logged_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No activities logged yet.</p>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            onClick={handleLogActivity}
            disabled={isLoggingActivity}
            className="bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {isLoggingActivity ? 'Logging...' : 'Log New Activity'}
          </button>
          <a 
            href="/programs" 
            className="bg-gray-200 text-gray-800 font-semibold py-3 rounded-lg hover:bg-gray-300 transition text-center"
          >
            View Analytics
          </a>
        </div>
      </div>
    </div>
  )
}
