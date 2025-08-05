"use client"

import type React from "react"
import { useState } from "react"
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth"
import { auth, googleProvider } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { Chrome } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!auth) {
        throw new Error("Firebase not initialized")
      }
      await signInWithEmailAndPassword(auth, email, password)
      toast({
        title: "Success",
        description: "Logged in successfully!",
      })
      router.push("/dashboard")
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred"
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    try {
      if (!auth || !googleProvider) {
        throw new Error("Firebase not initialized")
      }
      await signInWithPopup(auth, googleProvider)
      toast({
        title: "Success",
        description: "Logged in with Google successfully!",
      })
      router.push("/dashboard")
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred"
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <Button variant="outline" className="w-full bg-transparent" onClick={handleGoogleLogin} disabled={loading}>
            <Chrome className="mr-2 h-4 w-4" />
            Google
          </Button>

          <div className="text-center text-sm">
            {"Don't have an account? "}
            <Link href="/auth/signup" className="underline text-blue-600 hover:text-blue-800">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
