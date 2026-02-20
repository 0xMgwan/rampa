import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create Tanzania
  const tanzania = await prisma.country.upsert({
    where: { code: 'TZ' },
    update: {},
    create: {
      code: 'TZ',
      name: 'Tanzania',
      currencyCode: 'TZS',
      currencySymbol: 'TSh',
      currencyDecimals: 0,
      status: 'ACTIVE',
      supportedNetworks: ['BEP20', 'TRC20', 'BASE'],
      regulations: {
        kycRequired: false,
        dailyLimit: 5000000,
        monthlyLimit: 50000000,
      },
    },
  });

  // Create Kenya
  const kenya = await prisma.country.upsert({
    where: { code: 'KE' },
    update: {},
    create: {
      code: 'KE',
      name: 'Kenya',
      currencyCode: 'KES',
      currencySymbol: 'KSh',
      currencyDecimals: 2,
      status: 'ACTIVE',
      supportedNetworks: ['BEP20', 'TRC20', 'BASE'],
      regulations: {
        kycRequired: false,
        dailyLimit: 500000,
        monthlyLimit: 5000000,
      },
    },
  });

  // Create Uganda
  const uganda = await prisma.country.upsert({
    where: { code: 'UG' },
    update: {},
    create: {
      code: 'UG',
      name: 'Uganda',
      currencyCode: 'UGX',
      currencySymbol: 'USh',
      currencyDecimals: 0,
      status: 'ACTIVE',
      supportedNetworks: ['BEP20', 'TRC20', 'BASE'],
      regulations: {
        kycRequired: false,
        dailyLimit: 20000000,
        monthlyLimit: 200000000,
      },
    },
  });

  console.log('✅ Countries created');

  // Create Payment Providers for Tanzania
  
  // Unified Lipa Number (works with all providers)
  const lipaNumber = process.env.LIPA_NUMBER || '70005436';
  const businessName = process.env.BUSINESS_NAME || 'Victor Amos Muhagachi';
  
  await prisma.paymentProvider.upsert({
    where: { id: 'lipa-number' },
    update: {},
    create: {
      id: 'lipa-number',
      countryId: tanzania.id,
      providerName: 'Lipa Number (All Providers)',
      providerType: 'MOBILE_MONEY',
      accountNumber: lipaNumber,
      accountName: businessName,
      instructions: `Pay to Lipa Number ${lipaNumber} using M-Pesa, Airtel Money, Tigo Pesa, or Halopesa. You will receive an SMS with Transaction ID after payment.`,
      status: 'ACTIVE',
      feesPercentage: 0,
      phoneFormat: '^0[67]\\d{8}$',
      limits: {
        min: 1000,
        max: 10000000,
      },
    },
  });

  await prisma.paymentProvider.upsert({
    where: { id: 'mpesa-tz' },
    update: {},
    create: {
      id: 'mpesa-tz',
      countryId: tanzania.id,
      providerName: 'M-Pesa Tanzania',
      providerType: 'MOBILE_MONEY',
      accountNumber: '1234567',
      accountName: 'ONRAMPA LTD',
      instructions: 'Dial *150*00#, Select Lipa Kwa M-Pesa, Enter Till Number',
      status: 'ACTIVE',
      feesPercentage: 0,
      phoneFormat: '^0[67]\\d{8}$',
      limits: {
        min: 1000,
        max: 10000000,
      },
    },
  });

  await prisma.paymentProvider.upsert({
    where: { id: 'tigopesa-tz' },
    update: {},
    create: {
      id: 'tigopesa-tz',
      countryId: tanzania.id,
      providerName: 'Tigo Pesa',
      providerType: 'MOBILE_MONEY',
      accountNumber: '123456',
      accountName: 'ONRAMPA LTD',
      instructions: 'Dial *150*01#, Select Lipa Kwa Tigo Pesa, Enter Agent Number',
      status: 'ACTIVE',
      feesPercentage: 0,
      phoneFormat: '^0[67]\\d{8}$',
      limits: {
        min: 1000,
        max: 5000000,
      },
    },
  });

  await prisma.paymentProvider.upsert({
    where: { id: 'airtel-tz' },
    update: {},
    create: {
      id: 'airtel-tz',
      countryId: tanzania.id,
      providerName: 'Airtel Money',
      providerType: 'MOBILE_MONEY',
      accountNumber: '12345678',
      accountName: 'ONRAMPA LTD',
      instructions: 'Dial *150*60#, Select Lipa Kwa Airtel Money, Enter Agent Code',
      status: 'ACTIVE',
      feesPercentage: 0,
      phoneFormat: '^0[67]\\d{8}$',
      limits: {
        min: 1000,
        max: 5000000,
      },
    },
  });

  await prisma.paymentProvider.upsert({
    where: { id: 'halopesa-tz' },
    update: {},
    create: {
      id: 'halopesa-tz',
      countryId: tanzania.id,
      providerName: 'Halo Pesa',
      providerType: 'MOBILE_MONEY',
      accountNumber: '123456',
      accountName: 'ONRAMPA LTD',
      instructions: 'Dial *150*88#, Select Lipa Kwa Halo Pesa, Enter Agent Number',
      status: 'ACTIVE',
      feesPercentage: 0,
      phoneFormat: '^0[67]\\d{8}$',
      limits: {
        min: 1000,
        max: 3000000,
      },
    },
  });

  // Create Payment Providers for Kenya
  await prisma.paymentProvider.upsert({
    where: { id: 'mpesa-ke' },
    update: {},
    create: {
      id: 'mpesa-ke',
      countryId: kenya.id,
      providerName: 'M-Pesa Kenya',
      providerType: 'MOBILE_MONEY',
      accountNumber: '123456',
      accountName: 'ONRAMPA LTD',
      instructions: 'Dial *334#, Select Lipa Kwa M-Pesa, Enter Paybill Number',
      status: 'ACTIVE',
      feesPercentage: 0,
      phoneFormat: '^0[17]\\d{8}$',
      limits: {
        min: 100,
        max: 500000,
      },
    },
  });

  console.log('✅ Payment providers created');

  // Create Exchange Rates
  await prisma.exchangeRate.upsert({
    where: { 
      countryId_currencyCode: {
        countryId: tanzania.id,
        currencyCode: 'TZS',
      },
    },
    update: {},
    create: {
      countryId: tanzania.id,
      currencyCode: 'TZS',
      usdcBuyRate: 2580,
      usdcSellRate: 2520,
      usdtBuyRate: 2580,
      usdtSellRate: 2520,
      source: 'MANUAL',
    },
  });

  await prisma.exchangeRate.upsert({
    where: { 
      countryId_currencyCode: {
        countryId: kenya.id,
        currencyCode: 'KES',
      },
    },
    update: {},
    create: {
      countryId: kenya.id,
      currencyCode: 'KES',
      usdcBuyRate: 130,
      usdcSellRate: 127,
      usdtBuyRate: 130,
      usdtSellRate: 127,
      source: 'MANUAL',
    },
  });

  await prisma.exchangeRate.upsert({
    where: { 
      countryId_currencyCode: {
        countryId: uganda.id,
        currencyCode: 'UGX',
      },
    },
    update: {},
    create: {
      countryId: uganda.id,
      currencyCode: 'UGX',
      usdcBuyRate: 3750,
      usdcSellRate: 3650,
      usdtBuyRate: 3750,
      usdtSellRate: 3650,
      source: 'MANUAL',
    },
  });

  console.log('✅ Exchange rates created');

  // Create demo partner
  const apiKey = 'sk_test_demo_partner_key_12345';
  const apiKeyHash = await bcrypt.hash(apiKey, 10);

  await prisma.partner.upsert({
    where: { email: 'demo@partner.com' },
    update: {},
    create: {
      name: 'Demo Partner',
      email: 'demo@partner.com',
      apiKeyHash,
      webhookUrl: 'https://demo.partner.com/webhook',
      webhookSecret: 'whsec_demo_secret_12345',
      ipWhitelist: [],
      allowedCountries: ['TZ', 'KE', 'UG'],
      status: 'ACTIVE',
      rateLimit: 100,
    },
  });

  console.log('✅ Demo partner created');
  console.log('\n📝 Demo API Key:', apiKey);
  console.log('   Use this key in X-API-Key header for testing\n');

  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
