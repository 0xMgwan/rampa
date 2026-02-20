import TronWeb from 'tronweb';
import { BLOCKCHAIN_CONFIGS } from './config';
import { CryptoType, TransferResult, WalletBalance } from './types';
import { logger } from '../logger';

export class TronBlockchain {
  private tronWeb: any;
  private config: typeof BLOCKCHAIN_CONFIGS.TRC20;

  constructor(privateKey: string) {
    this.config = BLOCKCHAIN_CONFIGS.TRC20;
    this.tronWeb = new TronWeb({
      fullHost: this.config.rpcUrl,
      privateKey,
    });
  }

  async sendToken(
    token: CryptoType,
    toAddress: string,
    amount: number
  ): Promise<TransferResult> {
    try {
      const tokenAddress = this.config.tokens[token];
      if (!tokenAddress) {
        throw new Error(`${token} not supported on TRC20`);
      }

      logger.info(`Sending ${amount} ${token} on TRC20 to ${toAddress}`);

      const contract = await this.tronWeb.contract().at(tokenAddress);
      const decimals = await contract.decimals().call();
      const amountSun = amount * Math.pow(10, decimals);

      const tx = await contract.transfer(toAddress, amountSun).send();

      const explorerUrl = `${this.config.explorer}/#/transaction/${tx}`;

      logger.info(`Transaction confirmed: ${tx}`);

      return {
        txHash: tx,
        explorerUrl,
        success: true,
      };
    } catch (error: any) {
      logger.error(`Failed to send ${token} on TRC20:`, error);
      return {
        txHash: '',
        explorerUrl: '',
        success: false,
        error: error.message,
      };
    }
  }

  async getBalance(): Promise<WalletBalance> {
    try {
      const address = this.tronWeb.defaultAddress.base58;
      const nativeBalance = await this.tronWeb.trx.getBalance(address);
      const balance: WalletBalance = {
        native: (nativeBalance / 1e6).toString(),
      };

      if (this.config.tokens.USDC) {
        const usdcContract = await this.tronWeb.contract().at(this.config.tokens.USDC);
        const usdcBalance = await usdcContract.balanceOf(address).call();
        const usdcDecimals = await usdcContract.decimals().call();
        balance.usdc = (usdcBalance / Math.pow(10, usdcDecimals)).toString();
      }

      if (this.config.tokens.USDT) {
        const usdtContract = await this.tronWeb.contract().at(this.config.tokens.USDT);
        const usdtBalance = await usdtContract.balanceOf(address).call();
        const usdtDecimals = await usdtContract.decimals().call();
        balance.usdt = (usdtBalance / Math.pow(10, usdtDecimals)).toString();
      }

      return balance;
    } catch (error: any) {
      logger.error('Failed to get balance on TRC20:', error);
      throw error;
    }
  }

  async monitorAddress(
    address: string,
    token: CryptoType,
    expectedAmount: number,
    callback: (txHash: string, amount: number) => void
  ): Promise<void> {
    const tokenAddress = this.config.tokens[token];
    if (!tokenAddress) {
      throw new Error(`${token} not supported on TRC20`);
    }

    logger.info(`Monitoring ${address} for ${token} deposits on TRC20`);

    const checkInterval = setInterval(async () => {
      try {
        const contract = await this.tronWeb.contract().at(tokenAddress);
        const balance = await contract.balanceOf(address).call();
        const decimals = await contract.decimals().call();
        const amountFormatted = balance / Math.pow(10, decimals);

        if (amountFormatted >= expectedAmount * 0.99) {
          clearInterval(checkInterval);
          callback('', amountFormatted);
        }
      } catch (error) {
        logger.error('Error monitoring TRC20 address:', error);
      }
    }, 10000);
  }

  getAddress(): string {
    return this.tronWeb.defaultAddress.base58;
  }
}
