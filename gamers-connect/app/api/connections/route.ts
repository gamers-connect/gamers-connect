/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '../../../src/generated/prisma';
import { z } from 'zod';

const prisma3 = new PrismaClient();

const createConnectionSchema = z.object({
  fromUserId: z.string().min(1),
  toUserId: z.string().min(1),
  message: z.string().optional(),
});

// GET /api/connections
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const type = searchParams.get('type') || 'all';
    const status = searchParams.get('status');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    let where: any = {};

    switch (type) {
      case 'sent':
        where.fromUserId = userId;
        break;
      case 'received':
        where.toUserId = userId;
        break;
      case 'accepted':
        where = {
          OR: [{ fromUserId: userId }, { toUserId: userId }],
          status: 'ACCEPTED'
        };
        break;
      default:
        where = {
          OR: [{ fromUserId: userId }, { toUserId: userId }]
        };
    }

    if (status) {
      where.status = status;
    }

    const connections = await prisma3.connection.findMany({
      where,
      include: {
        fromUser: {
          select: {
            id: true,
            name: true,
            avatar: true,
            games: true,
            platforms: true,
            status: true,
            lastActive: true,
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
            lastActive: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formattedConnections = connections.map(connection => {
      const isFromUser = connection.fromUser.id === userId;
      const otherUser = isFromUser ? connection.toUser : connection.fromUser;
      
      return {
        id: connection.id,
        status: connection.status,
        message: connection.message,
        createdAt: connection.createdAt,
        updatedAt: connection.updatedAt,
        isOutgoing: isFromUser,
        user: otherUser,
        mutualGames: connection.fromUser.games.filter(game => 
          connection.toUser.games.includes(game)
        ).length,
      };
    });

    return NextResponse.json({ connections: formattedConnections });
  } catch (error) {
    console.error('Error fetching connections:', error);
    return NextResponse.json({ error: 'Failed to fetch connections' }, { status: 500 });
  }
}

// POST /api/connections
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createConnectionSchema.parse(body);
    const { fromUserId, toUserId, message } = validatedData;

    const [fromUser, toUser] = await Promise.all([
      prisma3.user.findUnique({ where: { id: fromUserId } }),
      prisma3.user.findUnique({ where: { id: toUserId } }),
    ]);

    if (!fromUser || !toUser) {
      return NextResponse.json({ error: 'One or both users not found' }, { status: 404 });
    }

    if (fromUserId === toUserId) {
      return NextResponse.json({ error: 'Cannot send connection request to yourself' }, { status: 400 });
    }

    const existingConnection = await prisma3.connection.findFirst({
      where: {
        OR: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId }
        ]
      }
    });

    if (existingConnection) {
      return NextResponse.json({ error: 'Connection request already exists' }, { status: 409 });
    }

    const connection = await prisma3.connection.create({
      data: {
        fromUserId,
        toUserId,
        message,
        status: 'PENDING',
      },
      include: {
        fromUser: {
          select: {
            id: true,
            name: true,
            avatar: true,
            games: true,
            platforms: true,
          },
        },
        toUser: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    await prisma3.notification.create({
      data: {
        userId: toUserId,
        type: 'CONNECTION_REQUEST',
        title: 'New Connection Request',
        message: `${fromUser.name} wants to connect with you`,
        actionUrl: `/connections`,
      },
    });

    return NextResponse.json(connection, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.issues }, { status: 400 });
    }
    console.error('Error creating connection:', error);
    return NextResponse.json({ error: 'Failed to create connection request' }, { status: 500 });
  }
}
