// Smart Goal Recommendations System
export interface GoalSuggestion {
  id: string
  name: string
  type: 'emergency_fund' | 'debt_payoff' | 'investment' | 'savings' | 'retirement' | 'education' | 'home' | 'vehicle' | 'vacation' | 'wedding'
  priority: 'high' | 'medium' | 'low'
  suggestedAmount: number
  reasoning: string
  timeToComplete: number // in months
  category: string
  icon: string
  confidence: number // 0-100
}

export interface GoalPriority {
  goalId: string
  score: number // 0-100
  factors: {
    urgency: number
    impact: number
    achievability: number
    roi: number
  }
}

export interface SmartRecommendation {
  type: 'emergency_fund' | 'debt_payoff' | 'investment' | 'savings'
  priority: 'high' | 'medium' | 'low'
  suggestedAmount: number
  reasoning: string
  timeToComplete: number
}

export interface SpendingAnalysis {
  category: string
  monthlyAverage: number
  potentialSavings: number
  suggestedGoals: GoalSuggestion[]
}

export interface LifeStageRecommendation {
  ageGroup: '18-25' | '26-35' | '36-50' | '50+'
  lifeEvents: string[]
  recommendedGoals: GoalSuggestion[]
}

export interface PredictiveGoal {
  predictedExpense: string
  estimatedAmount: number
  confidence: number
  timeHorizon: number
  reasoning: string
}

export interface SmartNudge {
  type: 'reminder' | 'suggestion' | 'warning' | 'celebration'
  message: string
  action: string
  timing: 'immediate' | 'weekly' | 'monthly'
}

export interface MarketBasedRecommendation {
  marketCondition: 'bull' | 'bear' | 'stable'
  sector: 'real_estate' | 'stocks' | 'bonds' | 'crypto'
  recommendation: string
  confidence: number
}

export interface FinancialInsight {
  type: 'savings_rate' | 'debt_ratio' | 'emergency_coverage' | 'investment_opportunity'
  title: string
  description: string
  value: number
  target: number
  status: 'good' | 'warning' | 'critical'
}

export interface ActionItem {
  id: string
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  action: string
  estimatedImpact: number
}

// User Profile Interface
export interface UserProfile {
  age: number
  income: number
  expenses: number
  debt: number
  savings: number
  lifeEvents: string[]
  riskTolerance: 'conservative' | 'moderate' | 'aggressive'
  location: string
  occupation: string
}

// Smart Recommendations Engine
export class SmartRecommendationsEngine {
  private userProfile: UserProfile
  private existingGoals: GoalSuggestion[]
  private spendingData: SpendingAnalysis[]

  constructor(userProfile: UserProfile, existingGoals: GoalSuggestion[] = [], spendingData: SpendingAnalysis[] = []) {
    this.userProfile = userProfile
    this.existingGoals = existingGoals
    this.spendingData = spendingData
  }

  private getCurrencySymbol(): string {
    // This will be overridden by the context, but we'll default to INR
    return '₹'
  }

  // Get age-based life stage
  private getLifeStage(): '18-25' | '26-35' | '36-50' | '50+' {
    const age = this.userProfile.age
    if (age <= 25) return '18-25'
    if (age <= 35) return '26-35'
    if (age <= 50) return '36-50'
    return '50+'
  }

  // Calculate disposable income
  private getDisposableIncome(): number {
    return this.userProfile.income - this.userProfile.expenses
  }

  // Calculate debt-to-income ratio
  private getDebtToIncomeRatio(): number {
    return (this.userProfile.debt / this.userProfile.income) * 100
  }

  // Calculate savings rate
  private getSavingsRate(): number {
    const monthlyIncome = this.userProfile.income / 12
    const monthlyExpenses = this.userProfile.expenses
    const monthlySavings = monthlyIncome - monthlyExpenses
    return (monthlySavings / monthlyIncome) * 100
  }

