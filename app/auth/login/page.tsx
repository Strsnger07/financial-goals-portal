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
import { Chrome, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      if (!auth) {
        throw new Error("Firebase not initialized. Please check your configuration.")
      }
      
      await signInWithEmailAndPassword(auth, email, password)
      toast({
        title: "Success",
        description: "Logged in successfully!",
      })
      router.push("/dashboard")
    } catch (error: unknown) {
      let errorMessage = "An error occurred during login"
      
      if (error instanceof Error) {
        // Handle specific Firebase auth errors
        if (error.message.includes("auth/invalid-credential")) {
          errorMessage = "Invalid email or password. Please check your credentials."
        } else if (error.message.includes("auth/user-not-found")) {
          errorMessage = "No account found with this email. Please sign up first."
        } else if (error.message.includes("auth/wrong-password")) {
          errorMessage = "Incorrect password. Please try again."
        } else if (error.message.includes("auth/too-many-requests")) {
          errorMessage = "Too many failed attempts. Please try again later."
        } else if (error.message.includes("auth/network-request-failed")) {
          errorMessage = "Network error. Please check your internet connection."
        } else {
          errorMessage = error.message
        }
      }
      
      setError(errorMessage)
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError("")
    
    try {
      if (!auth || !googleProvider) {
        throw new Error("Firebase not initialized. Please check your configuration.")
      }
      await signInWithPopup(auth, googleProvider)
      toast({
        title: "Success",
        description: "Logged in with Google successfully!",
      })
      router.push("/dashboard")
    } catch (error: unknown) {
      let errorMessage = "An error occurred during Google login"
      
      if (error instanceof Error) {
        if (error.message.includes("auth/popup-closed-by-user")) {
          errorMessage = "Login cancelled. Please try again."
        } else if (error.message.includes("auth/popup-blocked")) {
          errorMessage = "Popup blocked. Please allow popups for this site."
        } else {
          errorMessage = error.message
        }
      }
      
      setError(errorMessage)
      toast({
        title: "Google Login Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const useDemoAccount = () => {
    setEmail("demo@example.com")
    setPassword("demo123456")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
      <Card className="w-full max-w-md bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-100">Sign In</CardTitle>
          <CardDescription className="text-gray-400">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive" className="bg-red-900/20 border-red-800">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-red-200">{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                className="bg-gray-800 border-gray-700 text-gray-100 placeholder:text-gray-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                className="bg-gray-800 border-gray-700 text-gray-100 placeholder:text-gray-500"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          {/* Demo Account Button */}
          <div className="text-center">
            <Button 
              variant="outline" 
              onClick={useDemoAccount}
              className="text-sm text-gray-400 border-gray-600 hover:bg-gray-800"
              size="sm"
            >
              Use Demo Account
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-gray-900 px-2 text-gray-400">Or continue with</span>
            </div>
          </div>

          <Button 
            variant="outline" 
            className="w-full bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700" 
            onClick={handleGoogleLogin} 
            disabled={loading}
          >
            <Chrome className="mr-2 h-4 w-4" />
            Google
          </Button>

          <div className="text-center text-sm text-gray-400">
            {"Don't have an account? "}
            <Link href="/auth/signup" className="underline text-blue-400 hover:text-blue-300">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
