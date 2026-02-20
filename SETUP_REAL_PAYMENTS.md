# 🚀 Setup Guide: Real Money Testing with Selcom Lipa Number

## ✅ What You Have
- ✅ Selcom Lipa Number (for receiving payments)
- ✅ Private key with USDT balance (for sending crypto)
- ✅ Railway PostgreSQL & Redis databases

## 📋 Configuration Steps

### 1. Update Your `.env` File

Add these credentials to your `.env` file:

```bash
# Blockchain - Add your REAL private key
HOT_WALLET_PRIVATE_KEY_BEP20="your_actual_private_key_here"
HOT_WALLET_PRIVATE_KEY_TRC20="your_actual_private_key_here"  # if using Tron
HOT_WALLET_PRIVATE_KEY_BASE="your_actual_private_key_here"   # if using Base

# Selcom Payment Provider
SELCOM_API_KEY="your_selcom_api_key"
SELCOM_API_SECRET="your_selcom_api_secret"
SELCOM_VENDOR_ID="your_vendor_id"
SELCOM_LIPA_NUMBER="your_lipa_number"
SELCOM_BASE_URL="https://apigw.selcommobile.com"

# Already configured
DATABASE_URL="postgresql://postgres:wCHrQegmuUKSTrKXHcsFLNoPmoarrbCQ@nozomi.proxy.rlwy.net:52317/railway"
REDIS_URL="redis://default:eJYrKmdyilnGLAsltwOOAPBcjkEqvacK@tramway.proxy.rlwy.net:56586"
```

### 2. Get Selcom API Credentials

**Where to get them:**
1. Log into your Selcom merchant portal: https://merchant.selcommobile.com
2. Navigate to **Settings** → **API Keys**
3. Copy:
   - API Key
   - API Secret
   - Vendor ID
   - Your Lipa Number

### 3. Install TronWeb Types (Optional)

```bash
npm install --save-dev @types/tronweb
```

Or create a type declaration file:
```bash
echo 'declare module "tronweb";' > types/tronweb.d.ts
```

## 🧪 Testing Real Payments

### Test Flow Overview

```
Customer → Pays via Mobile Money → Selcom Lipa Number
                                         ↓
                                   Webhook Notification
                                         ↓
                              Your System Verifies Payment
                                         ↓
                              USDT Sent to Customer Wallet
```

### Step 1: Create Test Order

```bash
npx tsx scripts/test-real-payment.ts
```

This will output:
```
📱 PAYMENT INSTRUCTIONS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💰 Amount: 10000 TZS
📞 Lipa Number: 123456
🔖 Reference: REF-123
📋 Order ID: TEST-1234567890
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Step 2: Make Real Payment

**From any mobile money provider:**
1. Open M-Pesa, Tigo Pesa, Airtel Money, or Halopesa app
2. Select "Lipa Namba" or "Pay by Number"
3. Enter the Lipa Number shown above
4. Enter the exact amount shown
5. Confirm payment

### Step 3: Verify Payment

```bash
npx tsx scripts/verify-payment.ts TEST-1234567890
```

### Step 4: Check Webhook (Automatic)

Selcom will automatically send a webhook to:
```
POST https://your-domain.com/api/webhooks/selcom
```

The webhook handler will:
1. Verify payment signature
2. Update order status to PROCESSING
3. Send USDT from your hot wallet
4. Update order status to COMPLETED
5. Notify your partner via their webhook URL

## 🔧 API Testing with Real Data

### Create Buy Order (Onramp)

```bash
curl -X POST http://localhost:3000/api/v1/partner/onramp \
  -H "X-API-Key: sk_test_demo_partner_key_12345" \
  -H "Content-Type: application/json" \
  -d '{
    "amount_usdt": 10,
    "destination_address": "0xYourRealWalletAddress",
    "payment_method_id": "selcom-lipa",
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
    "amount_tzs": 25800,
    "reference": "ORD-20260220-1234"
  },
  "crypto_amount": 10,
  "estimated_delivery": "5-10 minutes"
}
```

### Create Sell Order (Offramp)

```bash
curl -X POST http://localhost:3000/api/v1/partner/offramp \
  -H "X-API-Key: sk_test_demo_partner_key_12345" \
  -H "Content-Type: application/json" \
  -d '{
    "amount_usdt": 10,
    "payment_method_id": "selcom-lipa",
    "user_full_name": "John Doe",
    "user_phone": "255765123456",
    "network": "BEP20",
    "country_code": "TZ"
  }'
