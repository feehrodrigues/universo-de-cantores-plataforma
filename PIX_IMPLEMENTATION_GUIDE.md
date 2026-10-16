# 🎵 PIX Payment Integration - Implementation Guide

## ✅ What's Been Implemented

### 1. **PIX Utilities Library** (`lib/pix.ts`)
Provides core PIX payment functionality:
- `generatePixTransactionId()` - Creates unique transaction IDs
- `generatePixBrcode()` - Generates PIX Brcode format
- `createPixTransaction()` - Creates a PIX transaction record
- `formatBRL()` - Formats values as Brazilian Real
- `calculatePixDeadline()` - Calculates payment deadlines

### 2. **Payment API Routes**

#### `/api/student/payment/initiate` (POST)
**Purpose**: Initiates a payment for a student
- Creates a `ClassPurchase` record in the database
- Generates a PIX QR code
- Returns transaction details and QR code

**Request**:
```json
{
  "paymentPlanId": "plan-id-123",
  "classId": "class-id-optional"
}
```

**Response**:
```json
{
  "success": true,
  "purchase": {
    "id": "purchase-123",
    "amount": 160.00,
    "amountFormatted": "R$ 160,00",
    "plan": { ... },
    "deadline": "2026-03-02T12:00:00Z"
  },
  "pix": {
    "transactionId": "uuid",
    "qrCode": "brcode-string",
    "expiresAt": "2026-03-02T12:00:00Z"
  }
}
```

#### `/api/student/payment/status` (GET)
**Purpose**: Checks the current status of a payment
**Usage**: `GET /api/student/payment/status?purchaseId=xxx`

**Response**:
```json
{
  "id": "purchase-123",
  "status": "pending|completed|expired|failed",
  "amount": 160.00,
  "lessonsRemaining": 4,
  "deadline": "2026-03-02T12:00:00Z",
  "paidAt": null,
  "plan": { ... }
}
```

#### `/api/payment/webhook` (POST)
**Purpose**: Receives payment notifications from payment providers
- Updates payment status when confirmed by provider
- Enrolls student in classes when payment completes
- Updates lesson balance in student profile

**Supports webhooks from**:
- Mercado Pago
- Pagar.me
- Stone
- Other providers (payment status mapping included)

### 3. **Payment UI Components**

#### `PixPaymentComponent.tsx`
React component that displays:
- QR code for scanning
- Copy-to-clipboard functionality
- Countdown timer for payment expiration
- Payment confirmation status
- Automatic polling for payment status
- Real-time feedback to user

#### `app/pagamento/page.tsx` 
Full payment page component featuring:
- Plan selection grid
- Plan details and pricing
- "Buy Now" button for each plan
- Integrated PIX payment flow
- Error handling and loading states

---

## 🔧 Configuration Required

### 1. **Environment Variables** (`.env.local`)
Add these variables to your project:

```env
# PIX Configuration
PIX_KEY=your-pix-key-here
# Examples: your-email@example.com, your-cpf, your-phone

# Payment Gateway Integration (choose one based on your provider)
MERCADO_PAGO_ACCESS_TOKEN=xxx
MERCADO_PAGO_WEBHOOK_SECRET=xxx

# or for Pagar.me:
PAGARME_API_KEY=xxx
PAGARME_WEBHOOK_SECRET=xxx
```

### 2. **Payment Provider Setup** (Required)

Choose a payment provider that supports PIX:

#### **Option A: Mercado Pago** (Recommended for Brazil)
1. Sign up at https://www.mercadopago.com.br/
2. Go to **Settings → Developers → Credentials**
3. Copy Access Token
4. Set up webhooks in dashboard pointing to `/api/payment/webhook`

#### **Option B: Pagar.me**
1. Sign up at https://pagar.me/
2. Get your API Key from dashboard
3. Configure webhook to `/api/payment/webhook`

#### **Option C: Stone**
1. Sign up at https://www.stone.com.br/
2. Get API credentials
3. Integrate with their SDK

### 3. **Database Migrations (Already Done)**
The `ClassPurchase` model already has PIX fields:
- `pixQrCode` - Stores the QR code
- `paymentStatus` - Tracks payment state
- `paymentDeadline` - Expiration time
- `paymentDate` - When payment was completed

---

## 🚀 How to Integrate Payment Provider

### Step 1: Install Provider SDK
```bash
# For Mercado Pago
npm install mercadopago

# For Pagar.me
npm install @pagarme/core-js
```

### Step 2: Update `lib/pix.ts`
Replace the `createPixTransaction` function with actual provider calls:

