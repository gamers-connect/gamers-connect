import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    console.log('Signin API called')
    const body = await request.json()
    console.log('Signin attempt for:', body.email)
    
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    console.log('Looking up user...')
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        username: true,
        password: true,
        createdAt: true,
        status: true,
        games: true,
        platforms: true,
        isBanned: true,
        isSuspended: true,
        isActive: true,
      },
    })

    if (!user) {
      console.log('User not found')
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    console.log('User found, checking password...')
    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      console.log('Invalid password')
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Check account status
    if (user.isBanned) {
      return NextResponse.json(
        { error: 'Account has been banned' },
        { status: 403 }
      )
    }

    if (user.isSuspended) {
      return NextResponse.json(
        { error: 'Account is temporarily suspended' },
        { status: 403 }
      )
    }

    if (!user.isActive) {
      return NextResponse.json(
        { error: 'Account is deactivated' },
        { status: 403 }
      )
    }

    console.log('Updating user status...')
    // Update last active and status
    await prisma.user.update({
      where: { id: user.id },
      data: { 
        lastActive: new Date(),
        status: 'ONLINE'
      },
    })

    // Generate JWT token
    const jwtSecret = process.env.JWT_SECRET
    if (!jwtSecret) {
      console.error('JWT_SECRET not found in environment variables')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    const token = jwt.sign(
      { 
        userId: user.id,
        email: user.email,
        username: user.username 
      },
      jwtSecret,
      { expiresIn: '7d' }
    )

    // Return user data (without password)
    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      username: user.username,
      createdAt: user.createdAt,
      status: user.status,
      games: user.games,
      platforms: user.platforms,
    }

    console.log('Signin successful for user:', user.email)

    return NextResponse.json({
      success: true,
      user: userData,
      token,
    })

  } catch (error) {
    console.error('Signin error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
