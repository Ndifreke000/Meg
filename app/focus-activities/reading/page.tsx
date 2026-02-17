'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, BookOpen, Trophy } from 'lucide-react'

const STORIES = [
  {
    id: 1,
    title: "The Brave Little Robot",
    content: [
      "Once upon a time, in a world full of gadgets and gizmos, there lived a little robot named Beep.",
      "Beep was smaller than all the other robots, but he had the biggest heart in the entire factory.",
      "One day, the factory's main computer started acting strange. All the big robots were confused!",
      "But little Beep remembered something important his creator had taught him about problem-solving.",
      "He took a deep breath (well, as much as a robot can), and carefully examined each wire and circuit.",
      "With patience and determination, Beep found the loose connection and fixed the problem!",
      "All the robots cheered for Beep, and he learned that being small doesn't mean you can't do big things."
    ],
    questions: [
      {
        question: "What was the little robot's name?",
        options: ["Buzz", "Beep", "Boop", "Bolt"],
        correct: 1
      },
      {
        question: "What made Beep special?",
        options: ["He was the biggest", "He was the fastest", "He had the biggest heart", "He was the smartest"],
        correct: 2
      },
      {
        question: "What did Beep learn at the end?",
        options: ["Size doesn't matter for doing big things", "Robots are better than humans", "Factories are fun", "Computers are scary"],
        correct: 0
      }
    ]
  },
  {
    id: 2,
    title: "The Magic Garden",
    content: [
      "Emma discovered a secret garden behind her grandmother's house.",
      "The garden was filled with flowers that changed colors when she sang to them.",
      "Red roses turned blue, yellow sunflowers became purple, and white daisies sparkled like rainbows.",
      "Emma learned that the flowers responded to kindness and gentle care.",
      "She spent every afternoon singing lullabies and telling stories to the magical plants.",
      "Soon, the garden became the most beautiful place in the entire neighborhood.",
      "Emma realized that when we show love and care, beautiful things can happen."
    ],
    questions: [
      {
        question: "Where did Emma find the secret garden?",
        options: ["At school", "Behind grandmother's house", "In the park", "At the library"],
        correct: 1
      },
      {
        question: "What made the flowers change colors?",
        options: ["Rain", "Sunshine", "Emma's singing", "Magic water"],
        correct: 2
      },
      {
        question: "What did Emma learn?",
        options: ["Gardens are hard work", "Love and care create beauty", "Flowers are expensive", "Singing is difficult"],
        correct: 1
      }
    ]
  }
]

export default function StoryTimePage() {
  const [currentStory, setCurrentStory] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [showQuestions, setShowQuestions] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [gameComplete, setGameComplete] = useState(false)

  const startStory = (storyId: number) => {
    setCurrentStory(storyId)
    setCurrentPage(0)
    setShowQuestions(false)
    setCurrentQuestion(0)
    setScore(0)
    setGameComplete(false)
  }

  const nextPage = () => {
    const story = STORIES.find(s => s.id === currentStory)
    if (!story) return

    if (currentPage < story.content.length - 1) {
      setCurrentPage(prev => prev + 1)
    } else {
      setShowQuestions(true)
    }
  }

  const handleAnswer = (answerIndex: number) => {
    const story = STORIES.find(s => s.id === currentStory)
    if (!story) return

    if (answerIndex === story.questions[currentQuestion].correct) {
      setScore(prev => prev + 1)
    }

    if (currentQuestion < story.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      setGameComplete(true)
    }
  }

  const resetGame = () => {
    setCurrentStory(null)
    setCurrentPage(0)
    setShowQuestions(false)
    setCurrentQuestion(0)
    setScore(0)
    setGameComplete(false)
  }

  const story = STORIES.find(s => s.id === currentStory)

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/focus-activities"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition" />
          Back to Activities
        </Link>

        {!currentStory && (
          <div className="text-center py-20 bg-white rounded-3xl shadow-lg p-12">
            <div className="w-24 h-24 bg-orange-500 rounded-3xl flex items-center justify-center text-5xl mx-auto mb-8">
              📚
            </div>
            <h1 className="text-5xl font-bold mb-4 text-gray-900">Story Time</h1>
            <p className="text-xl text-gray-600 mb-12">
              Choose a story to read and answer questions!
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              {STORIES.map((story) => (
                <button
                  key={story.id}
                  onClick={() => startStory(story.id)}
                  className="p-6 bg-orange-100 hover:bg-orange-200 rounded-2xl transition-all hover:scale-105 text-left"
                >
                  <BookOpen className="w-8 h-8 text-orange-600 mb-3" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{story.title}</h3>
                  <p className="text-gray-600 text-sm">{story.content.length} pages</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {currentStory && story && !showQuestions && !gameComplete && (
          <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">{story.title}</h2>
              <div className="text-sm text-gray-500">
                Page {currentPage + 1} of {story.content.length}
              </div>
            </div>

            <div className="mb-8">
              <p className="text-lg leading-relaxed text-gray-700 min-h-[120px]">
                {story.content[currentPage]}
              </p>
            </div>

            <div className="flex justify-between items-center">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-orange-500 h-2 rounded-full transition-all"
                  style={{ width: `${((currentPage + 1) / story.content.length) * 100}%` }}
                />
              </div>
              <button
                onClick={nextPage}
                className="ml-6 px-8 py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-2xl font-bold transition-all"
              >
                {currentPage < story.content.length - 1 ? 'Next Page' : 'Answer Questions'}
              </button>
            </div>
          </div>
        )}

        {showQuestions && story && !gameComplete && (
          <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Question Time!</h2>
              <p className="text-gray-600">Question {currentQuestion + 1} of {story.questions.length}</p>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
                {story.questions[currentQuestion].question}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {story.questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    className="p-4 bg-orange-100 hover:bg-orange-200 rounded-2xl transition-all hover:scale-105 text-left font-medium"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {gameComplete && story && (
          <div className="text-center py-20 bg-white rounded-3xl shadow-lg p-12">
            <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-6" />
            <h2 className="text-4xl font-bold mb-2 text-gray-900">Story Complete!</h2>
            <p className="text-gray-600 mb-8">Great job reading "{story.title}"!</p>

            <div className="bg-orange-50 rounded-2xl p-6 mb-8 max-w-md mx-auto">
              <p className="text-sm text-gray-600 mb-1">Questions Correct</p>
              <p className="text-4xl font-bold text-orange-600">{score} / {story.questions.length}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={resetGame}
                className="px-8 py-4 bg-orange-600 hover:bg-orange-500 text-white rounded-2xl font-bold transition-all"
              >
                Read Another Story
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