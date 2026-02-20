import { NextRequest, NextResponse } from 'next/server';
import { authenticatePartner } from '@/lib/middleware/auth';
import { checkRateLimit } from '@/lib/middleware/rate-limit';
import { prisma } from '@/lib/db';
import { logger } from '@/lib/logger';

export async function GET(
  request: NextRequest,
  { params }: { params: { orderNumber: string } }
) {
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
    const order = await prisma.order.findUnique({
      where: { orderNumber: params.orderNumber },
      include: {
        paymentProvider: true,
        country: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    if (order.partnerId !== partner.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      order: {
        order_number: order.orderNumber,
        partner_order_id: order.partnerOrderId,
        type: order.type.toLowerCase(),
        status: order.status.toLowerCase(),
        amount_crypto: order.amountCrypto,
        crypto_type: order.cryptoType,
        network: order.network,
        amount_fiat: order.amountFiat,
        currency: order.currencyCode,
        exchange_rate: order.exchangeRate,
        destination_address: order.destinationAddress,
        deposit_address: order.depositAddress,
        payment_provider: order.paymentProvider?.providerName,
        transaction_id: order.transactionId,
        tx_hash: order.txHash,
        explorer_url: order.explorerUrl,
        error_message: order.errorMessage,
        created_at: order.createdAt.toISOString(),
        expires_at: order.expiresAt.toISOString(),
        completed_at: order.completedAt?.toISOString(),
      },
    });
  } catch (error: any) {
    logger.error('Get order error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
