interface ParsedPayment {
  amount: number;
  phone: string;
  reference?: string;
  transactionId: string;
  provider: 'MPESA' | 'AIRTEL' | 'TIGOPESA' | 'HALOPESA' | 'UNKNOWN';
  timestamp: Date;
}

export class NotificationParser {
  parseEmailSubject(subject: string, body: string): ParsedPayment | null {
    // M-Pesa Tanzania pattern
    const mpesaMatch = subject.match(/You have received TZS ([\d,]+\.\d+) from (\d+)/i) ||
                       body.match(/You have received TZS ([\d,]+\.\d+) from (\d+)/i);
    
    if (mpesaMatch) {
      const amount = parseFloat(mpesaMatch[1].replace(/,/g, ''));
      const phone = mpesaMatch[2];
      const txIdMatch = body.match(/Transaction ID[:\s]+([A-Z0-9]+)/i);
      const refMatch = body.match(/Reference[:\s]+([A-Z0-9-]+)/i);
      
      return {
        amount,
        phone: this.normalizePhone(phone),
        reference: refMatch?.[1],
        transactionId: txIdMatch?.[1] || `MPESA-${Date.now()}`,
        provider: 'MPESA',
        timestamp: new Date(),
      };
    }

    // Airtel Money pattern
    const airtelMatch = subject.match(/You have received (\d+(?:,\d+)*(?:\.\d+)?) TZS from (\d+)/i) ||
                        body.match(/You have received (\d+(?:,\d+)*(?:\.\d+)?) TZS from (\d+)/i);
    
    if (airtelMatch) {
      const amount = parseFloat(airtelMatch[1].replace(/,/g, ''));
      const phone = airtelMatch[2];
      const txIdMatch = body.match(/Reference[:\s]+([A-Z0-9]+)/i);
      
      return {
        amount,
        phone: this.normalizePhone(phone),
        transactionId: txIdMatch?.[1] || `AIRTEL-${Date.now()}`,
        provider: 'AIRTEL',
        timestamp: new Date(),
      };
    }

    // Tigo Pesa pattern
    const tigoMatch = subject.match(/Payment of TZS ([\d,]+) received from (\d+)/i) ||
                      body.match(/Payment of TZS ([\d,]+) received from (\d+)/i);
    
    if (tigoMatch) {
      const amount = parseFloat(tigoMatch[1].replace(/,/g, ''));
      const phone = tigoMatch[2];
      const txIdMatch = body.match(/Transaction[:\s]+([A-Z0-9]+)/i);
      
      return {
        amount,
        phone: this.normalizePhone(phone),
        transactionId: txIdMatch?.[1] || `TIGO-${Date.now()}`,
        provider: 'TIGOPESA',
        timestamp: new Date(),
      };
    }

    // Halopesa pattern
    const haloMatch = subject.match(/Received TZS ([\d,]+) from (\d+)/i) ||
                      body.match(/Received TZS ([\d,]+) from (\d+)/i);
    
    if (haloMatch) {
      const amount = parseFloat(haloMatch[1].replace(/,/g, ''));
      const phone = haloMatch[2];
      const txIdMatch = body.match(/Ref[:\s]+([A-Z0-9]+)/i);
      
      return {
        amount,
        phone: this.normalizePhone(phone),
        transactionId: txIdMatch?.[1] || `HALO-${Date.now()}`,
        provider: 'HALOPESA',
        timestamp: new Date(),
      };
    }

    return null;
  }

  parseSMS(message: string): ParsedPayment | null {
    // M-Pesa SMS: "You have received TZS 25,800.00 from 255765123456..."
    const mpesaMatch = message.match(/received TZS ([\d,]+(?:\.\d+)?) from (\d+)/i);
    if (mpesaMatch) {
      const amount = parseFloat(mpesaMatch[1].replace(/,/g, ''));
      const phone = mpesaMatch[2];
      const txIdMatch = message.match(/([A-Z]{2}\d{8,})/);
      
      return {
        amount,
        phone: this.normalizePhone(phone),
        transactionId: txIdMatch?.[1] || `MPESA-${Date.now()}`,
        provider: 'MPESA',
        timestamp: new Date(),
      };
    }

    // Airtel SMS
    const airtelMatch = message.match(/received (\d+(?:,\d+)*(?:\.\d+)?) from (\d+)/i);
    if (airtelMatch) {
      return {
        amount: parseFloat(airtelMatch[1].replace(/,/g, '')),
        phone: this.normalizePhone(airtelMatch[2]),
        transactionId: `AIRTEL-${Date.now()}`,
        provider: 'AIRTEL',
        timestamp: new Date(),
      };
    }

    return null;
  }

  private normalizePhone(phone: string): string {
    // Remove spaces, dashes, plus signs
    let cleaned = phone.replace(/[\s\-+]/g, '');
    
    // Convert 0765... to 255765...
    if (cleaned.startsWith('0')) {
      cleaned = '255' + cleaned.substring(1);
    }
    
    // Ensure starts with 255
    if (!cleaned.startsWith('255')) {
      cleaned = '255' + cleaned;
    }
    
    return cleaned;
  }
}

export const notificationParser = new NotificationParser();
