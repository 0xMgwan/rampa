import { NextRequest, NextResponse } from 'next/server';
import { authenticatePartner } from '@/lib/middleware/auth';
import { checkRateLimit } from '@/lib/middleware/rate-limit';
import { RateService } from '@/lib/rates';
import { logger } from '@/lib/logger';

export async function GET(request: NextRequest) {
  const authResult = await authenticatePartner(request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const { partner } = authResult;

  const rateLimitResult = await checkRateLimit(partner.id, partner.rateLimit);
  if (rateLimitResult) {
    return rateLimitResult;
  }

  try {
    const { searchParams } = new URL(request.url);
    const countryCode = searchParams.get('country') || 'TZ';

    const rates = await RateService.getRates(countryCode);

    return NextResponse.json({
      success: true,
      rates: {
        buy_rate_usdc: rates.usdcBuyRate,
        sell_rate_usdc: rates.usdcSellRate,
        buy_rate_usdt: rates.usdtBuyRate,
        sell_rate_usdt: rates.usdtSellRate,
      },
      limits: {
        min_usdc: 1,
        max_usdc: 10000,
        min_usdt: 1,
        max_usdt: 10000,
      },
      currency: rates.currencyCode,
      updated_at: rates.updatedAt.toISOString(),
    });
  } catch (error: any) {
    logger.error('Get rates error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
