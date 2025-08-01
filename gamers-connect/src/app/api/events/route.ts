/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const createEventSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  game: z.string().min(1),
  date: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
  time: z.string().min(1),
  location: z.string().min(1),
  type: z.enum(['TOURNAMENT', 'MEETUP', 'CONTEST', 'SCRIMMAGE']),
  maxAttendees: z.number().min(1).max(1000),
});

// GET /api/events - Get all events with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const game = searchParams.get('game');
    const type = searchParams.get('type');
    const status = searchParams.get('status') || 'UPCOMING';
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    const upcoming = searchParams.get('upcoming') === 'true';

    const where: any = {};

    if (game) {
      where.game = { contains: game, mode: 'insensitive' };
    }
    if (type) {
      where.type = type;
    }
    if (status) {
      where.status = status;
    }
    if (upcoming) {
      where.date = { gte: new Date() };
      where.status = 'UPCOMING';
    }

    const events = await prisma.event.findMany({
      where,
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
      take: limit,
      skip: offset,
      orderBy: { date: 'asc' },
    });

    const total = await prisma.event.count({ where });

    const formattedEvents = events.map((event: any) => ({
      ...event,
      attendeeCount: event._count.attendees,
      isFullyBooked: event._count.attendees >= event.maxAttendees,
    }));

    return NextResponse.json({
      events: formattedEvents,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

// POST /api/events - Create new event
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createEventSchema.parse(body);

    // Convert date string to Date object
    const eventDate = new Date(validatedData.date);
    if (eventDate < new Date()) {
      return NextResponse.json(
        { error: 'Event date cannot be in the past' },
        { status: 400 }
      );
    }

    const event = await prisma.event.create({
      data: {
        ...validatedData,
        date: eventDate,
      },
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
      ...event,
      attendeeCount: event._count.attendees,
      isFullyBooked: event._count.attendees >= event.maxAttendees,
    };

    return NextResponse.json(formattedEvent, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Error creating event:', error);
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    );
  }
}
