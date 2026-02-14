'use client'

import { useState } from 'react'

export default function SensorySchedulePage() {
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null)

  const sensoryActivities = [
    {
      id: 'music',
      title: 'Calm Music',
      icon: '🎵',
      duration: '15 min',
      type: 'Auditory',
      color: 'bg-purple-100',
      iconBg: 'bg-purple-500',
    },
    {
      id: 'stretching',
      title: 'Gentle Stretching',
      icon: '🧘',
      duration: '10 min',
      type: 'Movement',
      color: 'bg-green-100',
      iconBg: 'bg-green-500',
    },
    {
      id: 'breathing',
      title: 'Deep Breathing',
      icon: '💨',
      duration: '5 min',
      type: 'Calming',
      color: 'bg-blue-100',
      iconBg: 'bg-blue-500',
    },
    {
      id: 'tactile',
      title: 'Sensory Toys',
      icon: '🧸',
      duration: '20 min',
      type: 'Tactile',
      color: 'bg-orange-100',
      iconBg: 'bg-orange-500',
    },
  ]

  const schedule = [
    { time: '8:30 AM', activity: 'Morning Routine', status: 'completed' },
    { time: '10:00 AM', activity: 'Sensory Break - Music', status: 'completed' },
    { time: '12:00 PM', activity: 'Lunch & Rest', status: 'active' },
    { time: '2:00 PM', activity: 'Focus Activity', status: 'upcoming' },
    { time: '3:30 PM', activity: 'Sensory Break - Movement', status: 'upcoming' },
    { time: '5:00 PM', activity: 'Free Play', status: 'upcoming' },
  ]

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
                <p className="text-xs text-gray-500">{activity.duration}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Today's Schedule</h2>
          <div className="space-y-3">
            {schedule.map((item, idx) => (
              <div
                key={idx}
                className={`flex items-center justify-between p-4 rounded-xl ${
                  item.status === 'active'
                    ? 'bg-purple-50 border-2 border-purple-300'
                    : 'bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-gray-500 w-20">{item.time}</span>
                  <span className="font-medium text-gray-900">{item.activity}</span>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    item.status === 'completed'
                      ? 'bg-green-100 text-green-700'
                      : item.status === 'active'
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {item.status === 'completed' ? 'Done' : item.status === 'active' ? 'Now' : 'Upcoming'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-purple-600 text-white font-semibold py-4 rounded-xl hover:bg-purple-700 transition">
            Start Sensory Break
          </button>
          <button className="bg-gray-200 text-gray-800 font-semibold py-4 rounded-xl hover:bg-gray-300 transition">
            Edit Schedule
          </button>
          <button className="bg-gray-200 text-gray-800 font-semibold py-4 rounded-xl hover:bg-gray-300 transition">
            View History
          </button>
        </div>
      </div>
    </div>
  )
}
