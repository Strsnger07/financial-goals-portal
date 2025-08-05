"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Briefcase, MapPin, Calendar, Users } from "lucide-react"

export default function JobsPage() {
  // Sample job data for demonstration
  const sampleJobs = [
    {
      id: "1",
      title: "Frontend Developer Intern",
      company: "Tech Solutions Inc.",
      description:
        "Join our team as a frontend developer intern and work on exciting web applications using React and TypeScript.",
      location: "Mumbai, India",
      type: "internship",
      salary: "₹15,000 - ₹25,000",
      deadline: "2024-02-15",
      applicants: 12,
      requirements: ["React", "JavaScript", "HTML/CSS", "Git"],
    },
    {
      id: "2",
      title: "Marketing Assistant",
      company: "Digital Marketing Pro",
      description: "Help create marketing campaigns and manage social media presence for our growing startup.",
      location: "Remote",
      type: "part-time",
      salary: "₹20,000 - ₹30,000",
      deadline: "2024-02-20",
      applicants: 8,
      requirements: ["Social Media", "Content Writing", "Analytics", "Creativity"],
    },
    {
      id: "3",
      title: "Data Analyst",
      company: "Analytics Corp",
      description: "Analyze business data and create insights to help drive strategic decisions.",
      location: "Bangalore, India",
      type: "full-time",
      salary: "₹40,000 - ₹60,000",
      deadline: "2024-02-25",
      applicants: 25,
      requirements: ["Python", "SQL", "Excel", "Statistics", "Data Visualization"],
    },
  ]

  const getTypeColor = (type: string) => {
    switch (type) {
      case "full-time":
        return "bg-green-100 text-green-800"
      case "part-time":
        return "bg-blue-100 text-blue-800"
      case "internship":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Campus Jobs</h1>
        </div>

        <div className="text-center py-8 bg-blue-50 rounded-lg">
          <Briefcase className="mx-auto h-12 w-12 text-blue-500 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Job Portal Coming Soon!</h2>
          <p className="text-gray-600 mb-4">
            The full job portal with application system is being prepared. Here's a preview of available positions:
          </p>
        </div>

        {/* Sample Jobs Display */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Available Positions</h2>
          <div className="grid gap-4">
            {sampleJobs.map((job) => (
              <Card key={job.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{job.title}</CardTitle>
                      <CardDescription className="text-lg font-medium text-gray-700">{job.company}</CardDescription>
                    </div>
                    <Badge className={getTypeColor(job.type)}>{job.type.replace("-", " ").toUpperCase()}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700">{job.description}</p>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="mr-1 h-4 w-4" />
                      {job.location}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Calendar className="mr-1 h-4 w-4" />
                      Deadline: {new Date(job.deadline).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Users className="mr-1 h-4 w-4" />
                      {job.applicants} applicants
                    </div>
                    <div className="text-gray-600 font-medium">{job.salary}</div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Requirements:</h4>
                    <div className="flex flex-wrap gap-2">
                      {job.requirements.map((req, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {req}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4">
                    <div className="text-sm text-gray-500">Posted recently</div>
                    <Button disabled className="opacity-50">
                      Apply Now (Coming Soon)
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600">🚀 Full job application system with real-time updates coming soon!</p>
        </div>
      </div>
    </DashboardLayout>
  )
}
