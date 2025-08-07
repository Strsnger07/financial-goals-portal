"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { DashboardLayout } from "@/components/dashboard-layout"
import { GoalCard } from "@/components/goal-card"
import { GoalCharts } from "@/components/goal-charts"
import { CreateGoalDialog } from "@/components/create-goal-dialog"
import { UserProfileSetup } from "@/components/user-profile-setup"
import { useAuth } from "@/components/auth-provider"
import { useEffect, useState } from "react"
import { collection, query, where, onSnapshot, doc, setDoc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Plus, Target, Brain, User, Settings, Filter, Search } from "lucide-react"
import { UserProfile } from "@/lib/smart-recommendations"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

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
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

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

  const handleGoalDeleted = (goalId: string) => {
    setGoals(prevGoals => prevGoals.filter(goal => goal.id !== goalId))
  }

  // Filter goals based on search and filters
  const filteredGoals = goals.filter(goal => {
    const matchesSearch = goal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         goal.category.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = categoryFilter === "all" || goal.category === categoryFilter
    
    const progressPercentage = (goal.contributed / goal.targetAmount) * 100
    const daysLeft = Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    
    let matchesStatus = true
    if (statusFilter === "completed") {
      matchesStatus = progressPercentage >= 100
    } else if (statusFilter === "active") {
      matchesStatus = progressPercentage < 100 && daysLeft > 0
    } else if (statusFilter === "overdue") {
      matchesStatus = daysLeft < 0
    }

    return matchesSearch && matchesCategory && matchesStatus
  })

  // Get unique categories for filter
  const categories = Array.from(new Set(goals.map(goal => goal.category).filter(category => category && category.trim() !== '')))

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
              <Target className="h-8 w-8 text-[#B9375D]" />
              <h1 className="text-3xl font-bold text-[#B9375D] dark:text-white">Financial Goals</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={() => setShowProfileSetup(true)} className="border-[#C5B0CD] text-[#415E72] hover:bg-[#C5B0CD]/20 dark:border-[#C5B0CD] dark:text-white dark:hover:bg-[#C5B0CD]/20">
                <Settings className="mr-2 h-4 w-4" />
                Update Profile
              </Button>
              <Button onClick={() => setShowCreateDialog(true)} className="bg-gradient-to-r from-[#B9375D] to-[#D25D5D] hover:from-[#B9375D]/90 hover:to-[#D25D5D]/90 text-white shadow-lg">
                <Plus className="mr-2 h-4 w-4" />
                Create Goal
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'goals' | 'smart')}>
            <TabsList className="grid w-full grid-cols-2 bg-[#FBF3D5]/80 dark:bg-[#415E72]/80 backdrop-blur-sm border border-[#C5B0CD]/50">
              <TabsTrigger value="goals" className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#B9375D] data-[state=active]:to-[#D25D5D] data-[state=active]:text-white">
                <Target className="h-4 w-4" />
                <span>Your Goals</span>
                <span className="bg-[#C5B0CD] text-[#415E72] text-xs px-2 py-1 rounded-full">
                  {goals.length}
                </span>
              </TabsTrigger>
              <TabsTrigger value="smart" className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#B9375D] data-[state=active]:to-[#D25D5D] data-[state=active]:text-white">
                <Brain className="h-4 w-4" />
                <span>Smart Recommendations</span>
                {userProfile && (
                  <span className="bg-[#C5B0CD] text-[#415E72] text-xs px-2 py-1 rounded-full">
                    AI
                  </span>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="goals" className="space-y-6">
              {/* Filters */}
              <Card className="bg-[#FBF3D5]/80 dark:bg-[#415E72]/80 backdrop-blur-sm border-[#C5B0CD]/50 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-[#415E72] dark:text-white flex items-center">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter Goals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#415E72] dark:text-white">Search</label>
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-[#C5B0CD]" />
                        <Input
                          placeholder="Search goals..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 bg-[#FBF3D5]/50 dark:bg-[#415E72]/50 border-[#C5B0CD]/50 text-[#415E72] dark:text-white"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#415E72] dark:text-white">Category</label>
                      <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger className="bg-[#FBF3D5]/50 dark:bg-[#415E72]/50 border-[#C5B0CD]/50 text-[#415E72] dark:text-white">
                          <SelectValue placeholder="All categories" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          {categories.filter(category => category && category.trim() !== '').map(category => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#415E72] dark:text-white">Status</label>
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="bg-[#FBF3D5]/50 dark:bg-[#415E72]/50 border-[#C5B0CD]/50 text-[#415E72] dark:text-white">
                          <SelectValue placeholder="All statuses" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="overdue">Overdue</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Goals Grid */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-semibold text-[#415E72] dark:text-white">
                    Your Goals ({filteredGoals.length})
                  </h2>
                  {filteredGoals.length !== goals.length && (
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setSearchTerm("")
                        setCategoryFilter("all")
                        setStatusFilter("all")
                      }}
                      className="border-[#C5B0CD] text-[#415E72] hover:bg-[#C5B0CD]/20 dark:border-[#C5B0CD] dark:text-white dark:hover:bg-[#C5B0CD]/20"
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>
                
                {filteredGoals.length === 0 ? (
                  <Card className="bg-[#FBF3D5]/80 dark:bg-[#415E72]/80 backdrop-blur-sm border-[#C5B0CD]/50 shadow-lg">
                    <CardContent className="text-center py-12">
                      <Target className="mx-auto h-12 w-12 text-[#C5B0CD] mb-4" />
                      <h3 className="text-lg font-semibold mb-2 text-[#415E72] dark:text-white">
                        {goals.length === 0 ? "No goals created yet" : "No goals match your filters"}
                      </h3>
                      <p className="text-[#C5B0CD] mb-6">
                        {goals.length === 0 
                          ? "Start by creating your first financial goal"
                          : "Try adjusting your search or filters"
                        }
                      </p>
                      <div className="flex justify-center space-x-3">
                        <Button onClick={() => setShowCreateDialog(true)} className="bg-gradient-to-r from-[#B9375D] to-[#D25D5D] hover:from-[#B9375D]/90 hover:to-[#D25D5D]/90 text-white shadow-lg">
                          <Plus className="mr-2 h-4 w-4" />
                          Create Goal
                        </Button>
                        {goals.length > 0 && (
                          <Button variant="outline" onClick={() => setActiveTab('smart')} className="border-[#C5B0CD] text-[#415E72] hover:bg-[#C5B0CD]/20 dark:border-[#C5B0CD] dark:text-white dark:hover:bg-[#C5B0CD]/20">
                            <Brain className="mr-2 h-4 w-4" />
                            Get Smart Suggestions
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredGoals.map((goal) => (
                      <GoalCard key={goal.id} goal={goal} onGoalDeleted={handleGoalDeleted} />
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="smart" className="space-y-6">
              <Card className="bg-[#FBF3D5]/80 dark:bg-[#415E72]/80 backdrop-blur-sm border-[#C5B0CD]/50 shadow-lg">
                <CardContent className="text-center py-12">
                  <Brain className="mx-auto h-12 w-12 text-[#C5B0CD] mb-4" />
                  <h3 className="text-lg font-semibold mb-2 text-[#415E72] dark:text-white">Smart Recommendations</h3>
                  <p className="text-[#C5B0CD] mb-6">
                    {userProfile 
                      ? "Smart recommendations feature is temporarily disabled. Please use the Goals tab to manage your goals."
                      : "Complete your profile to get personalized smart recommendations"
                    }
                  </p>
                  {!userProfile && (
                    <Button onClick={() => setShowProfileSetup(true)} className="bg-gradient-to-r from-[#B9375D] to-[#D25D5D] hover:from-[#B9375D]/90 hover:to-[#D25D5D]/90 text-white shadow-lg">
                      <User className="mr-2 h-4 w-4" />
                      Complete Profile Setup
                    </Button>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <CreateGoalDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
} 