/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    console.log('Signup API called')
    const body = await request.json()
    console.log('Signup data received:', { ...body, password: '[HIDDEN]' })
    
    const { email, password, name, username } = body

    // Validate required fields
    if (!email || !password || !name || !username) {
      console.log('Missing required fields')
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      )
    }

    console.log('Hashing password...')
    // Hash password
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    console.log('Creating user in database...')
    // Create user in database
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        username,
        status: 'ONLINE',
        lastActive: new Date(),
        games: [],
        platforms: [],
      },
      select: {
        id: true,
        email: true,
        name: true,
        username: true,
        createdAt: true,
        status: true,
        games: true,
        platforms: true,
      },
    })

    console.log('User created successfully:', user.id)

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

    console.log('Signup successful for user:', user.email)

    return NextResponse.json({
      success: true,
      user,
      token,
    })

  } catch (error: any) {
    console.error('Signup error:', error)

    // Handle Prisma unique constraint violations
    if (error.code === 'P2002') {
      const target = error.meta?.target as string[]
      if (target?.includes('email')) {
        return NextResponse.json(
          { error: 'Email already exists' },
          { status: 400 }
        )
      }
      if (target?.includes('username')) {
        return NextResponse.json(
          { error: 'Username already exists' },
          { status: 400 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
