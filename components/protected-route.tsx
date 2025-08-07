"use client"

import type React from "react"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    console.log("ProtectedRoute useEffect", { user, loading, path: window.location.pathname })
    if (!loading && !user) {
      console.log("No authenticated user, redirecting to login")
      try {
        router.push("/auth/login")
        console.log("Router.push called for /auth/login")
      } catch (error) {
        console.error("Error redirecting to login:", error)
      }
    }
  }, [user, loading, router])

  if (loading) {
    console.log("ProtectedRoute loading")
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    console.log("ProtectedRoute: No user, returning null")
    return null
  }

  console.log("ProtectedRoute: User authenticated, rendering children")
  return <>{children}</>
}
