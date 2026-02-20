# 📱 SMS-Based Payment Verification Guide

## Overview

Simple SMS-based verification flow:
1. Customer creates order → Gets Lipa Number payment instructions
2. Customer pays to Lipa Number (M-Pesa, Airtel, Tigo, Halopesa)
3. Customer receives SMS with **Transaction ID**
4. Customer submits Transaction ID to verify payment
5. System automatically sends USDT to customer's wallet

**No API credentials needed!** Works with all Tanzania mobile money providers.

## 🔧 Setup

### Update `.env` File

```bash
# Lipa Number
LIPA_NUMBER="your_lipa_number_here"
BUSINESS_NAME="OnRampa"

# Hot Wallet (for sending USDT)
HOT_WALLET_PRIVATE_KEY_BEP20="your_private_key"
HOT_WALLET_PRIVATE_KEY_TRC20="your_private_key"
HOT_WALLET_PRIVATE_KEY_BASE="your_private_key"

# Admin
ADMIN_SECRET="your_secure_password"

# Database (already configured)
DATABASE_URL="postgresql://..."
REDIS_URL="redis://..."
```

## 🎯 Complete Flow

### Step 1: Customer Creates Order

**API Request:**
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
      "Open your mobile money app",
      "Select 'Lipa Namba'",
      "Enter Lipa Number: 123456",
      "Enter Amount: 25,800 TZS",
      "Confirm payment",
      "You will receive an SMS with Transaction ID",
      "Submit the Transaction ID to complete your order"
    ]
  },
  "amount_crypto": 10,
  "crypto_currency": "USDT",
  "network": "BEP20",
  "destination_address": "0xCustomerWalletAddress"
}
```

### Step 2: Customer Makes Payment

Customer pays via any mobile money provider:
- **M-Pesa**: Lipa Namba → Enter 123456 → Amount 25,800
- **Airtel Money**: Pay by Number → Enter 123456 → Amount 25,800
- **Tigo Pesa**: Lipa Namba → Enter 123456 → Amount 25,800
- **Halopesa**: Pay to Number → Enter 123456 → Amount 25,800

### Step 3: Customer Receives SMS

**Example SMS from M-Pesa:**
```
You have paid TZS 25,800.00 to ONRAMPA (123456)
Transaction ID: QH12345678
Date: 20/02/2026 14:30
Balance: TZS 50,000.00
```

**Example SMS from Airtel:**
```
Payment successful
Amount: 25,800 TZS
To: ONRAMPA
Reference: AM987654321
Balance: 50,000 TZS
```

### Step 4: Customer Verifies Payment

#### Option A: Via Your App/Website (Recommended)

Customer enters Transaction ID on your verification page:

```bash
curl -X POST http://localhost:3000/api/v1/public/verify-payment \
  -H "Content-Type: application/json" \
  -d '{
    "order_number": "ORD-20260220-1234",
    "transaction_id": "QH12345678",
    "phone_number": "255765123456"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Payment verified! Your crypto has been sent.",
  "order_number": "ORD-20260220-1234",
  "status": "COMPLETED",
  "amount_sent": "10 USDT",
  "network": "BEP20",
  "tx_hash": "0xabc123...",
  "explorer_url": "https://bscscan.com/tx/0xabc123...",
  "estimated_arrival": "5-10 minutes"
}
```

#### Option B: Via Partner API

Your partner can verify on behalf of customer:

```bash
curl -X POST http://localhost:3000/api/v1/partner/verify-payment \
  -H "X-API-Key: sk_test_demo_partner_key_12345" \
  -H "Content-Type: application/json" \
  -d '{
    "order_number": "ORD-20260220-1234",
    "transaction_id": "QH12345678",
    "customer_phone": "255765123456"
  }'
```

### Step 5: USDT Automatically Sent

System automatically:
1. ✅ Validates transaction ID and phone number
2. ✅ Updates order status to PROCESSING
3. ✅ Sends USDT from hot wallet to customer's address
4. ✅ Updates order status to COMPLETED
5. ✅ Notifies partner via webhook
6. ✅ Returns transaction hash and explorer link

## 🎨 Customer Verification Page Example

Create a simple page for customers to verify:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Verify Your Payment</title>
</head>
<body>
    <h1>Verify Your Payment</h1>
    <form id="verifyForm">
        <label>Order Number:</label>
        <input type="text" id="orderNumber" placeholder="ORD-20260220-1234" required>
        
        <label>Transaction ID (from SMS):</label>
        <input type="text" id="transactionId" placeholder="QH12345678" required>
        
        <label>Your Phone Number:</label>
        <input type="tel" id="phoneNumber" placeholder="255765123456" required>
        
        <button type="submit">Verify Payment</button>
    </form>
    
    <div id="result"></div>
    
    <script>
        document.getElementById('verifyForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const response = await fetch('/api/v1/public/verify-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    order_number: document.getElementById('orderNumber').value,
                    transaction_id: document.getElementById('transactionId').value,
                    phone_number: document.getElementById('phoneNumber').value
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                document.getElementById('result').innerHTML = `
                    <h2>✅ Success!</h2>
                    <p>${data.message}</p>
                    <p><strong>Amount:</strong> ${data.amount_sent}</p>
                    <p><strong>Network:</strong> ${data.network}</p>
                    <p><strong>TX Hash:</strong> <a href="${data.explorer_url}" target="_blank">${data.tx_hash}</a></p>
                `;
            } else {
                document.getElementById('result').innerHTML = `
                    <h2>❌ Error</h2>
                    <p>${data.error || data.message}</p>
                `;
            }
        });
    </script>
</body>
</html>
```

