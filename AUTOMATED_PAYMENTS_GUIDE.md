# 🤖 Automated Payment Verification Guide

## Overview

Your system now **automatically checks Selcom** for payments and processes them without manual intervention!

## 🔄 How It Works

### Automated Flow:
```
1. Customer creates order → Gets Lipa Number payment instructions
2. Customer pays to Lipa Number
3. System automatically checks Selcom API every few minutes
4. Finds matching payment (by amount + phone number)
5. Automatically sends USDT to customer wallet
6. Notifies partner via webhook
```

## 📋 Setup

### 1. Get Selcom API Credentials

Log into your Selcom merchant portal and get:
- **API Key**
- **API Secret**
- **Vendor ID**
- **Lipa Number**

### 2. Update `.env` File

```bash
# Selcom API (for automated verification)
SELCOM_API_KEY="your_actual_api_key"
SELCOM_API_SECRET="your_actual_api_secret"
SELCOM_VENDOR_ID="your_vendor_id"
SELCOM_BASE_URL="https://apigw.selcommobile.com"
LIPA_NUMBER="your_lipa_number"

# Your USDT hot wallet
HOT_WALLET_PRIVATE_KEY_BEP20="your_private_key"
HOT_WALLET_PRIVATE_KEY_TRC20="your_private_key"
HOT_WALLET_PRIVATE_KEY_BASE="your_private_key"

# Admin access
ADMIN_SECRET="your_secure_password"

# Database (already configured)
DATABASE_URL="postgresql://..."
REDIS_URL="redis://..."
```

### 3. Set Up Automated Checking

#### Option A: Cron Job (Recommended)

Add to your crontab to run every 2 minutes:
```bash
# Edit crontab
crontab -e

# Add this line (runs every 2 minutes)
*/2 * * * * cd /path/to/onrampa && npx tsx scripts/auto-verify-cron.ts >> /var/log/onrampa-verify.log 2>&1
```

#### Option B: Manual Trigger

Run manually anytime:
```bash
npx tsx scripts/auto-verify-cron.ts
```

#### Option C: API Call

Call from your own scheduler:
```bash
curl -X POST http://localhost:3000/api/admin/auto-verify-payments \
  -H "Authorization: Bearer your_admin_secret"
```

## 🧪 Testing

### 1. Create Test Order

```bash
curl -X POST http://localhost:3000/api/v1/partner/onramp \
  -H "X-API-Key: sk_test_demo_partner_key_12345" \
  -H "Content-Type: application/json" \
  -d '{
    "amount_usdt": 10,
    "destination_address": "0xYourWalletAddress",
    "payment_method_id": "lipa-number",
    "user_full_name": "Test User",
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
    "reference": "ORD-20260220-1234"
  }
}
```

### 2. Make Real Payment

Pay **25,800 TZS** to Lipa Number **123456** from **255765123456**

### 3. Wait for Auto-Verification

The system will automatically:
- Check Selcom API (every 2 minutes if cron is set up)
- Find your payment
- Send USDT to your wallet
- Update order status to COMPLETED

### 4. Check Status

```bash
curl -X GET http://localhost:3000/api/v1/partner/orders/ORD-20260220-1234 \
  -H "X-API-Key: sk_test_demo_partner_key_12345"
```

## 🎯 Payment Matching Logic

The system matches payments by:

1. **Amount** - Must match within ±100 TZS tolerance
2. **Phone Number** - Customer's mobile money number
3. **Reference** - Order number (if customer included it)
4. **Status** - Payment must be COMPLETED/SUCCESS
5. **Timestamp** - Payment must be after order creation

**Example:**
```
Order Created:
- Order: ORD-20260220-1234
- Expected: 25,800 TZS
- Phone: 255765123456

Selcom Transaction Found:
- Amount: 25,800 TZS
- From: 255765123456
- Status: COMPLETED
- Time: After order creation
✅ MATCH! Auto-process.
```

## 📊 Monitoring

### Check Auto-Verification Results

```bash
curl -X POST http://localhost:3000/api/admin/auto-verify-payments \
  -H "Authorization: Bearer your_admin_secret"
```

