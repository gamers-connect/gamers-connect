/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface AuthRequest extends NextRequest {
  user?: AuthUser;
}

export class AuthError extends Error {
  constructor(message: string, public statusCode: number = 401) {
    super(message);
    this.name = 'AuthError';
  }
}

export async function verifyToken(token: string): Promise<AuthUser> {
  if (!process.env.JWT_SECRET) {
    throw new AuthError('JWT_SECRET not configured', 500);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as any;
    
    // Fetch fresh user data
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        isActive: true,
        isBanned: true,
        isSuspended: true,
      },
    });

    if (!user) {
      throw new AuthError('User not found');
    }

    if (!user.isActive || user.isBanned) {
      throw new AuthError('Account is inactive or banned');
    }

    if (user.isSuspended) {
      throw new AuthError('Account is suspended');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar || undefined,
    };
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new AuthError('Invalid token');
    }
    if (error instanceof AuthError) {
      throw error;
    }
    throw new AuthError('Token verification failed');
  }
}

export function generateToken(userId: string): string {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET not configured');
  }

  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: '7d' } // Token expires in 7 days
  );
}

export function extractTokenFromHeader(authorization?: string): string | null {
  if (!authorization) return null;
  
  const parts = authorization.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }
  
  return parts[1];
}

export async function authenticate(request: NextRequest): Promise<AuthUser> {
  const authorization = request.headers.get('authorization');
  const token = extractTokenFromHeader(authorization ?? undefined);
  
  if (!token) {
    throw new AuthError('No token provided');
  }

  return await verifyToken(token);
}

// Middleware wrapper for API routes
export function withAuth(handler: (request: AuthRequest, ...args: any[]) => Promise<Response>) {
  return async (request: NextRequest, ...args: any[]): Promise<Response> => {
    try {
      const user = await authenticate(request);
      (request as AuthRequest).user = user;
      
      // Update last active timestamp
      await prisma.user.update({
        where: { id: user.id },
        data: { lastActive: new Date() },
      });

      return await handler(request as AuthRequest, ...args);
    } catch (error) {
      if (error instanceof AuthError) {
        return new Response(
          JSON.stringify({ error: error.message }),
          { 
            status: error.statusCode,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }
      
      console.error('Authentication error:', error);
      return new Response(
        JSON.stringify({ error: 'Authentication failed' }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  };
}

// Optional auth wrapper (doesn't fail if no token)
export function withOptionalAuth(handler: (request: AuthRequest, ...args: any[]) => Promise<Response>) {
  return async (request: NextRequest, ...args: any[]): Promise<Response> => {
    try {
      const authorization = request.headers.get('authorization');
      const token = extractTokenFromHeader(authorization ?? undefined);
      
      if (token) {
        const user = await verifyToken(token);
        (request as AuthRequest).user = user;
        
        // Update last active timestamp
        await prisma.user.update({
          where: { id: user.id },
          data: { lastActive: new Date() },
        });
      }
    } catch (error) {
      // Ignore auth errors for optional auth
      console.warn('Optional auth failed:', error);
    }

    return await handler(request as AuthRequest, ...args);
  };
}
