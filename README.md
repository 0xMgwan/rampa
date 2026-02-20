# OnRampa - Multi-Country Fiat-to-Crypto Onramp API

Enterprise-grade USDC/USDT onramp and offramp API. Customizable for any country to plug into the system.

## Features

- **Multi-Country Support**: Tanzania, Kenya, Uganda (easily add more)
- **Multiple Payment Methods**: M-Pesa, Tigo Pesa, Airtel Money, Halo Pesa
- **Multiple Blockchain Networks**: BEP20, TRC20, Base, Polygon
- **Cryptocurrencies**: USDC, USDT
- **Real-time Exchange Rates**: Automatic rate updates from CoinGecko and forex APIs
- **Webhook Notifications**: Real-time order status updates
- **Secure Authentication**: API key authentication, IP whitelisting, rate limiting
- **Admin Dashboard**: Manage countries, payment providers, rates, and orders

## Quick Start

### 1. Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd onrampa

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
```

### 2. Configure Environment

Edit `.env` and add your configuration:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/onrampa"
REDIS_URL="redis://localhost:6379"

# Hot wallet private keys (KEEP SECURE!)
HOT_WALLET_PRIVATE_KEY_BEP20="your_private_key"
HOT_WALLET_PRIVATE_KEY_TRC20="your_private_key"
HOT_WALLET_PRIVATE_KEY_BASE="your_private_key"

# Payment provider credentials
MPESA_TZ_API_KEY="your_api_key"
# ... add other provider credentials
```

### 3. Setup Database

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed initial data
npm run db:seed
```

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## API Endpoints

### Base URL
```
https://your-domain.com/api/v1/partner
```

### Authentication
All requests require `X-API-Key` header:
```bash
curl https://your-domain.com/api/v1/partner/rates \
  -H "X-API-Key: sk_live_your_api_key"
```

### Available Endpoints

- `GET /rates?country=TZ` - Get exchange rates
- `GET /payment-methods?country=TZ` - Get payment methods
- `POST /onramp` - Create buy order (fiat → crypto)
- `POST /onramp/verify` - Verify payment and trigger crypto transfer
- `POST /offramp` - Create sell order (crypto → fiat)
- `GET /orders/:orderNumber` - Get order status

## Architecture

```
onrampa/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   └── v1/partner/   # Partner API endpoints
│   ├── admin/            # Admin dashboard
│   └── docs/             # API documentation
├── lib/                   # Core libraries
│   ├── blockchain/       # Blockchain integration (EVM, Tron)
│   ├── payments/         # Payment provider integrations
│   ├── rates/            # Exchange rate management
│   ├── webhooks/         # Webhook service
│   └── middleware/       # Auth, rate limiting
├── prisma/               # Database schema and migrations
└── components/           # React components
```

## Adding a New Country

1. **Add country to database**:
```typescript
await prisma.country.create({
  data: {
    code: 'NG',
    name: 'Nigeria',
    currencyCode: 'NGN',
    currencySymbol: '₦',
    supportedNetworks: ['BEP20', 'TRC20', 'BASE'],
  },
});
```

2. **Add payment providers**:
```typescript
await prisma.paymentProvider.create({
  data: {
    countryId: nigeria.id,
    providerName: 'Paystack',
    providerType: 'BANK_TRANSFER',
    // ... provider details
  },
});
```

3. **Implement payment provider integration**:
Create a new file in `lib/payments/` implementing the `PaymentProvider` interface.

4. **Add exchange rates**:
Rates are automatically fetched from APIs or can be set manually in the admin dashboard.

## Payment Provider Integration

To add a new payment provider:

1. Create a new file in `lib/payments/`:
```typescript
// lib/payments/your-provider.ts
import { PaymentProvider, PaymentVerificationResult, PayoutResult } from './types';

export class YourProvider implements PaymentProvider {
  async verifyPayment(transactionId: string, expectedAmount: number): Promise<PaymentVerificationResult> {
    // Implement payment verification
  }

  async sendPayout(phone: string, amount: number): Promise<PayoutResult> {
    // Implement payout
  }
}
```

2. Register in `lib/payments/index.ts`:
```typescript
case 'your-provider-id':
  this.providers.set(providerId, new YourProvider());
  break;
```

## Blockchain Networks

Supported networks:
- **BEP20** (Binance Smart Chain)
- **TRC20** (Tron)
- **Base** (Coinbase L2)
- **Polygon**

To add a new network, update `lib/blockchain/config.ts`.

## Security

- API keys are hashed with bcrypt
- IP whitelisting per partner
- Rate limiting with Redis
- Webhook signature verification (HMAC-SHA256)
- Hot wallet for automated transfers
- Cold wallet for reserves (recommended)

## Admin Dashboard

Access at `/admin`:
- Manage countries and payment providers
- Set exchange rates
- View and manage orders
- Monitor system health
- View analytics

## Webhooks

Configure webhook URL in admin dashboard. Events:
- `ORDER_CREATED`
- `ORDER_VERIFYING`
- `ORDER_PROCESSING`
- `ORDER_COMPLETED`
- `ORDER_FAILED`
- `ORDER_EXPIRED`

Verify webhook signatures:
```javascript
const crypto = require('crypto');

function verifyWebhookSignature(payload, signature, secret) {
  const [tPart, v1Part] = signature.split(',');
  const timestamp = tPart.split('=')[1];
  const expectedSig = v1Part.split('=')[1];
  
  const signedPayload = `${timestamp}.${JSON.stringify(payload)}`;
  const computedSig = crypto
    .createHmac('sha256', secret)
    .update(signedPayload)
    .digest('hex');
  
  return computedSig === expectedSig;
}
```

## Production Deployment

1. Set up PostgreSQL and Redis
2. Configure environment variables
3. Run database migrations
4. Deploy to your hosting platform (Vercel, Railway, etc.)
5. Set up monitoring and logging
6. Configure cold wallet for reserves
7. Implement KYC/AML if required

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.
