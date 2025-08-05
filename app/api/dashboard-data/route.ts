import { type NextRequest, NextResponse } from "next/server"
import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore, collection, getDocs, query, where } from "firebase/firestore"

// Initialize Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

async function verifyToken(request: NextRequest) {
  const token = request.headers.get("Authorization")?.replace("Bearer ", "")
  if (!token) throw new Error("No token provided")

  // For now, we'll use a simple token verification
  // In production, you should verify the Firebase ID token properly
  return { uid: "user-id" }
}

export async function GET(request: NextRequest) {
  try {
    const decodedToken = await verifyToken(request)

    // Get user's goals
    const goalsRef = collection(db, "goals")
    const q = query(goalsRef, where("userId", "==", decodedToken.uid))
    const goalsSnapshot = await getDocs(q)

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
