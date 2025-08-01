/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { PrismaClient } from '../../../../generated/prisma';
import { withAuth, AuthRequest } from '../../../../lib/auth';

const prisma = new PrismaClient();

// GET /api/auth/profile - Get current user profile
export const GET = withAuth(async (request: AuthRequest) => {
  try {
    const userId = request.user!.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
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
        // Include relationship counts
        _count: {
          select: {
            hostedSessions: true,
            sessionMembers: true,
            eventAttendees: true,
            sentConnections: {
              where: { status: 'ACCEPTED' }
            },
            receivedConnections: {
              where: { status: 'ACCEPTED' }
            },
          },
        },
        // Include active sessions
        hostedSessions: {
          where: { status: 'ACTIVE' },
          select: {
            id: true,
            title: true,
            game: true,
            date: true,
            time: true,
            maxPlayers: true,
            _count: { select: { members: true } },
          },
          take: 5,
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
          take: 5,
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
          take: 5,
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Calculate total connections
    const totalConnections = user._count.sentConnections + user._count.receivedConnections;

    const profile = {
      ...user,
      stats: {
        hostedSessions: user._count.hostedSessions,
        joinedSessions: user._count.sessionMembers,
        eventsAttended: user._count.eventAttendees,
        connections: totalConnections,
      },
      activeSessions: [
        ...user.hostedSessions.map(session => ({
          ...session,
          role: 'host' as const,
          memberCount: session._count.members + 1,
        })),
        ...user.sessionMembers.map(member => ({
          ...member.session,
          role: 'member' as const,
        })),
      ],
      upcomingEvents: user.eventAttendees.map(attendee => attendee.event),
    };

    delete (profile as any)._count;
    delete (profile as any).hostedSessions;
    delete (profile as any).sessionMembers;
    delete (profile as any).eventAttendees;

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
});
