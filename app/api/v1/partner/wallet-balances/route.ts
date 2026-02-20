import { NextRequest, NextResponse } from 'next/server';
import { BlockchainService } from '@/lib/blockchain';

export async function GET(request: NextRequest) {
  const apiKey = request.headers.get('X-API-Key');
  if (!apiKey) return NextResponse.json({ error: 'Missing API key' }, { status: 401 });

  const networks = ['BEP20', 'TRC20', 'BASE', 'POLYGON'] as const;

  const balances = await Promise.all(
    networks.map(async (network) => {
      try {
        const address = await BlockchainService.getWalletAddress(network);
        const balance = await BlockchainService.getBalance(network);
        const usdtBalance = typeof balance === 'object' && balance !== null && 'usdt' in balance
          ? String((balance as any).usdt)
          : String(balance);
        const usdcBalance = typeof balance === 'object' && balance !== null && 'usdc' in balance
          ? String((balance as any).usdc)
          : '0.00';
        const explorers: Record<string, string> = {
          BEP20: 'https://bscscan.com',
          TRC20: 'https://tronscan.org',
          BASE: 'https://basescan.org',
          POLYGON: 'https://polygonscan.com',
        };
        return {
          network,
          address,
          usdt: usdtBalance,
          usdc: usdcBalance,
          explorer: explorers[network],
        };
      } catch {
        return {
          network,
          address: null,
          usdt: '0.00',
          usdc: '0.00',
          explorer: '',
          error: 'Could not fetch balance',
        };
      }
    })
  );

  return NextResponse.json({ success: true, balances });
}
