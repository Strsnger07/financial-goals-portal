"use client"

import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Financial Goals & Job Portal</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Track your financial goals, manage your savings, and find the perfect campus job opportunities.
          </p>
          <div className="space-x-4">
            <Button asChild size="lg">
              <Link href="/auth/login">Get Started</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/jobs">Browse Jobs</Link>
            </Button>
          </div>
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Track Financial Goals</h3>
            <p className="text-gray-600">
              Set and monitor your savings goals with visual progress tracking and milestone rewards.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Smart Analytics</h3>
            <p className="text-gray-600">
              Get insights into your spending patterns with interactive charts and reports.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Campus Jobs</h3>
            <p className="text-gray-600">
              Find and apply for campus job opportunities posted by placement coordinators.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
