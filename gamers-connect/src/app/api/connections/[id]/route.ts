import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Using shared prisma instance from @/lib/prisma

const updateConnectionSchema = z.object({
  status: z.enum(['ACCEPTED', 'DECLINED']),
  userId: z.string().min(1),
});

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { status, userId } = updateConnectionSchema.parse(body);

    const existingConnection = await prisma.connection.findUnique({
      where: { id },
      include: {
        fromUser: { select: { id: true, name: true } },
        toUser: { select: { id: true, name: true } },
      },
    });

    if (!existingConnection) {
      return NextResponse.json({ error: 'Connection request not found' }, { status: 404 });
    }

    if (existingConnection.toUserId !== userId) {
      return NextResponse.json({ error: 'Only the recipient can respond to this request' }, { status: 403 });
    }

    if (existingConnection.status !== 'PENDING') {
      return NextResponse.json({ error: 'Connection request has already been responded to' }, { status: 400 });
    }

    const updatedConnection = await prisma.connection.update({
      where: { id },
      data: { status },
      include: {
        fromUser: {
          select: {
            id: true,
            name: true,
            avatar: true,
            games: true,
            platforms: true,
            status: true,
          },
        },
        toUser: {
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

    const notificationMessage = status === 'ACCEPTED'
      ? `${existingConnection.toUser.name} accepted your connection request!`
      : `${existingConnection.toUser.name} declined your connection request.`;

    await prisma.notification.create({
      data: {
        userId: existingConnection.fromUserId,
        type: 'CONNECTION_REQUEST',
        title: `Connection Request ${status === 'ACCEPTED' ? 'Accepted' : 'Declined'}`,
        message: notificationMessage,
        actionUrl: status === 'ACCEPTED' ? '/connections' : undefined,
      },
    });

    return NextResponse.json(updatedConnection);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.issues }, { status: 400 });
    }
    console.error('Error updating connection:', error);
    return NextResponse.json({ error: 'Failed to update connection request' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const existingConnection = await prisma.connection.findUnique({
      where: { id },
      include: {
        fromUser: { select: { name: true } },
        toUser: { select: { name: true } },
      },
    });

    if (!existingConnection) {
      return NextResponse.json({ error: 'Connection not found' }, { status: 404 });
    }

    const isFromUser = existingConnection.fromUserId === userId;
    const isToUser = existingConnection.toUserId === userId;

    if (!isFromUser && !isToUser) {
      return NextResponse.json({ error: 'You are not part of this connection' }, { status: 403 });
    }

    await prisma.connection.delete({ where: { id } });

    if (existingConnection.status === 'ACCEPTED') {
      const otherUserId = isFromUser ? existingConnection.toUserId : existingConnection.fromUserId;
      const currentUserName = isFromUser ? existingConnection.fromUser.name : existingConnection.toUser.name;

      await prisma.notification.create({
        data: {
          userId: otherUserId,
          type: 'CONNECTION_REQUEST',
          title: 'Connection Removed',
          message: `${currentUserName} removed you from their connections`,
        },
      });
    }

    return NextResponse.json({
      message: existingConnection.status === 'PENDING'
        ? 'Connection request cancelled'
        : 'Connection removed successfully'
    });
  } catch (error) {
    console.error('Error deleting connection:', error);
    return NextResponse.json({ error: 'Failed to delete connection' }, { status: 500 });
  }
}
