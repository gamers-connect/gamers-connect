/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    console.log('Verify API called')
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('No valid token provided')
      return NextResponse.json(
        { error: 'No valid token provided' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)

    const jwtSecret = process.env.JWT_SECRET
    if (!jwtSecret) {
      console.error('JWT_SECRET not found in environment variables')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    // Verify JWT token
    const decoded = jwt.verify(token, jwtSecret) as any
    console.log('Token verified for user:', decoded.userId)

    // Find user by ID
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        username: true,
        createdAt: true,
        status: true,
        games: true,
        platforms: true,
        avatar: true,
        bio: true,
        location: true,
        discord: true,
        playstyle: true,
        isActive: true,
        isBanned: true,
        isSuspended: true,
      },
    })

    if (!user) {
      console.log('User not found')
      return NextResponse.json(
        { error: 'User not found' },
        { status: 401 }
      )
    }

    // Check if user is still active
    if (!user.isActive || user.isBanned || user.isSuspended) {
      console.log('User account is not active')
      return NextResponse.json(
        { error: 'Account is no longer active' },
        { status: 401 }
      )
    }

    // Update last active time
    await prisma.user.update({
      where: { id: user.id },
      data: { lastActive: new Date() },
    })

    console.log('User verified successfully')

    return NextResponse.json({
      success: true,
      user,
    })

  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      console.log('Invalid token')
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }
    
    console.error('Token verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