  // Generate emergency fund recommendation
  private generateEmergencyFundRecommendation(): GoalSuggestion {
    const monthlyExpenses = this.userProfile.expenses
    const recommendedAmount = monthlyExpenses * 6 // 6 months of expenses
    const currentEmergencyFund = this.userProfile.savings // Use user's current savings
    const neededAmount = Math.max(0, recommendedAmount - currentEmergencyFund)
    const currencySymbol = this.getCurrencySymbol()

    return {
      id: 'emergency-fund',
      name: 'Emergency Fund',
      type: 'emergency_fund',
      priority: neededAmount > 0 ? 'high' : 'low',
      suggestedAmount: neededAmount,
      reasoning: `Based on your monthly expenses of ${currencySymbol}${monthlyExpenses.toLocaleString()}, you should have ${currencySymbol}${recommendedAmount.toLocaleString()} in emergency savings (6 months of expenses).`,
      timeToComplete: Math.ceil(neededAmount / (this.getDisposableIncome() * 0.5)),
      category: 'Safety Net',
      icon: '🛡️',
      confidence: 95
    }
  }

  // Generate debt payoff recommendations
  private generateDebtPayoffRecommendations(): GoalSuggestion[] {
    const recommendations: GoalSuggestion[] = []
    const disposableIncome = this.getDisposableIncome()
    const currencySymbol = this.getCurrencySymbol()

    if (this.userProfile.debt > 0) {
      const highInterestDebt = this.userProfile.debt * 0.6 // Assume 60% is high interest
      
      recommendations.push({
        id: 'debt-payoff',
        name: 'Debt Payoff',
        type: 'debt_payoff',
        priority: 'high',
        suggestedAmount: highInterestDebt,
        reasoning: `You have ${currencySymbol}${this.userProfile.debt.toLocaleString()} in debt. Focus on paying off high-interest debt first to reduce interest costs.`,
        timeToComplete: Math.ceil(highInterestDebt / (disposableIncome * 0.4)),
        category: 'Debt Management',
        icon: '💳',
        confidence: 90
      })
    }

    return recommendations
  }

  // Generate life stage based recommendations
  private generateLifeStageRecommendations(): GoalSuggestion[] {
    const lifeStage = this.getLifeStage()
    const recommendations: GoalSuggestion[] = []

    switch (lifeStage) {
      case '18-25':
        recommendations.push(
          {
            id: 'student-loan-payoff',
            name: 'Student Loan Payoff',
            type: 'debt_payoff',
            priority: 'high',
            suggestedAmount: 200000,
            reasoning: 'Focus on paying off student loans early to avoid long-term interest costs.',
            timeToComplete: 24,
            category: 'Education',
            icon: '🎓',
            confidence: 85
          },
          {
            id: 'first-car',
            name: 'First Car Fund',
            type: 'savings',
            priority: 'medium',
            suggestedAmount: 400000,
            reasoning: 'Save for a reliable first car to support your career and independence.',
            timeToComplete: 18,
            category: 'Transportation',
            icon: '🚗',
            confidence: 80
          }
        )
        break

      case '26-35':
        recommendations.push(
          {
            id: 'house-down-payment',
            name: 'House Down Payment',
            type: 'savings',
            priority: 'high',
            suggestedAmount: 2000000,
            reasoning: 'Save for a 20% down payment to avoid PMI and get better mortgage rates.',
            timeToComplete: 48,
            category: 'Housing',
            icon: '🏠',
            confidence: 90
          },
          {
            id: 'wedding-fund',
            name: 'Wedding Fund',
            type: 'savings',
            priority: 'medium',
            suggestedAmount: 500000,
            reasoning: 'Plan ahead for wedding expenses to avoid debt.',
            timeToComplete: 24,
            category: 'Life Events',
            icon: '💒',
            confidence: 75
          }
        )
        break

      case '36-50':
        recommendations.push(
          {
            id: 'college-fund',
            name: 'College Fund',
            type: 'education',
            priority: 'high',
            suggestedAmount: 800000,
            reasoning: 'Start saving early for children\'s education to take advantage of compound growth.',
            timeToComplete: 120,
            category: 'Education',
            icon: '🎓',
            confidence: 85
          },
          {
            id: 'retirement-catchup',
            name: 'Retirement Catch-up',
            type: 'retirement',
            priority: 'high',
            suggestedAmount: 5000000,
            reasoning: 'Maximize retirement contributions to ensure financial security.',
            timeToComplete: 180,
            category: 'Retirement',
            icon: '🏖️',
            confidence: 90
          }
        )
        break

      case '50+':
        recommendations.push(
          {
            id: 'healthcare-fund',
            name: 'Healthcare Fund',
            type: 'savings',
            priority: 'high',
            suggestedAmount: 300000,
            reasoning: 'Prepare for healthcare costs in retirement.',
            timeToComplete: 60,
            category: 'Healthcare',
            icon: '🏥',
            confidence: 95
          },
          {
            id: 'legacy-planning',
            name: 'Legacy Planning',
            type: 'investment',
            priority: 'medium',
            suggestedAmount: 2000000,
            reasoning: 'Plan for wealth transfer and estate planning.',
            timeToComplete: 120,
            category: 'Legacy',
            icon: '📜',
            confidence: 80
          }
        )
        break
    }

    return recommendations
  }

