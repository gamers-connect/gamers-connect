/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/sessions/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '../../../../generated/prisma';
import { z } from 'zod';

const prisma = new PrismaClient();

const updateSessionSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  game: z.string().min(1).optional(),
  platform: z.string().min(1).optional(),
  skillLevel: z.string().optional(),
  maxPlayers: z.number().min(2).max(20).optional(),
  isPrivate: z.boolean().optional(),
  date: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }).optional(),
  time: z.string().min(1).optional(),
  status: z.enum(['ACTIVE', 'COMPLETED', 'CANCELLED']).optional(),
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/sessions/[id]
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    const session = await prisma.session.findUnique({
      where: { id },
      include: {
        host: {
          select: {
            id: true,
            name: true,
            avatar: true,
            games: true,
            platforms: true,
            status: true,
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
                games: true,
                platforms: true,
                status: true,
              },
            },
          },
          orderBy: { joinedAt: 'asc' },
        },
        _count: {
          select: { members: true },
        },
      },
    });

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    if (session.isPrivate && userId) {
      const canView = session.hostId === userId || 
                     session.members.some(member => member.user.id === userId);
      
      if (!canView) {
        return NextResponse.json({ error: 'Access denied to private session' }, { status: 403 });
      }
    } else if (session.isPrivate && !userId) {
      return NextResponse.json({ error: 'Access denied to private session' }, { status: 403 });
    }

    const formattedSession = {
      ...session,
      memberCount: session._count.members + 1,
      isFull: session._count.members + 1 >= session.maxPlayers,
      spotsLeft: session.maxPlayers - (session._count.members + 1),
      canJoin: userId ? (
        session.status === 'ACTIVE' &&
        session._count.members + 1 < session.maxPlayers &&
        session.hostId !== userId &&
        !session.members.some(member => member.user.id === userId)
      ) : false,
    };

    return NextResponse.json(formattedSession);
  } catch (error) {
    console.error('Error fetching session:', error);
    return NextResponse.json({ error: 'Failed to fetch session' }, { status: 500 });
  }
}

// PUT /api/sessions/[id]
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validatedData = updateSessionSchema.parse(body);
    const { hostId } = body;

    const existingSession = await prisma.session.findUnique({
      where: { id },
      include: { _count: { select: { members: true } } },
    });

    if (!existingSession) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    if (hostId && existingSession.hostId !== hostId) {
      return NextResponse.json({ error: 'Only the host can update this session' }, { status: 403 });
    }

    const updateData: any = { ...validatedData };
    if (validatedData.date) {
      const sessionDate = new Date(validatedData.date);
      if (sessionDate < new Date() && validatedData.status !== 'COMPLETED' && validatedData.status !== 'CANCELLED') {
        return NextResponse.json({ error: 'Session date cannot be in the past' }, { status: 400 });
      }
      updateData.date = sessionDate;
    }

    if (validatedData.maxPlayers && validatedData.maxPlayers < existingSession._count.members + 1) {
      return NextResponse.json({ error: 'Cannot reduce max players below current member count' }, { status: 400 });
    }

    const updatedSession = await prisma.session.update({
      where: { id },
      data: updateData,
      include: {
        host: { select: { id: true, name: true, avatar: true } },
        members: {
          select: {
            id: true,
            user: { select: { id: true, name: true, avatar: true, status: true } }
          }
        },
        _count: { select: { members: true } }
      },
    });

    const formattedSession = {
      ...updatedSession,
      memberCount: updatedSession._count.members + 1,
      isFull: updatedSession._count.members + 1 >= updatedSession.maxPlayers,
      spotsLeft: updatedSession.maxPlayers - (updatedSession._count.members + 1),
    };

    return NextResponse.json(formattedSession);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.issues }, { status: 400 });
    }
    console.error('Error updating session:', error);
    return NextResponse.json({ error: 'Failed to update session' }, { status: 500 });
  }
}

// DELETE /api/sessions/[id]
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const hostId = searchParams.get('hostId');

    const existingSession = await prisma.session.findUnique({
      where: { id },
      include: { members: true },
    });

    if (!existingSession) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    if (hostId && existingSession.hostId !== hostId) {
      return NextResponse.json({ error: 'Only the host can delete this session' }, { status: 403 });
    }

    await prisma.$transaction([
      prisma.sessionMember.deleteMany({ where: { sessionId: id } }),
      prisma.session.delete({ where: { id } }),
    ]);

    return NextResponse.json({ message: 'Session deleted successfully' });
  } catch (error) {
    console.error('Error deleting session:', error);
    return NextResponse.json({ error: 'Failed to delete session' }, { status: 500 });
  }
}
