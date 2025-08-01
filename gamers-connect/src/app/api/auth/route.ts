import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma, UserStatus } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { generateToken, withAuth, AuthRequest } from '../../../lib/auth';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
  username: z.string().min(3).optional(),
  avatar: z.string().optional(),
  games: z.array(z.string()).default([]),
  platforms: z.array(z.string()).default([]),
  playstyle: z.string().optional(),
  location: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// POST /api/auth - Register new user
export async function POST(request: NextRequest) {
  try {
    console.log('Registration API called');
    const body = await request.json();
    console.log('Registration data received:', { ...body, password: '[HIDDEN]' });
    
    const validatedData = registerSchema.parse(body);

    // Check if user already exists by email
    const existingUserByEmail = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUserByEmail) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Check if username already exists (if provided)
    if (validatedData.username) {
      const existingUserByUsername = await prisma.user.findUnique({
        where: { username: validatedData.username },
      });

      if (existingUserByUsername) {
        return NextResponse.json(
          { error: 'Username already exists' },
          { status: 409 }
        );
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12);

    // Create user data
    const userData = {
      email: validatedData.email,
      password: hashedPassword,
      name: validatedData.name,
      username: validatedData.username || `user_${Date.now()}`,
      avatar: validatedData.avatar,
      games: validatedData.games,
      platforms: validatedData.platforms,
      playstyle: validatedData.playstyle,
      location: validatedData.location,
      status: UserStatus.ONLINE,
      lastActive: new Date(),
      isActive: true,
      isBanned: false,
      isSuspended: false,
    };

    // Create user
    const user = await prisma.user.create({
      data: userData,
      select: {
        id: true,
        email: true,
        name: true,
        username: true,
        avatar: true,
        games: true,
        platforms: true,
        playstyle: true,
        location: true,
        status: true,
        createdAt: true,
      },
    });

    console.log('User created successfully:', user.id);

    // Generate JWT token
    const token = generateToken(user.id);

    // Create welcome notification
    try {
      await prisma.notification.create({
        data: {
          userId: user.id,
          type: 'ACHIEVEMENT',
          title: 'Welcome to Game Connect!',
          message: 'Your account has been created successfully. Start connecting with fellow gamers!',
        },
      });
    } catch (notificationError) {
      // Don't fail registration if notification fails
      console.warn('Failed to create welcome notification:', notificationError);
    }

    console.log('Registration successful for user:', user.email);

    return NextResponse.json({
      user,
      token,
      message: 'User registered successfully',
    }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }

    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return NextResponse.json(
          { error: 'Email or username already exists' },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to register user' },
      { status: 500 }
    );
  }
}

// PUT /api/auth - Login user
export async function PUT(request: NextRequest) {
  try {
    console.log('Login API called');
    const body = await request.json();
    console.log('Login attempt for:', body.email);
    
    const { email, password } = loginSchema.parse(body);

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        username: true, // Include username
        avatar: true,
        games: true,
        platforms: true,
        playstyle: true,
        location: true,
        status: true,
        isActive: true,
        isBanned: true,
        isSuspended: true,
        password: true,
      } 
    });

    if (!user) {
      console.log('User not found');
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check account status
    if (!user.isActive || user.isBanned) {
      console.log('Account inactive or banned');
      return NextResponse.json(
        { error: 'Account is inactive or banned' },
        { status: 403 }
      );
    }

    if (user.isSuspended) {
      console.log('Account suspended');
      return NextResponse.json(
        { error: 'Account is suspended' },
        { status: 403 }
      );
    }

    console.log('User found, checking password...');
    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log('Invalid password');
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    console.log('Password valid, updating user status...');
    // Update user status to online
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { 
        status: 'ONLINE',
        lastActive: new Date(),
      },
      select: {
        id: true,
        email: true,
        name: true,
        username: true, // Include username in response
        avatar: true,
        games: true,
        platforms: true,
        playstyle: true,
        location: true,
        status: true,
        createdAt: true,
      },
    });

    // Generate JWT token
    const token = generateToken(user.id);

    console.log('Login successful for user:', user.email);

    return NextResponse.json({
      user: updatedUser,
      token,
      message: 'Login successful',
    });
  } catch (error) {
    console.error('Login error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to login' },
      { status: 500 }
    );
  }
}

// DELETE /api/auth - Logout user (with authentication)
export const DELETE = withAuth(async (request: AuthRequest) => {
  try {
    console.log('Logout API called');
    const user = request.user!;

    // Update user status to offline
    await prisma.user.update({
      where: { id: user.id },
      data: { 
        status: 'OFFLINE',
        lastActive: new Date(),
      },
    });

    console.log('User logged out successfully');

    return NextResponse.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Failed to logout' },
      { status: 500 }
    );
  }
});
