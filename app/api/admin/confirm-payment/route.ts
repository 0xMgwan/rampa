import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { sendCrypto } from '@/lib/blockchain/send';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const adminSecret = process.env.ADMIN_SECRET;

    if (!authHeader || authHeader !== `Bearer ${adminSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { order_number, payment_reference, verified_amount } = body;

    if (!order_number) {
      return NextResponse.json({ error: 'order_number is required' }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { orderNumber: order_number },
      include: { partner: true },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (order.status !== 'PENDING') {
      return NextResponse.json(
        { error: `Order is already ${order.status}` },
        { status: 400 }
      );
    }

    if (verified_amount && Math.abs(verified_amount - order.amountFiat) > 100) {
      return NextResponse.json(
        {
          error: 'Amount mismatch',
          expected: order.amountFiat,
          received: verified_amount,
        },
        { status: 400 }
      );
    }

    await prisma.order.update({
      where: { id: order.id },
      data: {
        status: 'PROCESSING',
        metadata: {
          ...((order.metadata as any) || {}),
          payment_reference,
          verified_at: new Date().toISOString(),
          verified_amount,
        },
      },
    });

    console.log(`Sending ${order.amountCrypto} ${order.cryptoType} to ${order.destinationAddress} on ${order.network}`);

    const txHash = await sendCrypto({
      network: order.network,
      token: order.cryptoType,
      toAddress: order.destinationAddress!,
      amount: order.amountCrypto,
    });

    await prisma.order.update({
      where: { id: order.id },
      data: {
        status: 'COMPLETED',
        txHash,
        completedAt: new Date(),
      },
    });

    if (order.partner.webhookUrl) {
      try {
        await fetch(order.partner.webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'order.completed',
            order_number: order.orderNumber,
            status: 'COMPLETED',
            crypto_tx_hash: txHash,
            amount_crypto: order.amountCrypto,
            currency: order.cryptoType,
            network: order.network,
            timestamp: new Date().toISOString(),
          }),
        });
      } catch (webhookError) {
        console.error('Webhook notification failed:', webhookError);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Payment confirmed and crypto sent',
      order_number: order.orderNumber,
      tx_hash: txHash,
      amount_sent: order.amountCrypto,
      currency: order.cryptoType,
      destination: order.destinationAddress,
    });
  } catch (error: any) {
    console.error('Error confirming payment:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
