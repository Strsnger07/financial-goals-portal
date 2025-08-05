import { type NextRequest, NextResponse } from "next/server"
import { auth } from "firebase-admin"
import { getFirestore } from "firebase-admin/firestore"

const db = getFirestore()

async function verifyToken(request: NextRequest) {
  const token = request.headers.get("Authorization")?.replace("Bearer ", "")
  if (!token) throw new Error("No token provided")

  const decodedToken = await auth().verifyIdToken(token)
  return decodedToken
}

export async function GET(request: NextRequest) {
  try {
    const decodedToken = await verifyToken(request)

    // Get user's goals
    const goalsSnapshot = await db.collection("goals").where("userId", "==", decodedToken.uid).get()

    const goals = goalsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    // Calculate dashboard metrics
    const totalGoals = goals.length
    const completedGoals = goals.filter((goal) => goal.progress >= 100).length
    const totalContributed = goals.reduce((sum, goal) => sum + goal.contributed, 0)
    const totalTarget = goals.reduce((sum, goal) => sum + goal.targetAmount, 0)

    // Prepare chart data
    const pieChartData = goals
      .map((goal) => ({
        name: goal.name,
        value: goal.contributed,
        category: goal.category,
      }))
      .filter((item) => item.value > 0)

    const progressData = goals.map((goal) => ({
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
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}
