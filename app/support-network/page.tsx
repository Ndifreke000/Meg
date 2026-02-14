'use client'

import { useState } from 'react'

export default function SupportNetworkPage() {
  const [activeTab, setActiveTab] = useState<'family' | 'professionals' | 'resources'>('family')

  const familyMembers = [
    {
      name: 'Mom',
      role: 'Primary Caregiver',
      icon: '👩',
      status: 'online',
      lastActive: 'Active now',
    },
    {
      name: 'Dad',
      role: 'Caregiver',
      icon: '👨',
      status: 'online',
      lastActive: '2 hours ago',
    },
    {
      name: 'Grandma',
      role: 'Support',
      icon: '👵',
      status: 'offline',
      lastActive: 'Yesterday',
    },
  ]

  const professionals = [
    {
      name: 'Dr. Sarah Johnson',
      specialty: 'Pediatric Psychologist',
      icon: '👩‍⚕️',
      nextAppointment: 'Feb 20, 2026',
      contact: 'Available via telehealth',
    },
    {
      name: 'Ms. Emily Chen',
      specialty: 'Occupational Therapist',
      icon: '👩‍🏫',
      nextAppointment: 'Feb 18, 2026',
      contact: 'In-person sessions',
    },
    {
      name: 'Mr. David Williams',
      specialty: 'Speech Therapist',
      icon: '👨‍🏫',
      nextAppointment: 'Feb 22, 2026',
      contact: 'Hybrid sessions',
    },
  ]

  const resources = [
    {
      title: 'ADHD Support Group',
      type: 'Community',
      description: 'Local parent support group meeting weekly',
      link: 'Join group',
    },
    {
      title: 'Sensory Processing Guide',
      type: 'Educational',
      description: 'Comprehensive guide for sensory activities',
      link: 'Download PDF',
    },
    {
      title: 'The Winford Centre',
      type: 'NGO',
      description: 'Children and women support services in Nigeria',
      link: 'Visit website',
    },
    {
      title: 'Focus & Attention Toolkit',
      type: 'Resource',
      description: 'Evidence-based strategies for ADHD',
      link: 'Access toolkit',
    },
  ]

  const sharedUpdates = [
    {
      author: 'Mom',
      time: '2 hours ago',
      message: 'Alex had a great focus session this morning! Completed all math activities.',
      reactions: 3,
    },
    {
      author: 'Dr. Johnson',
      time: '1 day ago',
      message: 'Reviewed weekly progress. Consider adding more sensory breaks in afternoon.',
      reactions: 5,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Support Network</h1>
          <p className="text-gray-600">Coordinate care with family and professionals</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          {(['family', 'professionals', 'resources'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-semibold capitalize transition-colors ${
                activeTab === tab
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Family Tab */}
        {activeTab === 'family' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {familyMembers.map((member, idx) => (
                <div key={idx} className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-4xl">{member.icon}</div>
                      <div>
                        <h3 className="font-bold text-gray-900">{member.name}</h3>
                        <p className="text-sm text-gray-600">{member.role}</p>
                      </div>
                    </div>
                    <div
                      className={`w-3 h-3 rounded-full ${
                        member.status === 'online' ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    />
                  </div>
                  <p className="text-xs text-gray-500">{member.lastActive}</p>
                  <button className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
                    Message
                  </button>
                </div>
              ))}
            </div>

            {/* Shared Updates */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Shared Updates</h2>
              <div className="space-y-4">
                {sharedUpdates.map((update, idx) => (
                  <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-900">{update.author}</span>
                      <span className="text-xs text-gray-500">{update.time}</span>
                    </div>
                    <p className="text-gray-700 mb-2">{update.message}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">❤️ {update.reactions}</span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-medium">
                Add Update
              </button>
            </div>
          </div>
        )}

        {/* Professionals Tab */}
        {activeTab === 'professionals' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {professionals.map((pro, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="text-5xl mb-4 text-center">{pro.icon}</div>
                <h3 className="font-bold text-gray-900 mb-1 text-center">{pro.name}</h3>
                <p className="text-sm text-gray-600 mb-4 text-center">{pro.specialty}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-500">📅</span>
                    <span className="text-gray-700">{pro.nextAppointment}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-500">💬</span>
                    <span className="text-gray-700">{pro.contact}</span>
                  </div>
                </div>

                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
                  Contact
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Resources Tab */}
        {activeTab === 'resources' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {resources.map((resource, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-gray-900">{resource.title}</h3>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded font-semibold">
                    {resource.type}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-4">{resource.description}</p>
                <button className="text-blue-600 font-semibold text-sm hover:underline">
                  {resource.link} →
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
