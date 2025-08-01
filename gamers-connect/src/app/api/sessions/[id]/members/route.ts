// ===== app/api/sessions/[id]/members/route.ts =====
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const joinSessionSchema = z.object({
  userId: z.string().min(1),
});

interface RouteParams2 {
  params: Promise<{ id: string }>;
}

// POST /api/sessions/[id]/members
export async function POST(request: NextRequest, { params }: RouteParams2) {
  try {
    const { id: sessionId } = await params;
    const body = await request.json();
    const { userId } = joinSessionSchema.parse(body);

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { _count: { select: { members: true } } },
    });

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    if (session.status !== 'ACTIVE') {
      return NextResponse.json({ error: 'Cannot join this session' }, { status: 400 });
    }

    if (session._count.members + 1 >= session.maxPlayers) {
      return NextResponse.json({ error: 'Session is full' }, { status: 400 });
    }

    if (session.hostId === userId) {
      return NextResponse.json({ error: 'Host is already part of the session' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const existingMember = await prisma.sessionMember.findUnique({
      where: { userId_sessionId: { userId, sessionId } },
    });

    if (existingMember) {
      return NextResponse.json({ error: 'User is already a member of this session' }, { status: 409 });
    }

    const member = await prisma.sessionMember.create({
      data: { userId, sessionId },
      include: {
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
    });

    await prisma.notification.create({
      data: {
        userId: session.hostId,
        type: 'SESSION',
        title: 'New Session Member!',
        message: `${user.name} joined your session "${session.title}"`,
        actionUrl: `/sessions/${sessionId}`,
      },
    });

    await prisma.notification.create({
      data: {
        userId: userId,
        type: 'SESSION',
        title: 'Session Joined!',
        message: `You successfully joined "${session.title}"`,
        actionUrl: `/sessions/${sessionId}`,
      },
    });

    return NextResponse.json(member, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.issues }, { status: 400 });
    }
    console.error('Error joining session:', error);
    return NextResponse.json({ error: 'Failed to join session' }, { status: 500 });
  }
}

// DELETE /api/sessions/[id]/members
export async function DELETE(request: NextRequest, { params }: RouteParams2) {
  try {
    const { id: sessionId } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const hostId = searchParams.get('hostId');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const session = await prisma.session.findUnique({ where: { id: sessionId } });
    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    const existingMember = await prisma.sessionMember.findUnique({
      where: { userId_sessionId: { userId, sessionId } },
      include: { user: { select: { name: true } } },
    });

    if (!existingMember) {
      return NextResponse.json({ error: 'User is not a member of this session' }, { status: 404 });
    }

    const isUserLeaving = !hostId;
    const isHostKicking = hostId === session.hostId && hostId !== userId;

    if (!isUserLeaving && !isHostKicking) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    await prisma.sessionMember.delete({
      where: { userId_sessionId: { userId, sessionId } },
    });

    if (isHostKicking) {
      await prisma.notification.create({
        data: {
          userId: userId,
          type: 'SESSION',
          title: 'Removed from Session',
          message: `You were removed from "${session.title}"`,
        },
      });
    } else {
      await prisma.notification.create({
        data: {
          userId: session.hostId,
          type: 'SESSION',
          title: 'Member Left Session',
          message: `${existingMember.user.name} left your session "${session.title}"`,
          actionUrl: `/sessions/${sessionId}`,
        },
      });
    }

    return NextResponse.json({ 
      message: isHostKicking ? 'Member removed successfully' : 'Successfully left the session' 
    });
  } catch (error) {
    console.error('Error leaving/removing from session:', error);
    return NextResponse.json({ error: 'Failed to leave/remove from session' }, { status: 500 });
  }
}
