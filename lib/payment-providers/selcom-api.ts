import crypto from 'crypto';

interface SelcomConfig {
  apiKey: string;
  apiSecret: string;
  vendorId: string;
  baseUrl: string;
}

interface SelcomTransaction {
  transid: string;
  amount: number;
  msisdn: string;
  reference: string;
  status: string;
  created_at: string;
}

export class SelcomAPI {
  private config: SelcomConfig;

  constructor() {
    this.config = {
      apiKey: process.env.SELCOM_API_KEY || '',
      apiSecret: process.env.SELCOM_API_SECRET || '',
      vendorId: process.env.SELCOM_VENDOR_ID || '',
      baseUrl: process.env.SELCOM_BASE_URL || 'https://apigw.selcommobile.com',
    };
  }

  private generateSignature(payload: string): string {
    const hmac = crypto.createHmac('sha256', this.config.apiSecret);
    hmac.update(payload);
    return hmac.digest('hex');
  }

  private async makeRequest(endpoint: string, method: string = 'GET', data?: any): Promise<any> {
    const timestamp = new Date().toISOString();
    const payload = data ? JSON.stringify(data) : '';
    const signedFields = `timestamp=${timestamp}&payload=${payload}`;
    const signature = this.generateSignature(signedFields);

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `SELCOM ${this.config.apiKey}`,
      'Digest-Method': 'HS256',
      'Digest': signature,
      'Timestamp': timestamp,
    };

    const options: RequestInit = {
      method,
      headers,
    };

    if (method !== 'GET' && data) {
      options.body = payload;
    }

    const response = await fetch(`${this.config.baseUrl}${endpoint}`, options);

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Selcom API error: ${error}`);
    }

    return response.json();
  }

  async getRecentTransactions(limit: number = 50): Promise<SelcomTransaction[]> {
    try {
      const result = await this.makeRequest(`/v1/wallet/transactions?limit=${limit}`, 'GET');
      return result.data || [];
    } catch (error: any) {
      console.error('Error fetching Selcom transactions:', error);
      return [];
    }
  }

  async getTransactionByReference(reference: string): Promise<SelcomTransaction | null> {
    try {
      const transactions = await this.getRecentTransactions(100);
      return transactions.find(tx => 
        tx.reference === reference || 
        tx.reference.includes(reference)
      ) || null;
    } catch (error: any) {
      console.error('Error finding transaction:', error);
      return null;
    }
  }

  async verifyPayment(orderNumber: string, expectedAmount: number, customerPhone: string): Promise<{
    verified: boolean;
    transaction?: SelcomTransaction;
    message: string;
  }> {
    try {
      const transactions = await this.getRecentTransactions(100);
      
      const cleanPhone = customerPhone.replace(/^\+/, '').replace(/^0/, '255');
      
      const matchingTx = transactions.find(tx => {
        const txPhone = tx.msisdn.replace(/^\+/, '').replace(/^0/, '255');
        const amountMatch = Math.abs(tx.amount - expectedAmount) <= 100;
        const phoneMatch = txPhone === cleanPhone;
        const referenceMatch = tx.reference && tx.reference.includes(orderNumber);
        const statusMatch = tx.status === 'COMPLETED' || tx.status === 'SUCCESS';
        
        return amountMatch && phoneMatch && statusMatch && (referenceMatch || true);
      });

      if (matchingTx) {
        return {
          verified: true,
          transaction: matchingTx,
          message: 'Payment verified successfully',
        };
      }

      return {
        verified: false,
        message: 'No matching payment found',
      };
    } catch (error: any) {
      console.error('Payment verification error:', error);
      return {
        verified: false,
        message: error.message || 'Verification failed',
      };
    }
  }

  async checkBalance(): Promise<{ success: boolean; balance?: number; currency?: string; message?: string }> {
    try {
      const result = await this.makeRequest('/v1/wallet/balance', 'GET');
      return {
        success: true,
        balance: result.balance,
        currency: result.currency,
      };
    } catch (error: any) {
      console.error('Balance check error:', error);
      return {
        success: false,
        message: error.message || 'Balance check failed',
      };
    }
  }
}

export const selcomAPI = new SelcomAPI();
