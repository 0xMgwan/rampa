import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { sendCrypto } from '@/lib/blockchain/send';

// Public endpoint for customers to verify their payment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { order_number, transaction_id, phone_number } = body;

    if (!order_number || !transaction_id || !phone_number) {
      return NextResponse.json(
        { error: 'order_number, transaction_id, and phone_number are required' },
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { orderNumber: order_number },
      include: { partner: true },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (order.status === 'COMPLETED') {
      return NextResponse.json({
        success: true,
        message: 'Your payment has already been processed',
        order_number: order.orderNumber,
        status: 'COMPLETED',
        tx_hash: order.txHash,
        explorer_url: getExplorerUrl(order.network, order.txHash!),
      });
    }

    if (order.status === 'PROCESSING') {
      return NextResponse.json({
        success: false,
        message: 'Your payment is being processed. Please wait a few moments.',
        order_number: order.orderNumber,
        status: 'PROCESSING',
      });
    }

    if (order.status !== 'PENDING') {
      return NextResponse.json(
        { error: `Order cannot be verified (status: ${order.status})` },
        { status: 400 }
      );
    }

    // Verify phone number matches
    const normalizedOrderPhone = order.userPhone?.replace(/[\s\-+]/g, '').replace(/^0/, '255') || '';
    const normalizedCustomerPhone = phone_number.replace(/[\s\-+]/g, '').replace(/^0/, '255');
    
    if (normalizedOrderPhone !== normalizedCustomerPhone) {
      return NextResponse.json(
        { error: 'Phone number does not match the order' },
        { status: 400 }
      );
    }

    // Update order to PROCESSING
    await prisma.order.update({
      where: { id: order.id },
      data: {
        status: 'PROCESSING',
        transactionId: transaction_id,
        metadata: {
          ...((order.metadata as any) || {}),
          verified_at: new Date().toISOString(),
          verification_method: 'customer_sms',
        },
      },
    });

    // Send crypto
    try {
      const txHash = await sendCrypto({
        network: order.network,
        token: order.cryptoType,
        toAddress: order.destinationAddress!,
        amount: order.amountCrypto,
      });

      // Update to COMPLETED
      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: 'COMPLETED',
          txHash,
          completedAt: new Date(),
        },
      });

      // Send webhook notification
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
              transaction_id,
              timestamp: new Date().toISOString(),
            }),
          });
        } catch (webhookError) {
          console.error('Webhook notification failed:', webhookError);
        }
      }

      return NextResponse.json({
        success: true,
        message: 'Payment verified! Your crypto has been sent.',
        order_number: order.orderNumber,
        status: 'COMPLETED',
        amount_sent: `${order.amountCrypto} ${order.cryptoType}`,
        network: order.network,
        tx_hash: txHash,
        explorer_url: getExplorerUrl(order.network, txHash),
        estimated_arrival: '5-10 minutes',
      });
    } catch (error: any) {
      // Mark as FAILED
      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: 'FAILED',
          errorMessage: error.message,
        },
      });

      return NextResponse.json(
        {
          success: false,
          error: 'Failed to send crypto. Please contact support.',
          message: error.message,
          order_number: order.orderNumber,
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Payment verification error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function getExplorerUrl(network: string, txHash: string): string {
  const explorers: Record<string, string> = {
    BEP20: `https://bscscan.com/tx/${txHash}`,
    TRC20: `https://tronscan.org/#/transaction/${txHash}`,
    BASE: `https://basescan.org/tx/${txHash}`,
    POLYGON: `https://polygonscan.com/tx/${txHash}`,
  };
  return explorers[network] || '';
}
