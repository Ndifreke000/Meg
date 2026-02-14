'use client'

export default function SupportNetworkPage() {
  const supportMembers = [
    {
      name: "Sarah Mitchell",
      role: "Primary Caregiver",
      contact: "sarah@email.com",
      phone: "555-0101",
      availability: "Available",
    },
    {
      name: "Michael Torres",
      role: "Secondary Caregiver",
      contact: "michael@email.com",
      phone: "555-0102",
      availability: "Available",
    },
    {
      name: "Dr. Lisa Chen",
      role: "Primary Physician",
      contact: "dr.chen@clinic.com",
      phone: "555-0201",
      availability: "Business hours",
    },
    {
      name: "Jennifer Walsh",
      role: "School Coordinator",
      contact: "j.walsh@school.edu",
      phone: "555-0301",
      availability: "School hours",
    },
  ]

  const groups = [
    {
      name: "Parent Support Group",
      frequency: "Weekly",
      members: 12,
      nextMeeting: "Tuesday, 7:00 PM",
    },
    {
      name: "Caregiver Network",
      frequency: "Bi-weekly",
      members: 8,
      nextMeeting: "Next Saturday, 2:00 PM",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 px-8 py-8">
      <div>
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Support Network</h1>
          <p className="text-gray-600">Manage caregivers, professionals, and support contacts</p>
        </div>

        {/* Support Team */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Support Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {supportMembers.map((member, idx) => (
              <div key={idx} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-gray-900">{member.name}</h3>
                    <p className="text-sm text-gray-600">{member.role}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    member.availability === "Available"
                      ? "bg-green-100 text-green-700"
                      : "bg-blue-100 text-blue-700"
                  }`}>
                    {member.availability}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Email:</span> {member.contact}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Phone:</span> {member.phone}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition">
                    Contact
                  </button>
                  <button className="flex-1 px-3 py-2 bg-gray-100 text-gray-800 text-sm rounded hover:bg-gray-200 transition">
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Support Groups */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Support Groups & Communities</h2>
          <div className="space-y-4">
            {groups.map((group, idx) => (
              <div key={idx} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{group.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">{group.frequency}</span> • {group.members} members
                  </p>
                  <p className="text-sm text-gray-600">Next: {group.nextMeeting}</p>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition">
                  Join
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
            Add Team Member
          </button>
          <button className="px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition">
            Share Network
          </button>
        </div>
      </div>
    </div>
  )
}
