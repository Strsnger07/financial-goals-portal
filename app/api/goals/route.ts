import { type NextRequest, NextResponse } from "next/server"
import { auth } from "firebase-admin"
import { initializeApp, getApps, cert } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"

// Initialize Firebase Admin
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  })
}

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

    const goalsSnapshot = await db.collection("goals").where("userId", "==", decodedToken.uid).get()

    const goals = goalsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    return NextResponse.json({ goals })
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const decodedToken = await verifyToken(request)
    const body = await request.json()

    const goalData = {
      ...body,
      userId: decodedToken.uid,
      progress: 0,
      contributed: 0,
      createdAt: new Date(),
      milestoneReached: [],
    }

    const docRef = await db.collection("goals").add(goalData)

    return NextResponse.json({ id: docRef.id, ...goalData })
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}
