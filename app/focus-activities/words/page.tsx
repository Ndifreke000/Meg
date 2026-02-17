'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Trophy, RefreshCcw, Shuffle } from 'lucide-react'

const WORD_SETS = [
  { letters: ['C', 'A', 'T'], word: 'CAT', hint: 'A furry pet that meows' },
  { letters: ['D', 'O', 'G'], word: 'DOG', hint: 'A loyal pet that barks' },
  { letters: ['S', 'U', 'N'], word: 'SUN', hint: 'Bright star in the sky' },
  { letters: ['B', 'O', 'O', 'K'], word: 'BOOK', hint: 'You read this' },
  { letters: ['T', 'R', 'E', 'E'], word: 'TREE', hint: 'Tall plant with leaves' },
  { letters: ['F', 'I', 'S', 'H'], word: 'FISH', hint: 'Swims in water' },
  { letters: ['B', 'I', 'R', 'D'], word: 'BIRD', hint: 'Has wings and can fly' },
  { letters: ['H', 'O', 'U', 'S', 'E'], word: 'HOUSE', hint: 'Where people live' },
  { letters: ['W', 'A', 'T', 'E', 'R'], word: 'WATER', hint: 'You drink this' },
  { letters: ['H', 'A', 'P', 'P', 'Y'], word: 'HAPPY', hint: 'Feeling joyful' }
]

export default function WordBuilderPage() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [shuffledLetters, setShuffledLetters] = useState<string[]>([])
  const [userWord, setUserWord] = useState<string[]>([])
  const [score, setScore] = useState(0)
  const [gameState, setGameState] = useState<'playing' | 'correct' | 'complete'>('playing')
  const [showHint, setShowHint] = useState(false)

  const currentWordSet = WORD_SETS[currentWordIndex]

  useEffect(() => {
    shuffleLetters()
  }, [currentWordIndex])

  const shuffleLetters = () => {
    const letters = [...currentWordSet.letters]
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[letters[i], letters[j]] = [letters[j], letters[i]]
    }
    setShuffledLetters(letters)
    setUserWord([])
    setShowHint(false)
  }

  const addLetter = (letter: string, index: number) => {
    if (userWord.length < currentWordSet.word.length) {
      setUserWord(prev => [...prev, letter])
      setShuffledLetters(prev => prev.filter((_, i) => i !== index))
    }
  }

  const removeLetter = (index: number) => {
    const letter = userWord[index]
    setUserWord(prev => prev.filter((_, i) => i !== index))
    setShuffledLetters(prev => [...prev, letter])
  }

  const checkWord = () => {
    const userWordString = userWord.join('')
    if (userWordString === currentWordSet.word) {
      setScore(prev => prev + 1)
      setGameState('correct')
      
      setTimeout(() => {
        if (currentWordIndex < WORD_SETS.length - 1) {
          setCurrentWordIndex(prev => prev + 1)
          setGameState('playing')
        } else {
          setGameState('complete')
        }
      }, 2000)
    } else {
      // Wrong answer - shake animation could be added here
      setUserWord([])
      setShuffledLetters([...currentWordSet.letters].sort(() => Math.random() - 0.5))
    }
  }

  const resetGame = () => {
    setCurrentWordIndex(0)
    setScore(0)
    setGameState('playing')
    setUserWord([])
    setShowHint(false)
    shuffleLetters()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 p-4 md:p-8">
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
                <div className="w-12 h-12 bg-yellow-500 rounded-2xl flex items-center justify-center text-2xl">
                  ✏️
                </div>
                <h1 className="text-3xl font-bold text-gray-900">Word Builder</h1>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Word {currentWordIndex + 1} of {WORD_SETS.length}</p>
                <p className="text-lg font-semibold text-yellow-600">Score: {score}</p>
              </div>
            </div>

            <div className="mb-8">
              <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
                <div 
                  className="bg-yellow-500 h-2 rounded-full transition-all"
                  style={{ width: `${((currentWordIndex + 1) / WORD_SETS.length) * 100}%` }}
                />
              </div>

              {gameState === 'correct' && (
                <div className="text-center mb-6">
                  <div className="text-6xl mb-4">🎉</div>
                  <h2 className="text-3xl font-bold text-green-600">Correct!</h2>
                  <p className="text-gray-600">Great job spelling "{currentWordSet.word}"!</p>
                </div>
              )}

              {gameState === 'playing' && (
                <>
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                      Build the word using these letters:
                    </h2>
                    
                    {/* User's word area */}
                    <div className="flex justify-center gap-2 mb-6 min-h-[80px] items-center">
                      {Array.from({ length: currentWordSet.word.length }).map((_, index) => (
                        <div
                          key={index}
                          className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center text-2xl font-bold bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => userWord[index] && removeLetter(index)}
                        >
                          {userWord[index] || ''}
                        </div>
                      ))}
                    </div>

                    {/* Available letters */}
                    <div className="flex justify-center gap-3 mb-6 flex-wrap">
                      {shuffledLetters.map((letter, index) => (
                        <button
                          key={index}
                          onClick={() => addLetter(letter, index)}
                          className="w-16 h-16 bg-yellow-200 hover:bg-yellow-300 rounded-xl text-2xl font-bold transition-all hover:scale-105 shadow-md"
                        >
                          {letter}
                        </button>
                      ))}
                    </div>

                    {/* Action buttons */}
                    <div className="flex justify-center gap-4 mb-6">
                      <button
                        onClick={checkWord}
                        disabled={userWord.length !== currentWordSet.word.length}
                        className="px-6 py-3 bg-green-600 hover:bg-green-500 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-2xl font-bold transition-all"
                      >
                        Check Word
                      </button>
                      <button
                        onClick={shuffleLetters}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold transition-all"
                      >
                        <Shuffle className="w-5 h-5" />
                        Shuffle
                      </button>
                    </div>

                    {/* Hint section */}
                    <div className="text-center">
                      {!showHint ? (
                        <button
                          onClick={() => setShowHint(true)}
                          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-all"
                        >
                          Need a hint? 💡
                        </button>
                      ) : (
                        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg max-w-md mx-auto">
                          <p className="text-blue-800 font-medium">Hint: {currentWordSet.hint}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {gameState === 'complete' && (
          <div className="text-center py-20 bg-white rounded-3xl shadow-lg p-12">
            <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-6" />
            <h2 className="text-4xl font-bold mb-2 text-gray-900">Word Master!</h2>
            <p className="text-gray-600 mb-8">You've completed all the word challenges!</p>

            <div className="bg-yellow-50 rounded-2xl p-6 mb-8 max-w-md mx-auto">
              <p className="text-sm text-gray-600 mb-1">Words Completed</p>
              <p className="text-4xl font-bold text-yellow-600">{score} / {WORD_SETS.length}</p>
              <p className="text-sm text-gray-600 mt-2">
                {score === WORD_SETS.length ? 'Perfect! All words correct! 🎉' : 
                 score >= WORD_SETS.length * 0.8 ? 'Excellent spelling! 🌟' :
                 score >= WORD_SETS.length * 0.6 ? 'Good work! 👍' : 'Keep practicing! 💪'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={resetGame}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-yellow-600 hover:bg-yellow-500 text-white rounded-2xl font-bold transition-all"
              >
                <RefreshCcw className="w-5 h-5" />
                Play Again
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