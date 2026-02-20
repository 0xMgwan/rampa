import axios from 'axios';
import { prisma } from '../db';
import { getCachedData, setCachedData } from '../redis';
import { logger } from '../logger';

export class RateService {
  static async getCryptoPrice(token: 'USDC' | 'USDT'): Promise<number> {
    const cacheKey = `crypto_price:${token}`;
    const cached = await getCachedData<number>(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      const tokenId = token === 'USDC' ? 'usd-coin' : 'tether';
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price?ids=${tokenId}&vs_currencies=usd`,
        {
          headers: process.env.COINGECKO_API_KEY
            ? { 'x-cg-pro-api-key': process.env.COINGECKO_API_KEY }
            : {},
        }
      );

      const price = response.data[tokenId].usd;
      await setCachedData(cacheKey, price, 300);
      return price;
    } catch (error) {
      logger.error(`Failed to fetch ${token} price:`, error);
      return 1.0;
    }
  }

  static async getForexRate(currencyCode: string): Promise<number> {
    const cacheKey = `forex_rate:${currencyCode}`;
    const cached = await getCachedData<number>(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      const response = await axios.get(
        `https://api.exchangerate-api.com/v4/latest/USD`
      );

      const rate = response.data.rates[currencyCode];
      if (rate) {
        await setCachedData(cacheKey, rate, 3600);
        return rate;
      }

      logger.warn(`Forex rate not found for ${currencyCode}`);
      return 1;
    } catch (error) {
      logger.error(`Failed to fetch forex rate for ${currencyCode}:`, error);
      return 1;
    }
  }

  static async updateExchangeRates(countryId: string): Promise<void> {
    try {
      const country = await prisma.country.findUnique({
        where: { id: countryId },
      });

      if (!country) {
        throw new Error('Country not found');
      }

      const usdcPrice = await this.getCryptoPrice('USDC');
      const usdtPrice = await this.getCryptoPrice('USDT');
      const forexRate = await this.getForexRate(country.currencyCode);

      const spreadPercentage = 0.02;

      const usdcBuyRate = (usdcPrice * forexRate) * (1 + spreadPercentage);
      const usdcSellRate = (usdcPrice * forexRate) * (1 - spreadPercentage);
      const usdtBuyRate = (usdtPrice * forexRate) * (1 + spreadPercentage);
      const usdtSellRate = (usdtPrice * forexRate) * (1 - spreadPercentage);

      await prisma.exchangeRate.upsert({
        where: {
          countryId_currencyCode: {
            countryId,
            currencyCode: country.currencyCode,
          },
        },
        update: {
          usdcBuyRate,
          usdcSellRate,
          usdtBuyRate,
          usdtSellRate,
          source: 'API',
        },
        create: {
          countryId,
          currencyCode: country.currencyCode,
          usdcBuyRate,
          usdcSellRate,
          usdtBuyRate,
          usdtSellRate,
          source: 'API',
        },
      });

      logger.info(`Updated exchange rates for ${country.code}`);
    } catch (error) {
      logger.error('Failed to update exchange rates:', error);
      throw error;
    }
  }

  static async getRates(countryCode: string) {
    const country = await prisma.country.findUnique({
      where: { code: countryCode },
      include: { exchangeRates: true },
    });

    if (!country || country.exchangeRates.length === 0) {
      throw new Error('Exchange rates not found');
    }

    return country.exchangeRates[0];
  }
}
