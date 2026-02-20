# 🚀 Complete OnRampa Setup Guide

## Overview

OnRampa is a crypto onramp/offramp API that allows customers in Tanzania to:
- **Buy USDT/USDC** by paying with mobile money (M-Pesa, Airtel, Tigo, Halopesa)
- **Sell USDT/USDC** to receive mobile money payments

## 🏗️ System Architecture

```
┌─────────────┐
│   Partner   │ (Your business/app)
│   API Call  │
└──────┬──────┘
       │
       ↓
┌─────────────────────────────────────┐
│        OnRampa API Server           │
│  ┌──────────────────────────────┐   │
│  │  Order Management            │   │
│  │  - Create orders             │   │
│  │  - Track status              │   │
│  │  - Payment verification      │   │
│  └──────────────────────────────┘   │
│                                      │
│  ┌──────────────────────────────┐   │
│  │  Payment Processing          │   │
│  │  - Lipa Number integration   │   │
│  │  - SMS verification          │   │
│  │  - Transaction ID matching   │   │
│  └──────────────────────────────┘   │
│                                      │
│  ┌──────────────────────────────┐   │
│  │  Blockchain Integration      │   │
│  │  - Send USDT (BEP20/TRC20)   │   │
│  │  - Monitor transactions      │   │
│  │  - Generate addresses        │   │
│  └──────────────────────────────┘   │
└─────────────────────────────────────┘
       │                    │
       ↓                    ↓
┌─────────────┐      ┌─────────────┐
│  PostgreSQL │      │   Blockchain│
│  Database   │      │  (BSC/Tron) │
└─────────────┘      └─────────────┘
```

## 📋 Prerequisites

1. **Railway Account** (for PostgreSQL & Redis)
2. **Lipa Number** (from Selcom or similar provider)
3. **USDT Wallet** with private key (MetaMask, Trust Wallet, etc.)
4. **Node.js 18+** installed
5. **Git** installed

## 🔧 Step-by-Step Setup

### Step 1: Clone & Install

```bash
cd /Users/macbookpro/Desktop/onrampa
npm install
```

### Step 2: Configure Environment Variables

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Edit `.env` with your actual values:

#### **Database (Already Configured)**
```bash
DATABASE_URL="postgresql://postgres:wCHrQegmuUKSTrKXHcsFLNoPmoarrbCQ@nozomi.proxy.rlwy.net:52317/railway"
REDIS_URL="redis://default:eJYrKmdyilnGLAsltwOOAPBcjkEqvacK@tramway.proxy.rlwy.net:56586"
```

#### **Blockchain Wallets (REQUIRED)**
```bash
# Get your private key from MetaMask:
# MetaMask → Account Details → Export Private Key
HOT_WALLET_PRIVATE_KEY_BEP20="0x1234567890abcdef..."
HOT_WALLET_PRIVATE_KEY_TRC20="0x1234567890abcdef..."
HOT_WALLET_PRIVATE_KEY_BASE="0x1234567890abcdef..."
```

⚠️ **IMPORTANT**: 
- Use a dedicated wallet for this (not your main wallet)
- Keep balance low (refill as needed)
- Never share private keys
- Never commit `.env` to git

#### **Lipa Number (REQUIRED)**
```bash
LIPA_NUMBER="123456"  # Your actual Lipa Number
BUSINESS_NAME="OnRampa"
```

#### **Admin Security (REQUIRED)**
```bash
# Generate strong random passwords
ADMIN_SECRET="your_secure_admin_password_here"
WEBHOOK_SIGNING_SECRET="your_secure_webhook_secret_here"
```

Generate secure passwords:
```bash
# On Mac/Linux:
openssl rand -base64 32
```

#### **App Configuration**
```bash
NODE_ENV="production"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Step 3: Initialize Database

```bash
# Push Prisma schema to database
npx prisma db push

# Seed initial data (countries, payment providers, demo partner)
npx tsx prisma/seed.ts
```

This creates:
- ✅ Tanzania country with TZS currency
- ✅ Lipa Number payment provider
- ✅ Exchange rates (USDT/USDC)
- ✅ Demo partner with API key: `sk_test_demo_partner_key_12345`

### Step 4: Start the Server

```bash
npm run dev
```

Server runs on: **http://localhost:3000**

### Step 5: Test the System

#### **Test 1: Create Order**

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
    "currency": "TZS"
  }
}
```

#### **Test 2: Make Real Payment**

Pay **25,800 TZS** to Lipa Number **123456** from **255765123456**

You'll receive SMS like:
```
Transaction ID: QH12345678
Amount: 25,800 TZS
To: ONRAMPA
```

