import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { userId, status } = await req.json();

    // Terminal log
    console.log(`[PRESENCE] User ${userId} is now ${status} at ${new Date().toISOString()}`);

    await prisma.user.update({
      where: { id: userId },
      data: {
        status,
        lastActive: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[PRESENCE] Error updating status:', error);
    return NextResponse.json({ error: 'Failed to update presence' }, { status: 500 });
  }
}
