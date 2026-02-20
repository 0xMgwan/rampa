import crypto from 'crypto';
import axios from 'axios';
import { prisma } from '../db';
import { logger } from '../logger';

export class WebhookService {
  static generateSignature(payload: any, secret: string): string {
    const timestamp = Math.floor(Date.now() / 1000);
    const signedPayload = `${timestamp}.${JSON.stringify(payload)}`;
    const signature = crypto
      .createHmac('sha256', secret)
      .update(signedPayload)
      .digest('hex');
    return `t=${timestamp},v1=${signature}`;
  }

  static async sendWebhook(orderId: string, eventType: string) {
    try {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          partner: true,
          country: true,
          paymentProvider: true,
        },
      });

      if (!order || !order.partner.webhookUrl) {
        return;
      }

      const payload = {
        event: eventType,
        timestamp: new Date().toISOString(),
        order: {
          snaville_order_id: order.id,
          order_number: order.orderNumber,
          partner_order_id: order.partnerOrderId,
          type: order.type.toLowerCase(),
          status: order.status.toLowerCase(),
          amount_crypto: order.amountCrypto,
          crypto_type: order.cryptoType,
          network: order.network,
          amount_fiat: order.amountFiat,
          currency_code: order.currencyCode,
          destination_address: order.destinationAddress,
          deposit_address: order.depositAddress,
          tx_hash: order.txHash,
          explorer_url: order.explorerUrl,
          created_at: order.createdAt.toISOString(),
          completed_at: order.completedAt?.toISOString(),
        },
      };

      const signature = this.generateSignature(payload, order.partner.webhookSecret || '');

      const webhook = await prisma.webhook.create({
        data: {
          orderId,
          eventType: eventType as any,
          payload,
          status: 'PENDING',
        },
      });

      try {
        await axios.post(order.partner.webhookUrl, payload, {
          headers: {
            'Content-Type': 'application/json',
            'X-Webhook-Signature': signature,
          },
          timeout: 10000,
        });

        await prisma.webhook.update({
          where: { id: webhook.id },
          data: {
            status: 'SENT',
            attempts: 1,
            lastAttemptAt: new Date(),
          },
        });

        logger.info(`Webhook sent successfully for order ${order.orderNumber}`);
      } catch (error: any) {
        await prisma.webhook.update({
          where: { id: webhook.id },
          data: {
            status: 'FAILED',
            attempts: 1,
            lastAttemptAt: new Date(),
            errorMessage: error.message,
            nextRetryAt: new Date(Date.now() + 60000),
          },
        });

        logger.error(`Webhook failed for order ${order.orderNumber}:`, error);
      }
    } catch (error) {
      logger.error('Webhook processing error:', error);
    }
  }

  static async retryFailedWebhooks() {
    const failedWebhooks = await prisma.webhook.findMany({
      where: {
        status: 'FAILED',
        attempts: { lt: 5 },
        nextRetryAt: { lte: new Date() },
      },
      include: {
        order: {
          include: { partner: true },
        },
      },
    });

    for (const webhook of failedWebhooks) {
      if (!webhook.order.partner.webhookUrl) continue;

      try {
        const signature = this.generateSignature(
          webhook.payload,
          webhook.order.partner.webhookSecret || ''
        );

        await axios.post(webhook.order.partner.webhookUrl, webhook.payload, {
          headers: {
            'Content-Type': 'application/json',
            'X-Webhook-Signature': signature,
          },
          timeout: 10000,
        });

        await prisma.webhook.update({
          where: { id: webhook.id },
          data: {
            status: 'SENT',
            attempts: webhook.attempts + 1,
            lastAttemptAt: new Date(),
          },
        });

        logger.info(`Webhook retry successful for order ${webhook.order.orderNumber}`);
      } catch (error: any) {
        const nextRetryDelay = Math.min(Math.pow(2, webhook.attempts) * 60000, 3600000);

        await prisma.webhook.update({
          where: { id: webhook.id },
          data: {
            attempts: webhook.attempts + 1,
            lastAttemptAt: new Date(),
            errorMessage: error.message,
            nextRetryAt: new Date(Date.now() + nextRetryDelay),
          },
        });

        logger.error(`Webhook retry failed for order ${webhook.order.orderNumber}:`, error);
      }
    }
  }
}
