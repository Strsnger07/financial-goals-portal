"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCurrency } from "@/contexts/currency-context"
import { 
  Home, 
  Car, 
  GraduationCap, 
  Heart, 
  Plane, 
  Shield, 
  PiggyBank, 
  Briefcase,
  Plus,
  Target,
  Calendar,
  DollarSign
} from "lucide-react"

interface GoalTemplate {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  category: string
  defaultAmount: number
  defaultTimeframe: number // in months
  difficulty: 'easy' | 'medium' | 'hard'
  tags: string[]
}

const goalTemplates: GoalTemplate[] = [
  {
    id: 'emergency-fund',
    name: 'Emergency Fund',
    description: 'Save 3-6 months of living expenses for unexpected situations',
    icon: <Shield className="h-6 w-6" />,
    category: 'Safety Net',
    defaultAmount: 150000,
    defaultTimeframe: 12,
    difficulty: 'easy',
    tags: ['essential', 'safety', 'short-term']
  },
  {
    id: 'house-down-payment',
    name: 'House Down Payment',
    description: 'Save for a 20% down payment on your dream home',
    icon: <Home className="h-6 w-6" />,
    category: 'Housing',
    defaultAmount: 2000000,
    defaultTimeframe: 48,
    difficulty: 'hard',
    tags: ['housing', 'long-term', 'investment']
  },
  {
    id: 'new-car',
    name: 'New Car Fund',
    description: 'Save for a reliable vehicle without taking on debt',
    icon: <Car className="h-6 w-6" />,
    category: 'Transportation',
    defaultAmount: 800000,
    defaultTimeframe: 24,
    difficulty: 'medium',
    tags: ['transportation', 'medium-term']
  },
  {
    id: 'education-fund',
    name: 'Education Fund',
    description: 'Save for college tuition or professional development',
    icon: <GraduationCap className="h-6 w-6" />,
    category: 'Education',
    defaultAmount: 500000,
    defaultTimeframe: 60,
    difficulty: 'hard',
    tags: ['education', 'long-term', 'investment']
  },
  {
    id: 'wedding-fund',
    name: 'Wedding Fund',
    description: 'Save for your special day without starting married life in debt',
    icon: <Heart className="h-6 w-6" />,
    category: 'Life Events',
    defaultAmount: 500000,
    defaultTimeframe: 24,
    difficulty: 'medium',
    tags: ['life-events', 'medium-term']
  },
  {
    id: 'vacation-fund',
    name: 'Vacation Fund',
    description: 'Save for dream vacations and travel experiences',
    icon: <Plane className="h-6 w-6" />,
    category: 'Travel',
    defaultAmount: 100000,
    defaultTimeframe: 12,
    difficulty: 'easy',
    tags: ['travel', 'short-term', 'enjoyment']
  },
  {
    id: 'retirement-fund',
    name: 'Retirement Fund',
    description: 'Build a nest egg for financial independence',
    icon: <Briefcase className="h-6 w-6" />,
    category: 'Retirement',
    defaultAmount: 10000000,
    defaultTimeframe: 240,
    difficulty: 'hard',
    tags: ['retirement', 'long-term', 'investment']
  },
  {
    id: 'investment-portfolio',
    name: 'Investment Portfolio',
    description: 'Build wealth through diversified investments',
    icon: <PiggyBank className="h-6 w-6" />,
    category: 'Investment',
    defaultAmount: 300000,
    defaultTimeframe: 36,
    difficulty: 'medium',
    tags: ['investment', 'wealth-building', 'medium-term']
  }
]

interface GoalTemplatesProps {
  onGoalCreate: (goal: {
    name: string
    targetAmount: number
    deadline: string
    category: string
  }) => void
  userProfile?: {
    income: number
    expenses: number
    debt: number
    savings: number
  }
}

