'use client'

export default function ProfilesPage() {
  const profiles = [
    {
      name: "Alex",
      role: "Child",
      icon: "👦",
      status: "Active",
      recentActivity: "Completed routine - 2 hours ago",
    },
    {
      name: "Parent/Caregiver",
      role: "Guardian",
      icon: "👨‍👩‍👧",
      status: "Online",
      recentActivity: "Reviewed goals - 30 minutes ago",
    },
  ]

  const setupItems = [
    { label: "Health & Medical Info", completed: true },
    { label: "School & Educational", completed: true },
    { label: "Therapies & Support", completed: false },
    { label: "Emergency Contacts", completed: true },
    { label: "Dietary Preferences", completed: false },
  ]

  return (
    <div className="min-h-screen bg-gray-50 px-8 py-8">
      <div>
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profiles & Setup</h1>
          <p className="text-gray-600">Manage family members and system configuration</p>
        </div>

        {/* User Profiles */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Family Profiles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profiles.map((profile, idx) => (
              <div key={idx} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-4xl">{profile.icon}</div>
                    <div>
                      <h3 className="font-bold text-gray-900">{profile.name}</h3>
                      <p className="text-sm text-gray-500">{profile.role}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    profile.status === "Active" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                  }`}>
                    {profile.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-4">{profile.recentActivity}</p>
                <button className="w-full px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition font-medium">
                  View Profile
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Setup Checklist */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Setup Checklist</h2>
          <div className="space-y-3">
            {setupItems.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <div className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                  item.completed 
                    ? "bg-green-500 border-green-500 text-white" 
                    : "border-gray-300"
                }`}>
                  {item.completed && "✓"}
                </div>
                <span className={item.completed ? "line-through text-gray-500" : "text-gray-900"}>
                  {item.label}
                </span>
                {!item.completed && (
                  <button className="ml-auto text-blue-600 text-sm font-semibold hover:underline">
                    Complete
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Add Member Button */}
        <div className="mt-8">
          <button className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
            Add Family Member
          </button>
        </div>
      </div>
    </div>
  )
}
