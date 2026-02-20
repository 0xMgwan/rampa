# Rampa — Multi-Country Fiat-to-Crypto Onramp API

**Rampa** is an open-source, production-ready API that lets any business accept mobile money payments (M-Pesa, Airtel Money, Tigo Pesa, etc.) and automatically settle in USDT/USDC on any EVM or Tron network.

> **Live demo**: [rampa-production.up.railway.app](https://rampa-production.up.railway.app)  
> **API docs**: [rampa-production.up.railway.app/docs](https://rampa-production.up.railway.app/docs)

---

## How It Works

```
Customer pays mobile money  →  Rampa verifies SMS transaction ID  →  USDT sent to wallet automatically
```

1. Partner calls `POST /api/v1/partner/onramp` with amount + destination wallet
2. Rampa returns payment instructions (Lipa Number + TZS amount)
3. Customer pays via M-Pesa/Airtel/Tigo and gets an SMS with a Transaction ID
4. Customer (or partner) calls `POST /api/v1/public/verify-payment` with the Transaction ID
5. Rampa verifies the payment and sends USDT to the destination wallet on-chain

---

## Features

- **Multi-Country**: Tanzania, Kenya, Uganda — add any country in minutes
- **Multi-Network**: BEP20, TRC20, Base, Polygon
- **Multi-Token**: USDT and USDC
- **Payment Methods**: M-Pesa, Airtel Money, Tigo Pesa, Halopesa (Lipa Number aggregator)
- **Auto Settlement**: USDT sent automatically on payment verification
- **Partner API**: API key auth, markup configuration, webhook notifications
- **Public Verify**: No-auth endpoint safe to call from mobile/frontend
- **Admin Dashboard**: Manage orders, providers, rates, and liquidity
- **Webhook Events**: Real-time order status via signed POST callbacks
- **Rate Limiting**: Redis-backed per-partner rate limits
- **IP Whitelisting**: Per-partner IP allowlist support

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Database | PostgreSQL + Prisma ORM |
| Cache / Rate Limiting | Redis |
| Blockchain (EVM) | ethers.js — BSC, Base, Polygon |
| Blockchain (Tron) | TronWeb — TRC20 |
| Styling | Tailwind CSS |
| Deployment | Railway |

---

## Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/0xMgwan/rampa.git
cd rampa
npm install
cp .env.example .env
```

### 2. Configure Environment Variables

Edit `.env`:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/rampa"

# Redis (for rate limiting)
REDIS_URL="redis://localhost:6379"

# Hot wallet private keys — fund these wallets with USDT/USDC for auto-payouts
HOT_WALLET_PRIVATE_KEY_BEP20="0x..."   # BSC wallet
HOT_WALLET_PRIVATE_KEY_TRC20="..."     # Tron wallet (hex, no 0x prefix)
HOT_WALLET_PRIVATE_KEY_BASE="0x..."    # Base wallet
HOT_WALLET_PRIVATE_KEY_POLYGON="0x..."  # Polygon wallet

# Selcom (Lipa Number aggregator for Tanzania)
SELCOM_API_KEY="your_selcom_api_key"
SELCOM_API_SECRET="your_selcom_api_secret"
SELCOM_VENDOR_ID="your_vendor_id"
SELCOM_LIPA_NUMBER="70005436"

# App
NEXTAUTH_SECRET="your_random_secret_32_chars"
NEXTAUTH_URL="http://localhost:3000"
```

> **Security**: Never commit `.env` to git. Hot wallet keys control real funds — use a dedicated wallet with only the liquidity needed for payouts.

### 3. Set Up Database

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed countries, payment providers, and exchange rates
npm run db:seed
```

### 4. Run Development Server

```bash
npm run dev
# → http://localhost:3000
```

---

## API Reference

### Base URL
```
https://rampa-production.up.railway.app/api/v1
```

### Authentication

All **partner** endpoints require your API key in the header:
```
X-API-Key: sk_live_your_api_key_here
```

**Public** endpoints (customer-facing) require no authentication.

---

### GET `/partner/rates?country_code=TZ`
Returns current exchange rates for a country.

```bash
curl 'https://rampa-production.up.railway.app/api/v1/partner/rates?country_code=TZ' \
  -H 'X-API-Key: sk_live_your_key'
```

```json
{
  "success": true,
  "rates": {
    "USDT_TZS": 2580,
    "USDC_TZS": 2578
  },
  "updated_at": "2026-02-20T12:00:00.000Z"
}
```

---

### GET `/partner/payment-methods?country_code=TZ`
Returns available payment methods for a country.

```bash
curl 'https://rampa-production.up.railway.app/api/v1/partner/payment-methods?country_code=TZ' \
  -H 'X-API-Key: sk_live_your_key'
```

```json
{
  "success": true,
  "payment_methods": [{
    "id": "lipa-number",
    "provider": "Lipa Number (All Providers)",
    "account_number": "70005436",
    "limits": { "min": 1000, "max": 10000000 }
  }]
}
```

---

### POST `/partner/onramp`
Create a buy order (fiat → crypto). Returns payment instructions for the customer.

```bash
curl -X POST 'https://rampa-production.up.railway.app/api/v1/partner/onramp' \
  -H 'X-API-Key: sk_live_your_key' \
  -H 'Content-Type: application/json' \
  -d '{
    "amount_usdt": 10,
    "destination_address": "0xYourWalletAddress",
    "payment_method_id": "lipa-number",
    "user_phone": "255765123456",
    "network": "BEP20",
    "country_code": "TZ"
  }'
```

**Request body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `amount_usdt` | number | ✓ | Amount of USDT to receive |
| `destination_address` | string | ✓ | Wallet address to receive USDT |
| `payment_method_id` | string | ✓ | From `/payment-methods` response |
| `user_phone` | string | ✓ | Customer phone (international format) |
| `network` | string | ✓ | `BEP20`, `TRC20`, `BASE`, or `POLYGON` |
| `country_code` | string | ✓ | ISO country code e.g. `TZ` |

```json
{
  "success": true,
  "order": {
    "order_number": "ORD-20260220-7450",
    "status": "PENDING",
    "amount_fiat": 25800,
    "currency": "TZS",
    "payment_instructions": {
      "account_number": "70005436",
      "instructions": "Pay TZS 25,800 to Lipa Number 70005436"
    }
  }
}
```

---

### POST `/public/verify-payment`
Customer submits their SMS Transaction ID. **No API key required.** USDT is sent automatically on success.

```bash
curl -X POST 'https://rampa-production.up.railway.app/api/v1/public/verify-payment' \
  -H 'Content-Type: application/json' \
  -d '{
    "order_number": "ORD-20260220-7450",
    "transaction_id": "QH12345678",
    "phone_number": "255765123456"
  }'
