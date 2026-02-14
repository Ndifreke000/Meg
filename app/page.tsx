'use client'

import { useState } from 'react'

export default function Page() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null)

  const moods = [
    { label: 'Happy', color: 'bg-emerald-100' },
    { label: 'Energetic', color: 'bg-orange-100' },
    { label: 'Calm', color: 'bg-blue-100' },
    { label: 'Upset', color: 'bg-rose-100' },
  ]

  const routineItems = [
    {
      id: 'breakfast',
      time: '8:00 AM',
      title: 'Breakfast',
      subtitle: 'Healthy start',
      icon: '🥚',
      iconBg: 'bg-emerald-500',
      completed: false,
      showToggle: false,
    },
    {
      id: 'game',
      time: '9:00 AM',
      title: 'Space Math Game',
      subtitle: '15 min focus • 50 pts',
      icon: '🎲',
      iconBg: 'bg-slate-300',
      completed: false,
      showToggle: true,
      highlighted: true,
    },
    {
      id: 'break',
      time: '10:00 AM',
      title: 'Sensory Break',
      subtitle: 'Calm music & stretching',
      icon: '🎵',
      iconBg: 'bg-slate-300',
      completed: false,
      showToggle: false,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="px-8 pt-8 pb-8">
        <div className="flex items-start justify-between mb-4">
          <div className="bg-orange-100 rounded-full px-4 py-2 inline-block">
            <span className="text-orange-500 font-semibold text-sm">12 Day Streak</span>
          </div>
          <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center flex-shrink-0">
            <div className="w-10 h-10 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
          </div>
        </div>
        <h1 className="text-4xl font-bold text-black">Good Morning, Alex!</h1>
      </div>

      {/* How are you feeling section */}
      <div className="px-8 mb-8">
        <h2 className="text-2xl font-bold text-black mb-6">How are you feeling?</h2>
        <div className="flex justify-between gap-3">
          {moods.map((mood) => (
            <button
              key={mood.label}
              onClick={() => setSelectedMood(mood.label)}
              className="flex flex-col items-center gap-3 flex-1"
            >
              <div
                className={`w-20 h-20 rounded-full transition-transform ${mood.color} ${
                  selectedMood === mood.label ? 'ring-2 ring-blue-500 scale-110' : ''
                }`}
              />
              <span className="text-sm text-gray-400">{mood.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* MedGemma Insight card */}
      <div className="px-8 mb-8">
        <div className="bg-blue-50 border-2 border-blue-200 rounded-3xl p-6">
          <div className="flex gap-4">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-lg font-bold text-blue-600 mb-2">MedGemma Insight</h3>
              <p className="text-base text-black leading-relaxed">
                Alex focused really well yesterday morning! We've adjusted today's schedule to include
                the "Space Math" game earlier.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Routine */}
      <div className="px-8 pb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-black">Today's Routine</h2>
          <a href="#" className="text-blue-600 font-semibold">
            See all
          </a>
        </div>

        <div className="space-y-4">
          {routineItems.map((item, index) => (
            <div
              key={item.id}
              className={`flex gap-4 p-4 rounded-2xl border-2 transition-all ${
                item.highlighted
                  ? 'border-blue-300 bg-blue-50'
                  : 'border-gray-200 bg-white'
              }`}
            >
              {/* Timeline */}
              <div className="flex flex-col items-center flex-shrink-0">
                <span className="text-sm text-gray-400 font-medium w-12 text-center">
                  {item.time}
                </span>
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-3 mb-3" />
                {index < routineItems.length - 1 && (
                  <div className="w-0.5 h-12 bg-gray-200" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <div
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl flex-shrink-0 ${item.iconBg}`}
                      >
                        {item.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-black">{item.title}</h3>
                        <p className="text-sm text-gray-400">{item.subtitle}</p>
                      </div>
                    </div>
                  </div>

                  {/* Right side indicator */}
                  {item.showToggle ? (
                    <div className="w-12 h-12 rounded-full border-4 border-gray-300 flex-shrink-0" />
                  ) : (
                    <div
                      className={`w-12 h-12 rounded-full flex-shrink-0 ${
                        index === 0 ? 'bg-emerald-500' : 'bg-blue-600'
                      }`}
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>


    </div>
  )
}
