'use client'

export default function ProgramsPage() {
  const programs = [
    {
      name: "Speech Therapy",
      provider: "Dr. Sarah Johnson",
      frequency: "2x per week",
      status: "Active",
      progress: 65,
      nextSession: "Tomorrow at 2:00 PM",
    },
    {
      name: "Occupational Therapy",
      provider: "Emily Rodriguez",
      frequency: "1x per week",
      status: "Active",
      progress: 45,
      nextSession: "Thursday at 3:30 PM",
    },
    {
      name: "Social Skills Group",
      provider: "Community Center",
      frequency: "1x per week",
      status: "Active",
      progress: 55,
      nextSession: "Saturday at 10:00 AM",
    },
  ]

  const analytics = [
    { metric: "Session Attendance", value: "92%", trend: "up" },
    { metric: "Progress Score", value: "7.8/10", trend: "up" },
    { metric: "Goals Completed", value: "12/18", trend: "up" },
    { metric: "Avg Session Duration", value: "45 min", trend: "neutral" },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Programs & Analytics</h1>
          <p className="text-gray-600">Track therapeutic programs and development progress</p>
        </div>

        {/* Analytics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {analytics.map((item, idx) => (
            <div key={idx} className="bg-white rounded-lg border border-gray-200 p-6">
              <p className="text-gray-600 text-sm mb-2">{item.metric}</p>
              <p className="text-3xl font-bold text-gray-900">{item.value}</p>
              <p className={`text-xs mt-2 ${item.trend === "up" ? "text-green-600" : "text-gray-600"}`}>
                {item.trend === "up" ? "↑" : "→"} vs last month
              </p>
            </div>
          ))}
        </div>

        {/* Active Programs */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Active Programs</h2>
          <div className="space-y-4">
            {programs.map((program, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{program.name}</h3>
                    <p className="text-sm text-gray-600">{program.provider}</p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                    {program.status}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-3">{program.frequency}</p>

                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Progress</span>
                    <span className="text-sm text-gray-600">{program.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${program.progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Next:</span> {program.nextSession}
                  </p>
                  <button className="text-blue-600 text-sm font-semibold hover:underline">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
            Add New Program
          </button>
          <button className="px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition">
            Download Report
          </button>
        </div>
      </div>
    </div>
  )
}
