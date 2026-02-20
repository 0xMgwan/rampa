import { NextRequest, NextResponse } from 'next/server';
import * as bcrypt from 'bcryptjs';
import { prisma } from '../db';
import { logger } from '../logger';

export async function authenticatePartner(request: NextRequest) {
  const apiKey = request.headers.get('X-API-Key');

  if (!apiKey) {
    return NextResponse.json(
      { success: false, error: 'API key required' },
      { status: 401 }
    );
  }

  try {
    const partners = await prisma.partner.findMany({
      where: { status: 'ACTIVE' },
    });

    let partner = null;
    for (const p of partners) {
      const isValid = await bcrypt.compare(apiKey, p.apiKeyHash);
      if (isValid) {
        partner = p;
        break;
      }
    }

    if (!partner) {
      logger.warn(`Invalid API key attempt: ${apiKey.substring(0, 10)}...`);
      return NextResponse.json(
        { success: false, error: 'Invalid API key' },
        { status: 401 }
      );
    }

    const clientIp = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';

    if (partner.ipWhitelist.length > 0 && !partner.ipWhitelist.includes(clientIp)) {
      logger.warn(`IP not whitelisted: ${clientIp} for partner ${partner.id}`);
      return NextResponse.json(
        { success: false, error: 'IP_NOT_ALLOWED' },
        { status: 403 }
      );
    }

    return { partner, clientIp };
  } catch (error) {
    logger.error('Authentication error:', error);
    return NextResponse.json(
      { success: false, error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
