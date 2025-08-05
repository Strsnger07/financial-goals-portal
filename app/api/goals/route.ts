import { type NextRequest, NextResponse } from "next/server"
import { initializeApp } from "firebase/app"
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"
import { getFirestore, collection, addDoc, getDocs, query, where } from "firebase/firestore"

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

    const goalsRef = collection(db, "goals")
    const q = query(goalsRef, where("userId", "==", decodedToken.uid))
    const goalsSnapshot = await getDocs(q)

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

    const docRef = await addDoc(collection(db, "goals"), goalData)

    return NextResponse.json({ id: docRef.id, ...goalData })
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}
