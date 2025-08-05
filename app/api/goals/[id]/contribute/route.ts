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

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const decodedToken = await verifyToken(request)
    const body = await request.json()
    const { amount } = body

    const goalRef = db.collection("goals").doc(params.id)
    const goalDoc = await goalRef.get()

    if (!goalDoc.exists) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 })
    }

    const goalData = goalDoc.data()
    if (goalData?.userId !== decodedToken.uid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const newContributed = goalData.contributed + amount
    const newProgress = (newContributed / goalData.targetAmount) * 100

    // Add contribution to subcollection
    await goalRef.collection("contributions").add({
      amount,
      date: new Date(),
      userId: decodedToken.uid,
    })

    // Update goal
    await goalRef.update({
      contributed: newContributed,
      progress: newProgress,
    })

    return NextResponse.json({
      contributed: newContributed,
      progress: newProgress,
    })
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}
