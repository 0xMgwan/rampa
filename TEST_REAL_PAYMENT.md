# 🧪 Testing Real Payments with Your Selcom Lipa Number

## ✅ What You Have
- Selcom Lipa Number
- USDT in hot wallet with private key
- Database seeded and ready
- Demo API Key: `sk_test_demo_partner_key_12345`

## 🚀 Step-by-Step Test

### Step 1: Create Test Order (Small Amount)

```bash
curl -X POST http://localhost:3000/api/v1/partner/onramp \
  -H "X-API-Key: sk_test_demo_partner_key_12345" \
  -H "Content-Type: application/json" \
  -d '{
    "amount_usdt": 5,
    "destination_address": "0xYourTestWalletAddress",
    "payment_method_id": "lipa-number",
    "user_full_name": "Test User",
    "user_phone": "255765123456",
    "network": "BEP20",
    "country_code": "TZ"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "order_number": "ORD-20260220-XXXX",
  "payment_instructions": {
    "lipa_number": "YOUR_SELCOM_LIPA_NUMBER",
    "amount": 12900,
    "currency": "TZS",
    "reference": "ORD-20260220-XXXX",
    "instructions": [
      "Open your mobile money app",
      "Select 'Lipa Namba'",
      "Enter Lipa Number: YOUR_SELCOM_LIPA_NUMBER",
      "Enter Amount: 12,900 TZS",
      "Confirm payment",
      "You will receive an SMS with Transaction ID",
      "Submit the Transaction ID to complete your order"
    ]
  },
  "amount_crypto": 5,
  "crypto_currency": "USDT",
  "network": "BEP20"
}
```

### Step 2: Make Real Payment

1. **Open M-Pesa/Airtel/Tigo/Halopesa app**
2. **Select "Lipa Namba" or "Pay by Number"**
3. **Enter your Selcom Lipa Number**
4. **Enter amount: 12,900 TZS** (or amount from response)
5. **Confirm payment**

### Step 3: Check SMS

You'll receive SMS like:
```
You have paid TZS 12,900.00 to ONRAMPA
Transaction ID: QH12345678
Date: 20/02/2026 15:30
Balance: TZS 50,000.00
```

**Save the Transaction ID!**

### Step 4: Verify Payment

```bash
curl -X POST http://localhost:3000/api/v1/public/verify-payment \
  -H "Content-Type: application/json" \
  -d '{
    "order_number": "ORD-20260220-XXXX",
    "transaction_id": "QH12345678",
    "phone_number": "255765123456"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Payment verified! Your crypto has been sent.",
  "order_number": "ORD-20260220-XXXX",
  "status": "COMPLETED",
  "amount_sent": "5 USDT",
  "network": "BEP20",
  "tx_hash": "0xabc123...",
  "explorer_url": "https://bscscan.com/tx/0xabc123...",
  "estimated_arrival": "5-10 minutes"
}
```

### Step 5: Check Blockchain

1. **Copy the `tx_hash` from response**
2. **Open BSCScan**: https://bscscan.com/tx/0xabc123...
3. **Verify transaction** shows:
   - From: Your hot wallet address
   - To: Customer's wallet address
   - Amount: 5 USDT
   - Status: Success

### Step 6: Check Customer Wallet

1. **Open customer wallet** (MetaMask, Trust Wallet, etc.)
2. **Check USDT balance** on BSC network
3. **Should see +5 USDT** within 5-10 minutes

## 🔍 Checking Order Status

```bash
curl -X GET http://localhost:3000/api/v1/partner/orders/ORD-20260220-XXXX \
  -H "X-API-Key: sk_test_demo_partner_key_12345"
```

**Response:**
```json
{
  "success": true,
  "order": {
    "order_number": "ORD-20260220-XXXX",
    "status": "COMPLETED",
    "amount_crypto": 5,
    "crypto_currency": "USDT",
    "network": "BEP20",
    "tx_hash": "0xabc123...",
    "created_at": "2026-02-20T15:30:00Z",
    "completed_at": "2026-02-20T15:35:00Z"
  }
}
```

## 📊 View Pending Payments (Admin)

```bash
curl -X GET http://localhost:3000/api/admin/pending-payments \
  -H "Authorization: Bearer your_admin_secret"
```

## 🎯 Testing Checklist

- [ ] Server running on http://localhost:3000
- [ ] Created test order via API
- [ ] Paid to Selcom Lipa Number via mobile money
- [ ] Received SMS with Transaction ID
- [ ] Verified payment via API
- [ ] USDT sent to customer wallet
- [ ] Transaction visible on BSCScan
- [ ] Customer received USDT in wallet

## 🚨 Troubleshooting

### Order Creation Fails
```bash
# Check if server is running
curl http://localhost:3000/api/health

# Check database connection
npx prisma db pull
```

### Payment Verification Fails

**Error: "Phone number does not match"**
- Use exact phone number from order creation
- Format: 255XXXXXXXXX (no spaces, dashes, or +)

**Error: "Order not found"**
- Check order number is correct
- Verify order was created successfully

**Error: "Failed to send crypto"**
- Check hot wallet has USDT balance
- Verify private key is correct
- Check RPC endpoint is working

### USDT Not Received

1. **Check transaction hash** on BSCScan
2. **Verify network** is correct (BEP20 = BSC)
3. **Check customer wallet** is on BSC network
4. **Wait 5-10 minutes** for confirmation

## 💡 Tips for Testing

1. **Start small**: Test with 5-10 USDT first
2. **Use test wallet**: Don't use your main wallet as destination
3. **Check balance**: Ensure hot wallet has enough USDT
4. **Save transaction IDs**: Keep record of all test transactions
5. **Monitor logs**: Watch server logs for errors
6. **Test different providers**: Try M-Pesa, Airtel, Tigo

## 📱 Quick Test Commands

**1. Create Order:**
```bash
curl -X POST http://localhost:3000/api/v1/partner/onramp \
  -H "X-API-Key: sk_test_demo_partner_key_12345" \
  -H "Content-Type: application/json" \
  -d '{"amount_usdt":5,"destination_address":"0xYourWallet","payment_method_id":"lipa-number","user_full_name":"Test","user_phone":"255765123456","network":"BEP20","country_code":"TZ"}'
```

**2. Verify Payment:**
```bash
curl -X POST http://localhost:3000/api/v1/public/verify-payment \
  -H "Content-Type: application/json" \
  -d '{"order_number":"ORD-XXXXX","transaction_id":"QH12345678","phone_number":"255765123456"}'
```

**3. Check Status:**
```bash
curl http://localhost:3000/api/v1/partner/orders/ORD-XXXXX \
  -H "X-API-Key: sk_test_demo_partner_key_12345"
```

## 🎉 Success Indicators

✅ Order created with status PENDING
✅ Payment instructions show your Lipa Number
✅ Mobile money payment successful
✅ SMS received with Transaction ID
✅ Verification returns success with tx_hash
✅ Order status changed to COMPLETED
✅ Transaction visible on BSCScan
✅ USDT received in customer wallet

## 📞 Next Steps After Successful Test

1. ✅ Test with different amounts (10, 20, 50 USDT)
2. ✅ Test with different mobile money providers
3. ✅ Test with different blockchain networks (TRC20, Base)
4. ✅ Create customer verification page
5. ✅ Set up monitoring for hot wallet balance
6. ✅ Configure production webhook URLs
7. ✅ Add more partners via admin dashboard
