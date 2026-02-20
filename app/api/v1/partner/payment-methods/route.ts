import { NextRequest, NextResponse } from 'next/server';
import { authenticatePartner } from '@/lib/middleware/auth';
import { checkRateLimit } from '@/lib/middleware/rate-limit';
import { prisma } from '@/lib/db';
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

    const country = await prisma.country.findUnique({
      where: { code: countryCode },
      include: {
        paymentProviders: {
          where: { status: 'ACTIVE' },
        },
      },
    });

    if (!country) {
      return NextResponse.json(
        { success: false, error: 'Country not found' },
        { status: 404 }
      );
    }

    const paymentMethods = country.paymentProviders.map((provider) => ({
      id: provider.id,
      provider: provider.providerName,
      type: provider.providerType.toLowerCase(),
      account_number: provider.accountNumber,
      account_name: provider.accountName,
      instructions: provider.instructions,
      limits: provider.limits,
    }));

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      country: {
        code: country.code,
        name: country.name,
        currency: country.currencyCode,
      },
      payment_methods: paymentMethods,
    });
  } catch (error: any) {
    logger.error('Get payment methods error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
