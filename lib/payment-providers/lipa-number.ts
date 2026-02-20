interface LipaNumberConfig {
  lipaNumber: string;
  businessName: string;
}

interface PaymentInstructions {
  lipaNumber: string;
  amount: number;
  currency: string;
  reference: string;
  instructions: string[];
}

export class LipaNumberProvider {
  private config: LipaNumberConfig;

  constructor() {
    this.config = {
      lipaNumber: process.env.LIPA_NUMBER || '',
      businessName: process.env.BUSINESS_NAME || 'OnRampa',
    };
  }

  generatePaymentInstructions(
    orderId: string,
    amount: number,
    currency: string,
    customerPhone: string
  ): PaymentInstructions {
    return {
      lipaNumber: this.config.lipaNumber,
      amount,
      currency,
      reference: orderId,
      instructions: [
        `Open your mobile money app (M-Pesa, Tigo Pesa, Airtel Money, or Halopesa)`,
        `Select "Lipa Namba" or "Pay by Number"`,
        `Enter Lipa Number: ${this.config.lipaNumber}`,
        `Enter Amount: ${amount} ${currency}`,
        `Reference: ${orderId}`,
        `Confirm payment`,
        `Payment will be verified within 5 minutes`,
      ],
    };
  }

  getLipaNumber(): string {
    return this.config.lipaNumber;
  }

  getBusinessName(): string {
    return this.config.businessName;
  }
}

export const lipaNumberProvider = new LipaNumberProvider();
