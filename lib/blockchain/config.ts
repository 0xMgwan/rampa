import { BlockchainConfig, Network } from './types';

export const BLOCKCHAIN_CONFIGS: Record<Network, BlockchainConfig> = {
  BEP20: {
    rpcUrl: process.env.RPC_URL_BSC || 'https://bsc-dataseed1.binance.org',
    chainId: 56,
    name: 'BNB Smart Chain',
    explorer: 'https://bscscan.com',
    tokens: {
      USDT: '0x55d398326f99059fF775485246999027B3197955',
      USDC: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
    },
  },
  TRC20: {
    rpcUrl: process.env.RPC_URL_TRON || 'https://api.trongrid.io',
    chainId: 0,
    name: 'Tron',
    explorer: 'https://tronscan.org',
    tokens: {
      USDT: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
      USDC: 'TEkxiTehnzSmSe2XqrBj4w32RUN966rdz8',
    },
  },
  BASE: {
    rpcUrl: process.env.RPC_URL_BASE || 'https://mainnet.base.org',
    chainId: 8453,
    name: 'Base',
    explorer: 'https://basescan.org',
    tokens: {
      USDC: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    },
  },
  POLYGON: {
    rpcUrl: process.env.RPC_URL_POLYGON || 'https://polygon-rpc.com',
    chainId: 137,
    name: 'Polygon',
    explorer: 'https://polygonscan.com',
    tokens: {
      USDC: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
      USDT: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
    },
  },
};

export const ERC20_ABI = [
  'function transfer(address to, uint256 amount) returns (bool)',
  'function balanceOf(address account) view returns (uint256)',
  'function decimals() view returns (uint8)',
];
