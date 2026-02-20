import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { sendCrypto } from '@/lib/blockchain/send';

export async function POST(request: NextRequest) {
  try {
    const apiKey = request.headers.get('x-api-key');
    
    if (!apiKey) {
      return NextResponse.json({ error: 'API key required' }, { status: 401 });
    }

    const partner = await prisma.partner.findFirst({
      where: { apiKeyHash: apiKey },
    });

    if (!partner || partner.status !== 'ACTIVE') {
      return NextResponse.json({ error: 'Invalid or inactive API key' }, { status: 401 });
    }

    const body = await request.json();
    const { order_number, transaction_id, customer_phone } = body;

    if (!order_number || !transaction_id) {
      return NextResponse.json(
        { error: 'order_number and transaction_id are required' },
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

    if (order.partnerId !== partner.id) {
      return NextResponse.json({ error: 'Order does not belong to this partner' }, { status: 403 });
    }

    if (order.status === 'COMPLETED') {
      return NextResponse.json({
        success: true,
        message: 'Order already completed',
        order_number: order.orderNumber,
        status: 'COMPLETED',
        tx_hash: order.txHash,
      });
    }

    if (order.status === 'PROCESSING') {
      return NextResponse.json({
        success: false,
        message: 'Order is already being processed',
        order_number: order.orderNumber,
        status: 'PROCESSING',
      });
    }

    if (order.status !== 'PENDING') {
      return NextResponse.json(
        { error: `Order status is ${order.status}, cannot verify` },
        { status: 400 }
      );
    }

    // Optional: Verify phone number matches
    if (customer_phone && order.userPhone) {
      const normalizedOrderPhone = order.userPhone.replace(/[\s\-+]/g, '').replace(/^0/, '255');
      const normalizedCustomerPhone = customer_phone.replace(/[\s\-+]/g, '').replace(/^0/, '255');
      
      if (normalizedOrderPhone !== normalizedCustomerPhone) {
        return NextResponse.json(
          { error: 'Phone number does not match order' },
          { status: 400 }
        );
      }
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
          verification_method: 'sms_transaction_id',
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
        message: 'Payment verified and crypto sent successfully',
        order_number: order.orderNumber,
        status: 'COMPLETED',
        tx_hash: txHash,
        amount_sent: order.amountCrypto,
        currency: order.cryptoType,
        network: order.network,
        destination_address: order.destinationAddress,
        explorer_url: getExplorerUrl(order.network, txHash),
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
          error: 'Failed to send crypto',
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
