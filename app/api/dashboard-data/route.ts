import { type NextRequest, NextResponse } from "next/server"

// For now, we'll create a simple API that works without Firebase server-side
// In production, you should use Firebase Admin SDK with proper service account

export async function GET(request: NextRequest) {
  try {
    // For now, return mock dashboard data
    // In production, implement proper Firebase Admin SDK
    const mockGoals = [
      {
        id: "demo-1",
        name: "Emergency Fund",
        category: "Savings",
        targetAmount: 50000,
        contributed: 25000,
        progress: 50,
      },
      {
        id: "demo-2", 
        name: "Vacation Fund",
        category: "Travel",
        targetAmount: 30000,
        contributed: 15000,
        progress: 50,
      }
    ]

    const totalGoals = mockGoals.length
    const completedGoals = mockGoals.filter((goal) => goal.progress >= 100).length
    const totalContributed = mockGoals.reduce((sum, goal) => sum + goal.contributed, 0)
    const totalTarget = mockGoals.reduce((sum, goal) => sum + goal.targetAmount, 0)

    const pieChartData = mockGoals
      .map((goal) => ({
        name: goal.name,
        value: goal.contributed,
        category: goal.category,
      }))
      .filter((item) => item.value > 0)

    const progressData = mockGoals.map((goal) => ({
      name: goal.name,
      progress: goal.progress,
      contributed: goal.contributed,
      target: goal.targetAmount,
    }))

    return NextResponse.json({
      metrics: {
        totalGoals,
        completedGoals,
        totalContributed,
        totalTarget,
        completionRate: totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0,
      },
      charts: {
        pieChart: pieChartData,
        progressChart: progressData,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
