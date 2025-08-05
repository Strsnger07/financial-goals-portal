"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  SmartRecommendationsEngine, 
  GoalSuggestion, 
  FinancialInsight, 
  SmartNudge, 
  ActionItem,
  UserProfile,
  GoalPriority
} from "@/lib/smart-recommendations"
import { GoalTemplates } from "@/components/goal-templates"
import { useCurrency } from "@/contexts/currency-context"
import { 
  Target, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Lightbulb, 
  Clock,
  DollarSign,
  Shield,
  CreditCard,
  Home,
  GraduationCap,
  Car,
  Heart,
  Briefcase,
  Stethoscope,
  ScrollText,
  Plus,
  ArrowRight,
  Star,
  Zap,
  BookOpen,
  BarChart3,
  CheckSquare
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface SmartRecommendationsProps {
  userProfile: UserProfile
  existingGoals: GoalSuggestion[]
  onGoalCreate: (goal: GoalSuggestion) => void
}

export function SmartRecommendations({ userProfile, existingGoals, onGoalCreate }: SmartRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<{
    suggestions: GoalSuggestion[]
    priorities: GoalPriority[]
    insights: FinancialInsight[]
    nudges: SmartNudge[]
    actions: ActionItem[]
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'suggestions' | 'insights' | 'actions' | 'templates'>('suggestions')
  const { formatCurrency } = useCurrency()

  useEffect(() => {
    const engine = new SmartRecommendationsEngine(userProfile, existingGoals)
    const results = engine.getSmartRecommendations()
    setRecommendations(results)
    setLoading(false)
  }, [userProfile, existingGoals])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-900 text-red-200'
      case 'medium': return 'bg-yellow-900 text-yellow-200'
      case 'low': return 'bg-green-900 text-green-200'
      default: return 'bg-gray-800 text-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-400'
      case 'warning': return 'text-yellow-400'
      case 'critical': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getNudgeIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="h-4 w-4" />
      case 'celebration': return <CheckCircle className="h-4 w-4" />
      case 'suggestion': return <Lightbulb className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const getNudgeColor = (type: string) => {
    switch (type) {
      case 'warning': return 'border-red-800 bg-red-900/20 text-red-200'
      case 'celebration': return 'border-green-800 bg-green-900/20 text-green-200'
      case 'suggestion': return 'border-blue-800 bg-blue-900/20 text-blue-200'
      default: return 'border-gray-700 bg-gray-800/50 text-gray-200'
    }
  }

  return (
    <div className="space-y-6 text-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-900 rounded-lg">
            <Target className="h-6 w-6 text-blue-200" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-100">Smart Recommendations</h2>
            <p className="text-gray-400">AI-powered financial goal suggestions</p>
          </div>
        </div>
        <Badge variant="secondary" className="bg-blue-900 text-blue-200">
          <Zap className="h-3 w-3 mr-1" />
          AI Powered
        </Badge>
      </div>

      {/* Smart Nudges */}
      {recommendations?.nudges && recommendations.nudges.length > 0 && (
        <div className="space-y-3">
          {recommendations.nudges.map((nudge: SmartNudge, index: number) => (
            <Alert key={index} className={getNudgeColor(nudge.type)}>
              {getNudgeIcon(nudge.type)}
              <AlertDescription className="flex items-center justify-between">
                <div>
                  <span className="font-medium text-gray-100">{nudge.message}</span>
                  <p className="text-sm text-gray-400 mt-1">{nudge.action}</p>
                </div>
                <Badge variant="outline" className="ml-2 border-gray-600 text-gray-300">
                  {nudge.timing}
                </Badge>
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
        <TabsList className="grid w-full grid-cols-4 bg-gray-800">
          <TabsTrigger value="suggestions" className="data-[state=active]:bg-blue-600">Suggestions</TabsTrigger>
          <TabsTrigger value="insights" className="data-[state=active]:bg-blue-600">Insights</TabsTrigger>
          <TabsTrigger value="actions" className="data-[state=active]:bg-blue-600">Actions</TabsTrigger>
          <TabsTrigger value="templates" className="data-[state=active]:bg-blue-600">Templates</TabsTrigger>
        </TabsList>

        {/* Suggestions Tab */}
        <TabsContent value="suggestions" className="space-y-4">
          {recommendations?.suggestions && recommendations.suggestions.length > 0 ? (
            <div className="grid gap-4">
              {recommendations.suggestions.map((suggestion: GoalSuggestion) => (
                <Card key={suggestion.id} className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{suggestion.icon}</span>
                        <div>
                          <CardTitle className="text-gray-100">{suggestion.name}</CardTitle>
                          <p className="text-sm text-gray-400">{suggestion.category}</p>
                        </div>
                      </div>
                      <Badge className={getPriorityColor(suggestion.priority)}>
                        {suggestion.priority}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">Suggested Amount</p>
                        <p className="font-semibold text-gray-100">{formatCurrency(suggestion.suggestedAmount)}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Time to Complete</p>
                        <p className="font-semibold text-gray-100">{suggestion.timeToComplete} months</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-300">{suggestion.reasoning}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="border-gray-600 text-gray-300">
                        Confidence: {suggestion.confidence}%
                      </Badge>
                      <Button size="sm" onClick={() => onGoalCreate(suggestion)}>
                        <Plus className="mr-1 h-4 w-4" />
                        Create Goal
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="text-center py-8">
                <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400">No suggestions available. Complete your profile to get personalized recommendations.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights" className="space-y-4">
          {recommendations?.insights && recommendations.insights.length > 0 ? (
            <div className="grid gap-4">
              {recommendations.insights.map((insight: FinancialInsight, index: number) => (
                <Card key={index} className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-gray-100">{insight.title}</CardTitle>
                    <p className="text-sm text-gray-400">{insight.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-gray-100">{insight.value.toFixed(1)}</div>
                      <Badge className={getStatusColor(insight.status)}>
                        {insight.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="text-center py-8">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400">No insights available. Complete your profile to get financial insights.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Actions Tab */}
        <TabsContent value="actions" className="space-y-4">
          {recommendations?.actions && recommendations.actions.length > 0 ? (
            <div className="grid gap-4">
              {recommendations.actions.map((action: ActionItem) => (
                <Card key={action.id} className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-gray-100">{action.title}</CardTitle>
                      <Badge className={getPriorityColor(action.priority)}>
                        {action.priority}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-300 mb-4">{action.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">{action.action}</span>
                      <Badge variant="outline" className="border-gray-600 text-gray-300">
                        Impact: {action.estimatedImpact}%
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="text-center py-8">
                <CheckSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400">No actions available. Complete your profile to get action items.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-4">
          <GoalTemplates userProfile={userProfile} onGoalCreate={(goal) => {
            // Convert template goal to GoalSuggestion format
            const suggestion: GoalSuggestion = {
              id: `template-${Date.now()}`,
              name: goal.name,
              type: 'savings' as any,
              priority: 'medium',
              suggestedAmount: goal.targetAmount,
              reasoning: `Template goal: ${goal.name}`,
              timeToComplete: 12,
              category: goal.category,
              icon: '🎯',
              confidence: 80
            }
            onGoalCreate(suggestion)
          }} />
        </TabsContent>
      </Tabs>
    </div>
  )
} 