export function GoalTemplates({ onGoalCreate, userProfile }: GoalTemplatesProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<GoalTemplate | null>(null)
  const [customAmount, setCustomAmount] = useState<number>(0)
  const [customTimeframe, setCustomTimeframe] = useState<number>(0)
  const { currency, formatCurrency } = useCurrency()

  // Function to calculate dynamic amounts based on user profile
  const calculateDynamicAmount = (baseAmount: number, templateId: string): number => {
    if (!userProfile) return baseAmount
    
    const monthlyIncome = userProfile.income / 12
    const monthlyExpenses = userProfile.expenses
    const disposableIncome = monthlyIncome - monthlyExpenses
    
    // Income level classification
    const isLowIncome = monthlyIncome < 50000 // Less than 50k INR per month
    const isHighIncome = monthlyIncome > 200000 // More than 2L INR per month
    
    let multiplier = 1
    
    switch (templateId) {
      case 'emergency-fund':
        // Emergency fund should be 6 months of expenses
        return monthlyExpenses * 6
        
      case 'house-down-payment':
        // House down payment based on income level
        if (isLowIncome) multiplier = 0.5 // 50% of base for low income
        else if (isHighIncome) multiplier = 2 // 200% of base for high income
        break
        
      case 'new-car':
        // Car fund based on income
        if (isLowIncome) multiplier = 0.6
        else if (isHighIncome) multiplier = 1.5
        break
        
      case 'education-fund':
        // Education fund based on income
        if (isLowIncome) multiplier = 0.7
        else if (isHighIncome) multiplier = 1.8
        break
        
      case 'wedding-fund':
        // Wedding fund based on income
        if (isLowIncome) multiplier = 0.6
        else if (isHighIncome) multiplier = 1.5
        break
        
      case 'vacation-fund':
        // Vacation fund based on income
        if (isLowIncome) multiplier = 0.5
        else if (isHighIncome) multiplier = 1.3
        break
        
      case 'retirement-fund':
        // Retirement fund based on income
        if (isLowIncome) multiplier = 0.8
        else if (isHighIncome) multiplier = 2.5
        break
        
      case 'investment-portfolio':
        // Investment portfolio based on income
        if (isLowIncome) multiplier = 0.6
        else if (isHighIncome) multiplier = 1.4
        break
    }
    
    return Math.round(baseAmount * multiplier)
  }

  // Function to calculate dynamic timeframe based on user profile
  const calculateDynamicTimeframe = (baseTimeframe: number, templateId: string, amount: number): number => {
    if (!userProfile) return baseTimeframe
    
    const monthlyIncome = userProfile.income / 12
    const monthlyExpenses = userProfile.expenses
    const disposableIncome = monthlyIncome - monthlyExpenses
    
    // Calculate how much they can save per month (30% of disposable income)
    const monthlySavings = Math.max(disposableIncome * 0.3, monthlyIncome * 0.1)
    
    // Calculate how many months it would take to reach the goal
    const monthsNeeded = Math.ceil(amount / monthlySavings)
    
    // Ensure minimum and maximum timeframes
    const minTimeframe = 6 // Minimum 6 months
    const maxTimeframe = 120 // Maximum 10 years
    
    return Math.max(minTimeframe, Math.min(maxTimeframe, monthsNeeded))
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-900 text-green-200'
      case 'medium': return 'bg-yellow-900 text-yellow-200'
      case 'hard': return 'bg-red-900 text-red-200'
      default: return 'bg-gray-800 text-gray-200'
    }
  }

  const handleTemplateSelect = (template: GoalTemplate) => {
    setSelectedTemplate(template)
    const dynamicAmount = calculateDynamicAmount(template.defaultAmount, template.id)
    const dynamicTimeframe = calculateDynamicTimeframe(template.defaultTimeframe, template.id, dynamicAmount)
    setCustomAmount(dynamicAmount)
    setCustomTimeframe(dynamicTimeframe)
  }

  const handleCreateGoal = () => {
    if (!selectedTemplate) return

    const deadline = new Date()
    deadline.setMonth(deadline.getMonth() + customTimeframe)

    onGoalCreate({
      name: selectedTemplate.name,
      targetAmount: customAmount,
      deadline: deadline.toISOString().split('T')[0],
      category: selectedTemplate.category
    })

    setSelectedTemplate(null)
  }

  return (
    <div className="space-y-6 text-gray-100">
      <div className="flex items-center space-x-3">
        <Target className="h-6 w-6 text-blue-400" />
        <div>
          <h2 className="text-2xl font-bold text-gray-100">Goal Templates</h2>
          <p className="text-gray-400">Choose from popular financial goals or customize your own</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {goalTemplates.map((template) => (
          <Card key={template.id} className="hover:shadow-lg transition-shadow cursor-pointer bg-gray-900 border-gray-700">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-900 rounded-lg text-blue-200">
                    {template.icon}
                  </div>
                  <div>
                    <CardTitle className="text-lg text-gray-100">{template.name}</CardTitle>
                    <CardDescription className="text-gray-400">{template.category}</CardDescription>
                  </div>
                </div>
                <Badge className={getDifficultyColor(template.difficulty)}>
                  {template.difficulty}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-400">{template.description}</p>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Suggested Amount</span>
                <span className="font-semibold">{formatCurrency(calculateDynamicAmount(template.defaultAmount, template.id))}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Suggested Timeframe</span>
                <span className="font-semibold">{calculateDynamicTimeframe(template.defaultTimeframe, template.id, calculateDynamicAmount(template.defaultAmount, template.id))} months</span>
              </div>

              <div className="flex flex-wrap gap-1">
                {template.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs border-gray-600 text-gray-300">
                    {tag}
                  </Badge>
                ))}
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    className="w-full" 
                    size="sm"
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Use Template
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gray-900 border-gray-700">
                  <DialogHeader>
                    <DialogTitle className="flex items-center space-x-2 text-gray-100">
                      {template.icon}
                      <span>{template.name}</span>
                    </DialogTitle>
                    <DialogDescription className="text-gray-400">
                      Customize your {template.name.toLowerCase()} goal
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="amount" className="text-gray-300">Target Amount (INR)</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-3 text-gray-400 font-medium">{currency}</span>
                        <Input
                          id="amount"
                          type="number"
                          value={customAmount}
                          onChange={(e) => setCustomAmount(parseInt(e.target.value) || 0)}
                          placeholder={template.defaultAmount.toString()}
                          className="pl-8"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="timeframe" className="text-gray-300">Timeframe (months)</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="timeframe"
                          type="number"
                          value={customTimeframe}
                          onChange={(e) => setCustomTimeframe(parseInt(e.target.value) || 0)}
                          placeholder={template.defaultTimeframe.toString()}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="p-4 bg-blue-900 rounded-lg">
                      <h4 className="font-medium text-blue-200 mb-2">Goal Summary</h4>
                      <div className="space-y-1 text-sm text-blue-100">
                        <div className="flex justify-between">
                          <span>Monthly Savings Needed:</span>
                          <span className="font-semibold">
                             {formatCurrency(customAmount && customTimeframe ? Math.ceil(customAmount / customTimeframe) : 0)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Category:</span>
                          <span className="font-semibold">{template.category}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Difficulty:</span>
                          <Badge className={getDifficultyColor(template.difficulty)}>
                            {template.difficulty}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setSelectedTemplate(null)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreateGoal}>
                        Create Goal
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 