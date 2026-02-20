import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { emailChecker } from '@/lib/payment-providers/email-checker';
import { sendCrypto } from '@/lib/blockchain/send';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const adminSecret = process.env.ADMIN_SECRET;

    if (!authHeader || authHeader !== `Bearer ${adminSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get pending orders from last 24 hours
    const pendingOrders = await prisma.order.findMany({
      where: {
        status: 'PENDING',
        type: 'BUY',
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
      },
      include: {
        partner: true,
      },
    });

    // Check email for payment notifications
    const paymentNotifications = await emailChecker.checkForPaymentNotifications();

    const results = {
      checked: pendingOrders.length,
      notifications_found: paymentNotifications.length,
      verified: 0,
      processed: 0,
      failed: 0,
      details: [] as any[],
    };

    // Match notifications to orders
    for (const order of pendingOrders) {
      const matchingPayment = paymentNotifications.find(payment => {
        const amountMatch = Math.abs(payment.amount - order.amountFiat) <= 100;
        const phoneMatch = payment.phone === order.userPhone?.replace(/[\s\-+]/g, '').replace(/^0/, '255');
        const referenceMatch = !payment.reference || payment.reference.includes(order.orderNumber);
        
        return amountMatch && phoneMatch && referenceMatch;
      });

      if (matchingPayment) {
        results.verified++;

        try {
          // Update order to PROCESSING
          await prisma.order.update({
            where: { id: order.id },
            data: {
              status: 'PROCESSING',
              transactionId: matchingPayment.transactionId,
              metadata: {
                ...((order.metadata as any) || {}),
                payment_notification: matchingPayment,
                auto_verified_at: new Date().toISOString(),
                provider: matchingPayment.provider,
              },
            },
          });

          // Send crypto
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

          results.processed++;

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
                  payment_provider: matchingPayment.provider,
                  timestamp: new Date().toISOString(),
                }),
              });
            } catch (webhookError) {
              console.error('Webhook failed:', webhookError);
            }
          }

          results.details.push({
            order_number: order.orderNumber,
            status: 'processed',
            tx_hash: txHash,
            amount: order.amountCrypto,
            provider: matchingPayment.provider,
            transaction_id: matchingPayment.transactionId,
          });
        } catch (error: any) {
          results.failed++;
          
          await prisma.order.update({
            where: { id: order.id },
            data: {
              status: 'FAILED',
              errorMessage: error.message,
            },
          });

          results.details.push({
            order_number: order.orderNumber,
            status: 'failed',
            error: error.message,
          });
        }
      } else {
        results.details.push({
          order_number: order.orderNumber,
          status: 'pending',
          message: 'No matching payment notification found',
          expected_amount: order.amountFiat,
          expected_phone: order.userPhone,
        });
      }
    }

    return NextResponse.json({
      success: true,
      summary: {
        total_checked: results.checked,
        notifications_found: results.notifications_found,
        payments_verified: results.verified,
        orders_processed: results.processed,
        failures: results.failed,
      },
      details: results.details,
    });
  } catch (error: any) {
    console.error('Auto-verify error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