## 📊 Transaction ID Formats

Different providers use different formats:

| Provider | Format | Example |
|----------|--------|---------|
| M-Pesa | 2 letters + 8-10 digits | QH12345678 |
| Airtel Money | AM + 9 digits | AM987654321 |
| Tigo Pesa | TP + 8 digits | TP12345678 |
| Halopesa | HP + 8 digits | HP87654321 |

System accepts any format - just needs to match what customer provides.

## 🔒 Security Features

1. **Phone Number Verification** - Must match order
2. **One-Time Verification** - Transaction ID can only be used once
3. **Order Status Check** - Only PENDING orders can be verified
4. **Automatic Processing** - No manual intervention needed
5. **Audit Trail** - All verifications logged in database

## 🧪 Testing

### Test Flow:

1. **Create test order**
2. **Make real payment** to your Lipa Number
3. **Check SMS** for transaction ID
4. **Submit transaction ID** via API or web form
5. **Receive USDT** in wallet

### Test with Small Amount:

```bash
# 1. Create order for 5 USDT (~12,900 TZS)
curl -X POST http://localhost:3000/api/v1/partner/onramp \
  -H "X-API-Key: sk_test_demo_partner_key_12345" \
  -H "Content-Type: application/json" \
  -d '{
    "amount_usdt": 5,
    "destination_address": "0xYourTestWallet",
    "payment_method_id": "lipa-number",
    "user_full_name": "Test User",
    "user_phone": "255765123456",
    "network": "BEP20",
    "country_code": "TZ"
  }'

# 2. Pay 12,900 TZS to Lipa Number

# 3. Get Transaction ID from SMS

# 4. Verify payment
curl -X POST http://localhost:3000/api/v1/public/verify-payment \
  -H "Content-Type: application/json" \
  -d '{
    "order_number": "ORD-XXXXX",
    "transaction_id": "QH12345678",
    "phone_number": "255765123456"
  }'
```

## 🚨 Error Handling

### Common Errors:

**Order not found:**
```json
{
  "error": "Order not found"
}
```
→ Check order number is correct

**Phone number mismatch:**
```json
{
  "error": "Phone number does not match the order"
}
```
→ Use the same phone number from order creation

**Already completed:**
```json
{
  "success": true,
  "message": "Your payment has already been processed",
  "tx_hash": "0xabc..."
}
```
→ Payment already processed, check blockchain

**Failed to send crypto:**
```json
{
  "success": false,
  "error": "Failed to send crypto. Please contact support."
}
```
→ Check hot wallet balance, contact support

## 💡 Best Practices

1. **Clear Instructions** - Tell customers to save Transaction ID from SMS
2. **Verification Page** - Provide easy-to-use web form for verification
3. **SMS Template** - Include verification link in payment instructions
4. **Support Contact** - Provide support for failed verifications
5. **Monitor Hot Wallet** - Keep USDT balance topped up
6. **Test Regularly** - Test with small amounts weekly

## 📱 SMS Integration (Optional)

You can send SMS to customers with verification link:

```
Thank you for your payment!
Order: ORD-20260220-1234
Amount: 10 USDT

To complete your order, verify your payment here:
https://yoursite.com/verify?order=ORD-20260220-1234

Enter your Transaction ID from the payment SMS.
```

## 🎉 Advantages

- ✅ **Simple** - No complex API integrations
- ✅ **Universal** - Works with ALL mobile money providers
- ✅ **Fast** - Instant verification when customer submits
- ✅ **Secure** - Phone number validation
- ✅ **Automated** - USDT sent automatically
- ✅ **Reliable** - No dependency on email or external APIs

## 📞 Support

**For Customers:**
- Provide clear verification instructions
- Offer support contact for issues
- Show transaction status page

**For Partners:**
- API documentation at `/docs`
- Webhook notifications for order status
- Admin dashboard for monitoring
