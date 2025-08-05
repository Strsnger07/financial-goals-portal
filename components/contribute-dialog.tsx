"use client"

import type React from "react"
import { useState } from "react"
import { doc, updateDoc, addDoc, collection, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { useCurrency } from "@/contexts/currency-context"

interface Goal {
  id: string
  name: string
  targetAmount: number
  contributed: number
  milestoneReached: number[]
}

interface ContributeDialogProps {
  goal: Goal
  open: boolean
  onOpenChange: (open: boolean) => void
  onMilestoneReached: (milestone: number) => void
}

export function ContributeDialog({ goal, open, onOpenChange, onMilestoneReached }: ContributeDialogProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [amount, setAmount] = useState("")
  const [loading, setLoading] = useState(false)
  const { formatCurrency } = useCurrency()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !amount) return

    const contributionAmount = Number.parseFloat(amount)
    if (contributionAmount <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const newContributed = goal.contributed + contributionAmount
      const newProgress = (newContributed / goal.targetAmount) * 100

      // Add contribution to subcollection
      await addDoc(collection(db, "goals", goal.id, "contributions"), {
        amount: contributionAmount,
        date: serverTimestamp(),
        userId: user.uid,
      })

      // Check for new milestones
      const milestones = [25, 50, 75]
      const newMilestones = [...(goal.milestoneReached || [])]

      for (const milestone of milestones) {
        if (newProgress >= milestone && !newMilestones.includes(milestone)) {
          newMilestones.push(milestone)
          onMilestoneReached(milestone)
        }
      }

      // Update goal
      await updateDoc(doc(db, "goals", goal.id), {
        contributed: newContributed,
        progress: newProgress,
        milestoneReached: newMilestones,
      })

      toast({
        title: "Success!",
        description: `${formatCurrency(contributionAmount)} added to ${goal.name}!`,
      })

      setAmount("")
      onOpenChange(false)
    } catch (error) {
      console.error("Error adding contribution:", error)
      toast({
        title: "Error",
        description: "Failed to add contribution",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Contribution</DialogTitle>
          <DialogDescription>Add money to your "{goal.name}" goal</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              required
            />
          </div>
          <div className="text-sm text-gray-500">
            <p>Current: {formatCurrency(goal.contributed)}</p>
            <p>Target: {formatCurrency(goal.targetAmount)}</p>
            <p>Remaining: {formatCurrency(goal.targetAmount - goal.contributed)}</p>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Contribution"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