```

```json
{
  "success": true,
  "message": "Payment verified! Your crypto has been sent.",
  "status": "COMPLETED",
  "amount_sent": "10 USDT",
  "network": "BEP20",
  "tx_hash": "0x5ab8275d60ef7eb172...",
  "explorer_url": "https://bscscan.com/tx/0x5ab..."
}
```

---

### POST `/partner/verify-payment`
Same as public verify but authenticated — call from your backend to verify on behalf of the customer.

---

### GET `/partner/orders/:orderNumber`
Get full order details and current status.

```bash
curl 'https://rampa-production.up.railway.app/api/v1/partner/orders/ORD-20260220-7450' \
  -H 'X-API-Key: sk_live_your_key'
```

**Order statuses:** `PENDING` → `PROCESSING` → `COMPLETED` | `FAILED` | `EXPIRED`

---

## Webhooks

Set your webhook URL in the partner dashboard. Rampa will POST to it on every order status change.

**Events:** `order.created`, `order.processing`, `order.completed`, `order.failed`

```json
{
  "event": "order.completed",
  "order_number": "ORD-20260220-7450",
  "status": "COMPLETED",
  "amount_crypto": 10,
  "currency": "USDT",
  "network": "BEP20",
  "tx_hash": "0x5ab8275d60ef7eb172a968fb...",
  "timestamp": "2026-02-20T12:35:00.000Z"
}
```

**Verify webhook signatures** (HMAC-SHA256):

```javascript
const crypto = require('crypto');

