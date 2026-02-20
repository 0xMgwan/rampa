import axios from 'axios';
import { PaymentProvider, PaymentVerificationResult, PayoutResult } from './types';
import { logger } from '../logger';

export class MPesaTanzania implements PaymentProvider {
  private apiKey: string;
  private publicKey: string;
  private serviceProviderCode: string;
  private baseUrl: string = 'https://openapi.m-pesa.com';

  constructor() {
    this.apiKey = process.env.MPESA_TZ_API_KEY || '';
    this.publicKey = process.env.MPESA_TZ_PUBLIC_KEY || '';
    this.serviceProviderCode = process.env.MPESA_TZ_SERVICE_PROVIDER_CODE || '';
  }

  private async getAccessToken(): Promise<string> {
    try {
      const response = await axios.get(`${this.baseUrl}/sandbox/ipg/v2/vodacomTZN/getSession/`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data.output_SessionID;
    } catch (error: any) {
      logger.error('Failed to get M-Pesa access token:', error);
      throw new Error('Failed to authenticate with M-Pesa');
    }
  }

  async verifyPayment(transactionId: string, expectedAmount: number): Promise<PaymentVerificationResult> {
    try {
      const sessionId = await this.getAccessToken();

      const response = await axios.get(
        `${this.baseUrl}/sandbox/ipg/v2/vodacomTZN/queryTransactionStatus/`,
        {
          headers: {
            'Authorization': `Bearer ${sessionId}`,
            'Content-Type': 'application/json',
          },
          params: {
            input_QueryReference: transactionId,
            input_ServiceProviderCode: this.serviceProviderCode,
          },
        }
      );

      const transaction = response.data;

      if (transaction.output_ResponseCode === 'INS-0') {
        const amount = parseFloat(transaction.output_Amount);
        
        return {
          verified: Math.abs(amount - expectedAmount) < 0.01,
          amount,
          sender: transaction.output_CustomerMSISDN,
          timestamp: new Date(transaction.output_TransactionDateTime),
          transactionId,
        };
      }

      return {
        verified: false,
        error: 'Transaction not found or failed',
      };
    } catch (error: any) {
      logger.error('M-Pesa payment verification failed:', error);
      return {
        verified: false,
        error: error.message,
      };
    }
  }

  async sendPayout(phone: string, amount: number): Promise<PayoutResult> {
    try {
      const sessionId = await this.getAccessToken();

      const response = await axios.post(
        `${this.baseUrl}/sandbox/ipg/v2/vodacomTZN/b2cPayment/`,
        {
          input_Amount: amount.toString(),
          input_CustomerMSISDN: phone,
          input_ServiceProviderCode: this.serviceProviderCode,
          input_TransactionReference: `PAYOUT-${Date.now()}`,
          input_ThirdPartyConversationID: `CONV-${Date.now()}`,
        },
        {
          headers: {
            'Authorization': `Bearer ${sessionId}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.output_ResponseCode === 'INS-0') {
        return {
          success: true,
          transactionId: response.data.output_TransactionID,
        };
      }

      return {
        success: false,
        error: response.data.output_ResponseDesc,
      };
    } catch (error: any) {
      logger.error('M-Pesa payout failed:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }
}