**Response:**
```json
{
  "success": true,
  "summary": {
    "total_checked": 5,
    "payments_verified": 2,
    "orders_processed": 2,
    "failures": 0
  },
  "details": [
    {
      "order_number": "ORD-20260220-1234",
      "status": "processed",
      "tx_hash": "0xabc123...",
      "amount": 10
    },
    {
      "order_number": "ORD-20260220-1235",
      "status": "pending",
      "message": "No matching payment found"
    }
  ]
}
```

### View Pending Orders

```bash
curl -X GET http://localhost:3000/api/admin/pending-payments \
  -H "Authorization: Bearer your_admin_secret"
```

### Check Selcom Balance

```bash
curl -X GET http://localhost:3000/api/admin/selcom/balance \
  -H "Authorization: Bearer your_admin_secret"
```

## 🔧 Advanced Configuration

### Adjust Verification Frequency

**More Frequent (Every 1 minute):**
```bash
*/1 * * * * cd /path/to/onrampa && npx tsx scripts/auto-verify-cron.ts
```

**Less Frequent (Every 5 minutes):**
```bash
*/5 * * * * cd /path/to/onrampa && npx tsx scripts/auto-verify-cron.ts
```

### Custom Verification Window

Edit `app/api/admin/auto-verify-payments/route.ts`:
```typescript
createdAt: {
  gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
}
```

Change to check last 1 hour:
```typescript
createdAt: {
  gte: new Date(Date.now() - 60 * 60 * 1000), // Last 1 hour
}
```

## 🚨 Troubleshooting

### Payments Not Being Verified

1. **Check Selcom API credentials**
   ```bash
   # Test API connection
   curl -X GET https://apigw.selcommobile.com/v1/wallet/balance \
     -H "Authorization: SELCOM your_api_key"
   ```

2. **Check cron is running**
   ```bash
   # View cron logs
   tail -f /var/log/onrampa-verify.log
   ```

3. **Manually trigger verification**
   ```bash
   npx tsx scripts/auto-verify-cron.ts
   ```

4. **Check order status**
   ```bash
   curl -X GET http://localhost:3000/api/admin/pending-payments \
     -H "Authorization: Bearer your_admin_secret"
   ```

### USDT Not Sending

1. **Check hot wallet balance**
2. **Verify private key is correct**
3. **Check RPC endpoints are working**
4. **Review error logs in database**

### Amount Mismatch

The system allows ±100 TZS tolerance. If customer paid wrong amount:
- Order stays PENDING
- Won't auto-process
- Manually refund customer or adjust

## 💡 Best Practices

1. **Monitor cron logs** regularly
2. **Set up alerts** for failed verifications
3. **Keep hot wallet topped up** with USDT
4. **Check Selcom balance** daily
5. **Review failed orders** weekly
6. **Test with small amounts** first
7. **Set up backup verification** (manual check once daily)

## 🔒 Security

- ✅ API credentials stored in `.env` (never committed)
- ✅ Admin endpoints require authentication
- ✅ Payment matching prevents fraud
- ✅ Hot wallet has limited balance
- ✅ All transactions logged in database
- ✅ Webhook signatures verified

## 📈 Scaling

For high volume:
1. **Increase cron frequency** to every 30 seconds
2. **Use Redis queue** for processing
3. **Add multiple hot wallets** for different networks
4. **Set up monitoring** with alerts
5. **Auto-refill hot wallets** from cold storage
6. **Implement rate limiting** per partner

## 🎉 Benefits

- ✅ **Fully automated** - No manual checking needed
- ✅ **Fast processing** - Orders completed in 2-5 minutes
- ✅ **Accurate matching** - Multiple verification criteria
- ✅ **Scalable** - Handles high volume
- ✅ **Reliable** - Automatic retries and error handling
- ✅ **Transparent** - Full audit trail in database

## 📞 Support

**Selcom API Issues:**
- Documentation: https://developer.selcommobile.com
- Support: support@selcommobile.com

**System Issues:**
- Check logs: `/var/log/onrampa-verify.log`
- Review database: Check `orders` table
- Test manually: Run verification script