  // Generate investment recommendations based on risk tolerance
  private generateInvestmentRecommendations(): GoalSuggestion[] {
    const recommendations: GoalSuggestion[] = []
    const disposableIncome = this.getDisposableIncome()

    switch (this.userProfile.riskTolerance) {
      case 'conservative':
        recommendations.push({
          id: 'bonds-portfolio',
          name: 'Conservative Bond Portfolio',
          type: 'investment',
          priority: 'medium',
          suggestedAmount: disposableIncome * 12,
          reasoning: 'Build a conservative portfolio focused on capital preservation.',
          timeToComplete: 24,
          category: 'Investment',
          icon: '📈',
          confidence: 85
        })
        break

      case 'moderate':
        recommendations.push({
          id: 'balanced-portfolio',
          name: 'Balanced Investment Portfolio',
          type: 'investment',
          priority: 'medium',
          suggestedAmount: disposableIncome * 18,
          reasoning: 'Create a balanced portfolio with growth and income components.',
          timeToComplete: 36,
          category: 'Investment',
          icon: '📊',
          confidence: 80
        })
        break

      case 'aggressive':
        recommendations.push({
          id: 'growth-portfolio',
          name: 'Growth Investment Portfolio',
          type: 'investment',
          priority: 'medium',
          suggestedAmount: disposableIncome * 24,
          reasoning: 'Focus on growth investments for long-term wealth building.',
          timeToComplete: 48,
          category: 'Investment',
          icon: '🚀',
          confidence: 75
        })
        break
    }

    return recommendations
  }

  // Calculate goal priority scores
  private calculateGoalPriority(goal: GoalSuggestion): GoalPriority {
    const urgency = goal.priority === 'high' ? 90 : goal.priority === 'medium' ? 60 : 30
    const impact = goal.type === 'emergency_fund' ? 95 : goal.type === 'debt_payoff' ? 90 : 70
    const achievability = Math.max(0, 100 - (goal.timeToComplete * 2)) // Shorter time = higher achievability
    const roi = goal.type === 'investment' ? 85 : goal.type === 'debt_payoff' ? 80 : 60

    const score = (urgency + impact + achievability + roi) / 4

    return {
      goalId: goal.id,
      score,
      factors: { urgency, impact, achievability, roi }
    }
  }

