import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { selcomAPI } from '@/lib/payment-providers/selcom-api';
import { sendCrypto } from '@/lib/blockchain/send';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const adminSecret = process.env.ADMIN_SECRET;

    if (!authHeader || authHeader !== `Bearer ${adminSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const pendingOrders = await prisma.order.findMany({
      where: {
        status: 'PENDING',
        type: 'BUY',
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
        },
      },
      include: {
        partner: true,
      },
    });

    const results = {
      checked: 0,
      verified: 0,
      processed: 0,
      failed: 0,
      details: [] as any[],
    };

    for (const order of pendingOrders) {
      results.checked++;

      try {
        const verification = await selcomAPI.verifyPayment(
          order.orderNumber,
          order.amountFiat,
          order.userPhone || ''
        );

        if (verification.verified && verification.transaction) {
          results.verified++;

          await prisma.order.update({
            where: { id: order.id },
            data: {
              status: 'PROCESSING',
              transactionId: verification.transaction.transid,
              metadata: {
                ...((order.metadata as any) || {}),
                selcom_transaction: verification.transaction,
                auto_verified_at: new Date().toISOString(),
              },
            },
          });

          try {
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

            results.processed++;

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
                console.error('Webhook failed:', webhookError);
              }
            }

            results.details.push({
              order_number: order.orderNumber,
              status: 'processed',
              tx_hash: txHash,
              amount: order.amountCrypto,
            });
          } catch (cryptoError: any) {
            results.failed++;
            await prisma.order.update({
              where: { id: order.id },
              data: {
                status: 'FAILED',
                errorMessage: cryptoError.message,
              },
            });

            results.details.push({
              order_number: order.orderNumber,
              status: 'failed',
              error: cryptoError.message,
            });
          }
        } else {
          results.details.push({
            order_number: order.orderNumber,
            status: 'pending',
            message: verification.message,
          });
        }
      } catch (error: any) {
        results.failed++;
        results.details.push({
          order_number: order.orderNumber,
          status: 'error',
          error: error.message,
        });
      }
    }

    return NextResponse.json({
      success: true,
      summary: {
        total_checked: results.checked,
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
