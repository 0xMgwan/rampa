export interface PaymentVerificationResult {
  verified: boolean;
  amount?: number;
  sender?: string;
  timestamp?: Date;
  transactionId?: string;
  error?: string;
}

export interface PayoutResult {
  success: boolean;
  transactionId?: string;
  error?: string;
}

export interface PaymentProvider {
  verifyPayment(transactionId: string, expectedAmount: number): Promise<PaymentVerificationResult>;
  sendPayout(phone: string, amount: number): Promise<PayoutResult>;
}
