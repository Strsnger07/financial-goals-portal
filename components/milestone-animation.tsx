"use client"

import { useEffect, useState } from "react"
import { Star } from "lucide-react"

interface MilestoneAnimationProps {
  milestone: number
  onComplete: () => void
}

export function MilestoneAnimation({ milestone, onComplete }: MilestoneAnimationProps) {
  const [show, setShow] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false)
      setTimeout(onComplete, 500)
    }, 3000)

    return () => clearTimeout(timer)
  }, [onComplete])

  const getMilestoneInfo = () => {
    switch (milestone) {
      case 25:
        return { emoji: "🥉", title: "Great Start!", color: "from-orange-400 to-orange-600" }
      case 50:
        return { emoji: "🥈", title: "Halfway There!", color: "from-gray-400 to-gray-600" }
      case 75:
        return { emoji: "🥇", title: "Almost Done!", color: "from-yellow-400 to-yellow-600" }
      default:
        return { emoji: "🎉", title: "Milestone Reached!", color: "from-blue-400 to-blue-600" }
    }
  }

  const info = getMilestoneInfo()

  if (!show) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className={`bg-gradient-to-r ${info.color} p-8 rounded-lg text-white text-center shadow-2xl animate-bounce`}>
        <div className="text-6xl mb-4 animate-pulse">{info.emoji}</div>
        <h2 className="text-2xl font-bold mb-2">{info.title}</h2>
        <p className="text-lg">You've reached {milestone}% of your goal!</p>
        <div className="flex justify-center mt-4">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-6 h-6 text-yellow-300 mx-1 animate-pulse" fill="currentColor" />
          ))}
        </div>
      </div>
    </div>
  )
}
