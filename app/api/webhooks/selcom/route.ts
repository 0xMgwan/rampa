import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { selcomProvider } from '@/lib/payment-providers/selcom';
import { sendCrypto } from '@/lib/blockchain/send';

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get('digest') || '';
    const payload = await request.json();

    const verification = await selcomProvider.processWebhook(payload, signature);

    if (!verification.verified) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const { orderId, transactionId, status, amount } = verification.data!;

    const order = await prisma.order.findUnique({
      where: { orderNumber: orderId },
      include: { partner: true },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (status === 'COMPLETED' || status === 'PAID') {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: 'PROCESSING',
          paymentTransactionId: transactionId,
        },
      });

      if (order.type === 'BUY') {
        const txHash = await sendCrypto({
          network: order.network,
          token: order.cryptoCurrency,
          toAddress: order.destinationAddress!,
          amount: order.cryptoAmount,
        });

        await prisma.order.update({
          where: { id: order.id },
          data: {
            status: 'COMPLETED',
            cryptoTransactionHash: txHash,
          },
        });

        if (order.partner.webhookUrl) {
          await fetch(order.partner.webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              event: 'order.completed',
              order_number: order.orderNumber,
              status: 'COMPLETED',
              crypto_tx_hash: txHash,
              timestamp: new Date().toISOString(),
            }),
          });
        }
      }

      return NextResponse.json({ success: true, message: 'Payment processed' });
    }

    return NextResponse.json({ success: true, message: 'Webhook received' });
  } catch (error: any) {
    console.error('Selcom webhook error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
