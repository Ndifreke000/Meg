'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Trophy, RefreshCcw } from 'lucide-react'

const COLORS = ['red', 'blue', 'green', 'yellow', 'purple', 'orange']
const SHAPES = ['circle', 'square', 'triangle']

export default function PatternPuzzlePage() {
  const [pattern, setPattern] = useState<string[]>([])
  const [userPattern, setUserPattern] = useState<string[]>([])
  const [gameState, setGameState] = useState<'idle' | 'showing' | 'playing' | 'correct' | 'wrong'>('idle')
  const [level, setLevel] = useState(1)
  const [score, setScore] = useState(0)

  const generatePattern = (length: number) => {
    const newPattern = []
    for (let i = 0; i < length; i++) {
      const color = COLORS[Math.floor(Math.random() * COLORS.length)]
      const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)]
      newPattern.push(`${color}-${shape}`)
    }
    return newPattern
  }

  const startGame = () => {
    setLevel(1)
    setScore(0)
    startLevel(1)
  }

  const startLevel = (currentLevel: number) => {
    const newPattern = generatePattern(currentLevel + 2)
    setPattern(newPattern)
    setUserPattern([])
    setGameState('showing')
    
    setTimeout(() => {
      setGameState('playing')
    }, (currentLevel + 2) * 1000)
  }

  const handleShapeClick = (colorShape: string) => {
    if (gameState !== 'playing') return
    
    const newUserPattern = [...userPattern, colorShape]
    setUserPattern(newUserPattern)
    
    if (newUserPattern.length === pattern.length) {
      const isCorrect = newUserPattern.every((item, index) => item === pattern[index])
      
      if (isCorrect) {
        setGameState('correct')
        setScore(prev => prev + level * 10)
        setTimeout(() => {
          setLevel(prev => prev + 1)
          startLevel(level + 1)
        }, 1500)
      } else {
        setGameState('wrong')
      }
    }
  }

  const getShapeComponent = (colorShape: string, size = 'w-16 h-16') => {
    const [color, shape] = colorShape.split('-')
    const colorClass = {
      red: 'bg-red-500',
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      yellow: 'bg-yellow-500',
      purple: 'bg-purple-500',
      orange: 'bg-orange-500'
    }[color]

    if (shape === 'circle') {
      return <div className={`${size} ${colorClass} rounded-full`} />
    } else if (shape === 'triangle') {
      return (
        <div className={`${size} relative`}>
          <div className={`w-0 h-0 border-l-8 border-r-8 border-b-16 border-transparent ${colorClass.replace('bg-', 'border-b-')}`} 
               style={{ borderBottomWidth: '32px', borderLeftWidth: '32px', borderRightWidth: '32px' }} />
        </div>
      )
    } else {
      return <div className={`${size} ${colorClass}`} />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/focus-activities"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition" />
          Back to Activities
        </Link>

        {gameState === 'idle' && (
          <div className="text-center py-20 bg-white rounded-3xl shadow-lg p-12">
            <div className="w-24 h-24 bg-purple-500 rounded-3xl flex items-center justify-center text-5xl mx-auto mb-8">
              🎨
            </div>
            <h1 className="text-5xl font-bold mb-4 text-gray-900">Pattern Puzzle</h1>
            <p className="text-xl text-gray-600 mb-12">
              Remember the pattern and recreate it!
            </p>
            <button
              onClick={startGame}
              className="px-12 py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl font-bold text-xl transition-all hover:scale-105"
            >
              Start Challenge
            </button>
          </div>
        )}

        {(gameState === 'showing' || gameState === 'playing' || gameState === 'correct' || gameState === 'wrong') && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <div className="bg-white rounded-2xl px-6 py-4 shadow-lg">
                <p className="text-sm text-gray-600 mb-1">Level</p>
                <p className="text-3xl font-bold text-purple-600">{level}</p>
              </div>
              <div className="bg-white rounded-2xl px-6 py-4 shadow-lg">
                <p className="text-sm text-gray-600 mb-1">Score</p>
                <p className="text-3xl font-bold text-green-600">{score}</p>
              </div>
            </div>

            {gameState === 'showing' && (
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-6 text-gray-900">Remember this pattern:</h2>
                <div className="flex justify-center gap-4 mb-8">
                  {pattern.map((colorShape, index) => (
                    <div key={index} className="animate-pulse">
                      {getShapeComponent(colorShape)}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {gameState === 'playing' && (
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-6 text-gray-900">Recreate the pattern:</h2>
                <div className="flex justify-center gap-4 mb-8 min-h-[64px]">
                  {userPattern.map((colorShape, index) => (
                    <div key={index}>
                      {getShapeComponent(colorShape)}
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-6 gap-4 max-w-2xl mx-auto">
                  {COLORS.map(color => 
                    SHAPES.map(shape => (
                      <button
                        key={`${color}-${shape}`}
                        onClick={() => handleShapeClick(`${color}-${shape}`)}
                        className="p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-all hover:scale-105"
                      >
                        {getShapeComponent(`${color}-${shape}`, 'w-12 h-12')}
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}

            {gameState === 'correct' && (
              <div className="text-center">
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-3xl font-bold text-green-600 mb-4">Perfect!</h2>
                <p className="text-gray-600">Moving to level {level + 1}...</p>
              </div>
            )}

            {gameState === 'wrong' && (
              <div className="text-center py-20 bg-white rounded-3xl shadow-lg p-12">
                <div className="text-6xl mb-4">😅</div>
                <h2 className="text-3xl font-bold text-red-600 mb-4">Not quite right!</h2>
                <p className="text-gray-600 mb-8">You reached level {level}</p>
                
                <div className="bg-purple-50 rounded-2xl p-6 mb-8">
                  <p className="text-sm text-gray-600 mb-1">Final Score</p>
                  <p className="text-4xl font-bold text-purple-600">{score}</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={startGame}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl font-bold transition-all"
                  >
                    <RefreshCcw className="w-5 h-5" />
                    Try Again
                  </button>
                  <Link
                    href="/focus-activities"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-2xl font-bold transition-all"
                  >
                    Back to Activities
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}