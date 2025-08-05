"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { DashboardLayout } from "@/components/dashboard-layout"
import { GoalCard } from "@/components/goal-card"
import { GoalCharts } from "@/components/goal-charts"
import { CreateGoalDialog } from "@/components/create-goal-dialog"
import { SmartRecommendations } from "@/components/smart-recommendations"
import { useAuth } from "@/components/auth-provider"
import { useEffect, useState } from "react"
import { collection, query, where, onSnapshot, doc, getDoc, setDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Plus, Brain, Target } from "lucide-react"
import { UserProfile, GoalSuggestion } from "@/lib/smart-recommendations"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Goal {
  id: string
  name: string
  targetAmount: number
  deadline: string
  category: string
  progress: number
  contributed: number
  createdAt: any
  milestoneReached: number[]
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'smart'>('overview')

  useEffect(() => {
    if (!user) return

    // Load user profile
    const loadUserProfile = async () => {
      const profileDoc = doc(db, "userProfiles", user.uid)
      try {
        const profileSnapshot = await getDoc(profileDoc)
        if (profileSnapshot.exists()) {
          setUserProfile(profileSnapshot.data() as UserProfile)
        }
      } catch (error) {
        console.error("Error loading user profile:", error)
      }
    }

    const q = query(collection(db, "goals"), where("userId", "==", user.uid))

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const goalsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Goal[]

      setGoals(
        goalsData.sort((a, b) => {
          const aDate = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt)
          const bDate = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt)
          return bDate.getTime() - aDate.getTime()
        }),
      )
      setLoading(false)
    })

    loadUserProfile()
    return unsubscribe
  }, [user])

  const handleSmartGoalCreate = async (suggestion: GoalSuggestion) => {
    if (!user) return

    const newGoal = {
      name: suggestion.name,
      targetAmount: suggestion.suggestedAmount,
      deadline: new Date(Date.now() + suggestion.timeToComplete * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      category: suggestion.category,
      progress: 0,
      contributed: 0,
      createdAt: new Date(),
      milestoneReached: [],
      userId: user.uid,
      type: suggestion.type,
      confidence: suggestion.confidence,
      reasoning: suggestion.reasoning
    }

    try {
      await setDoc(doc(collection(db, "goals")), newGoal)
      setShowCreateDialog(false)
    } catch (error) {
      console.error("Error creating goal:", error)
    }
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6 text-gray-100">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-100">Financial Dashboard</h1>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Goal
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'overview' | 'smart')}>
            <TabsList className="grid w-full grid-cols-2 bg-gray-800">
              <TabsTrigger value="overview" className="flex items-center space-x-2">
                <Target className="h-4 w-4" />
                <span>Overview</span>
                <span className="bg-blue-900 text-blue-200 text-xs px-2 py-1 rounded-full">
                  {goals.length}
                </span>
              </TabsTrigger>
              <TabsTrigger value="smart" className="flex items-center space-x-2">
                <Brain className="h-4 w-4" />
                <span>Smart Insights</span>
                {userProfile && (
                  <span className="bg-green-900 text-green-200 text-xs px-2 py-1 rounded-full">
                    AI
                  </span>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {goals.length > 0 && <GoalCharts goals={goals} />}

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-100">Your Goals</h2>
                {goals.length === 0 ? (
                  <Card className="bg-gray-900 border-gray-700">
                    <CardContent className="text-center py-12">
                      <Target className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-semibold mb-2 text-gray-100">No goals created yet</h3>
                      <p className="text-gray-400 mb-6">Start by creating your first financial goal</p>
                      <div className="flex justify-center space-x-3">
                        <Button onClick={() => setShowCreateDialog(true)}>
                          <Plus className="mr-2 h-4 w-4" />
                          Create Goal
                        </Button>
                        <Button variant="outline" onClick={() => setActiveTab('smart')}>
                          <Brain className="mr-2 h-4 w-4" />
                          Get Smart Suggestions
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {goals.map((goal) => (
                      <GoalCard key={goal.id} goal={goal} />
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="smart" className="space-y-6">
              {userProfile ? (
                <SmartRecommendations
                  userProfile={userProfile}
                  existingGoals={goals}
                  onGoalCreate={handleSmartGoalCreate}
                />
              ) : (
                <Card className="bg-gray-900 border-gray-700">
                  <CardContent className="text-center py-12">
                    <Brain className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold mb-2 text-gray-100">Smart Recommendations</h3>
                    <p className="text-gray-400 mb-6">
                      Complete your profile to get personalized AI-powered goal suggestions
                    </p>
                    <Button onClick={() => window.location.href = '/goals'}>
                      <Brain className="mr-2 h-4 w-4" />
                      Setup Profile
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>

          <CreateGoalDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
