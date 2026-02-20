# OnRampa Setup Guide

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Redis server
- Hot wallet private keys for blockchain networks

## Step-by-Step Setup

### 1. Install Dependencies

```bash
cd /Users/macbookpro/Desktop/onrampa
npm install
```

### 2. Setup PostgreSQL Database

Create a new PostgreSQL database:

```sql
CREATE DATABASE onrampa;
```

### 3. Setup Redis

Install and start Redis:

```bash
# macOS
brew install redis
brew services start redis

# Or use Docker
docker run -d -p 6379:6379 redis:alpine
```

### 4. Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` and configure:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/onrampa?schema=public"

# Redis
REDIS_URL="redis://localhost:6379"

# Blockchain - Hot Wallets (GENERATE NEW WALLETS!)
HOT_WALLET_PRIVATE_KEY_BEP20="your_private_key_here"
HOT_WALLET_PRIVATE_KEY_TRC20="your_private_key_here"
HOT_WALLET_PRIVATE_KEY_BASE="your_private_key_here"

# RPC Endpoints (use your own or public)
RPC_URL_BSC="https://bsc-dataseed1.binance.org"
RPC_URL_TRON="https://api.trongrid.io"
RPC_URL_BASE="https://mainnet.base.org"

# Payment Providers - Add your credentials
MPESA_TZ_API_KEY="your_api_key"
MPESA_TZ_PUBLIC_KEY="your_public_key"
MPESA_TZ_SERVICE_PROVIDER_CODE="your_code"

# Exchange Rate APIs (optional, for automatic rate updates)
COINGECKO_API_KEY="your_api_key"
EXCHANGERATE_API_KEY="your_api_key"

# Admin
ADMIN_SECRET="generate_a_strong_secret"
WEBHOOK_SIGNING_SECRET="generate_another_strong_secret"

# App Config
NODE_ENV="development"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 5. Generate Prisma Client

```bash
npm run db:generate
```

### 6. Push Database Schema

```bash
npm run db:push
```

### 7. Seed Initial Data

```bash
npm run db:seed
```

This will create:
- Countries: Tanzania, Kenya, Uganda
- Payment providers for each country
- Initial exchange rates
- Demo partner account

**Important**: The seed script will output a demo API key. Save this for testing!

### 8. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

## Testing the API

### Get Demo API Key

After running `npm run db:seed`, you'll see:

```
📝 Demo API Key: sk_test_demo_partner_key_12345
```

### Test Endpoints

**Get Rates:**
```bash
curl http://localhost:3000/api/v1/partner/rates?country=TZ \
  -H "X-API-Key: sk_test_demo_partner_key_12345"
```

**Get Payment Methods:**
```bash
curl http://localhost:3000/api/v1/partner/payment-methods?country=TZ \
  -H "X-API-Key: sk_test_demo_partner_key_12345"
```

**Create Buy Order:**
```bash
curl -X POST http://localhost:3000/api/v1/partner/onramp \
  -H "X-API-Key: sk_test_demo_partner_key_12345" \
  -H "Content-Type: application/json" \
  -d '{
    "amount_usdt": 50,
    "destination_address": "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    "payment_method_id": "mpesa-tz",
    "user_full_name": "Test User",
    "user_phone": "0765123456",
    "network": "BEP20",
    "country_code": "TZ"
  }'
```

## Production Deployment

### 1. Environment Setup

- Use production PostgreSQL and Redis instances
- Generate new secure hot wallet private keys
- Configure production payment provider credentials
- Set strong secrets for admin and webhooks

### 2. Security Checklist

- [ ] Change all default secrets
- [ ] Use environment-specific API keys
- [ ] Enable IP whitelisting for partners
- [ ] Set up SSL/TLS certificates
- [ ] Configure rate limiting appropriately
- [ ] Set up monitoring and alerting
- [ ] Implement backup strategy for database
- [ ] Use cold wallet for reserves

### 3. Deploy to Hosting Platform

**Vercel:**
```bash
npm install -g vercel
vercel
```

**Railway:**
```bash
npm install -g @railway/cli
railway up
```

**Docker:**
```bash
docker build -t onrampa .
docker run -p 3000:3000 --env-file .env onrampa
```

### 4. Post-Deployment

- Run database migrations
- Seed initial data
- Test all API endpoints
- Configure webhooks for partners
- Monitor logs and metrics

## Troubleshooting

### Database Connection Issues

```bash
# Test PostgreSQL connection
psql postgresql://user:password@localhost:5432/onrampa

# Check if database exists
\l
```

### Redis Connection Issues

```bash
# Test Redis connection
redis-cli ping
# Should return: PONG
```

### Prisma Issues

```bash
# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Generate client again
npm run db:generate
```

### Module Not Found Errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Next Steps

1. **Add More Countries**: Follow the guide in README.md
2. **Integrate Payment Providers**: Implement provider-specific integrations
3. **Configure Exchange Rates**: Set up automatic rate updates
4. **Build Admin Dashboard**: Access at `/admin` (to be implemented)
5. **Set Up Monitoring**: Use tools like Sentry, DataDog, or Grafana

## Support

For issues and questions:
- Check the README.md
- Review API documentation at `/docs`
- Open an issue on GitHub

## Security Notes

⚠️ **IMPORTANT SECURITY REMINDERS:**

1. **Never commit `.env` file to version control**
2. **Use separate wallets for hot and cold storage**
3. **Implement KYC/AML if required by your jurisdiction**
4. **Regularly audit transaction logs**
5. **Set up alerts for unusual activity**
6. **Keep dependencies updated**
7. **Use strong, unique secrets for production**
8. **Implement proper access controls**

## License

MIT License - See LICENSE file for details
