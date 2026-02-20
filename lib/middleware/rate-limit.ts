import { RateLimiterRedis } from 'rate-limiter-flexible';
import { redis } from '../redis';
import { NextRequest, NextResponse } from 'next/server';

const rateLimiter = new RateLimiterRedis({
  storeClient: redis,
  keyPrefix: 'rate_limit',
  points: 100,
  duration: 60,
});

export async function checkRateLimit(partnerId: string, limit: number = 100) {
  try {
    await rateLimiter.consume(partnerId, 1);
    return null;
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Rate limit exceeded',
        retryAfter: Math.ceil((error as any).msBeforeNext / 1000)
      },
      { status: 429 }
    );
  }
}
