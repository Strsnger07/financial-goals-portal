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
  UserProfile 
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
  BookOpen
} from "lucide-react"

interface SmartRecommendationsProps {
  userProfile: UserProfile
  existingGoals: any[]
  onGoalCreate: (goal: any) => void
}

export function SmartRecommendations({ userProfile, existingGoals, onGoalCreate }: SmartRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<any>(null)
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
      {recommendations.nudges.length > 0 && (
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

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg">
        <Button
          variant={activeTab === 'suggestions' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('suggestions')}
          className="flex-1"
        >
          <Target className="h-4 w-4 mr-2" />
          Goal Suggestions
          <Badge variant="secondary" className="ml-2">
            {recommendations.suggestions.length}
          </Badge>
        </Button>
        <Button
          variant={activeTab === 'insights' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('insights')}
          className="flex-1"
        >
          <TrendingUp className="h-4 w-4 mr-2" />
          Financial Insights
          <Badge variant="secondary" className="ml-2">
            {recommendations.insights.length}
          </Badge>
        </Button>
        <Button
          variant={activeTab === 'actions' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('actions')}
          className="flex-1"
        >
          <Lightbulb className="h-4 w-4 mr-2" />
          Action Items
          <Badge variant="secondary" className="ml-2">
            {recommendations.actions.length}
          </Badge>
        </Button>
        <Button
          variant={activeTab === 'templates' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('templates')}
          className="flex-1"
        >
          <BookOpen className="h-4 w-4 mr-2" />
          Templates
          <Badge variant="secondary" className="ml-2">
            New
          </Badge>
        </Button>
      </div>

      {/* Tab Content */}
      {activeTab === 'suggestions' && (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recommendations.suggestions.map((suggestion: GoalSuggestion) => (
              <Card key={suggestion.id} className="hover:shadow-lg transition-shadow bg-gray-900 border-gray-700">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{suggestion.icon}</span>
                      <div>
                        <CardTitle className="text-lg text-gray-100">{suggestion.name}</CardTitle>
                        <CardDescription className="text-gray-400">{suggestion.category}</CardDescription>
                      </div>
                    </div>
                    <Badge className={getPriorityColor(suggestion.priority)}>
                      {suggestion.priority}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Suggested Amount</span>
                      <span className="font-semibold">
                        {formatCurrency(suggestion.suggestedAmount)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-1">
                      <span className="text-gray-400">Time to Complete</span>
                      <span className="font-semibold">{suggestion.timeToComplete} months</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm text-gray-400">
                      {suggestion.confidence}% confidence
                    </span>
                  </div>

                  <p className="text-sm text-gray-400 leading-relaxed">
                    {suggestion.reasoning}
                  </p>

                  <Button 
                    onClick={() => onGoalCreate(suggestion)}
                    className="w-full"
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Goal
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recommendations.insights.map((insight: FinancialInsight) => (
              <Card key={insight.type} className="bg-gray-900 border-gray-700">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-gray-100">{insight.title}</CardTitle>
                    <div className={`p-2 rounded-full ${getStatusColor(insight.status)}`}>
                      {insight.status === 'good' && <CheckCircle className="h-5 w-5" />}
                      {insight.status === 'warning' && <AlertTriangle className="h-5 w-5" />}
                      {insight.status === 'critical' && <AlertTriangle className="h-5 w-5" />}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-400">{insight.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-300">Current</span>
                      <span className="font-semibold">{insight.value.toFixed(1)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-300">Target</span>
                      <span className="font-semibold">{insight.target}</span>
                    </div>
                    <Progress 
                      value={(insight.value / insight.target) * 100} 
                      className="h-2"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'actions' && (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {recommendations.actions.map((action: ActionItem) => (
              <Card key={action.id} className="hover:shadow-lg transition-shadow bg-gray-900 border-gray-700">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-gray-100">{action.title}</CardTitle>
                    <Badge className={getPriorityColor(action.priority)}>
                      {action.priority}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-400">{action.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Zap className="h-4 w-4 text-blue-500" />
                      <span className="text-sm text-gray-400">
                        Estimated Impact: {action.estimatedImpact}%
                      </span>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full" size="sm">
                    <ArrowRight className="h-4 w-4 mr-2" />
                    {action.action}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

             {activeTab === 'templates' && (
         <div className="space-y-4">
           <GoalTemplates onGoalCreate={onGoalCreate} userProfile={userProfile} />
         </div>
       )}
    </div>
  )
} 