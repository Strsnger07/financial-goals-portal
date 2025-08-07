"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { DashboardLayout } from "@/components/dashboard-layout"
import { GoalCharts } from "@/components/goal-charts"
import { CreateGoalDialog } from "@/components/create-goal-dialog"
import { SmartRecommendations } from "@/components/smart-recommendations"
import { useAuth } from "@/components/auth-provider"
import { useEffect, useState } from "react"
import { collection, query, where, onSnapshot, doc, getDoc, setDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Plus, Brain, Target, TrendingUp, Calendar, DollarSign } from "lucide-react"
import { UserProfile, GoalSuggestion } from "@/lib/smart-recommendations"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useCurrency } from "@/contexts/currency-context"
import Link from "next/link"

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

export default function DashboardPage() {
  const { user } = useAuth()
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'smart'>('overview')
  const { formatCurrency } = useCurrency()

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
        }
      } catch (error) {
        console.error("Error loading user profile:", error)
      }
    }

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

  // Calculate dashboard statistics
  const totalGoals = goals.length
  const totalTargetAmount = goals.reduce((sum, goal) => sum + goal.targetAmount, 0)
  const totalContributed = goals.reduce((sum, goal) => sum + goal.contributed, 0)
  const overallProgress = totalTargetAmount > 0 ? (totalContributed / totalTargetAmount) * 100 : 0
  
  // Get upcoming deadlines (within 30 days)
  const upcomingDeadlines = goals.filter(goal => {
    const daysLeft = Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    return daysLeft > 0 && daysLeft <= 30
  })

  // Get recent goals (last 5)
  const recentGoals = goals.slice(0, 5)

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
            <h1 className="text-3xl font-bold text-[#D6A99D]">Financial Dashboard</h1>
            <div className="flex space-x-2">
              <Button variant="outline" asChild className="border-[#D6DAC8] text-[#9CAFAA] hover:bg-[#D6DAC8]/20">
                <Link href="/goals">
                  <Target className="mr-2 h-4 w-4" />
                  Manage Goals
                </Link>
              </Button>
              <Button onClick={() => setShowCreateDialog(true)} className="bg-[#D6A99D] hover:bg-[#D6A99D]/90 text-white shadow-lg">
                <Plus className="mr-2 h-4 w-4" />
                Create Goal
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'overview' | 'smart')}>
            <TabsList className="grid w-full grid-cols-2 bg-[#FBF3D5]/80 dark:bg-[#9CAFAA]/80 backdrop-blur-sm border border-[#D6DAC8]/50">
              <TabsTrigger value="overview" className="flex items-center space-x-2 data-[state=active]:bg-[#D6A99D] data-[state=active]:text-white">
                <TrendingUp className="h-4 w-4" />
                <span>Overview</span>
                <span className="bg-[#D6DAC8] text-[#9CAFAA] text-xs px-2 py-1 rounded-full">
                  {totalGoals}
                </span>
              </TabsTrigger>
              <TabsTrigger value="smart" className="flex items-center space-x-2 data-[state=active]:bg-[#D6A99D] data-[state=active]:text-white">
                <Brain className="h-4 w-4" />
                <span>Smart Insights</span>
                {userProfile && (
                  <span className="bg-[#D6DAC8] text-[#9CAFAA] text-xs px-2 py-1 rounded-full">
                    AI
                  </span>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-[#FBF3D5]/80 dark:bg-[#9CAFAA]/80 backdrop-blur-sm border-[#D6DAC8]/50 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-[#9CAFAA]">Total Goals</CardTitle>
                    <Target className="h-4 w-4 text-[#D6A99D]" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-[#9CAFAA]">{totalGoals}</div>
                    <p className="text-xs text-[#D6DAC8]">Active financial goals</p>
                  </CardContent>
                </Card>

                <Card className="bg-[#FBF3D5]/80 dark:bg-[#9CAFAA]/80 backdrop-blur-sm border-[#D6DAC8]/50 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-[#9CAFAA]">Total Target</CardTitle>
                    <DollarSign className="h-4 w-4 text-[#D6A99D]" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-[#9CAFAA]">{formatCurrency(totalTargetAmount)}</div>
                    <p className="text-xs text-[#D6DAC8]">Combined target amount</p>
                  </CardContent>
                </Card>

                <Card className="bg-[#FBF3D5]/80 dark:bg-[#9CAFAA]/80 backdrop-blur-sm border-[#D6DAC8]/50 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-[#9CAFAA]">Total Saved</CardTitle>
                    <TrendingUp className="h-4 w-4 text-[#D6A99D]" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-[#9CAFAA]">{formatCurrency(totalContributed)}</div>
                    <p className="text-xs text-[#D6DAC8]">Total contributions</p>
                  </CardContent>
                </Card>

                <Card className="bg-[#FBF3D5]/80 dark:bg-[#9CAFAA]/80 backdrop-blur-sm border-[#D6DAC8]/50 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-[#9CAFAA]">Progress</CardTitle>
                    <div className="h-4 w-4 rounded-full bg-[#D6A99D]" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-[#9CAFAA]">{overallProgress.toFixed(1)}%</div>
                    <p className="text-xs text-[#D6DAC8]">Overall completion</p>
                  </CardContent>
                </Card>
              </div>

              {/* Charts */}
              {goals.length > 0 && <GoalCharts goals={goals} />}

              {/* Quick Actions and Recent Goals */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Quick Actions */}
                <Card className="bg-[#FBF3D5]/80 dark:bg-[#9CAFAA]/80 backdrop-blur-sm border-[#D6DAC8]/50 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-[#9CAFAA]">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button onClick={() => setShowCreateDialog(true)} className="w-full bg-[#D6A99D] hover:bg-[#D6A99D]/90 text-white shadow-lg">
                      <Plus className="mr-2 h-4 w-4" />
                      Create New Goal
                    </Button>
                    <Button variant="outline" asChild className="w-full border-[#D6DAC8] text-[#9CAFAA] hover:bg-[#D6DAC8]/20">
                      <Link href="/goals">
                        <Target className="mr-2 h-4 w-4" />
                        Manage All Goals
                      </Link>
                    </Button>
                    <Button variant="outline" asChild className="w-full border-[#D6DAC8] text-[#9CAFAA] hover:bg-[#D6DAC8]/20">
                      <Link href="/profile">
                        <Brain className="mr-2 h-4 w-4" />
                        Update Profile
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                {/* Upcoming Deadlines */}
                <Card className="bg-[#FBF3D5]/80 dark:bg-[#9CAFAA]/80 backdrop-blur-sm border-[#D6DAC8]/50 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-[#9CAFAA] flex items-center">
                      <Calendar className="mr-2 h-4 w-4" />
                      Upcoming Deadlines
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {upcomingDeadlines.length > 0 ? (
                      <div className="space-y-2">
                        {upcomingDeadlines.slice(0, 3).map((goal) => {
                          const daysLeft = Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                          return (
                            <div key={goal.id} className="flex items-center justify-between p-3 bg-[#D6DAC8]/30 rounded-lg border border-[#D6DAC8]/50">
                              <div>
                                <p className="text-sm font-medium text-[#9CAFAA]">{goal.name}</p>
                                <p className="text-xs text-[#D6DAC8]">{new Date(goal.deadline).toLocaleDateString()}</p>
                              </div>
                              <Badge variant={daysLeft <= 7 ? "destructive" : "secondary"} className="bg-[#D6A99D] text-white">
                                {daysLeft} days
                              </Badge>
                            </div>
                          )
                        })}
                        {upcomingDeadlines.length > 3 && (
                          <Button variant="outline" asChild className="w-full mt-2 border-[#D6DAC8] text-[#9CAFAA] hover:bg-[#D6DAC8]/20">
                            <Link href="/goals">
                              View All ({upcomingDeadlines.length})
                            </Link>
                          </Button>
                        )}
                      </div>
                    ) : (
                      <p className="text-[#D6DAC8] text-sm">No upcoming deadlines</p>
                    )}
                  </CardContent>
                </Card>
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
                <Card className="bg-[#FBF3D5]/80 dark:bg-[#9CAFAA]/80 backdrop-blur-sm border-[#D6DAC8]/50 shadow-lg">
                  <CardContent className="text-center py-12">
                    <Brain className="mx-auto h-12 w-12 text-[#D6DAC8] mb-4" />
                    <h3 className="text-lg font-semibold mb-2 text-[#9CAFAA]">Smart Recommendations</h3>
                    <p className="text-[#D6DAC8] mb-6">
                      Complete your profile to get personalized AI-powered goal suggestions
                    </p>
                    <Button onClick={() => window.location.href = '/goals'} className="bg-[#D6A99D] hover:bg-[#D6A99D]/90 text-white shadow-lg">
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
