import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { authenticatePartner } from '@/lib/middleware/auth';
import { checkRateLimit } from '@/lib/middleware/rate-limit';
import { prisma } from '@/lib/db';
import { PaymentService } from '@/lib/payments';
import { BlockchainService } from '@/lib/blockchain';
import { WebhookService } from '@/lib/webhooks';
import { logger } from '@/lib/logger';

const verifySchema = z.object({
  order_number: z.string(),
  transaction_id: z.string(),
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
    const data = verifySchema.parse(body);

    const order = await prisma.order.findUnique({
      where: { orderNumber: data.order_number },
      include: {
        paymentProvider: true,
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

    if (order.status !== 'PENDING') {
      return NextResponse.json(
        { success: false, error: `Order is already ${order.status.toLowerCase()}` },
        { status: 400 }
      );
    }

    if (new Date() > order.expiresAt) {
      await prisma.order.update({
        where: { id: order.id },
        data: { status: 'EXPIRED' },
      });

      await WebhookService.sendWebhook(order.id, 'ORDER_EXPIRED');

      return NextResponse.json(
        { success: false, error: 'Order has expired' },
        { status: 400 }
      );
    }

    await prisma.order.update({
      where: { id: order.id },
      data: { 
        status: 'VERIFYING',
        transactionId: data.transaction_id,
      },
    });

    await WebhookService.sendWebhook(order.id, 'ORDER_VERIFYING');

    if (!order.paymentProvider) {
      throw new Error('Payment provider not found');
    }

    const verification = await PaymentService.verifyPayment(
      order.paymentProvider.id,
      data.transaction_id,
      order.amountFiat
    );

    if (!verification.verified) {
      await prisma.order.update({
        where: { id: order.id },
        data: { 
          status: 'FAILED',
          errorMessage: verification.error || 'Payment verification failed',
        },
      });

      await WebhookService.sendWebhook(order.id, 'ORDER_FAILED');

      return NextResponse.json(
        { success: false, error: verification.error || 'Payment verification failed' },
        { status: 400 }
      );
    }

    await prisma.order.update({
      where: { id: order.id },
      data: { status: 'PROCESSING' },
    });

    await WebhookService.sendWebhook(order.id, 'ORDER_PROCESSING');

    const transferResult = await BlockchainService.sendCrypto(
      order.network as any,
      order.cryptoType as any,
      order.destinationAddress!,
      order.amountCrypto
    );

    if (!transferResult.success) {
      await prisma.order.update({
        where: { id: order.id },
        data: { 
          status: 'FAILED',
          errorMessage: transferResult.error || 'Blockchain transfer failed',
        },
      });

      await WebhookService.sendWebhook(order.id, 'ORDER_FAILED');

      return NextResponse.json(
        { success: false, error: transferResult.error || 'Blockchain transfer failed' },
        { status: 500 }
      );
    }

    await prisma.order.update({
      where: { id: order.id },
      data: { 
        status: 'COMPLETED',
        txHash: transferResult.txHash,
        explorerUrl: transferResult.explorerUrl,
        completedAt: new Date(),
      },
    });

    await WebhookService.sendWebhook(order.id, 'ORDER_COMPLETED');

    logger.info(`Order completed: ${order.orderNumber}`);

    return NextResponse.json({
      success: true,
      order: {
        order_number: order.orderNumber,
        status: 'completed',
        tx_hash: transferResult.txHash,
        explorer_url: transferResult.explorerUrl,
      },
    });
  } catch (error: any) {
    logger.error('Verify payment error:', error);
    
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
