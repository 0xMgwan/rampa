import { selcomProvider } from '../lib/payment-providers/selcom';

async function verifyPayment(orderId: string) {
  console.log(`\n🔍 Verifying payment for Order ID: ${orderId}\n`);

  const verification = await selcomProvider.verifyPayment(orderId);

  if (verification.success) {
    console.log('✅ PAYMENT VERIFIED!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Transaction ID: ${verification.transactionId}`);
    console.log(`Reference: ${verification.reference}`);
    console.log(`Status: PAID`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n🚀 Next: Crypto will be sent automatically via webhook');
  } else {
    console.log('⏳ Payment not yet confirmed');
    console.log(`Status: ${verification.message}`);
    console.log('\n💡 Tip: Wait a few seconds and try again');
  }
}

const orderId = process.argv[2];

if (!orderId) {
  console.log('❌ Usage: node scripts/verify-payment.ts <ORDER_ID>');
  process.exit(1);
}

verifyPayment(orderId).catch(console.error);
