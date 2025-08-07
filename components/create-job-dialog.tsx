"use client"

import type React from "react"
import { useState } from "react"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { X } from "lucide-react"

interface CreateJobDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateJobDialog({ open, onOpenChange }: CreateJobDialogProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [requirements, setRequirements] = useState<string[]>([])
  const [currentRequirement, setCurrentRequirement] = useState("")
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    description: "",
    salary: "",
    location: "",
    type: "",
    deadline: "",
  })

  const jobTypes = [
    { value: "full-time", label: "Full Time" },
    { value: "part-time", label: "Part Time" },
    { value: "internship", label: "Internship" },
    { value: "contract", label: "Contract" },
  ]

  const addRequirement = () => {
    if (currentRequirement.trim()) {
      setRequirements([...requirements, currentRequirement.trim()])
      setCurrentRequirement("")
    }
  }

  const removeRequirement = (index: number) => {
    setRequirements(requirements.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    if (requirements.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one requirement",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      await addDoc(collection(db, "jobs"), {
        ...formData,
        requirements,
        createdBy: user.uid,
        createdAt: serverTimestamp(),
        applicants: [],
      })

      toast({
        title: "Success",
        description: "Job posted successfully!",
      })

      setFormData({
        title: "",
        company: "",
        description: "",
        salary: "",
        location: "",
        type: "",
        deadline: "",
      })
      setRequirements([])
      onOpenChange(false)
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to post job",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Post New Job</DialogTitle>
          <DialogDescription>Create a new job posting for students to apply.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Job Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Software Developer"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => setFormData((prev) => ({ ...prev, company: e.target.value }))}
                placeholder="e.g., Tech Corp"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Job Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the job role, responsibilities, and what you're looking for..."
              className="min-h-[100px]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="salary">Salary</Label>
              <Input
                id="salary"
                value={formData.salary}
                onChange={(e) => setFormData((prev) => ({ ...prev, salary: e.target.value }))}
                placeholder="e.g., ₹50,000 - ₹80,000"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                placeholder="e.g., Mumbai, Remote"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Job Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent>
                  {jobTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="deadline">Application Deadline</Label>
              <Input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData((prev) => ({ ...prev, deadline: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Requirements</Label>
            <div className="flex gap-2">
              <Input
                value={currentRequirement}
                onChange={(e) => setCurrentRequirement(e.target.value)}
                placeholder="Add a requirement..."
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addRequirement())}
              />
              <Button type="button" onClick={addRequirement}>
                Add
              </Button>
            </div>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {requirements.map((req, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <span className="text-sm">{req}</span>
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeRequirement(index)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Posting..." : "Post Job"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
