# 💰 Lipa Number Payment Flow Guide

## How It Works (Simple!)

Your Lipa Number is like a **payment collection number**. Customers pay to it from any mobile money provider, then you manually verify and process the payment.

## 🔄 Complete Flow

### 1. Customer Creates Order

```bash
curl -X POST http://localhost:3000/api/v1/partner/onramp \
  -H "X-API-Key: sk_test_demo_partner_key_12345" \
  -H "Content-Type: application/json" \
  -d '{
    "amount_usdt": 10,
    "destination_address": "0xCustomerWalletAddress",
    "payment_method_id": "lipa-number",
    "user_full_name": "John Doe",
    "user_phone": "255765123456",
    "network": "BEP20",
    "country_code": "TZ"
  }'
```

**Response:**
```json
{
  "success": true,
  "order_number": "ORD-20260220-1234",
  "payment_instructions": {
    "lipa_number": "123456",
    "amount": 25800,
    "currency": "TZS",
    "reference": "ORD-20260220-1234",
    "instructions": [
      "Open your mobile money app (M-Pesa, Tigo Pesa, Airtel Money, or Halopesa)",
      "Select 'Lipa Namba' or 'Pay by Number'",
      "Enter Lipa Number: 123456",
      "Enter Amount: 25800 TZS",
      "Reference: ORD-20260220-1234",
      "Confirm payment"
    ]
  },
  "crypto_amount": 10,
  "crypto_currency": "USDT",
  "network": "BEP20"
}
```

### 2. Customer Makes Payment

Customer pays from their mobile money app:
- **From**: Any provider (M-Pesa, Tigo Pesa, Airtel, Halopesa)
- **To**: Your Lipa Number
- **Amount**: Exact amount shown (25,800 TZS)
- **Reference**: Order number (ORD-20260220-1234)

### 3. You Check Pending Payments

```bash
curl -X GET http://localhost:3000/api/admin/pending-payments \
  -H "Authorization: Bearer your_admin_secret"
```

**Response:**
```json
{
  "success": true,
  "count": 3,
  "pending_payments": [
    {
      "order_number": "ORD-20260220-1234",
      "customer_name": "John Doe",
      "customer_phone": "255765123456",
      "amount_fiat": 25800,
      "currency": "TZS",
      "amount_crypto": 10,
      "crypto_currency": "USDT",
      "destination_address": "0xCustomerWalletAddress",
      "network": "BEP20",
      "payment_method": "lipa-number",
      "created_at": "2026-02-20T12:00:00Z",
      "partner": "Demo Partner"
    }
  ]
}
```

### 4. You Check Your Lipa Number Account

**Manually check your Selcom/Lipa account:**
1. Log into your merchant portal
2. Check recent transactions
3. Look for payment matching:
   - **Amount**: 25,800 TZS
   - **Phone**: 255765123456
   - **Reference**: ORD-20260220-1234 (if provided)

### 5. Confirm Payment & Send USDT

Once you verify the payment was received:

```bash
curl -X POST http://localhost:3000/api/admin/confirm-payment \
  -H "Authorization: Bearer your_admin_secret" \
  -H "Content-Type: application/json" \
  -d '{
    "order_number": "ORD-20260220-1234",
    "payment_reference": "MP123456789",
    "verified_amount": 25800
  }'
```

**This will automatically:**
1. ✅ Update order status to PROCESSING
2. ✅ Send 10 USDT from your hot wallet to customer's address
3. ✅ Update order status to COMPLETED
4. ✅ Notify partner via webhook (if configured)

**Response:**
```json
{
  "success": true,
  "message": "Payment confirmed and crypto sent",
  "order_number": "ORD-20260220-1234",
  "tx_hash": "0xabc123...",
  "amount_sent": 10,
  "currency": "USDT",
  "destination": "0xCustomerWalletAddress"
}
```

## 📋 Setup Checklist

### 1. Configure Environment Variables

```bash
# .env file
LIPA_NUMBER="123456"
BUSINESS_NAME="OnRampa"

# Your USDT hot wallet
HOT_WALLET_PRIVATE_KEY_BEP20="your_private_key"
HOT_WALLET_PRIVATE_KEY_TRC20="your_private_key"
HOT_WALLET_PRIVATE_KEY_BASE="your_private_key"

# Admin access
ADMIN_SECRET="your_secure_admin_password"

# Database (already configured)
DATABASE_URL="postgresql://..."
REDIS_URL="redis://..."
```

### 2. Test the Flow

