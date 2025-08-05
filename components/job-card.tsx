"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, DollarSign, Users, Building, Clock } from "lucide-react"
import { ApplyJobDialog } from "@/components/apply-job-dialog"
import { useAuth } from "@/components/auth-provider"

interface Job {
  id: string
  title: string
  company: string
  description: string
  requirements: string[]
  salary: string
  location: string
  type: string
  deadline: string
  createdAt: Date | { toDate: () => Date }
  createdBy: string
  applicants: string[]
}

interface JobCardProps {
  job: Job
  userRole: string
}

export function JobCard({ job, userRole }: JobCardProps) {
  const { user } = useAuth()
  const [showApplyDialog, setShowApplyDialog] = useState(false)

  const hasApplied = user && job.applicants?.includes(user.uid)
  const isExpired = new Date(job.deadline) < new Date()
  const daysLeft = Math.ceil((new Date(job.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

  const getTypeColor = (type: string) => {
    switch (type) {
      case "full-time":
        return "bg-green-100 text-green-800"
      case "part-time":
        return "bg-blue-100 text-blue-800"
      case "internship":
        return "bg-purple-100 text-purple-800"
      case "contract":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <>
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl">{job.title}</CardTitle>
              <div className="flex items-center text-gray-600 mt-1">
                <Building className="mr-1 h-4 w-4" />
                {job.company}
              </div>
            </div>
            <Badge className={getTypeColor(job.type)}>{job.type.replace("-", " ").toUpperCase()}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700 line-clamp-3">{job.description}</p>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center text-gray-600">
              <MapPin className="mr-1 h-4 w-4" />
              {job.location}
            </div>
            <div className="flex items-center text-gray-600">
              <DollarSign className="mr-1 h-4 w-4" />
              {job.salary}
            </div>
            <div className="flex items-center text-gray-600">
              <Calendar className="mr-1 h-4 w-4" />
              Deadline: {new Date(job.deadline).toLocaleDateString()}
            </div>
            <div className="flex items-center text-gray-600">
              <Users className="mr-1 h-4 w-4" />
              {job.applicants?.length || 0} applicants
            </div>
          </div>

          {daysLeft >= 0 && (
            <div className="flex items-center text-sm">
              <Clock className="mr-1 h-4 w-4" />
              <span className={daysLeft <= 3 ? "text-red-600 font-medium" : "text-gray-600"}>
                {daysLeft === 0 ? "Last day to apply" : `${daysLeft} days left`}
              </span>
            </div>
          )}

          <div className="space-y-2">
            <h4 className="font-medium">Requirements:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {job.requirements.slice(0, 3).map((req, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2">•</span>
                  {req}
                </li>
              ))}
              {job.requirements.length > 3 && <li className="text-blue-600">+{job.requirements.length - 3} more...</li>}
            </ul>
          </div>

          <div className="flex justify-between items-center pt-4">
            <div className="text-sm text-gray-500">Posted {new Date(job.createdAt?.toDate()).toLocaleDateString()}</div>
            {userRole === "student" && (
              <Button
                onClick={() => setShowApplyDialog(true)}
                disabled={hasApplied || isExpired}
                variant={hasApplied ? "outline" : "default"}
              >
                {hasApplied ? "Applied" : isExpired ? "Expired" : "Apply Now"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <ApplyJobDialog job={job} open={showApplyDialog} onOpenChange={setShowApplyDialog} />
    </>
  )
}
