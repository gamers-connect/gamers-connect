import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, Prisma } from '../../../src/generated/prisma';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { generateToken, withAuth, AuthRequest } from '../../../src/lib/auth';

const prisma = new PrismaClient();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
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
    const body = await request.json();
    const validatedData = registerSchema.parse(body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        password: hashedPassword,
        name: validatedData.name,
        avatar: validatedData.avatar,
        games: validatedData.games,
        platforms: validatedData.platforms,
        playstyle: validatedData.playstyle,
        location: validatedData.location,
      } as Prisma.UserUncheckedCreateInput,
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        games: true,
        platforms: true,
        playstyle: true,
        location: true,
        createdAt: true,
      },
    });

    // Generate JWT token
    const token = generateToken(user.id);

    // Create welcome notification
    await prisma.notification.create({
      data: {
        userId: user.id,
        type: 'ACHIEVEMENT',
        title: 'Welcome to Game Connect!',
        message: 'Your account has been created successfully. Start connecting with fellow gamers!',
      },
    });

    return NextResponse.json({
      user,
      token,
      message: 'User registered successfully',
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Failed to register user' },
      { status: 500 }
    );
  }
}

// PUT /api/auth - Login user
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = loginSchema.parse(body);

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
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
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check account status
    if (!user.isActive || user.isBanned) {
      return NextResponse.json(
        { error: 'Account is inactive or banned' },
        { status: 403 }
      );
    }

    if (user.isSuspended) {
      return NextResponse.json(
        { error: 'Account is suspended' },
        { status: 403 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

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
        avatar: true,
        games: true,
        platforms: true,
        playstyle: true,
        location: true,
        status: true,
      },
    });

    // Generate JWT token
    const token = generateToken(user.id);

    return NextResponse.json({
      user: updatedUser,
      token,
      message: 'Login successful',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Failed to login' },
      { status: 500 }
    );
  }
}

// DELETE /api/auth - Logout user (with authentication)
export const DELETE = withAuth(async (request: AuthRequest) => {
  try {
    const user = request.user!; // We know user exists because of withAuth

    // Update user status to offline
    await prisma.user.update({
      where: { id: user.id },
      data: { status: 'OFFLINE' },
    });

    return NextResponse.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Failed to logout' },
      { status: 500 }
    );
  }
});