```bash
# 1. Create test order
curl -X POST http://localhost:3000/api/v1/partner/onramp \
  -H "X-API-Key: sk_test_demo_partner_key_12345" \
  -H "Content-Type: application/json" \
  -d '{
    "amount_usdt": 5,
    "destination_address": "0xYourTestWallet",
    "payment_method_id": "lipa-number",
    "user_full_name": "Test User",
    "user_phone": "255700000000",
    "network": "BEP20",
    "country_code": "TZ"
  }'

# 2. Make real payment to your Lipa Number
# (Use the amount and reference from step 1)

# 3. Check pending payments
curl -X GET http://localhost:3000/api/admin/pending-payments \
  -H "Authorization: Bearer your_admin_secret"

# 4. Confirm payment after verifying in your Lipa account
curl -X POST http://localhost:3000/api/admin/confirm-payment \
  -H "Authorization: Bearer your_admin_secret" \
  -H "Content-Type: application/json" \
  -d '{
    "order_number": "ORD-XXXXX",
    "payment_reference": "MP123456789",
    "verified_amount": 12900
  }'
```

## 🎯 Matching Payments to Orders

**Match by:**
1. **Amount** (must match exactly, ±100 TZS tolerance)
2. **Phone Number** (customer's mobile money number)
3. **Reference** (order number, if customer included it)
4. **Timestamp** (payment time should be after order creation)

**Example Matching:**
```
Order: ORD-20260220-1234
- Expected: 25,800 TZS from 255765123456

Lipa Account Shows:
- Received: 25,800 TZS from 255765123456 at 14:30
- Reference: ORD-20260220-1234
✅ MATCH! Confirm this payment.
```

## 🔒 Security Best Practices

1. **Always verify amount matches** before confirming
2. **Check phone number** matches the order
3. **Keep hot wallet balance low** (refill as needed)
4. **Use strong ADMIN_SECRET**
5. **Monitor for duplicate payments**
6. **Keep transaction logs**

## 📊 Admin Dashboard Integration

You can add a simple admin page to view and confirm payments:

```typescript
// app/admin/payments/page.tsx
'use client';

export default function AdminPayments() {
  const [pending, setPending] = useState([]);
  
  const fetchPending = async () => {
    const res = await fetch('/api/admin/pending-payments', {
      headers: { 'Authorization': 'Bearer ' + adminSecret }
    });
    const data = await res.json();
    setPending(data.pending_payments);
  };
  
  const confirmPayment = async (orderNumber, reference, amount) => {
    await fetch('/api/admin/confirm-payment', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + adminSecret,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        order_number: orderNumber,
        payment_reference: reference,
        verified_amount: amount
      })
    });
    fetchPending(); // Refresh list
  };
  
  return (
    <div>
      <h1>Pending Payments</h1>
      {pending.map(order => (
        <div key={order.order_number}>
          <p>Order: {order.order_number}</p>
          <p>Customer: {order.customer_name} ({order.customer_phone})</p>
          <p>Amount: {order.amount_fiat} {order.currency}</p>
          <p>Will send: {order.amount_crypto} {order.crypto_currency}</p>
          <button onClick={() => confirmPayment(
            order.order_number,
            'MP123456789', // Get from your Lipa account
            order.amount_fiat
          )}>
            Confirm & Send USDT
          </button>
        </div>
      ))}
    </div>
  );
}
```

## 💡 Pro Tips

1. **Check your Lipa account every 5-10 minutes** for new payments
2. **Set up SMS/email notifications** from your Lipa provider
3. **Keep a spreadsheet** of pending orders for tracking
4. **Process payments in batches** to save time
5. **Refund immediately** if amount doesn't match
6. **Communicate with customers** via SMS about payment status

## 🚨 Common Issues

### Payment received but amount is wrong
```bash
# Refund the customer via mobile money
# Mark order as FAILED in database
```

### Customer claims they paid but you don't see it
1. Ask for M-Pesa/Tigo Pesa confirmation SMS
2. Check transaction ID in your Lipa account
3. Verify they sent to correct Lipa Number
4. Check if they used correct amount

### Hot wallet runs out of USDT
1. Transfer more USDT to hot wallet
2. Process pending confirmations
3. Set up low-balance alerts

## 📞 Support

**Your Lipa Number Provider:**
- Check their merchant portal for transactions
- Contact their support for payment issues
- Set up automatic notifications

**Blockchain Issues:**
- Check BSCScan/Tronscan for transaction status
- Verify gas fees are sufficient
- Ensure hot wallet has balance
