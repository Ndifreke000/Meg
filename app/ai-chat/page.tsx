'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { api } from '@/lib/api'
import { toast } from 'sonner'

interface ChatMessage {
  role: 'user' | 'assistant'
  message: string
  time: string
}

export default function AIChatPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [message, setMessage] = useState('')
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      message: "Hi! I'm your AI helper powered by MedGemma. I'm here to support you and answer any questions you might have. How are you feeling today?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  const sendMessage = async () => {
    if (!message.trim() || isLoading) return

    const userMessage: ChatMessage = {
      role: 'user',
      message: message.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setChatHistory(prev => [...prev, userMessage])
    setMessage('')
    setIsLoading(true)

    try {
      const response = await api.chatWithAI(userMessage.message)
      
      const aiMessage: ChatMessage = {
        role: 'assistant',
        message: response.response,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }

      setChatHistory(prev => [...prev, aiMessage])
    } catch (error) {
      toast.error('Failed to get AI response')
      const errorMessage: ChatMessage = {
        role: 'assistant',
        message: "I'm sorry, I'm having trouble connecting right now. Can you try asking me something else?",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
      setChatHistory(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const quickActions = [
    { label: 'How am I doing?', icon: '📊' },
    { label: 'I need help focusing', icon: '🎯' },
    { label: 'I feel anxious', icon: '😰' },
    { label: 'Tell me a story', icon: '📚' },
  ]

  const handleQuickAction = (action: string) => {
    setMessage(action)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Assistant</h1>
          <p className="text-gray-600">Chat with your helpful AI companion powered by MedGemma</p>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 bg-white rounded-2xl border-2 border-gray-200 p-6 mb-6 overflow-y-auto max-h-96">
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
                  <p className="mb-1 whitespace-pre-wrap">{chat.message}</p>
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
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-900 rounded-2xl p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Quick actions:</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {quickActions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickAction(action.label)}
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
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-1 px-6 py-4 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 text-gray-900 disabled:opacity-50"
          />
          <button 
            onClick={sendMessage}
            disabled={!message.trim() || isLoading}
            className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  )
}