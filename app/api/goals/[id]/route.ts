import { type NextRequest, NextResponse } from "next/server"
import { doc, deleteDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: goalId } = await params

    if (!db) {
      return NextResponse.json({ error: "Firebase not initialized" }, { status: 500 })
    }

    // Delete the goal from Firebase
    const goalRef = doc(db, "goals", goalId)
    await deleteDoc(goalRef)

    return NextResponse.json({ 
      success: true, 
      message: "Goal deleted successfully",
      goalId 
    })
  } catch (error) {
    console.error("Error deleting goal:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
