/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '../../../generated/prisma';
import { z } from 'zod';

const prisma = new PrismaClient();

const createSessionSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  game: z.string().min(1),
  platform: z.string().min(1),
  skillLevel: z.string().optional(),
  maxPlayers: z.number().min(2).max(20),
  isPrivate: z.boolean().default(false),
  date: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
  time: z.string().min(1),
  hostId: z.string().min(1),
});

// GET /api/sessions - Get all gaming sessions with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const game = searchParams.get('game');
    const platform = searchParams.get('platform');
    const skillLevel = searchParams.get('skillLevel');
    const status = searchParams.get('status') || 'ACTIVE';
    const hostId = searchParams.get('hostId');
    const userId = searchParams.get('userId'); // For user's sessions
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    const where: any = {
      status,
    };

    // Don't show private sessions unless user is host or member
    if (!hostId && !userId) {
      where.isPrivate = false;
    }

    if (game) {
      where.game = { contains: game, mode: 'insensitive' };
    }
    if (platform) {
      where.platform = platform;
    }
    if (skillLevel) {
      where.skillLevel = skillLevel;
    }
    if (hostId) {
      where.hostId = hostId;
    }
    if (userId) {
      where.OR = [
        { hostId: userId },
        { members: { some: { userId } } },
      ];
    }

    const sessions = await prisma.session.findMany({
      where,
      include: {
        host: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        members: {
          select: {
            id: true,
            joinedAt: true,
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
                status: true,
              },
            },
          },
          orderBy: { joinedAt: 'asc' },
        },
        _count: {
          select: {
            members: true,
          },
        },
      },
      take: limit,
      skip: offset,
      orderBy: { date: 'asc' },
    });

    const total = await prisma.session.count({ where });

    const formattedSessions = sessions.map(session => ({
      ...session,
      memberCount: session._count.members + 1, // +1 for host
      isFull: session._count.members + 1 >= session.maxPlayers,
      spotsLeft: session.maxPlayers - (session._count.members + 1),
    }));

    return NextResponse.json({
      sessions: formattedSessions,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sessions' },
      { status: 500 }
    );
  }
}

// POST /api/sessions - Create new gaming session
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createSessionSchema.parse(body);

    // Convert date string to Date object
    const sessionDate = new Date(validatedData.date);
    if (sessionDate < new Date()) {
      return NextResponse.json(
        { error: 'Session date cannot be in the past' },
        { status: 400 }
      );
    }

    // Check if host exists
    const host = await prisma.user.findUnique({
      where: { id: validatedData.hostId },
    });

    if (!host) {
      return NextResponse.json(
        { error: 'Host user not found' },
        { status: 404 }
      );
    }

    const session = await prisma.session.create({
      data: {
        ...validatedData,
        date: sessionDate,
      },
      include: {
        host: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        members: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
                status: true,
              },
            },
          },
        },
        _count: {
          select: {
            members: true,
          },
        },
      },
    });

    const formattedSession = {
      ...session,
      memberCount: session._count.members + 1,
      isFull: session._count.members + 1 >= session.maxPlayers,
      spotsLeft: session.maxPlayers - (session._count.members + 1),
    };

    return NextResponse.json(formattedSession, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Error creating session:', error);
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    );
  }
}