#### **Test 3: Verify Payment**

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
  "tx_hash": "0xabc123...",
  "explorer_url": "https://bscscan.com/tx/0xabc123..."
}
```

## 🎯 How Payments Work

### **Buy Flow (Onramp)**

1. **Partner creates order** via API
2. **Customer receives** payment instructions (Lipa Number + Amount)
3. **Customer pays** via M-Pesa/Airtel/Tigo/Halopesa
4. **Customer gets SMS** with Transaction ID
5. **Customer verifies** by submitting Transaction ID
6. **System sends USDT** automatically to customer's wallet

### **Sell Flow (Offramp)**

1. **Partner creates sell order** via API
2. **Customer sends USDT** to provided address
3. **System detects** blockchain transaction
4. **Admin confirms** and pays customer via mobile money

## 📊 Key Endpoints

### **For Partners (Require API Key)**

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/v1/partner/rates` | GET | Get exchange rates |
| `/api/v1/partner/payment-methods` | GET | Get available payment methods |
| `/api/v1/partner/onramp` | POST | Create buy order |
| `/api/v1/partner/offramp` | POST | Create sell order |
| `/api/v1/partner/orders/:id` | GET | Get order status |
| `/api/v1/partner/verify-payment` | POST | Verify payment (partner) |

### **For Customers (Public)**

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/v1/public/verify-payment` | POST | Verify payment (customer) |

### **For Admins (Require Admin Secret)**

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/admin/pending-payments` | GET | View pending orders |
| `/api/admin/confirm-payment` | POST | Manually confirm payment |

## 🔐 Security Features

1. **API Key Authentication** - Partners need valid API keys
2. **Phone Number Verification** - Matches order to payment
3. **Transaction ID Validation** - Prevents duplicate processing
4. **Rate Limiting** - Prevents abuse
5. **Webhook Signatures** - Secure partner notifications
6. **Hot Wallet Isolation** - Limited balance, separate from main funds

## 💰 Managing Your Hot Wallet

### **Check Balance**

```bash
# BEP20 (BSC)
curl "https://api.bscscan.com/api?module=account&action=tokenbalance&contractaddress=0x55d398326f99059fF775485246999027B3197955&address=YOUR_WALLET_ADDRESS&tag=latest&apikey=YourApiKeyToken"
```

### **Refill When Low**

1. Transfer USDT from your main wallet to hot wallet
2. Keep balance around $500-$1000 for operations
3. Set up alerts for low balance

### **Best Practices**

- ✅ Use dedicated wallet (not your main wallet)
- ✅ Keep limited balance (refill regularly)
- ✅ Monitor transactions daily
- ✅ Set up withdrawal limits
- ✅ Enable 2FA on wallet

## 📱 Customer Verification Page

Create a simple HTML page for customers:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Verify Payment - OnRampa</title>
    <style>
        body { font-family: Arial; max-width: 500px; margin: 50px auto; padding: 20px; }
        input { width: 100%; padding: 10px; margin: 10px 0; }
        button { width: 100%; padding: 15px; background: #0070f3; color: white; border: none; cursor: pointer; }
        .result { margin-top: 20px; padding: 15px; border-radius: 5px; }
        .success { background: #d4edda; color: #155724; }
        .error { background: #f8d7da; color: #721c24; }
    </style>
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
            
            const resultDiv = document.getElementById('result');
            resultDiv.innerHTML = 'Processing...';
            
            try {
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
                    resultDiv.className = 'result success';
                    resultDiv.innerHTML = `
                        <h2>✅ Success!</h2>
                        <p>${data.message}</p>
                        <p><strong>Amount:</strong> ${data.amount_sent}</p>
                        <p><strong>Network:</strong> ${data.network}</p>
                        <p><strong>Transaction:</strong> <a href="${data.explorer_url}" target="_blank">View on Explorer</a></p>
                    `;
                } else {
                    resultDiv.className = 'result error';
                    resultDiv.innerHTML = `
                        <h2>❌ Error</h2>
                        <p>${data.error || data.message}</p>
                    `;
                }
            } catch (error) {
                resultDiv.className = 'result error';
                resultDiv.innerHTML = `<h2>❌ Error</h2><p>Failed to verify payment. Please try again.</p>`;
            }
        });
    </script>
</body>
</html>
```

Save as `app/verify/page.tsx` and customers can access at `/verify`

## 🎉 You're Ready!

Your OnRampa system is now:
- ✅ Connected to Railway database
- ✅ Configured with your Lipa Number
- ✅ Ready to send USDT from hot wallet
- ✅ Accepting payments from all mobile money providers
- ✅ Automatically processing verified payments

## 📞 Next Steps

1. **Test with small amounts** (5-10 USDT)
2. **Create verification page** for customers
3. **Set up monitoring** for hot wallet balance
4. **Configure webhooks** for partner notifications
5. **Add more partners** via admin dashboard
6. **Scale up** as volume increases

## 🚨 Troubleshooting

### Hot Wallet Issues
- Check private key is correct
- Ensure wallet has USDT balance
- Verify RPC endpoints are working

### Payment Verification Fails
- Check phone number format (255XXXXXXXXX)
- Verify transaction ID is correct
- Ensure order is in PENDING status

### Database Connection Issues
- Verify Railway database is running
- Check DATABASE_URL is correct
- Test connection: `npx prisma db pull`

## 📖 Documentation

- **API Docs**: http://localhost:3000/docs
- **Admin Dashboard**: http://localhost:3000/admin
- **Partner Dashboard**: http://localhost:3000/dashboard
- **SMS Verification Guide**: `SMS_VERIFICATION_GUIDE.md`
