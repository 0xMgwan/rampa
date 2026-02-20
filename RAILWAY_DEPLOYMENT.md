# 🚂 Railway Deployment Guide

## Quick Deploy to Railway

### Step 1: Push to GitHub ✅

```bash
git init
git add .
git commit -m "Initial commit: OnRampa API"
git remote add origin https://github.com/0xMgwan/rampa.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Railway

1. **Go to Railway**: https://railway.app
2. **Click "New Project"**
3. **Select "Deploy from GitHub repo"**
4. **Choose**: `0xMgwan/rampa`
5. **Railway will auto-detect Next.js** and deploy

### Step 3: Configure Environment Variables

In Railway dashboard, add these environment variables:

#### **Database (Already Created)**
```bash
DATABASE_URL=postgresql://postgres:wCHrQegmuUKSTrKXHcsFLNoPmoarrbCQ@nozomi.proxy.rlwy.net:52317/railway
REDIS_URL=redis://default:eJYrKmdyilnGLAsltwOOAPBcjkEqvacK@tramway.proxy.rlwy.net:56586
```

#### **Blockchain Wallets** ⚠️ REQUIRED
```bash
HOT_WALLET_PRIVATE_KEY_BEP20=your_private_key_here
HOT_WALLET_PRIVATE_KEY_TRC20=your_private_key_here
HOT_WALLET_PRIVATE_KEY_BASE=your_private_key_here
```

#### **RPC Endpoints**
```bash
RPC_URL_BSC=https://bsc-dataseed1.binance.org
RPC_URL_TRON=https://api.trongrid.io
RPC_URL_BASE=https://mainnet.base.org
RPC_URL_POLYGON=https://polygon-rpc.com
```

#### **Lipa Number**
```bash
LIPA_NUMBER=70005436
BUSINESS_NAME=Victor Amos Muhagachi
```

#### **Admin & Security**
```bash
ADMIN_SECRET=your_secure_admin_password
WEBHOOK_SIGNING_SECRET=your_webhook_secret
```

#### **App Config**
```bash
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-app.railway.app
```

### Step 4: Run Database Migration

After deployment, run this command in Railway terminal:

```bash
npx prisma db push
npx tsx prisma/seed.ts
```

Or add to `package.json` scripts:
```json
{
  "scripts": {
    "build": "prisma generate && prisma db push && next build",
    "postinstall": "prisma generate"
  }
}
```

### Step 5: Test Deployment

```bash
# Get your Railway URL (e.g., https://rampa-production.up.railway.app)

# Test health check
curl https://your-app.railway.app/api/health

# Create test order
curl -X POST https://your-app.railway.app/api/v1/partner/onramp \
  -H "X-API-Key: sk_test_demo_partner_key_12345" \
  -H "Content-Type: application/json" \
  -d '{
    "amount_usdt": 5,
    "destination_address": "0xF97CEfDb52331bd97ae206964467113d0d7B3629",
    "payment_method_id": "lipa-number",
    "user_full_name": "Test User",
    "user_phone": "255693758950",
    "network": "BEP20",
    "country_code": "TZ"
  }'
```

## 🔧 Railway Configuration

### Build Command
```bash
npm run build
```

### Start Command
```bash
npm start
```

### Root Directory
```
/
```

### Environment Variables Priority

Railway will use:
1. Variables set in Railway dashboard (highest priority)
2. `.env` file (ignored in production)
3. `.env.example` (template only)

## 📊 Monitoring

### Railway Dashboard
- **Logs**: View real-time application logs
- **Metrics**: CPU, Memory, Network usage
- **Deployments**: Track deployment history
- **Environment**: Manage environment variables

### Check Application Health
```bash
curl https://your-app.railway.app/api/health
```

### View Logs
```bash
# In Railway dashboard, go to:
# Project → Service → Deployments → View Logs
```

## 🚨 Troubleshooting

### Build Fails

**Error: Prisma Client not generated**
```bash
# Add to package.json
"postinstall": "prisma generate"
```

**Error: Database connection failed**
- Check DATABASE_URL is correct
- Ensure Railway PostgreSQL is running
- Verify network connectivity

### Runtime Errors

**Error: Hot wallet private key missing**
- Add HOT_WALLET_PRIVATE_KEY_BEP20 to Railway env vars
- Restart deployment

**Error: USDT transfer fails**
- Check hot wallet has USDT balance
- Verify RPC_URL_BSC is accessible
- Check private key is correct

### Database Issues

**Error: Table doesn't exist**
```bash
# Run in Railway terminal:
npx prisma db push
npx tsx prisma/seed.ts
```

## 🔐 Security Checklist

- [ ] All private keys stored in Railway env vars (not in code)
- [ ] `.env` file in `.gitignore`
- [ ] ADMIN_SECRET is strong random string
- [ ] WEBHOOK_SIGNING_SECRET is unique
- [ ] Hot wallet has limited balance
- [ ] IP whitelist configured for partners (optional)
- [ ] Rate limiting enabled
- [ ] HTTPS enforced (Railway does this automatically)

## 📱 Custom Domain (Optional)

1. **Go to Railway dashboard**
2. **Click "Settings"**
3. **Add custom domain**: `api.yourcompany.com`
4. **Update DNS records** as shown
5. **Update NEXT_PUBLIC_APP_URL** to your domain

## 🎯 Post-Deployment

### Update Your Partners

Send them the new API endpoint:
```
Production API: https://your-app.railway.app
API Key: sk_test_demo_partner_key_12345
Documentation: https://your-app.railway.app/docs
```

### Monitor First Transactions

1. Watch Railway logs during first few payments
2. Verify USDT transfers on BSCScan
3. Check webhook notifications are sent
4. Monitor hot wallet balance

### Set Up Alerts

- Low hot wallet balance
- Failed transactions
- High error rate
- Deployment failures

## 🚀 Scaling

Railway auto-scales based on traffic. For high volume:

1. **Upgrade Railway plan** for more resources
2. **Add Redis caching** (already configured)
3. **Optimize database queries**
4. **Use connection pooling**
5. **Monitor performance metrics**

## 💡 Tips

- **Use Railway CLI** for faster deployments: `railway up`
- **Enable auto-deploy** from GitHub main branch
- **Set up staging environment** for testing
- **Use Railway templates** for faster setup
- **Monitor costs** in Railway dashboard

## 📞 Support

- **Railway Docs**: https://docs.railway.app
- **Railway Discord**: https://discord.gg/railway
- **GitHub Issues**: https://github.com/0xMgwan/rampa/issues
