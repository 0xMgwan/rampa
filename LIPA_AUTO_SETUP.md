# 🤖 Automated Lipa Number Payment Processing

## Overview

This system automatically processes payments from **ALL mobile money providers** in Tanzania:
- ✅ Vodacom M-Pesa
- ✅ Airtel Money  
- ✅ Tigo Pesa
- ✅ Halopesa

**No API credentials needed!** Works by monitoring payment notification emails.

## 🔧 Setup (3 Steps)

### Step 1: Configure Email Forwarding

You need an email address that receives payment notifications from your Lipa Number provider.

#### Option A: Gmail (Recommended)

1. **Create Gmail account** for payments (e.g., `payments@yourdomain.com`)

2. **Enable IMAP** in Gmail:
   - Go to Settings → See all settings → Forwarding and POP/IMAP
   - Enable IMAP
   - Save changes

3. **Create App Password**:
   - Go to Google Account → Security → 2-Step Verification
   - Scroll to "App passwords"
   - Generate password for "Mail"
   - Copy the 16-character password

4. **Forward payment notifications** to this Gmail:
   - Set up forwarding from your Lipa provider's notification email
   - OR give this email when registering Lipa Number

#### Option B: Other Email Providers

Works with any IMAP-enabled email:
- Outlook/Hotmail
- Yahoo Mail
- Custom domain email

### Step 2: Update `.env` File

```bash
# Lipa Number
LIPA_NUMBER="your_lipa_number_here"
BUSINESS_NAME="OnRampa"

# Email for Payment Notifications
NOTIFICATION_EMAIL="payments@yourdomain.com"
NOTIFICATION_EMAIL_PASSWORD="your_16_char_app_password"
NOTIFICATION_EMAIL_IMAP="imap.gmail.com"

# Hot Wallet
HOT_WALLET_PRIVATE_KEY_BEP20="your_private_key"

# Admin
ADMIN_SECRET="your_secure_password"

# Database (already configured)
DATABASE_URL="postgresql://..."
REDIS_URL="redis://..."
```

### Step 3: Set Up Cron Job

```bash
# Make script executable
chmod +x /Users/macbookpro/Desktop/onrampa/scripts/lipa-auto-verify-cron.sh

# Edit script to set correct path
nano /Users/macbookpro/Desktop/onrampa/scripts/lipa-auto-verify-cron.sh
# Change: /path/to/onrampa/.env → /Users/macbookpro/Desktop/onrampa/.env

# Add to crontab (runs every 2 minutes)
crontab -e

# Add this line:
*/2 * * * * /Users/macbookpro/Desktop/onrampa/scripts/lipa-auto-verify-cron.sh
```

## 🎯 How It Works

### Automated Flow:

```
1. Customer creates order
   ↓
2. Customer pays to Lipa Number (from ANY provider)
   ↓
3. Payment provider sends email notification
   ↓
4. Cron job checks email every 2 minutes
   ↓
5. Finds matching payment (amount + phone)
   ↓
6. Automatically sends USDT to customer
   ↓
7. Order marked as COMPLETED ✅
```

### Email Notification Examples:

**M-Pesa:**
```
Subject: M-Pesa Payment Received
You have received TZS 25,800.00 from 255765123456
Transaction ID: QH12345678
Reference: ORD-20260220-1234
```

**Airtel Money:**
```
Subject: Airtel Money Payment
You have received 25800 TZS from 255765123456
Reference: AM123456
```

**Tigo Pesa:**
```
Subject: Tigo Pesa Payment
Payment of TZS 25,800 received from 255765123456
Transaction: TP123456
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

### 2. Make Real Payment

Pay to your Lipa Number from **any mobile money provider**:
- Amount: As shown in order response
- Lipa Number: Your configured number
- From: The phone number used in the order

### 3. Wait for Auto-Processing

The system will:
- Check email every 2 minutes
- Find the payment notification
- Match by amount + phone number
- Send USDT automatically
- Complete order

### 4. Manual Trigger (for testing)

```bash
curl -X POST http://localhost:3000/api/admin/auto-verify-lipa \
  -H "Authorization: Bearer your_admin_secret"
