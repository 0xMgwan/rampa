#!/usr/bin/env node

const ADMIN_SECRET = process.env.ADMIN_SECRET;
const API_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

async function runAutoVerification() {
  console.log(`[${new Date().toISOString()}] Running auto-verification...`);

  try {
    const response = await fetch(`${API_URL}/api/admin/auto-verify-payments`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ADMIN_SECRET}`,
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (result.success) {
      console.log('✅ Auto-verification completed:');
      console.log(`   - Checked: ${result.summary.total_checked} orders`);
      console.log(`   - Verified: ${result.summary.payments_verified} payments`);
      console.log(`   - Processed: ${result.summary.orders_processed} orders`);
      console.log(`   - Failed: ${result.summary.failures} orders`);

      if (result.details.length > 0) {
        console.log('\nDetails:');
        result.details.forEach((detail: any) => {
          console.log(`   ${detail.order_number}: ${detail.status}`);
          if (detail.tx_hash) {
            console.log(`      TX: ${detail.tx_hash}`);
          }
          if (detail.error) {
            console.log(`      Error: ${detail.error}`);
          }
        });
      }
    } else {
      console.error('❌ Auto-verification failed:', result.error);
    }
  } catch (error: any) {
    console.error('❌ Error running auto-verification:', error.message);
  }
}

runAutoVerification();
