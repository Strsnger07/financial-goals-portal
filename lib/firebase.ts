import { initializeApp, getApps, type FirebaseApp } from "firebase/app"
import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth"
import { getFirestore, type Firestore } from "firebase/firestore"

// Check if we're in a browser environment
const isClient = typeof window !== "undefined"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyCQee08Ygmz2Gel_a0j7P9ovRI9GHT45Mw",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "financial-goals-app.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "financial-goals-app",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "financial-goals-app.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "45110528573",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:45110528573:web:3b858f010539edeb423854",
}

// Initialize Firebase only if we're in a browser environment and it hasn't been initialized already
let app: FirebaseApp | undefined
let auth: Auth | undefined
let db: Firestore | undefined
let googleProvider: GoogleAuthProvider | undefined

if (isClient) {
  try {
    if (!getApps().length) {
      app = initializeApp(firebaseConfig)
    } else {
      app = getApps()[0]
    }
    
    // Initialize Firebase Authentication and get a reference to the service
    auth = getAuth(app)
    
    // Initialize Cloud Firestore and get a reference to the service
    db = getFirestore(app)
    
    // Google Auth Provider
    googleProvider = new GoogleAuthProvider()
  } catch (error) {
    console.error("Firebase initialization error:", error)
  }
}

export { auth, db, googleProvider }
