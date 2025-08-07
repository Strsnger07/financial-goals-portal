"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { DashboardLayout } from "@/components/dashboard-layout"
import { GoalCard } from "@/components/goal-card"
import { GoalCharts } from "@/components/goal-charts"
import { CreateGoalDialog } from "@/components/create-goal-dialog"
import { SmartRecommendations } from "@/components/smart-recommendations"
import { UserProfileSetup } from "@/components/user-profile-setup"
import { useAuth } from "@/components/auth-provider"
import { useEffect, useState } from "react"
import { collection, query, where, onSnapshot, doc, setDoc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Plus, Target, Brain, User, Settings } from "lucide-react"
import { UserProfile, GoalSuggestion } from "@/lib/smart-recommendations"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Goal {
  id: string
  name: string
  targetAmount: number
  deadline: string
  category: string
  progress: number
  contributed: number
  createdAt: Date | { toDate: () => Date }
  milestoneReached: number[]
}

export default function GoalsPage() {
  const { user } = useAuth()
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [showProfileSetup, setShowProfileSetup] = useState(false)
  const [activeTab, setActiveTab] = useState<'goals' | 'smart'>('goals')

  useEffect(() => {
    if (!user) return

    // Load user profile
    const loadUserProfile = async () => {
      if (!db) return
      const profileDoc = doc(db, "userProfiles", user.uid)
      try {
        const profileSnapshot = await getDoc(profileDoc)
        if (profileSnapshot.exists()) {
          setUserProfile(profileSnapshot.data() as UserProfile)
        } else {
          setShowProfileSetup(true)
        }
      } catch (error) {
        console.error("Error loading user profile:", error)
        setShowProfileSetup(true)
      }
    }

    // Load goals
    if (!db) return
    const q = query(collection(db, "goals"), where("userId", "==", user.uid))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const goalsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Goal[]

      setGoals(
        goalsData.sort((a, b) => {
          const aDate = typeof a.createdAt === 'object' && 'toDate' in a.createdAt 
            ? a.createdAt.toDate() 
            : new Date(a.createdAt)
          const bDate = typeof b.createdAt === 'object' && 'toDate' in b.createdAt 
            ? b.createdAt.toDate() 
            : new Date(b.createdAt)
          return bDate.getTime() - aDate.getTime()
        }),
      )
      setLoading(false)
    })

    loadUserProfile()
    return unsubscribe
  }, [user])

  const handleProfileComplete = async (profile: UserProfile) => {
    if (!user || !db) return

    try {
      await setDoc(doc(db, "userProfiles", user.uid), profile)
      setUserProfile(profile)
      setShowProfileSetup(false)
    } catch (error) {
      console.error("Error saving user profile:", error)
    }
  }

  const handleSmartGoalCreate = async (suggestion: GoalSuggestion) => {
    if (!user || !db) return

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

  const handleGoalDeleted = (goalId: string) => {
    setGoals(prevGoals => prevGoals.filter(goal => goal.id !== goalId))
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

  if (showProfileSetup) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="space-y-6">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <Brain className="h-8 w-8 text-blue-600" />
                <h1 className="text-3xl font-bold">Smart Goal Setup</h1>
              </div>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Help us understand your financial situation so we can provide personalized goal recommendations. 
                This information helps our AI suggest the most relevant goals for your life stage and financial profile.
              </p>
            </div>
            <UserProfileSetup onProfileComplete={handleProfileComplete} />
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Target className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl font-bold">Financial Goals</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={() => setShowProfileSetup(true)}>
                <Settings className="mr-2 h-4 w-4" />
                Update Profile
              </Button>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Goal
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'goals' | 'smart')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="goals" className="flex items-center space-x-2">
                <Target className="h-4 w-4" />
                <span>Your Goals</span>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  {goals.length}
                </span>
              </TabsTrigger>
              <TabsTrigger value="smart" className="flex items-center space-x-2">
                <Brain className="h-4 w-4" />
                <span>Smart Recommendations</span>
                {userProfile && (
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    AI
                  </span>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="goals" className="space-y-6">
              {goals.length > 0 && <GoalCharts goals={goals} />}

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">Your Goals</h2>
                {goals.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-12">
                      <Target className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No goals created yet</h3>
                      <p className="text-gray-500 mb-6">Start by creating your first financial goal</p>
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
                      <GoalCard key={goal.id} goal={goal} onGoalDeleted={handleGoalDeleted} />
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="smart" className="space-y-6">
              {userProfile ? (
                <SmartRecommendations
                  userProfile={userProfile}
                  existingGoals={[]}
                  onGoalCreate={handleSmartGoalCreate}
                />
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <User className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Profile Setup Required</h3>
                    <p className="text-gray-500 mb-6">
                      Complete your profile to get personalized smart recommendations
                    </p>
                    <Button onClick={() => setShowProfileSetup(true)}>
                      <User className="mr-2 h-4 w-4" />
                      Complete Profile Setup
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