  // Generate financial insights
  private generateFinancialInsights(): FinancialInsight[] {
    const insights: FinancialInsight[] = []
    const savingsRate = this.getSavingsRate()
    const debtRatio = this.getDebtToIncomeRatio()
    const emergencyFund = this.userProfile.savings // Use user's current savings
    const monthlyExpenses = this.userProfile.expenses

    // Savings rate insight
    insights.push({
      type: 'savings_rate',
      title: 'Savings Rate',
      description: `You're saving ${savingsRate.toFixed(1)}% of your income`,
      value: savingsRate,
      target: 20,
      status: savingsRate >= 20 ? 'good' : savingsRate >= 10 ? 'warning' : 'critical'
    })

    // Debt ratio insight
    insights.push({
      type: 'debt_ratio',
      title: 'Debt-to-Income Ratio',
      description: `Your debt is ${debtRatio.toFixed(1)}% of your income`,
      value: debtRatio,
      target: 30,
      status: debtRatio <= 30 ? 'good' : debtRatio <= 40 ? 'warning' : 'critical'
    })

    // Emergency fund insight
    const emergencyMonths = this.userProfile.savings / monthlyExpenses
    insights.push({
      type: 'emergency_coverage',
      title: 'Emergency Fund Coverage',
      description: `You have ${emergencyMonths.toFixed(1)} months of expenses saved`,
      value: emergencyMonths,
      target: 6,
      status: emergencyMonths >= 6 ? 'good' : emergencyMonths >= 3 ? 'warning' : 'critical'
    })

    return insights
  }

  // Generate smart nudges
  private generateSmartNudges(): SmartNudge[] {
    const nudges: SmartNudge[] = []
    const savingsRate = this.getSavingsRate()
    const debtRatio = this.getDebtToIncomeRatio()

    if (savingsRate < 10) {
      nudges.push({
        type: 'warning',
        message: 'Your savings rate is below recommended levels',
        action: 'Consider increasing your savings by 5%',
        timing: 'immediate'
      })
    }

    if (debtRatio > 40) {
      nudges.push({
        type: 'warning',
        message: 'Your debt-to-income ratio is high',
        action: 'Focus on paying down high-interest debt',
        timing: 'immediate'
      })
    }

    if (savingsRate >= 20) {
      nudges.push({
        type: 'celebration',
        message: 'Great job! You\'re saving at an excellent rate',
        action: 'Consider increasing your investment goals',
        timing: 'weekly'
      })
    }

    return nudges
  }

  // Generate action items
  private generateActionItems(): ActionItem[] {
    const actions: ActionItem[] = []
    const savingsRate = this.getSavingsRate()
    const debtRatio = this.getDebtToIncomeRatio()

    if (savingsRate < 10) {
      actions.push({
        id: 'increase-savings',
        title: 'Increase Savings Rate',
        description: 'Aim to save at least 20% of your income',
        priority: 'high',
        action: 'Set up automatic transfers to savings account',
        estimatedImpact: 15
      })
    }

    if (debtRatio > 30) {
      actions.push({
        id: 'debt-payoff-plan',
        title: 'Create Debt Payoff Plan',
        description: 'Focus on high-interest debt first',
        priority: 'high',
        action: 'List all debts and create payoff strategy',
        estimatedImpact: 20
      })
    }

    actions.push({
      id: 'emergency-fund',
      title: 'Build Emergency Fund',
      description: 'Save 6 months of expenses',
      priority: 'medium',
      action: 'Open high-yield savings account',
      estimatedImpact: 10
    })

    return actions
  }

  // Main method to get all smart recommendations
  public getSmartRecommendations(): {
    suggestions: GoalSuggestion[]
    priorities: GoalPriority[]
    insights: FinancialInsight[]
    nudges: SmartNudge[]
    actions: ActionItem[]
  } {
    const suggestions = [
      this.generateEmergencyFundRecommendation(),
      ...this.generateDebtPayoffRecommendations(),
      ...this.generateLifeStageRecommendations(),
      ...this.generateInvestmentRecommendations()
    ]

    const priorities = suggestions.map(goal => this.calculateGoalPriority(goal))
    const insights = this.generateFinancialInsights()
    const nudges = this.generateSmartNudges()
    const actions = this.generateActionItems()

    return {
      suggestions: suggestions.filter(s => s.suggestedAmount > 0),
      priorities: priorities.sort((a, b) => b.score - a.score),
      insights,
      nudges,
      actions: actions.sort((a, b) => a.priority === 'high' ? -1 : 1)
    }
  }
} 