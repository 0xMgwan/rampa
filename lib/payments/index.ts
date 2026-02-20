import { MPesaTanzania } from './mpesa-tanzania';
import { PaymentProvider } from './types';
import { logger } from '../logger';

export class PaymentService {
  private static providers: Map<string, PaymentProvider> = new Map();

  static getProvider(providerId: string): PaymentProvider {
    if (!this.providers.has(providerId)) {
      switch (providerId) {
        case 'mpesa-tz':
          this.providers.set(providerId, new MPesaTanzania());
          break;
        default:
          throw new Error(`Payment provider ${providerId} not implemented`);
      }
    }

    return this.providers.get(providerId)!;
  }

  static async verifyPayment(
    providerId: string,
    transactionId: string,
    expectedAmount: number
  ) {
    try {
      logger.info(`Verifying payment ${transactionId} with ${providerId}`);
      const provider = this.getProvider(providerId);
      return await provider.verifyPayment(transactionId, expectedAmount);
    } catch (error: any) {
      logger.error('Payment verification failed:', error);
      return {
        verified: false,
        error: error.message,
      };
    }
  }

  static async sendPayout(providerId: string, phone: string, amount: number) {
    try {
      logger.info(`Sending payout of ${amount} to ${phone} via ${providerId}`);
      const provider = this.getProvider(providerId);
      return await provider.sendPayout(phone, amount);
    } catch (error: any) {
      logger.error('Payout failed:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

export * from './types';
