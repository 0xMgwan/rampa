import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
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
      },
      include: {
        partner: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const formatted = pendingOrders.map((order) => ({
      order_number: order.orderNumber,
      customer_name: order.userFullName,
      customer_phone: order.userPhone,
      amount_fiat: order.amountFiat,
      currency: order.currencyCode,
      amount_crypto: order.amountCrypto,
      crypto_currency: order.cryptoType,
      destination_address: order.destinationAddress,
      network: order.network,
      payment_provider_id: order.paymentProviderId,
      created_at: order.createdAt,
      partner: order.partner.name,
    }));

    return NextResponse.json({
      success: true,
      count: formatted.length,
      pending_payments: formatted,
    });
  } catch (error: any) {
    console.error('Error fetching pending payments:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
