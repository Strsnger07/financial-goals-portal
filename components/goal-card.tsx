"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Plus, Calendar, Trash2, AlertTriangle } from "lucide-react"
import { ContributeDialog } from "@/components/contribute-dialog"
import { MilestoneAnimation } from "@/components/milestone-animation"
import { useCurrency } from "@/contexts/currency-context"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { db } from "@/lib/firebase"
import { doc, deleteDoc } from "firebase/firestore"

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
  onGoalDeleted?: (goalId: string) => void
}

export function GoalCard({ goal, onGoalDeleted }: GoalCardProps) {
  const [showContributeDialog, setShowContributeDialog] = useState(false)
  const [showMilestone, setShowMilestone] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const { formatCurrency } = useCurrency()
  const { toast } = useToast()

  const progressPercentage = (goal.contributed / goal.targetAmount) * 100
  const remainingAmount = goal.targetAmount - goal.contributed
  const daysLeft = Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

  const getStatusBadge = () => {
    if (progressPercentage >= 100) return <Badge className="bg-green-500 hover:bg-green-600">Completed</Badge>
    if (daysLeft < 0) return <Badge variant="destructive">Overdue</Badge>
    if (daysLeft <= 7) return <Badge variant="destructive">Due Soon</Badge>
    return <Badge variant="secondary">Active</Badge>
  }

  const handleDeleteGoal = async () => {
    setIsDeleting(true)
    try {
      if (!db) {
        throw new Error("Firebase not initialized")
      }

      // Delete directly from Firebase
      const goalRef = doc(db, "goals", goal.id)
      await deleteDoc(goalRef)

      toast({
        title: "Goal Deleted",
        description: "Your goal has been successfully deleted.",
      })
      onGoalDeleted?.(goal.id)
    } catch (error) {
      console.error("Error deleting goal:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete goal. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <Card className="hover:shadow-xl transition-all duration-300 bg-[#FBF3D5]/90 dark:bg-[#415E72]/90 backdrop-blur-sm border-[#C5B0CD]/50 shadow-lg hover:scale-105">
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg text-[#415E72] dark:text-white">{goal.name}</CardTitle>
            <div className="flex items-center space-x-2">
              {getStatusBadge()}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-[#FBF3D5]/95 dark:bg-[#415E72]/95 backdrop-blur-sm border-[#C5B0CD]/50">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-[#415E72] dark:text-white flex items-center">
                      <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
                      Delete Goal
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-[#C5B0CD]">
                      Are you sure you want to delete "{goal.name}"? This action cannot be undone and all progress will be lost.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="bg-[#C5B0CD] border-[#C5B0CD] text-[#415E72] hover:bg-[#C5B0CD]/80">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteGoal}
                      disabled={isDeleting}
                      className="bg-gradient-to-r from-[#B9375D] to-[#D25D5D] hover:from-[#B9375D]/90 hover:to-[#D25D5D]/90 text-white shadow-lg"
                    >
                      {isDeleting ? "Deleting..." : "Delete Goal"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
          <div className="flex items-center text-sm text-[#C5B0CD]">
            <Calendar className="mr-1 h-4 w-4" />
            {new Date(goal.deadline).toLocaleDateString()}
            {daysLeft >= 0 && <span className="ml-2">({daysLeft} days left)</span>}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-[#415E72] dark:text-white">
              <span>Progress</span>
              <span>{progressPercentage.toFixed(1)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2 bg-[#C5B0CD]" />
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-[#C5B0CD]">Contributed</p>
              <p className="font-semibold text-[#415E72] dark:text-white">{formatCurrency(goal.contributed)}</p>
            </div>
            <div>
              <p className="text-[#C5B0CD]">Target</p>
              <p className="font-semibold text-[#415E72] dark:text-white">{formatCurrency(goal.targetAmount)}</p>
            </div>
          </div>

          <div className="text-sm">
            <p className="text-[#C5B0CD]">Remaining</p>
            <p className="font-semibold text-[#B9375D]">{formatCurrency(remainingAmount)}</p>
          </div>

          <div className="flex items-center justify-between">
            <Badge variant="outline" className="border-[#C5B0CD] text-[#415E72] bg-[#C5B0CD]/20">{goal.category}</Badge>
            <Button size="sm" onClick={() => setShowContributeDialog(true)} disabled={progressPercentage >= 100} className="bg-gradient-to-r from-[#B9375D] to-[#D25D5D] hover:from-[#B9375D]/90 hover:to-[#D25D5D]/90 text-white shadow-lg">
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
                    ? "bg-gradient-to-r from-[#B9375D] to-[#D25D5D] text-white shadow-lg"
                    : progressPercentage >= milestone
                      ? "bg-[#C5B0CD] text-[#415E72] shadow-lg"
                      : "bg-[#C5B0CD]/50 text-[#415E72]/50"
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
