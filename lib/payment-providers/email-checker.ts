import Imap from 'imap';
import { simpleParser } from 'mailparser';
import { notificationParser } from './notification-parser';

interface EmailConfig {
  user: string;
  password: string;
  host: string;
  port: number;
  tls: boolean;
}

export class EmailChecker {
  private config: EmailConfig;

  constructor() {
    this.config = {
      user: process.env.NOTIFICATION_EMAIL || '',
      password: process.env.NOTIFICATION_EMAIL_PASSWORD || '',
      host: process.env.NOTIFICATION_EMAIL_IMAP || 'imap.gmail.com',
      port: 993,
      tls: true,
    };
  }

  async checkForPaymentNotifications(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const imap = new Imap(this.config);
      const payments: any[] = [];

      imap.once('ready', () => {
        imap.openBox('INBOX', false, (err, box) => {
          if (err) {
            reject(err);
            return;
          }

          // Search for unread emails from last 24 hours
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);

          imap.search(['UNSEEN', ['SINCE', yesterday]], (err, results) => {
            if (err) {
              reject(err);
              return;
            }

            if (!results || results.length === 0) {
              imap.end();
              resolve([]);
              return;
            }

            const fetch = imap.fetch(results, { bodies: '' });

            fetch.on('message', (msg) => {
              msg.on('body', (stream) => {
                simpleParser(stream, async (err, parsed) => {
                  if (err) {
                    console.error('Email parse error:', err);
                    return;
                  }

                  const subject = parsed.subject || '';
                  const body = parsed.text || '';

                  // Check if it's a payment notification
                  if (this.isPaymentNotification(subject, body)) {
                    const payment = notificationParser.parseEmailSubject(subject, body);
                    if (payment) {
                      payments.push({
                        ...payment,
                        emailSubject: subject,
                        emailDate: parsed.date,
                      });
                    }
                  }
                });
              });
            });

            fetch.once('end', () => {
              imap.end();
              resolve(payments);
            });

            fetch.once('error', (err) => {
              reject(err);
            });
          });
        });
      });

      imap.once('error', (err) => {
        reject(err);
      });

      imap.connect();
    });
  }

  private isPaymentNotification(subject: string, body: string): boolean {
    const keywords = [
      'received',
      'payment',
      'mpesa',
      'airtel',
      'tigo pesa',
      'halopesa',
      'lipa',
      'transaction',
    ];

    const text = (subject + ' ' + body).toLowerCase();
    return keywords.some(keyword => text.includes(keyword));
  }
}

export const emailChecker = new EmailChecker();
