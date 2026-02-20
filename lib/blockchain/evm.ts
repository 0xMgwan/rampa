import { ethers } from 'ethers';
import { BLOCKCHAIN_CONFIGS, ERC20_ABI } from './config';
import { Network, CryptoType, TransferResult, WalletBalance } from './types';
import { logger } from '../logger';

export class EVMBlockchain {
  private provider: ethers.JsonRpcProvider;
  private wallet: ethers.Wallet;
  private config: typeof BLOCKCHAIN_CONFIGS.BEP20;
  private network: Network;

  constructor(network: Network, privateKey: string) {
    if (network === 'TRC20') {
      throw new Error('Use TronBlockchain for TRC20');
    }

    this.network = network;
    this.config = BLOCKCHAIN_CONFIGS[network];
    this.provider = new ethers.JsonRpcProvider(this.config.rpcUrl);
    this.wallet = new ethers.Wallet(privateKey, this.provider);
  }

  async sendToken(
    token: CryptoType,
    toAddress: string,
    amount: number
  ): Promise<TransferResult> {
    try {
      const tokenAddress = this.config.tokens[token];
      if (!tokenAddress) {
        throw new Error(`${token} not supported on ${this.network}`);
      }

      const contract = new ethers.Contract(tokenAddress, ERC20_ABI, this.wallet);
      const decimals = await contract.decimals();
      const amountWei = ethers.parseUnits(amount.toString(), decimals);

      logger.info(`Sending ${amount} ${token} on ${this.network} to ${toAddress}`);

      const tx = await contract.transfer(toAddress, amountWei);
      const receipt = await tx.wait();

      const explorerUrl = `${this.config.explorer}/tx/${receipt.hash}`;

      logger.info(`Transaction confirmed: ${receipt.hash}`);

      return {
        txHash: receipt.hash,
        explorerUrl,
        success: true,
      };
    } catch (error: any) {
      logger.error(`Failed to send ${token} on ${this.network}:`, error);
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
      const nativeBalance = await this.provider.getBalance(this.wallet.address);
      const balance: WalletBalance = {
        native: ethers.formatEther(nativeBalance),
      };

      if (this.config.tokens.USDC) {
        const usdcContract = new ethers.Contract(
          this.config.tokens.USDC,
          ERC20_ABI,
          this.provider
        );
        const usdcBalance = await usdcContract.balanceOf(this.wallet.address);
        const usdcDecimals = await usdcContract.decimals();
        balance.usdc = ethers.formatUnits(usdcBalance, usdcDecimals);
      }

      if (this.config.tokens.USDT) {
        const usdtContract = new ethers.Contract(
          this.config.tokens.USDT,
          ERC20_ABI,
          this.provider
        );
        const usdtBalance = await usdtContract.balanceOf(this.wallet.address);
        const usdtDecimals = await usdtContract.decimals();
        balance.usdt = ethers.formatUnits(usdtBalance, usdtDecimals);
      }

      return balance;
    } catch (error: any) {
      logger.error(`Failed to get balance on ${this.network}:`, error);
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
      throw new Error(`${token} not supported on ${this.network}`);
    }

    const contract = new ethers.Contract(tokenAddress, ERC20_ABI, this.provider);
    const decimals = await contract.decimals();

    const filter = contract.filters.Transfer(null, address);

    logger.info(`Monitoring ${address} for ${token} deposits on ${this.network}`);

    contract.on(filter, async (from, to, amount, event) => {
      const amountFormatted = parseFloat(ethers.formatUnits(amount, decimals));
      logger.info(`Detected deposit: ${amountFormatted} ${token} from ${from}`);

      if (amountFormatted >= expectedAmount * 0.99) {
        callback(event.log.transactionHash, amountFormatted);
      }
    });
  }

  getAddress(): string {
    return this.wallet.address;
  }
}
