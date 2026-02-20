import crypto from 'crypto';

interface SelcomConfig {
  apiKey: string;
  apiSecret: string;
  vendorId: string;
  lipaNumber: string;
  baseUrl: string;
}

interface PaymentRequest {
  orderId: string;
  amount: number;
  currency: string;
  customerPhone: string;
  customerName: string;
  description: string;
}

interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  reference?: string;
  message?: string;
  lipaNumber?: string;
  amount?: number;
}

export class SelcomPaymentProvider {
  private config: SelcomConfig;

  constructor() {
    this.config = {
      apiKey: process.env.SELCOM_API_KEY || '',
      apiSecret: process.env.SELCOM_API_SECRET || '',
      vendorId: process.env.SELCOM_VENDOR_ID || '',
      lipaNumber: process.env.SELCOM_LIPA_NUMBER || '',
      baseUrl: process.env.SELCOM_BASE_URL || 'https://apigw.selcommobile.com',
    };
  }

  private generateSignature(payload: string): string {
    const hmac = crypto.createHmac('sha256', this.config.apiSecret);
    hmac.update(payload);
    return hmac.digest('hex');
  }

  private async makeRequest(endpoint: string, method: string, data?: any): Promise<any> {
    const timestamp = new Date().toISOString();
    const payload = JSON.stringify(data || {});
    const signedFields = `timestamp=${timestamp}&payload=${payload}`;
    const signature = this.generateSignature(signedFields);

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `SELCOM ${this.config.apiKey}`,
      'Digest-Method': 'HS256',
      'Digest': signature,
      'Timestamp': timestamp,
    };

    const response = await fetch(`${this.config.baseUrl}${endpoint}`, {
      method,
      headers,
      body: method !== 'GET' ? payload : undefined,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Selcom API error: ${error}`);
    }

    return response.json();
  }

  async createPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      const payload = {
        vendor: this.config.vendorId,
        order_id: request.orderId,
        buyer_email: `${request.customerPhone}@customer.com`,
        buyer_name: request.customerName,
        buyer_phone: request.customerPhone,
        amount: request.amount,
        currency: request.currency,
        no_of_items: 1,
        payment_methods: ['MASTERCARD', 'VISA', 'MOBILEBANKING'],
        redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/callback`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/cancel`,
        webhook_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/selcom`,
      };

      const result = await this.makeRequest('/v1/checkout/create-order', 'POST', payload);

      return {
        success: true,
        transactionId: result.order_id,
        reference: result.reference,
        lipaNumber: this.config.lipaNumber,
        amount: request.amount,
        message: `Pay ${request.amount} ${request.currency} to Lipa Number: ${this.config.lipaNumber}`,
      };
    } catch (error: any) {
      console.error('Selcom payment creation error:', error);
      return {
        success: false,
        message: error.message || 'Payment creation failed',
      };
    }
  }

  async verifyPayment(orderId: string): Promise<PaymentResponse> {
    try {
      const result = await this.makeRequest(`/v1/checkout/order-status/${orderId}`, 'GET');

      const isPaid = result.payment_status === 'COMPLETED' || result.payment_status === 'PAID';

      return {
        success: isPaid,
        transactionId: result.transaction_id,
        reference: result.reference,
        message: isPaid ? 'Payment verified successfully' : `Payment status: ${result.payment_status}`,
      };
    } catch (error: any) {
      console.error('Selcom payment verification error:', error);
      return {
        success: false,
        message: error.message || 'Payment verification failed',
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
      console.error('Selcom balance check error:', error);
      return {
        success: false,
        message: error.message || 'Balance check failed',
      };
    }
  }

  getLipaNumber(): string {
    return this.config.lipaNumber;
  }

  async processWebhook(payload: any, signature: string): Promise<{ verified: boolean; data?: any }> {
    try {
      const expectedSignature = this.generateSignature(JSON.stringify(payload));
      
      if (signature !== expectedSignature) {
        return { verified: false };
      }

      return {
        verified: true,
        data: {
          orderId: payload.order_id,
          transactionId: payload.transaction_id,
          status: payload.payment_status,
          amount: payload.amount,
          currency: payload.currency,
          paymentMethod: payload.payment_method,
        },
      };
    } catch (error) {
      console.error('Webhook verification error:', error);
      return { verified: false };
    }
  }
}

export const selcomProvider = new SelcomPaymentProvider();
