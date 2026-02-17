'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { ArrowLeft, Rocket, Star, Trophy, RefreshCcw } from 'lucide-react'

export default function SpaceMathPage() {
    const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle')
    const [question, setQuestion] = useState({ a: 0, b: 0, op: '+', answer: 0 })
    const [userInput, setUserInput] = useState('')
    const [score, setScore] = useState(0)
    const [timeLeft, setTimeLeft] = useState(60)
    const [streak, setStreak] = useState(0)
    const [highScore, setHighScore] = useState(0)

    const generateQuestion = useCallback(() => {
        const ops = ['+', '-', '*']
        const op = ops[Math.floor(Math.random() * ops.length)]
        let a, b, answer

        if (op === '+') {
            a = Math.floor(Math.random() * 50) + 1
            b = Math.floor(Math.random() * 50) + 1
            answer = a + b
        } else if (op === '-') {
            a = Math.floor(Math.random() * 50) + 10
            b = Math.floor(Math.random() * a) + 1
            answer = a - b
        } else {
            a = Math.floor(Math.random() * 12) + 1
            b = Math.floor(Math.random() * 12) + 1
            answer = a * b
        }

        setQuestion({ a, b, op, answer })
    }, [])

    const startGame = () => {
        setGameState('playing')
        setScore(0)
        setTimeLeft(60)
        setStreak(0)
        setUserInput('')
        generateQuestion()
    }

    useEffect(() => {
        let timer: NodeJS.Timeout
        if (gameState === 'playing' && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1)
            }, 1000)
        } else if (timeLeft === 0) {
            setGameState('gameover')
            if (score > highScore) setHighScore(score)
        }
        return () => clearInterval(timer)
    }, [gameState, timeLeft, score, highScore])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setUserInput(value)

        if (parseInt(value) === question.answer) {
            setScore((prev) => prev + 10 + streak)
            setStreak((prev) => prev + 1)
            setUserInput('')
            generateQuestion()
        }
    }

    return (
        <div className="min-h-screen bg-[#0B0E14] text-white p-4 md:p-8 font-sans overflow-hidden relative">
            {/* Stars Background */}
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(50)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full bg-white animate-pulse"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            width: `${Math.random() * 3}px`,
                            height: `${Math.random() * 3}px`,
                            animationDelay: `${Math.random() * 5}s`,
                            opacity: Math.random(),
                        }}
                    />
                ))}
            </div>

            <div className="max-w-4xl mx-auto relative z-10">
                <Link
                    href="/focus-activities"
                    className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition mb-8 group"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition" />
                    Back to Activities
                </Link>

                {gameState === 'idle' && (
                    <div className="text-center py-20 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-12">
                        <div className="w-24 h-24 bg-blue-500 rounded-3xl flex items-center justify-center text-5xl mx-auto mb-8 animate-bounce">
                            🚀
                        </div>
                        <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            Space Math
                        </h1>
                        <p className="text-xl text-gray-400 mb-12">
                            Solve as many math problems as possible in 60 seconds!
                        </p>
                        <button
                            onClick={startGame}
                            className="px-12 py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-bold text-xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/20"
                        >
                            Launch Mission
                        </button>
                    </div>
                )}

                {gameState === 'playing' && (
                    <div className="space-y-8">
                        <div className="flex justify-between items-center">
                            <div className="bg-white/5 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10">
                                <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">Time Left</p>
                                <p className={`text-3xl font-mono font-bold ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-blue-400'}`}>
                                    {timeLeft}s
                                </p>
                            </div>
                            <div className="bg-white/5 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10 text-right">
                                <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">Score</p>
                                <div className="flex items-center gap-3">
                                    {streak > 5 && <Star className="w-6 h-6 text-yellow-400 animate-spin" />}
                                    <p className="text-3xl font-mono font-bold text-green-400">{score.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-12 text-center relative overflow-hidden">
                            {/* Streak Indicator */}
                            {streak > 0 && (
                                <div className="absolute top-4 right-4 bg-yellow-400/20 text-yellow-400 px-4 py-1 rounded-full text-sm font-bold border border-yellow-400/30">
                                    {streak}x Combo!
                                </div>
                            )}

                            <div className="mb-12">
                                <p className="text-sm text-gray-400 mb-4">Calculate the mission course:</p>
                                <div className="text-7xl font-mono font-black tracking-tighter flex items-center justify-center gap-8">
                                    <span>{question.a}</span>
                                    <span className="text-blue-500">{question.op}</span>
                                    <span>{question.b}</span>
                                    <span className="text-gray-600">=</span>
                                </div>
                            </div>

                            <input
                                type="number"
                                value={userInput}
                                onChange={handleInputChange}
                                autoFocus
                                className="w-full max-w-sm bg-white/10 border-2 border-white/20 rounded-2xl px-8 py-6 text-4xl text-center focus:outline-none focus:border-blue-500 transition-all font-mono"
                                placeholder="?"
                            />
                        </div>

                        <div className="flex justify-center">
                            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden max-w-2xl">
                                <div
                                    className="h-full bg-blue-500 transition-all duration-1000"
                                    style={{ width: `${(timeLeft / 60) * 100}%` }}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {gameState === 'gameover' && (
                    <div className="text-center py-20 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-12">
                        <Trophy className="w-20 h-20 text-yellow-400 mx-auto mb-6" />
                        <h2 className="text-4xl font-bold mb-2">Mission Complete!</h2>
                        <p className="text-gray-400 mb-8">Great job astronaut!</p>

                        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-12">
                            <div className="bg-white/5 rounded-2xl p-6">
                                <p className="text-sm text-gray-400 mb-1">Total Score</p>
                                <p className="text-3xl font-bold text-green-400">{score}</p>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-6">
                                <p className="text-sm text-gray-400 mb-1">Best Score</p>
                                <p className="text-3xl font-bold text-blue-400">{highScore}</p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={startGame}
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-bold transition-all"
                            >
                                <RefreshCcw className="w-5 h-5" />
                                Try Again
                            </button>
                            <Link
                                href="/focus-activities"
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 rounded-2xl font-bold transition-all"
                            >
                                Return to Base
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
