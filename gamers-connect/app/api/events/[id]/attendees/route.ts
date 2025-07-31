import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '../../../../../src/generated/prisma';
import { z } from 'zod';

const prisma = new PrismaClient();

const joinEventSchema = z.object({
  userId: z.string().min(1),
});

interface RouteParams {
  params: { id: string };
}

// POST /api/events/[id]/attendees - Join event
export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id: eventId } = params;
    const body = await request.json();
    const { userId } = joinEventSchema.parse(body);

    // Check if event exists and is available for joining
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        _count: {
          select: { attendees: true },
        },
      },
    });

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    if (event.status !== 'UPCOMING') {
      return NextResponse.json(
        { error: 'Cannot join this event' },
        { status: 400 }
      );
    }

    if (event._count.attendees >= event.maxAttendees) {
      return NextResponse.json(
        { error: 'Event is fully booked' },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if user is already attending
    const existingAttendee = await prisma.eventAttendee.findUnique({
      where: {
        userId_eventId: {
          userId,
          eventId,
        },
      },
    });

    if (existingAttendee) {
      return NextResponse.json(
        { error: 'User is already attending this event' },
        { status: 409 }
      );
    }

    // Add user as attendee
    const attendee = await prisma.eventAttendee.create({
      data: {
        userId,
        eventId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
            games: true,
            platforms: true,
          },
        },
      },
    });

    // Create notification for event organizer/other attendees
    await prisma.notification.create({
      data: {
        userId: userId,
        type: 'EVENT',
        title: 'Event Joined!',
        message: `You successfully joined "${event.title}"`,
        actionUrl: `/events/${eventId}`,
      },
    });

    return NextResponse.json(attendee, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Error joining event:', error);
    return NextResponse.json(
      { error: 'Failed to join event' },
      { status: 500 }
    );
  }
}

// DELETE /api/events/[id]/attendees?userId=... - Leave event
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id: eventId } = params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    // Check if event exists
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // Check if user is attending
    const existingAttendee = await prisma.eventAttendee.findUnique({
      where: {
        userId_eventId: {
          userId,
          eventId,
        },
      },
    });

    if (!existingAttendee) {
      return NextResponse.json(
        { error: 'User is not attending this event' },
        { status: 404 }
      );
    }

    // Remove attendee
    await prisma.eventAttendee.delete({
      where: {
        userId_eventId: {
          userId,
          eventId,
        },
      },
    });

    return NextResponse.json({ message: 'Successfully left the event' });
  } catch (error) {
    console.error('Error leaving event:', error);
    return NextResponse.json(
      { error: 'Failed to leave event' },
      { status: 500 }
    );
  }
}
