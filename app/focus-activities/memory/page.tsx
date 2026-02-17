'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Trophy, RefreshCcw } from 'lucide-react'

const EMOJIS = ['🚀', '🌟', '🎯', '🎨', '🎵', '🎮', '🏆', '💎']

export default function MemoryMatchPage() {
  const [cards, setCards] = useState<{ id: number; emoji: string; flipped: boolean; matched: boolean }[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'won'>('idle')
  const [startTime, setStartTime] = useState<number>(0)
  const [endTime, setEndTime] = useState<number>(0)

  const initializeGame = () => {
    const shuffledEmojis = [...EMOJIS, ...EMOJIS]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        flipped: false,
        matched: false,
      }))
    
    setCards(shuffledEmojis)
    setFlippedCards([])
    setMoves(0)
    setGameState('playing')
    setStartTime(Date.now())
  }

  const handleCardClick = (id: number) => {
    if (gameState !== 'playing' || flippedCards.length === 2) return
    
    const card = cards.find(c => c.id === id)
    if (!card || card.flipped || card.matched) return

    const newFlippedCards = [...flippedCards, id]
    setFlippedCards(newFlippedCards)
    
    setCards(prev => prev.map(c => 
      c.id === id ? { ...c, flipped: true } : c
    ))

    if (newFlippedCards.length === 2) {
      setMoves(prev => prev + 1)
      
      setTimeout(() => {
        const [first, second] = newFlippedCards
        const firstCard = cards.find(c => c.id === first)
        const secondCard = cards.find(c => c.id === second)
        
        if (firstCard?.emoji === secondCard?.emoji) {
          setCards(prev => prev.map(c => 
            c.id === first || c.id === second 
              ? { ...c, matched: true }
              : c
          ))
        } else {
          setCards(prev => prev.map(c => 
            c.id === first || c.id === second 
              ? { ...c, flipped: false }
              : c
          ))
        }
        
        setFlippedCards([])
      }, 1000)
    }
  }

  useEffect(() => {
    if (cards.length > 0 && cards.every(card => card.matched)) {
      setGameState('won')
      setEndTime(Date.now())
    }
  }, [cards])

  const getTimeElapsed = () => {
    if (gameState === 'won') {
      return Math.round((endTime - startTime) / 1000)
    }
    return 0
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4 md:p-8">
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
            <div className="w-24 h-24 bg-green-500 rounded-3xl flex items-center justify-center text-5xl mx-auto mb-8">
              🧩
            </div>
            <h1 className="text-5xl font-bold mb-4 text-gray-900">Memory Match</h1>
            <p className="text-xl text-gray-600 mb-12">
              Find all matching pairs by flipping cards!
            </p>
            <button
              onClick={initializeGame}
              className="px-12 py-4 bg-green-600 hover:bg-green-500 text-white rounded-2xl font-bold text-xl transition-all hover:scale-105"
            >
              Start Game
            </button>
          </div>
        )}

        {gameState === 'playing' && (
          <div className="space-y-8">
            <div className="flex justify-center">
              <div className="bg-white rounded-2xl px-6 py-4 shadow-lg">
                <p className="text-sm text-gray-600 mb-1">Moves</p>
                <p className="text-3xl font-bold text-green-600">{moves}</p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto">
              {cards.map((card) => (
                <button
                  key={card.id}
                  onClick={() => handleCardClick(card.id)}
                  className={`aspect-square rounded-2xl text-4xl font-bold transition-all duration-300 ${
                    card.flipped || card.matched
                      ? 'bg-white shadow-lg transform scale-105'
                      : 'bg-green-200 hover:bg-green-300 shadow-md'
                  }`}
                  disabled={card.matched}
                >
                  {card.flipped || card.matched ? card.emoji : '?'}
                </button>
              ))}
            </div>
          </div>
        )}

        {gameState === 'won' && (
          <div className="text-center py-20 bg-white rounded-3xl shadow-lg p-12">
            <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-6" />
            <h2 className="text-4xl font-bold mb-2 text-gray-900">Congratulations!</h2>
            <p className="text-gray-600 mb-8">You found all the pairs!</p>

            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-12">
              <div className="bg-green-50 rounded-2xl p-6">
                <p className="text-sm text-gray-600 mb-1">Moves</p>
                <p className="text-3xl font-bold text-green-600">{moves}</p>
              </div>
              <div className="bg-blue-50 rounded-2xl p-6">
                <p className="text-sm text-gray-600 mb-1">Time</p>
                <p className="text-3xl font-bold text-blue-600">{getTimeElapsed()}s</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={initializeGame}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-green-600 hover:bg-green-500 text-white rounded-2xl font-bold transition-all"
              >
                <RefreshCcw className="w-5 h-5" />
                Play Again
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
    </div>
  )
}