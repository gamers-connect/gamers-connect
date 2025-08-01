/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '../../../generated/prisma';
import { withAuth, AuthRequest } from '../../../lib/auth';
import { z } from 'zod';

const prisma5 = new PrismaClient();

const markAsReadSchema = z.object({
  notificationIds: z.array(z.string()).optional(),
  markAll: z.boolean().optional(),
});

// GET /api/notifications
export const GET = withAuth(async (request: AuthRequest) => {
  try {
    const userId = request.user!.id;
    const { searchParams } = new URL(request.url);
    const unreadOnly = searchParams.get('unreadOnly') === 'true';
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const where: any = { userId };
    if (unreadOnly) {
      where.isRead = false;
    }

    const notifications = await prisma5.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });

    const total = await prisma5.notification.count({ where });
    const unreadCount = await prisma5.notification.count({
      where: { userId, isRead: false },
    });

    return NextResponse.json({
      notifications,
      unreadCount,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
});

// PUT /api/notifications
export const PUT = withAuth(async (request: AuthRequest) => {
  try {
    const userId = request.user!.id;
    const body = await request.json();
    const { notificationIds, markAll } = markAsReadSchema.parse(body);

    if (markAll) {
      await prisma5.notification.updateMany({
        where: {
          userId,
          isRead: false,
        },
        data: { isRead: true },
      });

      return NextResponse.json({ message: 'All notifications marked as read' });
    } else if (notificationIds && notificationIds.length > 0) {
      await prisma5.notification.updateMany({
        where: {
          id: { in: notificationIds },
          userId,
        },
        data: { isRead: true },
      });

      return NextResponse.json({
        message: `${notificationIds.length} notifications marked as read`,
      });
    } else {
      return NextResponse.json({ error: 'Must specify notificationIds or markAll' }, { status: 400 });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.issues }, { status: 400 });
    }
    console.error('Error marking notifications as read:', error);
    return NextResponse.json({ error: 'Failed to mark notifications as read' }, { status: 500 });
  }
});

// DELETE /api/notifications
export const DELETE = withAuth(async (request: AuthRequest) => {
  try {
    const userId = request.user!.id;
    const { searchParams } = new URL(request.url);
    const notificationId = searchParams.get('id');
    const deleteAll = searchParams.get('deleteAll') === 'true';

    if (deleteAll) {
      const deleted = await prisma5.notification.deleteMany({
        where: { userId },
      });

      return NextResponse.json({
        message: `Deleted ${deleted.count} notifications`,
      });
    } else if (notificationId) {
      const notification = await prisma5.notification.findUnique({
        where: { id: notificationId },
      });

      if (!notification) {
        return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
      }

      if (notification.userId !== userId) {
        return NextResponse.json({ error: 'You can only delete your own notifications' }, { status: 403 });
      }

      await prisma5.notification.delete({
        where: { id: notificationId },
      });

      return NextResponse.json({ message: 'Notification deleted' });
    } else {
      return NextResponse.json({ error: 'Must specify notification ID or deleteAll=true' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error deleting notifications:', error);
    return NextResponse.json({ error: 'Failed to delete notifications' }, { status: 500 });
  }
});
