import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { authenticatePartner } from '@/lib/middleware/auth';
import { checkRateLimit } from '@/lib/middleware/rate-limit';
import { prisma } from '@/lib/db';
import { RateService } from '@/lib/rates';
import { generateOrderNumber, isValidAddress } from '@/lib/utils';
import { WebhookService } from '@/lib/webhooks';
import { logger } from '@/lib/logger';

const onrampSchema = z.object({
  partner_order_id: z.string().optional(),
  amount_usdt: z.number().positive().optional(),
  amount_usdc: z.number().positive().optional(),
  destination_address: z.string(),
  payment_method_id: z.string(),
  user_full_name: z.string(),
  user_phone: z.string(),
  network: z.enum(['BEP20', 'TRC20', 'BASE', 'POLYGON']),
  country_code: z.string().default('TZ'),
  auto_process: z.boolean().default(false),
  require_exact: z.boolean().default(false),
});

export async function POST(request: NextRequest) {
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
    const body = await request.json();
    const data = onrampSchema.parse(body);

    if (!data.amount_usdt && !data.amount_usdc) {
      return NextResponse.json(
        { success: false, error: 'Either amount_usdt or amount_usdc is required' },
        { status: 400 }
      );
    }

    const cryptoType = data.amount_usdt ? 'USDT' : 'USDC';
    const amountCrypto = data.amount_usdt || data.amount_usdc || 0;

    if (!isValidAddress(data.destination_address, data.network)) {
      return NextResponse.json(
        { success: false, error: 'Invalid destination address' },
        { status: 400 }
      );
    }

    const country = await prisma.country.findUnique({
      where: { code: data.country_code },
    });

    if (!country) {
      return NextResponse.json(
        { success: false, error: 'Country not supported' },
        { status: 400 }
      );
    }

    const paymentProvider = await prisma.paymentProvider.findUnique({
      where: { id: data.payment_method_id },
    });

    if (!paymentProvider || paymentProvider.countryId !== country.id) {
      return NextResponse.json(
        { success: false, error: 'Invalid payment method' },
        { status: 400 }
      );
    }

    const rates = await RateService.getRates(data.country_code);
    const exchangeRate = cryptoType === 'USDT' ? rates.usdtBuyRate : rates.usdcBuyRate;
    const amountFiat = Math.ceil(amountCrypto * exchangeRate);

    const orderNumber = generateOrderNumber();
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

    const order = await prisma.order.create({
      data: {
        orderNumber,
        partnerId: partner.id,
        partnerOrderId: data.partner_order_id,
        type: 'BUY',
        status: 'PENDING',
        amountCrypto,
        cryptoType,
        network: data.network,
        amountFiat,
        currencyCode: country.currencyCode,
        exchangeRate,
        destinationAddress: data.destination_address,
        userFullName: data.user_full_name,
        userPhone: data.user_phone,
        countryId: country.id,
        paymentProviderId: paymentProvider.id,
        autoProcess: data.auto_process,
        requireExact: data.require_exact,
        expiresAt,
      },
    });

    await WebhookService.sendWebhook(order.id, 'ORDER_CREATED');

    logger.info(`Order created: ${orderNumber} for partner ${partner.name}`);

    return NextResponse.json({
      success: true,
      order: {
        order_number: order.orderNumber,
        status: order.status.toLowerCase(),
        amount_crypto: order.amountCrypto,
        crypto_type: order.cryptoType,
        network: order.network,
        amount_fiat: order.amountFiat,
        currency: order.currencyCode,
        payment_instructions: {
          provider: paymentProvider.providerName,
          account_number: paymentProvider.accountNumber,
          account_name: paymentProvider.accountName,
          amount_to_send: order.amountFiat,
          instructions: paymentProvider.instructions,
        },
        expires_at: order.expiresAt.toISOString(),
      },
    });
  } catch (error: any) {
    logger.error('Create onramp order error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
