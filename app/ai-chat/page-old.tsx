'use client'

import { useState } from 'react'

export default function AIChatPage() {
  const [message, setMessage] = useState('')
  
  const chatHistory = [
    {
      role: 'assistant',
      message: "Hi Alex! I'm your AI helper. How are you feeling today?",
      time: '10:00 AM',
    },
    {
      role: 'user',
      message: "I'm feeling good!",
      time: '10:01 AM',
    },
    {
      role: 'assistant',
      message: "That's wonderful! I noticed you completed your morning routine perfectly. Would you like to try the Space Math game now?",
      time: '10:01 AM',
    },
    {
      role: 'user',
      message: "Yes, let's play!",
      time: '10:02 AM',
    },
  ]

  const quickActions = [
    { label: 'How am I doing?', icon: '📊' },
    { label: 'Start activity', icon: '🎮' },
    { label: 'Take a break', icon: '☕' },
    { label: 'Talk to parent', icon: '👨‍👩‍👧' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Assistant</h1>
          <p className="text-gray-600">Chat with your helpful AI companion</p>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 bg-white rounded-2xl border-2 border-gray-200 p-6 mb-6 overflow-y-auto">
          <div className="space-y-4">
            {chatHistory.map((chat, idx) => (
              <div
                key={idx}
                className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-2xl p-4 ${
                    chat.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="mb-1">{chat.message}</p>
                  <p
                    className={`text-xs ${
                      chat.role === 'user' ? 'text-blue-200' : 'text-gray-500'
                    }`}
                  >
                    {chat.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Quick actions:</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {quickActions.map((action, idx) => (
              <button
                key={idx}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition"
              >
                <span className="mr-2">{action.icon}</span>
                {action.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="flex gap-3">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-6 py-4 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 text-gray-900"
          />
          <button className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition">
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
