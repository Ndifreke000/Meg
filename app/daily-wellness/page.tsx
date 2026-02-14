'use client'

export default function DailyWellnessPage() {
  const sections = [
    {
      title: "Today's routine",
      subtitle: "Routine log time",
      items: [
        { label: "Rise & brighten", status: "completed" },
        { label: "Salt 7ft Dexp", status: "completed" },
        { label: "Oral Care head", status: "completed" },
      ],
    },
    {
      title: "Meet & highlights",
      subtitle: "Top 1 of 3; Child",
      items: [
        { label: "Focus", value: "8/10" },
      ],
    },
    {
      title: "David's goals",
      subtitle: "Target & Strategy",
      items: [
        { label: "Morning focus", status: "active" },
      ],
    },
    {
      title: "Page-Left - Therapy",
      subtitle: "Session info",
      items: [
        { label: "Bipolar focus", status: "info" },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Daily Wellness Check</h1>
          <p className="text-gray-600">Track daily routines, wellness metrics, and therapeutic sessions</p>
        </div>

        {/* Main Sections Grid */}
        <div className="grid grid-cols-1 gap-6">
          {sections.map((section, idx) => (
            <div key={idx} className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-1">{section.title}</h2>
              <p className="text-sm text-gray-500 mb-4">{section.subtitle}</p>
              
              <div className="space-y-3">
                {section.items.map((item, itemIdx) => (
                  <div key={itemIdx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">{item.label}</span>
                    {item.status === "completed" && (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                        Completed
                      </span>
                    )}
                    {item.status === "active" && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                        Active
                      </span>
                    )}
                    {item.status === "info" && (
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
                        In Progress
                      </span>
                    )}
                    {item.value && (
                      <span className="text-gray-900 font-semibold">{item.value}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition">
            Log New Activity
          </button>
          <button className="bg-gray-200 text-gray-800 font-semibold py-3 rounded-lg hover:bg-gray-300 transition">
            View Analytics
          </button>
        </div>
      </div>
    </div>
  )
}