```

## 📊 Monitoring

### Check Logs

```bash
# View cron logs
tail -f /var/log/onrampa-lipa-verify.log

# View last 50 lines
tail -n 50 /var/log/onrampa-lipa-verify.log
```

### Check Pending Orders

```bash
curl -X GET http://localhost:3000/api/admin/pending-payments \
  -H "Authorization: Bearer your_admin_secret"
```

### Manual Verification

```bash
curl -X POST http://localhost:3000/api/admin/auto-verify-lipa \
  -H "Authorization: Bearer your_admin_secret"
```

## 🔍 Payment Matching Logic

The system matches payments using:

1. **Amount** - Must match within ±100 TZS
2. **Phone Number** - Customer's mobile money number
3. **Reference** - Order number (if included in payment)
4. **Timestamp** - Payment must be after order creation

**Example:**
```
Order:
- Amount: 25,800 TZS
- Phone: 255765123456
- Order: ORD-20260220-1234

Email Notification:
- Amount: 25,800 TZS
- From: 255765123456
- Reference: ORD-20260220-1234
✅ MATCH! Auto-process.
```

## 🚨 Troubleshooting

### Emails Not Being Checked

1. **Verify IMAP is enabled** in your email account
2. **Check app password** is correct (not regular password)
3. **Test email connection**:
   ```bash
   npx tsx -e "
   import Imap from 'imap';
   const imap = new Imap({
     user: 'your_email@gmail.com',
     password: 'your_app_password',
     host: 'imap.gmail.com',
     port: 993,
     tls: true
   });
   imap.once('ready', () => console.log('✅ Connected!'));
   imap.once('error', (err) => console.error('❌ Error:', err));
   imap.connect();
   "
   ```

### Payments Not Being Matched

1. **Check email format** matches expected patterns
2. **Verify phone number format** (should be 255XXXXXXXXX)
3. **Check amount tolerance** (±100 TZS)
4. **Review logs** for parsing errors

### Cron Not Running

1. **Check crontab**:
   ```bash
   crontab -l
   ```

2. **Verify script permissions**:
   ```bash
   ls -l /Users/macbookpro/Desktop/onrampa/scripts/lipa-auto-verify-cron.sh
   ```

3. **Test script manually**:
   ```bash
   /Users/macbookpro/Desktop/onrampa/scripts/lipa-auto-verify-cron.sh
   ```

## 📦 Required Packages

Install email parsing dependencies:

```bash
npm install imap mailparser
npm install --save-dev @types/imap @types/mailparser
```

## 🔒 Security

- ✅ Email credentials in `.env` (never committed)
- ✅ App password (not main password)
- ✅ IMAP over TLS (encrypted)
- ✅ Admin endpoints require authentication
- ✅ Payment matching prevents fraud
- ✅ All transactions logged

## 💡 Best Practices

1. **Use dedicated email** for payment notifications only
2. **Set up email filters** to mark payment emails as important
3. **Monitor logs daily** for first week
4. **Test with small amounts** first
5. **Keep hot wallet topped up**
6. **Set up alerts** for failed verifications
7. **Review unmatched payments** weekly

## 📈 Scaling

For high volume:
- Reduce cron interval to every 1 minute
- Use multiple email accounts
- Add Redis queue for processing
- Set up monitoring and alerts
- Auto-refill hot wallets

## 🎉 Advantages

- ✅ **No API needed** - Works with any Lipa Number
- ✅ **All providers supported** - M-Pesa, Airtel, Tigo, Halopesa
- ✅ **Fully automated** - No manual checking
- ✅ **Fast processing** - 2-minute intervals
- ✅ **Reliable** - Email-based verification
- ✅ **Scalable** - Handles multiple orders

## 📞 Support

**Email Issues:**
- Gmail: https://support.google.com/mail
- Check IMAP settings
- Verify app password

**System Issues:**
- Check logs: `/var/log/onrampa-lipa-verify.log`
- Test email connection
- Review notification format
