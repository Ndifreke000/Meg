'use client'

export default function SensorySchedulePage() {
  const sensoryActivities = [
    {
      time: "9:00 AM",
      activity: "Morning Stretch",
      type: "Physical",
      duration: "10 min",
      description: "Gentle stretching to start the day",
    },
    {
      time: "11:00 AM",
      activity: "Calming Music",
      type: "Audio",
      duration: "15 min",
      description: "Soothing instrumental music for focus",
    },
    {
      time: "1:00 PM",
      activity: "Outdoor Time",
      type: "Environmental",
      duration: "20 min",
      description: "Nature walk and fresh air exposure",
    },
    {
      time: "3:30 PM",
      activity: "Fidget Activity",
      type: "Tactile",
      duration: "10 min",
      description: "Sensory play with approved items",
    },
    {
      time: "6:00 PM",
      activity: "Wind-Down Ritual",
      type: "Relaxation",
      duration: "15 min",
      description: "Evening routine for preparation to bed",
    },
  ]

  const sensoryTools = [
    "Noise-canceling headphones",
    "Weighted blanket",
    "Fidget tools collection",
    "Aromatherapy diffuser",
    "Visual timer",
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sensory & Schedule</h1>
          <p className="text-gray-600">Manage sensory-friendly activities and daily structure</p>
        </div>

        {/* Today's Sensory Schedule */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Today's Sensory Activities</h2>
          <div className="space-y-3">
            {sensoryActivities.map((activity, idx) => (
              <div key={idx} className="flex items-start gap-4 p-4 bg-gradient-to-r from-purple-50 to-transparent rounded-lg border border-purple-100">
                <div className="text-center flex-shrink-0">
                  <p className="font-bold text-gray-900">{activity.time}</p>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-1">{activity.activity}</h3>
                  <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded font-medium">
                      {activity.type}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded font-medium">
                      {activity.duration}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Available Sensory Tools */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Approved Sensory Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {sensoryTools.map((tool, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-3 h-3 bg-blue-500 rounded-full" />
                <span className="text-gray-700">{tool}</span>
                <button className="ml-auto text-blue-600 text-sm font-semibold hover:underline">
                  Details
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
            Add Activity
          </button>
          <button className="px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition">
            Export Schedule
          </button>
        </div>
      </div>
    </div>
  )
}