```

Customer sends USDT to the provided address, then you pay them via mobile money.

## 💰 How Selcom Lipa Number Works

**Advantages:**
- ✅ **One number for all providers** - M-Pesa, Tigo Pesa, Airtel Money, Halopesa
- ✅ **Instant notifications** via webhooks
- ✅ **No individual PSP integrations** needed
- ✅ **Automatic reconciliation**
- ✅ **Lower fees** than individual integrations

**Payment Flow:**
1. Customer pays to your Lipa Number from ANY mobile money provider
2. Selcom receives the payment
3. Selcom sends webhook to your system
4. You verify and process the order
5. Funds settle to your Selcom wallet
6. You withdraw to your bank account

## 🔒 Security Checklist

- [ ] Private keys stored securely in `.env` (never commit to git)
- [ ] `.env` is in `.gitignore`
- [ ] Webhook signature verification enabled
- [ ] HTTPS enabled for production webhooks
- [ ] IP whitelisting configured for API access
- [ ] Rate limiting enabled
- [ ] Hot wallet has limited balance (refill as needed)
- [ ] Monitor transactions in real-time
- [ ] Set up alerts for failed transactions

## 📊 Monitoring

### Check Selcom Balance
```bash
curl -X GET http://localhost:3000/api/admin/selcom/balance \
  -H "Authorization: Bearer your_admin_secret"
```

### View Recent Orders
```bash
curl -X GET http://localhost:3000/api/v1/partner/orders \
  -H "X-API-Key: sk_test_demo_partner_key_12345"
```

### Check Hot Wallet Balance
```bash
# BEP20 (BSC)
curl -X GET "https://api.bscscan.com/api?module=account&action=tokenbalance&contractaddress=0x55d398326f99059fF775485246999027B3197955&address=YOUR_WALLET_ADDRESS&tag=latest&apikey=YourApiKeyToken"
```

## 🚨 Troubleshooting

### Payment Not Detected
1. Check Selcom merchant portal for payment status
2. Verify webhook URL is accessible: `https://your-domain.com/api/webhooks/selcom`
3. Check webhook logs in Selcom dashboard
4. Manually verify payment: `npx tsx scripts/verify-payment.ts ORDER_ID`

### USDT Not Sent
1. Check hot wallet balance
2. Verify private key is correct
3. Check RPC endpoint is working
4. Review transaction logs in database
5. Check gas fees are sufficient

### Webhook Signature Mismatch
1. Verify `SELCOM_API_SECRET` is correct
2. Check webhook payload format
3. Review Selcom documentation for signature algorithm

## 📞 Support

**Selcom Support:**
- Email: support@selcommobile.com
- Phone: +255 22 211 0888
- Portal: https://merchant.selcommobile.com

**Documentation:**
- Selcom API Docs: https://developer.selcommobile.com
- Your API Docs: http://localhost:3000/docs

## 🎯 Next Steps

1. **Test with small amounts first** (1000-5000 TZS)
2. **Monitor first 10 transactions** closely
3. **Set up proper monitoring** and alerts
4. **Configure production webhook URL**
5. **Enable IP whitelisting** for security
6. **Set up automatic hot wallet refills**
7. **Add transaction limits** per partner
8. **Implement fraud detection** rules

## 💡 Pro Tips

- Keep hot wallet balance low, refill regularly
- Use different wallets for different networks
- Set up alerts for low balances
- Monitor exchange rates and update regularly
- Test webhook failures and retries
- Keep detailed logs of all transactions
- Have a manual override process for issues