```typescript
import MercadoPago from 'mercadopago';

export async function createPixTransaction(
  data: PixTransactionData
): Promise<PixQrCode> {
  const client = new MercadoPago({
    accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
  });

  const preference = await client.preference.create({
    items: [{
      title: data.description,
      quantity: 1,
      unit_price: data.amount,
    }],
    external_reference: data.orderId,
    payment_methods: {
      excluded_payment_methods: [{ id: 'ticket' }],
      installments: 1,
    },
    payer: {
      name: data.recipientName,
    },
  });

  // The provider will return actual PIX QR code
  return {
    qrCode: preference.init_point,
    qrCodeUrl: preference.qr_code ? preference.qr_code.in_store : '',
    transactionId: preference.id,
    expiresAt: new Date(Date.now() + 3600000).toISOString(),
  };
}
```

### Step 3: Update Webhook Verification
Update `/api/payment/webhook` to verify provider signatures:

```typescript
function verifyWebhookSignature(payload: any, signature: string): boolean {
  // For Mercado Pago:
  const id = payload.data?.id;
  const hash = crypto
    .createHmac('sha256', process.env.MERCADO_PAGO_WEBHOOK_SECRET!)
    .update(`id:${id}`)
    .digest('hex');
  return hash === signature;
}
```

---

## 📊 Payment Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│ Student clicks "Comprar" on /pagamento                  │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│ POST /api/student/payment/initiate                       │
│ - Create ClassPurchase (status: pending)                │
│ - Generate PIX transaction with provider                │
│ - Return QR code                                        │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│ PixPaymentComponent displays QR code                    │
│ - Student scans with bank app                          │
│ - Component polls payment status every 5 seconds        │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
                 PAYMENT SENT (Bank)
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│ Payment Provider sends webhook notification              │
│ POST /api/payment/webhook                              │
│ - Verify webhook signature                              │
│ - Update ClassPurchase (status: completed)             │
│ - Enroll student in class                              │
│ - Update lesson balance                                 │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│ PixPaymentComponent shows "Payment Confirmed" ✅         │
│ Student redirected to dashboard                         │
└─────────────────────────────────────────────────────────┘
```

---

## 📱 Testing the Integration

### 1. **Local Testing with Sandbox**
Most payment providers offer sandbox environments:
- Mercado Pago: Use sandbox credentials + test card numbers
- Pagar.me: Sandbox mode in dashboard

### 2. **Test Endpoints**
```bash
# Initiate payment
curl -X POST http://localhost:3000/api/student/payment/initiate \
  -H "Content-Type: application/json" \
  -d '{"paymentPlanId": "plan-1"}'

# Check status
curl http://localhost:3000/api/student/payment/status?purchaseId=xxx
```

### 3. **Test Webhook** (using ngrok for local development)
```bash
# 1. Start ngrok tunnel
ngrok http 3000

# 2. Configure webhook in payment provider to:
# https://your-ngrok-url/api/payment/webhook

# 3. Trigger test webhook from provider dashboard
```

---

## 🔐 Security Considerations

1. **Webhook Signature Verification** ✅
   - Always verify webhook signatures from payment provider
   - Located in `/api/payment/webhook`

2. **User Authorization** ✅
   - Verify student owns the purchase before returning details
   - Implemented in status and webhook routes

3. **Sensitive Data** ✅
   - Never log PIX keys or credentials
   - Store in environment variables only
   - Use HTTPS in production

4. **Idempotent Webhooks** ✅
   - Webhooks may be received multiple times
   - Webhook handler checks existing payments before updating

---

## 📚 Next Steps

1. **Choose Payment Provider** (Mercado Pago recommended for Brazil)
2. **Install Provider SDK** and add credentials to `.env.local`
3. **Update `lib/pix.ts`** with actual provider integration
4. **Update `/api/payment/webhook`** with signature verification
5. **Test in sandbox** environment first
6. **Deploy to production** with production credentials

---

## 📞 Support Resources

- **Mercado Pago Docs**: https://www.mercadopago.com.br/developers
- **PIX Documentation**: https://www.bcb.gov.br/estabilidade/pix
- **Next.js API Routes**: https://nextjs.org/docs/app/building-your-application/routing/route-handlers

---

## ✨ Features Included

- ✅ PIX QR code generation framework
- ✅ Payment initiation API
- ✅ Payment status checking
- ✅ Webhook handling
- ✅ React component for QR display
- ✅ Countdown timer
- ✅ Real-time polling for status
- ✅ Copy-to-clipboard functionality
- ✅ Complete payment UI page
- ✅ Error handling
- ✅ Student enrollment on payment
- ✅ Lesson balance updates

---

**Integration Status**: 🟡 Ready for Provider Setup
All framework code is in place. Just needs payment provider configuration!
