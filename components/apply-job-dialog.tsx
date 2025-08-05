"use client"

import type React from "react"
import { useState } from "react"
import { doc, updateDoc, arrayUnion, addDoc, collection, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

interface Job {
  id: string
  title: string
  company: string
  description: string
  requirements: string[]
}

interface ApplyJobDialogProps {
  job: Job
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ApplyJobDialog({ job, open, onOpenChange }: ApplyJobDialogProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [coverLetter, setCoverLetter] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    try {
      // Add user to job applicants
      await updateDoc(doc(db, "jobs", job.id), {
        applicants: arrayUnion(user.uid),
      })

      // Create application record
      await addDoc(collection(db, "applications"), {
        jobId: job.id,
        jobTitle: job.title,
        company: job.company,
        userId: user.uid,
        userName: user.displayName || user.email,
        userEmail: user.email,
        coverLetter,
        appliedAt: serverTimestamp(),
        status: "pending",
      })

      toast({
        title: "Success",
        description: `Applied to ${job.title} at ${job.company}!`,
      })

      setCoverLetter("")
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit application",
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
          <DialogTitle>Apply for {job.title}</DialogTitle>
          <DialogDescription>Submit your application for this position at {job.company}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="coverLetter">Cover Letter</Label>
            <Textarea
              id="coverLetter"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Tell us why you're interested in this position and what makes you a good fit..."
              className="min-h-[150px]"
              required
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Job Requirements:</h4>
            <ul className="text-sm space-y-1">
              {job.requirements.map((req, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2">•</span>
                  {req}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit Application"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
