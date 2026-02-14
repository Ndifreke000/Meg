'use client'

export default function ProgramsPage() {
  const programs = [
    {
      title: 'Focus Builder',
      description: 'Cognitive activities to improve attention span',
      progress: 75,
      sessions: 12,
      totalSessions: 16,
      color: 'bg-blue-500',
    },
    {
      title: 'Social Skills',
      description: 'Interactive exercises for communication',
      progress: 45,
      sessions: 9,
      totalSessions: 20,
      color: 'bg-green-500',
    },
    {
      title: 'Emotional Regulation',
      description: 'Techniques for managing emotions',
      progress: 60,
      sessions: 6,
      totalSessions: 10,
      color: 'bg-purple-500',
    },
  ]

  const weeklyStats = [
    { day: 'Mon', focus: 8, mood: 7 },
    { day: 'Tue', focus: 7, mood: 8 },
    { day: 'Wed', focus: 9, mood: 9 },
    { day: 'Thu', focus: 6, mood: 7 },
    { day: 'Fri', focus: 8, mood: 8 },
    { day: 'Sat', focus: 7, mood: 9 },
    { day: 'Sun', focus: 8, mood: 8 },
  ]

  const achievements = [
    { title: '7-Day Streak', icon: '🔥', earned: true },
    { title: 'Focus Master', icon: '🎯', earned: true },
    { title: 'Social Star', icon: '⭐', earned: false },
    { title: 'Calm Champion', icon: '🧘', earned: true },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Programs & Analytics</h1>
          <p className="text-gray-600">Track progress across therapeutic programs</p>
        </div>

        {/* Active Programs */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Active Programs</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {programs.map((program, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition">
                <h3 className="font-bold text-gray-900 mb-2">{program.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{program.description}</p>
                
                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{program.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`${program.color} h-2 rounded-full transition-all`}
                      style={{ width: `${program.progress}%` }}
                    />
                  </div>
                </div>

                <p className="text-sm text-gray-600">
                  {program.sessions} of {program.totalSessions} sessions completed
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Analytics */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Weekly Analytics</h2>
          
          {/* Simple Bar Chart */}
          <div className="flex items-end justify-between gap-2 h-48 mb-4">
            {weeklyStats.map((stat, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex flex-col gap-1">
                  <div
                    className="bg-blue-500 rounded-t"
                    style={{ height: `${stat.focus * 10}px` }}
                    title={`Focus: ${stat.focus}`}
                  />
                  <div
                    className="bg-green-500 rounded-t"
                    style={{ height: `${stat.mood * 10}px` }}
                    title={`Mood: ${stat.mood}`}
                  />
                </div>
                <span className="text-xs text-gray-600 font-medium">{stat.day}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-6 justify-center">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded" />
              <span className="text-sm text-gray-600">Focus Score</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded" />
              <span className="text-sm text-gray-600">Mood Score</span>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Achievements</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {achievements.map((achievement, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl text-center ${
                  achievement.earned ? 'bg-yellow-50 border-2 border-yellow-300' : 'bg-gray-100'
                }`}
              >
                <div className={`text-4xl mb-2 ${!achievement.earned && 'opacity-30'}`}>
                  {achievement.icon}
                </div>
                <p className={`text-sm font-semibold ${achievement.earned ? 'text-gray-900' : 'text-gray-400'}`}>
                  {achievement.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
