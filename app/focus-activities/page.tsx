'use client'

import { useState } from 'react'

export default function FocusActivitiesPage() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('medium')

  const activities = [
    {
      id: 'math',
      title: 'Space Math',
      icon: '🚀',
      difficulty: 'medium',
      duration: '15 min',
      points: 50,
      color: 'bg-blue-100',
      iconBg: 'bg-blue-500',
    },
    {
      id: 'memory',
      title: 'Memory Match',
      icon: '🧩',
      difficulty: 'easy',
      duration: '10 min',
      points: 30,
      color: 'bg-green-100',
      iconBg: 'bg-green-500',
    },
    {
      id: 'puzzle',
      title: 'Pattern Puzzle',
      icon: '🎨',
      difficulty: 'hard',
      duration: '20 min',
      points: 75,
      color: 'bg-purple-100',
      iconBg: 'bg-purple-500',
    },
    {
      id: 'reading',
      title: 'Story Time',
      icon: '📚',
      difficulty: 'easy',
      duration: '15 min',
      points: 40,
      color: 'bg-orange-100',
      iconBg: 'bg-orange-500',
    },
    {
      id: 'logic',
      title: 'Logic Quest',
      icon: '🧠',
      difficulty: 'hard',
      duration: '25 min',
      points: 80,
      color: 'bg-red-100',
      iconBg: 'bg-red-500',
    },
    {
      id: 'words',
      title: 'Word Builder',
      icon: '✏️',
      difficulty: 'medium',
      duration: '12 min',
      points: 45,
      color: 'bg-yellow-100',
      iconBg: 'bg-yellow-500',
    },
  ]

  const recentProgress = [
    { activity: 'Space Math', score: 85, date: 'Today' },
    { activity: 'Memory Match', score: 92, date: 'Yesterday' },
    { activity: 'Pattern Puzzle', score: 78, date: '2 days ago' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Focus Activities</h1>
          <p className="text-gray-600">Choose an activity to improve focus and skills</p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <p className="text-gray-600 text-sm mb-1">Total Points</p>
            <p className="text-3xl font-bold text-gray-900">1,250</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <p className="text-gray-600 text-sm mb-1">Activities Completed</p>
            <p className="text-3xl font-bold text-gray-900">24</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <p className="text-gray-600 text-sm mb-1">Current Streak</p>
            <p className="text-3xl font-bold text-gray-900">12 days</p>
          </div>
        </div>

        {/* Difficulty Filter */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-gray-700 mb-3">Filter by difficulty:</p>
          <div className="flex gap-2">
            {['easy', 'medium', 'hard'].map((level) => (
              <button
                key={level}
                onClick={() => setSelectedDifficulty(level)}
                className={`px-4 py-2 rounded-lg font-medium capitalize transition ${
                  selectedDifficulty === level
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Activities Grid */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Available Activities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities
              .filter((a) => selectedDifficulty === 'all' || a.difficulty === selectedDifficulty)
              .map((activity) => (
                <div
                  key={activity.id}
                  className={`${activity.color} rounded-2xl p-6 border-2 border-transparent hover:border-blue-500 hover:shadow-lg transition cursor-pointer`}
                >
                  <div className={`w-16 h-16 ${activity.iconBg} rounded-2xl flex items-center justify-center text-3xl mb-4`}>
                    {activity.icon}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{activity.title}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-1 bg-white rounded text-xs font-semibold text-gray-700 capitalize">
                      {activity.difficulty}
                    </span>
                    <span className="text-xs text-gray-600">{activity.duration}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700">
                      🏆 {activity.points} pts
                    </span>
                    <button className="px-4 py-2 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-50 transition">
                      Start
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Recent Progress */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Progress</h2>
          <div className="space-y-3">
            {recentProgress.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-900">{item.activity}</p>
                  <p className="text-sm text-gray-600">{item.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">{item.score}%</p>
                  <p className="text-xs text-gray-500">Score</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
