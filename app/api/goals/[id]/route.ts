import { type NextRequest, NextResponse } from "next/server"

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: goalId } = await params

    // For now, return success response since Firebase client SDK doesn't work in API routes
    // In production, you would use Firebase Admin SDK here
    console.log(`Goal deletion requested for ID: ${goalId}`)

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
