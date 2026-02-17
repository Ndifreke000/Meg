'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Trophy, RefreshCcw, Brain } from 'lucide-react'

const LOGIC_PUZZLES = [
  {
    id: 1,
    question: "If all cats are animals, and Fluffy is a cat, what can we conclude?",
    options: ["Fluffy is an animal", "Fluffy is not an animal", "We can't tell", "Fluffy is a dog"],
    correct: 0,
    explanation: "Since all cats are animals and Fluffy is a cat, Fluffy must be an animal."
  },
  {
    id: 2,
    question: "What comes next in this sequence: 2, 4, 8, 16, ?",
    options: ["24", "32", "20", "18"],
    correct: 1,
    explanation: "Each number is doubled: 2×2=4, 4×2=8, 8×2=16, 16×2=32"
  },
  {
    id: 3,
    question: "If it takes 5 machines 5 minutes to make 5 widgets, how long does it take 100 machines to make 100 widgets?",
    options: ["100 minutes", "20 minutes", "5 minutes", "1 minute"],
    correct: 2,
    explanation: "Each machine makes 1 widget in 5 minutes, so 100 machines make 100 widgets in 5 minutes."
  },
  {
    id: 4,
    question: "Which shape doesn't belong: Circle, Square, Triangle, Red?",
    options: ["Circle", "Square", "Triangle", "Red"],
    correct: 3,
    explanation: "Red is a color, while the others are shapes."
  },
  {
    id: 5,
    question: "If some birds can fly, and penguins are birds, can all penguins fly?",
    options: ["Yes, all penguins can fly", "No, not all penguins can fly", "Only some penguins can fly", "We need more information"],
    correct: 1,
    explanation: "Just because some birds can fly doesn't mean ALL birds can fly. Penguins are birds that cannot fly."
  },
  {
    id: 6,
    question: "What's the missing number: 1, 1, 2, 3, 5, 8, ?",
    options: ["11", "13", "15", "10"],
    correct: 1,
    explanation: "This is the Fibonacci sequence: each number is the sum of the two before it. 5+8=13"
  }
]

export default function LogicQuestPage() {
  const [currentPuzzle, setCurrentPuzzle] = useState(0)
  const [score, setScore] = useState(0)
  const [gameState, setGameState] = useState<'playing' | 'answered' | 'complete'>('playing')
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)

  const handleAnswer = (answerIndex: number) => {
    if (gameState !== 'playing') return
    
    setSelectedAnswer(answerIndex)
    setGameState('answered')
    setShowExplanation(true)
    
    if (answerIndex === LOGIC_PUZZLES[currentPuzzle].correct) {
      setScore(prev => prev + 1)
    }
  }

  const nextPuzzle = () => {
    if (currentPuzzle < LOGIC_PUZZLES.length - 1) {
      setCurrentPuzzle(prev => prev + 1)
      setGameState('playing')
      setSelectedAnswer(null)
      setShowExplanation(false)
    } else {
      setGameState('complete')
    }
  }

  const resetGame = () => {
    setCurrentPuzzle(0)
    setScore(0)
    setGameState('playing')
    setSelectedAnswer(null)
    setShowExplanation(false)
  }

  const puzzle = LOGIC_PUZZLES[currentPuzzle]

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/focus-activities"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition" />
          Back to Activities
        </Link>

        {gameState !== 'complete' && (
          <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <Brain className="w-8 h-8 text-red-600" />
                <h1 className="text-3xl font-bold text-gray-900">Logic Quest</h1>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Question {currentPuzzle + 1} of {LOGIC_PUZZLES.length}</p>
                <p className="text-lg font-semibold text-red-600">Score: {score}</p>
              </div>
            </div>

            <div className="mb-8">
              <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
                <div 
                  className="bg-red-500 h-2 rounded-full transition-all"
                  style={{ width: `${((currentPuzzle + 1) / LOGIC_PUZZLES.length) * 100}%` }}
                />
              </div>

              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                {puzzle.question}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {puzzle.options.map((option, index) => {
                  let buttonClass = "p-4 rounded-2xl transition-all font-medium text-left "
                  
                  if (gameState === 'playing') {
                    buttonClass += "bg-red-100 hover:bg-red-200 hover:scale-105"
                  } else {
                    if (index === puzzle.correct) {
                      buttonClass += "bg-green-200 border-2 border-green-500"
                    } else if (index === selectedAnswer && index !== puzzle.correct) {
                      buttonClass += "bg-red-200 border-2 border-red-500"
                    } else {
                      buttonClass += "bg-gray-100"
                    }
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswer(index)}
                      disabled={gameState !== 'playing'}
                      className={buttonClass}
                    >
                      {option}
                    </button>
                  )
                })}
              </div>

              {showExplanation && (
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Explanation:</h3>
                  <p className="text-blue-800">{puzzle.explanation}</p>
                </div>
              )}
            </div>

            {gameState === 'answered' && (
              <div className="text-center">
                <button
                  onClick={nextPuzzle}
                  className="px-8 py-4 bg-red-600 hover:bg-red-500 text-white rounded-2xl font-bold transition-all"
                >
                  {currentPuzzle < LOGIC_PUZZLES.length - 1 ? 'Next Puzzle' : 'See Results'}
                </button>
              </div>
            )}
          </div>
        )}

        {gameState === 'complete' && (
          <div className="text-center py-20 bg-white rounded-3xl shadow-lg p-12">
            <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-6" />
            <h2 className="text-4xl font-bold mb-2 text-gray-900">Quest Complete!</h2>
            <p className="text-gray-600 mb-8">You've completed all the logic puzzles!</p>

            <div className="bg-red-50 rounded-2xl p-6 mb-8 max-w-md mx-auto">
              <p className="text-sm text-gray-600 mb-1">Final Score</p>
              <p className="text-4xl font-bold text-red-600">{score} / {LOGIC_PUZZLES.length}</p>
              <p className="text-sm text-gray-600 mt-2">
                {score === LOGIC_PUZZLES.length ? 'Perfect Score! 🎉' : 
                 score >= LOGIC_PUZZLES.length * 0.8 ? 'Excellent Work! 🌟' :
                 score >= LOGIC_PUZZLES.length * 0.6 ? 'Good Job! 👍' : 'Keep Practicing! 💪'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={resetGame}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-red-600 hover:bg-red-500 text-white rounded-2xl font-bold transition-all"
              >
                <RefreshCcw className="w-5 h-5" />
                Try Again
              </button>
              <Link
                href="/focus-activities"
                className="inline-flex items-center justify-center px-8 py-4 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-2xl font-bold transition-all"
              >
                Back to Activities
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}