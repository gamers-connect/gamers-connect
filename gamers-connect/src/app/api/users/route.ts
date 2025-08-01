/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { Prisma, PrismaClient } from '../../../generated/prisma';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Validation schemas
const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
  avatar: z.string().optional(),
  bio: z.string().optional(),
  discord: z.string().optional(),
  location: z.string().optional(),
  games: z.array(z.string()),
  platforms: z.array(z.string()),
  playstyle: z.string().optional(),
});

//const updateUserSchema = createUserSchema.partial();

// GET /api/users - Get all users with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const game = searchParams.get('game');
    const platform = searchParams.get('platform');
    const playstyle = searchParams.get('playstyle');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const where: any = {
      isActive: true,
      isBanned: false,
    };

    if (game) {
      where.games = { has: game };
    }
    if (platform) {
      where.platforms = { has: platform };
    }
    if (playstyle) {
      where.playstyle = playstyle;
    }
    if (status) {
      where.status = status;
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        avatar: true,
        bio: true,
        location: true,
        games: true,
        platforms: true,
        playstyle: true,
        status: true,
        lastActive: true,
        createdAt: true,
      },
      take: limit,
      skip: offset,
      orderBy: { lastActive: 'desc' },
    });

    const total = await prisma.user.count({ where });

    return NextResponse.json({
      users,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST /api/users - Create new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createUserSchema.parse(body);

    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(validatedData.password, 12);

    const user = await prisma.user.create({
      data: {
        ...validatedData, // Spread all properties from validatedData
        password: hashedPassword, // <--- OVERRIDE with the hashed password
      } as Prisma.UserUncheckedCreateInput, // Assert to UncheckedCreateInput for direct scalar field mapping
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        bio: true,
        discord: true,
        location: true,
        games: true,
        platforms: true,
        playstyle: true,
        status: true,
        createdAt: true,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
