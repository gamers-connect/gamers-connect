import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  avatar: z.string().optional(),
  bio: z.string().optional(),
  discord: z.string().optional(),
  location: z.string().optional(),
  games: z.array(z.string()).optional(),
  platforms: z.array(z.string()).optional(),
  playstyle: z.string().optional(),
  status: z.enum(['ONLINE', 'AWAY', 'OFFLINE']).optional(),
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/users/[id] - Get specific user
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { id },
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
        lastActive: true,
        createdAt: true,
        hostedSessions: {
          where: { status: 'ACTIVE' },
          select: {
            id: true,
            title: true,
            game: true,
            date: true,
            time: true,
            maxPlayers: true,
            members: { select: { id: true } },
          },
        },
        sessionMembers: {
          where: { session: { status: 'ACTIVE' } },
          select: {
            session: {
              select: {
                id: true,
                title: true,
                game: true,
                date: true,
                time: true,
                host: { select: { name: true } },
              },
            },
          },
        },
        eventAttendees: {
          where: { event: { status: 'UPCOMING' } },
          select: {
            event: {
              select: {
                id: true,
                title: true,
                game: true,
                date: true,
                time: true,
                location: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

// PUT /api/users/[id] - Update user
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validatedData = updateUserSchema.parse(body);

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...validatedData,
        lastActive: new Date(),
      },
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
        lastActive: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

// DELETE /api/users/[id] - Soft delete user (deactivate)
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Soft delete by setting isActive to false
    await prisma.user.update({
      where: { id },
      data: {
        isActive: false,
        status: 'OFFLINE',
      },
    });

    return NextResponse.json({ message: 'User deactivated successfully' });
  } catch (error) {
    console.error('Error deactivating user:', error);
    return NextResponse.json(
      { error: 'Failed to deactivate user' },
      { status: 500 }
    );
  }
}
