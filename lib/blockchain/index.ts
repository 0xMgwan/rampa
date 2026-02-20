import { EVMBlockchain } from './evm';
import { TronBlockchain } from './tron';
import { Network, CryptoType, TransferResult } from './types';
import { logger } from '../logger';

export class BlockchainService {
  private static instances: Map<Network, EVMBlockchain | TronBlockchain> = new Map();

  static getInstance(network: Network): EVMBlockchain | TronBlockchain {
    if (!this.instances.has(network)) {
      const privateKey = this.getPrivateKey(network);
      
      if (network === 'TRC20') {
        this.instances.set(network, new TronBlockchain(privateKey));
      } else {
        this.instances.set(network, new EVMBlockchain(network, privateKey));
      }
    }

    return this.instances.get(network)!;
  }

  private static getPrivateKey(network: Network): string {
    const keyMap: Record<Network, string> = {
      BEP20: process.env.HOT_WALLET_PRIVATE_KEY_BEP20 || '',
      TRC20: process.env.HOT_WALLET_PRIVATE_KEY_TRC20 || '',
      BASE: process.env.HOT_WALLET_PRIVATE_KEY_BASE || '',
      POLYGON: process.env.HOT_WALLET_PRIVATE_KEY_POLYGON || '',
    };

    const key = keyMap[network];
    if (!key) {
      throw new Error(`Private key not configured for ${network}`);
    }

    return key;
  }

  static async sendCrypto(
    network: Network,
    token: CryptoType,
    toAddress: string,
    amount: number
  ): Promise<TransferResult> {
    try {
      logger.info(`Initiating ${amount} ${token} transfer on ${network} to ${toAddress}`);
      const blockchain = this.getInstance(network);
      return await blockchain.sendToken(token, toAddress, amount);
    } catch (error: any) {
      logger.error('Blockchain transfer failed:', error);
      return {
        txHash: '',
        explorerUrl: '',
        success: false,
        error: error.message,
      };
    }
  }

  static async getWalletAddress(network: Network): string {
    const blockchain = this.getInstance(network);
    return blockchain.getAddress();
  }

  static async getBalance(network: Network) {
    const blockchain = this.getInstance(network);
    return await blockchain.getBalance();
  }

  static async monitorDeposit(
    network: Network,
    address: string,
    token: CryptoType,
    expectedAmount: number,
    callback: (txHash: string, amount: number) => void
  ): Promise<void> {
    const blockchain = this.getInstance(network);
    await blockchain.monitorAddress(address, token, expectedAmount, callback);
  }
}

export * from './types';
export * from './config';
