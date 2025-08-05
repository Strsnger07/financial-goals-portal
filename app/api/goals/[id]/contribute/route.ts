import { type NextRequest, NextResponse } from "next/server"

// For now, we'll create a simple API that works without Firebase server-side
// In production, you should use Firebase Admin SDK with proper service account

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { amount } = body

    // For now, return mock data
    // In production, implement proper Firebase Admin SDK
    const newContributed = amount
    const newProgress = 50 // Mock progress

    return NextResponse.json({
      contributed: newContributed,
      progress: newProgress,
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
