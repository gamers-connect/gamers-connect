/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const updateEventSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  game: z.string().min(1).optional(),
  date: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }).optional(),
  time: z.string().min(1).optional(),
  location: z.string().min(1).optional(),
  type: z.enum(['TOURNAMENT', 'MEETUP', 'CONTEST', 'SCRIMMAGE']).optional(),
  maxAttendees: z.number().min(1).max(1000).optional(),
  status: z.enum(['UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED']).optional(),
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/events/[id] - Get specific event
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;

    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        attendees: {
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
              },
            },
          },
          orderBy: { joinedAt: 'asc' },
        },
        _count: {
          select: {
            attendees: true,
          },
        },
      },
    });

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    const formattedEvent = {
      ...event,
      attendeeCount: event._count.attendees,
      isFullyBooked: event._count.attendees >= event.maxAttendees,
    };

    return NextResponse.json(formattedEvent);
  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json(
      { error: 'Failed to fetch event' },
      { status: 500 }
    );
  }
}

// PUT /api/events/[id] - Update event
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validatedData = updateEventSchema.parse(body);

    // Check if event exists
    const existingEvent = await prisma.event.findUnique({
      where: { id },
    });

    if (!existingEvent) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // Convert date string to Date object if provided
    const updateData: any = { ...validatedData };
    if (validatedData.date) {
      const eventDate = new Date(validatedData.date);
      if (eventDate < new Date() && validatedData.status !== 'COMPLETED' && validatedData.status !== 'CANCELLED') {
        return NextResponse.json(
          { error: 'Event date cannot be in the past' },
          { status: 400 }
        );
      }
      updateData.date = eventDate;
    }

    const updatedEvent = await prisma.event.update({
      where: { id },
      data: updateData,
      include: {
        attendees: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
        _count: {
          select: {
            attendees: true,
          },
        },
      },
    });

    const formattedEvent = {
      ...updatedEvent,
      attendeeCount: updatedEvent._count.attendees,
      isFullyBooked: updatedEvent._count.attendees >= updatedEvent.maxAttendees,
    };

    return NextResponse.json(formattedEvent);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Error updating event:', error);
    return NextResponse.json(
      { error: 'Failed to update event' },
      { status: 500 }
    );
  }
}

// DELETE /api/events/[id] - Delete event
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;

    // Check if event exists
    const existingEvent = await prisma.event.findUnique({
      where: { id },
      include: { attendees: true },
    });

    if (!existingEvent) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // Check if event has already started or completed
    if (existingEvent.status === 'ONGOING' || existingEvent.status === 'COMPLETED') {
      return NextResponse.json(
        { error: 'Cannot delete ongoing or completed events' },
        { status: 400 }
      );
    }

    // Delete all attendees first, then the event
    await prisma.$transaction([
      prisma.eventAttendee.deleteMany({
        where: { eventId: id },
      }),
      prisma.event.delete({
        where: { id },
      }),
    ]);

    return NextResponse.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json(
      { error: 'Failed to delete event' },
      { status: 500 }
    );
  }
}
