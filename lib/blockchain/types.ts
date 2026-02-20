export type Network = 'BEP20' | 'TRC20' | 'BASE' | 'POLYGON';
export type CryptoType = 'USDC' | 'USDT';

export interface BlockchainConfig {
  rpcUrl: string;
  chainId: number;
  name: string;
  explorer: string;
  tokens: {
    USDC?: string;
    USDT?: string;
  };
}

export interface TransferResult {
  txHash: string;
  explorerUrl: string;
  success: boolean;
  error?: string;
}

export interface WalletBalance {
  native: string;
  usdc?: string;
  usdt?: string;
}
