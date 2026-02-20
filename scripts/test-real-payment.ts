import { selcomProvider } from '../lib/payment-providers/selcom';

async function testRealPayment() {
  console.log('🧪 Testing Real Payment with Selcom Lipa Number\n');

  const testOrder = {
    orderId: `TEST-${Date.now()}`,
    amount: 10000,
    currency: 'TZS',
    customerPhone: '255765123456',
    customerName: 'Test Customer',
    description: 'Test USDT purchase',
  };

  console.log('📝 Creating payment order...');
  console.log('Order Details:', testOrder);

  const payment = await selcomProvider.createPayment(testOrder);

  if (payment.success) {
    console.log('\n✅ Payment order created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📱 PAYMENT INSTRUCTIONS:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`💰 Amount: ${payment.amount} ${testOrder.currency}`);
    console.log(`📞 Lipa Number: ${payment.lipaNumber}`);
    console.log(`🔖 Reference: ${payment.reference}`);
    console.log(`📋 Order ID: ${payment.transactionId}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n📲 How to pay:');
    console.log('1. Open your mobile money app (M-Pesa, Tigo Pesa, Airtel Money, etc.)');
    console.log('2. Select "Lipa Namba" or "Pay by Number"');
    console.log(`3. Enter Lipa Number: ${payment.lipaNumber}`);
    console.log(`4. Enter Amount: ${payment.amount}`);
    console.log('5. Confirm payment');
    console.log('\n⏳ After payment, verify with:');
    console.log(`   node scripts/verify-payment.ts ${payment.transactionId}\n`);

    return payment.transactionId;
  } else {
    console.log('\n❌ Payment creation failed!');
    console.log('Error:', payment.message);
    return null;
  }
}

async function checkBalance() {
  console.log('\n💰 Checking Selcom wallet balance...');
  const balance = await selcomProvider.checkBalance();
  
  if (balance.success) {
    console.log(`✅ Balance: ${balance.balance} ${balance.currency}`);
  } else {
    console.log('❌ Balance check failed:', balance.message);
  }
}

testRealPayment()
  .then(async (orderId) => {
    if (orderId) {
      await checkBalance();
    }
  })
  .catch(console.error);
