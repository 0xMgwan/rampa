import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { authenticatePartner } from '@/lib/middleware/auth';
import { checkRateLimit } from '@/lib/middleware/rate-limit';
import { prisma } from '@/lib/db';
import { RateService } from '@/lib/rates';
import { BlockchainService } from '@/lib/blockchain';
import { generateOrderNumber } from '@/lib/utils';
import { WebhookService } from '@/lib/webhooks';
import { logger } from '@/lib/logger';

const offrampSchema = z.object({
  partner_order_id: z.string().optional(),
  amount_usdt: z.number().positive().optional(),
  amount_usdc: z.number().positive().optional(),
  recipient_phone: z.string(),
  payment_method_id: z.string().optional(),
  network: z.enum(['BEP20', 'TRC20', 'BASE', 'POLYGON']).default('BEP20'),
  country_code: z.string().default('TZ'),
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
    const data = offrampSchema.parse(body);

    if (!data.amount_usdt && !data.amount_usdc) {
      return NextResponse.json(
        { success: false, error: 'Either amount_usdt or amount_usdc is required' },
        { status: 400 }
      );
    }

    const cryptoType = data.amount_usdt ? 'USDT' : 'USDC';
    const amountCrypto = data.amount_usdt || data.amount_usdc || 0;

    const country = await prisma.country.findUnique({
      where: { code: data.country_code },
      include: {
        paymentProviders: {
          where: { status: 'ACTIVE' },
        },
      },
    });

    if (!country) {
      return NextResponse.json(
        { success: false, error: 'Country not supported' },
        { status: 400 }
      );
    }

    const paymentProvider = data.payment_method_id
      ? country.paymentProviders.find(p => p.id === data.payment_method_id)
      : country.paymentProviders[0];

    if (!paymentProvider) {
      return NextResponse.json(
        { success: false, error: 'No payment provider available' },
        { status: 400 }
      );
    }

    const rates = await RateService.getRates(data.country_code);
    const exchangeRate = cryptoType === 'USDT' ? rates.usdtSellRate : rates.usdcSellRate;
    const amountFiat = Math.floor(amountCrypto * exchangeRate);

    const depositAddress = await BlockchainService.getWalletAddress(data.network as any);

    const orderNumber = generateOrderNumber();
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

    const order = await prisma.order.create({
      data: {
        orderNumber,
        partnerId: partner.id,
        partnerOrderId: data.partner_order_id,
        type: 'SELL',
        status: 'PENDING',
        amountCrypto,
        cryptoType,
        network: data.network,
        amountFiat,
        currencyCode: country.currencyCode,
        exchangeRate,
        depositAddress,
        userPhone: data.recipient_phone,
        countryId: country.id,
        paymentProviderId: paymentProvider.id,
        expiresAt,
      },
    });

    BlockchainService.monitorDeposit(
      data.network as any,
      depositAddress,
      cryptoType as any,
      amountCrypto,
      async (txHash: string, amount: number) => {
        logger.info(`Deposit detected for order ${orderNumber}: ${amount} ${cryptoType}`);
        
        await prisma.order.update({
          where: { id: order.id },
          data: {
            status: 'PROCESSING',
            txHash,
          },
        });

        await WebhookService.sendWebhook(order.id, 'ORDER_PROCESSING');

        const { PaymentService } = await import('@/lib/payments');
        const payoutResult = await PaymentService.sendPayout(
          paymentProvider.id,
          data.recipient_phone,
          amountFiat
        );

        if (payoutResult.success) {
          await prisma.order.update({
            where: { id: order.id },
            data: {
              status: 'COMPLETED',
              transactionId: payoutResult.transactionId,
              completedAt: new Date(),
            },
          });

          await WebhookService.sendWebhook(order.id, 'ORDER_COMPLETED');
        } else {
          await prisma.order.update({
            where: { id: order.id },
            data: {
              status: 'FAILED',
              errorMessage: payoutResult.error,
            },
          });

          await WebhookService.sendWebhook(order.id, 'ORDER_FAILED');
        }
      }
    );

    await WebhookService.sendWebhook(order.id, 'ORDER_CREATED');

    logger.info(`Offramp order created: ${orderNumber} for partner ${partner.name}`);

    return NextResponse.json({
      success: true,
      order: {
        snaville_order_id: order.id,
        order_number: order.orderNumber,
        partner_order_id: order.partnerOrderId,
        type: 'sell',
        status: order.status.toLowerCase(),
        deposit: {
          amount: order.amountCrypto,
          wallet: depositAddress,
          network: order.network,
        },
        payout: {
          phone: data.recipient_phone,
          provider: paymentProvider.providerName,
          amount_fiat: amountFiat,
          currency: country.currencyCode,
          rate: exchangeRate,
        },
        expires_at: order.expiresAt.toISOString(),
        created_at: order.createdAt.toISOString(),
      },
    });
  } catch (error: any) {
    logger.error('Create offramp order error:', error);
    
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
