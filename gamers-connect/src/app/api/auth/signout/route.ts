import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7)
      const jwtSecret = process.env.JWT_SECRET
      
      if (jwtSecret) {
        try {
          const decoded = jwt.verify(token, jwtSecret) as { userId: string }
          if (decoded.userId) {
            await prisma.user.update({
              where: { id: decoded.userId },
              data: { 
                status: 'OFFLINE',
                lastActive: new Date()
              },
            }).catch((err: unknown) => {
              console.log('Failed to update user status (not critical):', err)
            })
          }
        } catch (err: unknown) {
          console.log('Invalid token (not critical):', err)
        }
      }
    }
    
    // Always return success for signout
    return NextResponse.json({
      success: true,
      message: 'Signed out successfully'
    })

  } catch (error: unknown) {
    console.error('Signout error:', error)
    return NextResponse.json({
      success: true,
      message: 'Signed out successfully'
    })
  }
}
