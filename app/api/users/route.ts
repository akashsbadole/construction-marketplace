import { NextRequest, NextResponse } from 'next/server'
import { dbService } from '@/lib/database/service'

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json()
    const user = await dbService.createUser(userData)
    return NextResponse.json(user)
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // Return mock data for now
    return NextResponse.json([])
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}
