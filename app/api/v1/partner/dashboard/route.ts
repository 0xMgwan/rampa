import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  const apiKey = request.headers.get('X-API-Key');
  if (!apiKey) return NextResponse.json({ error: 'Missing API key' }, { status: 401 });

  const partner = await prisma.partner.findFirst({ where: { status: 'ACTIVE' } });
  if (!partner) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - 7);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

  const [
    allOrders,
    thisMonthOrders,
    lastMonthOrders,
    thisWeekOrders,
    recentOrders,
    rates,
    providers,
  ] = await Promise.all([
    prisma.order.findMany({
      where: { partnerId: partner.id, status: 'COMPLETED' },
      select: { amountCrypto: true, amountFiat: true, currencyCode: true },
    }),
    prisma.order.findMany({
      where: { partnerId: partner.id, status: 'COMPLETED', createdAt: { gte: startOfMonth } },
      select: { amountCrypto: true },
    }),
    prisma.order.findMany({
      where: { partnerId: partner.id, status: 'COMPLETED', createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } },
      select: { amountCrypto: true },
    }),
    prisma.order.count({
      where: { partnerId: partner.id, createdAt: { gte: startOfWeek } },
    }),
    prisma.order.findMany({
      where: { partnerId: partner.id },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        orderNumber: true,
        amountCrypto: true,
        cryptoType: true,
        amountFiat: true,
        currencyCode: true,
        status: true,
        network: true,
        createdAt: true,
        txHash: true,
      },
    }),
    prisma.exchangeRate.findMany({
      include: { country: { select: { code: true, currencyCode: true } } },
    }),
    prisma.paymentProvider.findMany({
      where: { status: 'ACTIVE' },
      include: { country: { select: { code: true, name: true } } },
    }),
  ]);

  const totalVolume = allOrders.reduce((s, o) => s + o.amountCrypto, 0);
  const totalTransactions = allOrders.length;
  const thisMonthVolume = thisMonthOrders.reduce((s, o) => s + o.amountCrypto, 0);
  const lastMonthVolume = lastMonthOrders.reduce((s, o) => s + o.amountCrypto, 0);
  const monthGrowth = lastMonthVolume > 0
    ? Math.round(((thisMonthVolume - lastMonthVolume) / lastMonthVolume) * 100)
    : 0;
  const commission = totalVolume * 0.03;

  const allOrdersForRate = await prisma.order.count({ where: { partnerId: partner.id } });
  const completedCount = allOrders.length;
  const successRate = allOrdersForRate > 0
    ? ((completedCount / allOrdersForRate) * 100).toFixed(1)
    : '0.0';

  return NextResponse.json({
    success: true,
    partner: { name: partner.name, email: partner.email, apiKey: partner.apiKeyHash.slice(0, 20) + '...', webhookUrl: partner.webhookUrl },
    stats: {
      totalVolume: totalVolume.toFixed(2),
      totalTransactions,
      thisWeekTransactions: thisWeekOrders,
      commission: commission.toFixed(2),
      successRate,
      monthGrowth,
    },
    recentOrders: recentOrders.map(o => ({
      orderNumber: o.orderNumber,
      amount: `${o.amountCrypto} ${o.cryptoType}`,
      fiat: `${o.amountFiat.toLocaleString()} ${o.currencyCode}`,
      status: o.status,
      network: o.network,
      txHash: o.txHash,
      createdAt: o.createdAt,
    })),
    rates: rates.map(r => ({
      country: r.country.code,
      currency: r.country.currencyCode,
      usdtBuy: r.usdtBuyRate,
      usdcBuy: r.usdcBuyRate,
      updatedAt: r.updatedAt,
    })),
    providers: providers.map(p => ({
      id: p.id,
      name: p.providerName,
      account: p.accountNumber,
      country: p.country.name,
      status: p.status,
    })),
  });
}
