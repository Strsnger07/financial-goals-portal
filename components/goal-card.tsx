"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Plus, Calendar } from "lucide-react"
import { ContributeDialog } from "@/components/contribute-dialog"
import { MilestoneAnimation } from "@/components/milestone-animation"
import { useCurrency } from "@/contexts/currency-context"

interface Goal {
  id: string
  name: string
  targetAmount: number
  deadline: string
  category: string
  progress: number
  contributed: number
  createdAt: Date | { toDate: () => Date }
  milestoneReached: number[]
}

interface GoalCardProps {
  goal: Goal
}

export function GoalCard({ goal }: GoalCardProps) {
  const [showContributeDialog, setShowContributeDialog] = useState(false)
  const [showMilestone, setShowMilestone] = useState<number | null>(null)
  const { formatCurrency } = useCurrency()

  const progressPercentage = (goal.contributed / goal.targetAmount) * 100
  const remainingAmount = goal.targetAmount - goal.contributed
  const daysLeft = Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

  const getStatusBadge = () => {
    if (progressPercentage >= 100) return <Badge className="bg-green-500 hover:bg-green-600">Completed</Badge>
    if (daysLeft < 0) return <Badge variant="destructive">Overdue</Badge>
    if (daysLeft <= 7) return <Badge variant="destructive">Due Soon</Badge>
    return <Badge variant="secondary">Active</Badge>
  }

  return (
    <>
      <Card className="hover:shadow-lg transition-shadow bg-gray-900 border-gray-700">
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg text-gray-100">{goal.name}</CardTitle>
            {getStatusBadge()}
          </div>
          <div className="flex items-center text-sm text-gray-400">
            <Calendar className="mr-1 h-4 w-4" />
            {new Date(goal.deadline).toLocaleDateString()}
            {daysLeft >= 0 && <span className="ml-2">({daysLeft} days left)</span>}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-300">
              <span>Progress</span>
              <span>{progressPercentage.toFixed(1)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-400">Contributed</p>
              <p className="font-semibold text-gray-100">{formatCurrency(goal.contributed)}</p>
            </div>
            <div>
              <p className="text-gray-400">Target</p>
              <p className="font-semibold text-gray-100">{formatCurrency(goal.targetAmount)}</p>
            </div>
          </div>

          <div className="text-sm">
            <p className="text-gray-400">Remaining</p>
            <p className="font-semibold text-blue-400">{formatCurrency(remainingAmount)}</p>
          </div>

          <div className="flex items-center justify-between">
            <Badge variant="outline" className="border-gray-600 text-gray-300">{goal.category}</Badge>
            <Button size="sm" onClick={() => setShowContributeDialog(true)} disabled={progressPercentage >= 100}>
              <Plus className="mr-1 h-4 w-4" />
              Add Funds
            </Button>
          </div>

          {/* Milestone badges */}
          <div className="flex space-x-1">
            {[25, 50, 75].map((milestone) => (
              <div
                key={milestone}
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  goal.milestoneReached?.includes(milestone)
                    ? "bg-green-500 text-white"
                    : progressPercentage >= milestone
                      ? "bg-yellow-500 text-white"
                      : "bg-gray-700 text-gray-400"
                }`}
              >
                {milestone === 25 ? "🥉" : milestone === 50 ? "🥈" : "🥇"}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <ContributeDialog
        goal={goal}
        open={showContributeDialog}
        onOpenChange={setShowContributeDialog}
        onMilestoneReached={setShowMilestone}
      />

      {showMilestone && <MilestoneAnimation milestone={showMilestone} onComplete={() => setShowMilestone(null)} />}
    </>
  )
}
