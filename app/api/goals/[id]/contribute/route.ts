import { type NextRequest, NextResponse } from "next/server"
import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore, doc, getDoc, updateDoc, collection, addDoc } from "firebase/firestore"

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

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const decodedToken = await verifyToken(request)
    const body = await request.json()
    const { amount } = body

    const goalRef = doc(db, "goals", params.id)
    const goalDoc = await getDoc(goalRef)

    if (!goalDoc.exists()) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 })
    }

    const goalData = goalDoc.data()
    if (goalData?.userId !== decodedToken.uid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const newContributed = goalData.contributed + amount
    const newProgress = (newContributed / goalData.targetAmount) * 100

    // Add contribution to subcollection
    await addDoc(collection(goalRef, "contributions"), {
      amount,
      date: new Date(),
      userId: decodedToken.uid,
    })

    // Update goal
    await updateDoc(goalRef, {
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