function verifyWebhook(payload, signature, secret) {
  const computed = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');
  return computed === signature;
}
```

---

## Project Structure

```
rampa/
├── app/
│   ├── api/
│   │   ├── v1/
│   │   │   ├── partner/
│   │   │   │   ├── onramp/          # POST - create buy order
│   │   │   │   ├── onramp/verify/   # POST - partner verify
│   │   │   │   ├── offramp/         # POST - create sell order
│   │   │   │   ├── rates/           # GET  - exchange rates
│   │   │   │   ├── payment-methods/ # GET  - payment methods
│   │   │   │   ├── orders/[n]/      # GET  - order status
│   │   │   │   ├── verify-payment/  # POST - partner verify
│   │   │   │   ├── dashboard/       # GET  - partner stats
│   │   │   │   └── wallet-balances/ # GET  - hot wallet balances
│   │   │   └── public/
│   │   │       └── verify-payment/  # POST - public verify (no auth)
│   │   ├── admin/                   # Admin management endpoints
│   │   └── webhooks/selcom/         # Selcom payment callback
│   ├── page.tsx                     # Landing page
│   ├── docs/page.tsx                # API documentation
│   ├── get-started/page.tsx         # Integration guide
│   └── dashboard/page.tsx           # Partner dashboard
├── lib/
│   ├── blockchain/
│   │   ├── evm.ts                   # ethers.js — BEP20, Base, Polygon
│   │   ├── tron.ts                  # TronWeb — TRC20
│   │   ├── config.ts                # RPC URLs, contract addresses
│   │   └── index.ts                 # BlockchainService facade
│   ├── payments/
│   │   ├── selcom.ts                # Selcom Lipa Number integration
│   │   └── index.ts                 # PaymentService facade
│   ├── rates/                       # Exchange rate fetching & caching
│   ├── webhooks/                    # Webhook delivery with retries
│   ├── middleware/                  # API key auth, rate limiting
│   └── db.ts                        # Prisma client singleton
├── prisma/
│   ├── schema.prisma                # Full data model
│   └── seed.ts                      # Countries, providers, rates seed
└── .env.example                     # All required environment variables
```

---

## Adding a New Country

No code changes needed — just add data to the database:

```typescript
// 1. Create the country
const country = await prisma.country.create({
  data: {
    code: 'NG',
    name: 'Nigeria',
    currencyCode: 'NGN',
    currencySymbol: '₦',
    supportedNetworks: ['BEP20', 'TRC20'],
    status: 'ACTIVE',
  },
});

// 2. Add payment provider
await prisma.paymentProvider.create({
  data: {
    countryId: country.id,
    providerName: 'OPay',
    providerType: 'MOBILE_MONEY',
    accountNumber: 'your_account',
    status: 'ACTIVE',
    limits: { min: 100, max: 5000000 },
  },
});

// 3. Set exchange rate
await prisma.exchangeRate.create({
  data: {
    countryId: country.id,
    currencyCode: 'NGN',
    usdtBuyRate: 1580,
    usdtSellRate: 1560,
    usdcBuyRate: 1578,
    usdcSellRate: 1558,
  },
});
```

---

## Adding a New Payment Provider

1. Create `lib/payments/your-provider.ts`:

```typescript
import { PaymentVerificationResult } from './types';

export class YourProvider {
  async verifyPayment(
    transactionId: string,
    expectedAmount: number,
    phone: string
  ): Promise<PaymentVerificationResult> {
    // Call your provider's API to verify the transaction
    const result = await yourProviderAPI.verify(transactionId);
    return {
      verified: result.amount >= expectedAmount,
      amount: result.amount,
      phone: result.phone,
    };
  }
}
```

2. Register in `lib/payments/index.ts`:

```typescript
case 'your-provider-id':
  return new YourProvider();
```

---

## Supported Networks

| Network | Chain | Settlement Time | Explorer |
|---|---|---|---|
| BEP20 | Binance Smart Chain | ~5 seconds | bscscan.com |
| TRC20 | Tron | ~3 seconds | tronscan.org |
| BASE | Base (Coinbase L2) | ~2 seconds | basescan.org |
| POLYGON | Polygon | ~5 seconds | polygonscan.com |

Contract addresses are in `lib/blockchain/config.ts`.

---

## Security Considerations

- **API keys** are stored as bcrypt hashes — never in plaintext
- **Hot wallets** should hold only the liquidity needed for active orders
- **IP whitelisting** is supported per partner — configure in the database
- **Rate limiting** via Redis — default 100 req/min per partner
- **Webhook signatures** use HMAC-SHA256 — always verify on your end
- **Never expose** `HOT_WALLET_PRIVATE_KEY_*` variables client-side

---

## Production Deployment (Railway)

```bash
# 1. Push to GitHub
git push origin main

# 2. Connect repo to Railway
# railway.app → New Project → Deploy from GitHub

# 3. Add environment variables in Railway dashboard

# 4. Add PostgreSQL and Redis plugins in Railway

# 5. Run migrations
railway run npm run db:push
railway run npm run db:seed
```

Railway auto-deploys on every push to `main`.

---

## Error Codes

| HTTP Status | Meaning |
|---|---|
| 400 | Bad Request — missing or invalid parameters |
| 401 | Unauthorized — invalid or missing API key |
| 404 | Not Found — order does not exist |
| 409 | Conflict — order already verified |
| 429 | Too Many Requests — rate limit exceeded |
| 500 | Internal Server Error |

---

## License

MIT — free to use, modify, and deploy commercially.

## Support

Open an issue on [GitHub](https://github.com/0xMgwan/rampa) or visit the [live docs](https://rampa-production.up.railway.app/docs).
