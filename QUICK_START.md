# Quick Start Guide - Getting Your Payment & Email System Live

This guide walks you through the complete setup process in the recommended order.

## Prerequisites ✓

- Dev server running: `npm run dev`
- TypeScript compiling clean: ✓
- Database connected: ✓
- Authentication working: ✓

## Step 1: Email Configuration (30 minutes)

Email is easier to set up first. Students can't complete payments without email confirmations.

### 1.1 Create SendGrid Account (Recommended)

1. Go to https://sendgrid.com and sign up (free)
2. Verify your email address
3. Go to Settings → API Keys
4. Create new API key, copy it

### 1.2 Add to .env.local

Create `.env.local` in the workspace root directory:

```env
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=SG.YOUR_API_KEY_HERE
SENDGRID_FROM_EMAIL=noreply@universodecantores.com
SENDGRID_FROM_NAME="Universo de Cantores"
```

Replace `SG.YOUR_API_KEY_HERE` with your actual key from Step 1.1

### 1.3 Restart Dev Server

Stop and restart your dev server for env vars to reload:

```bash
# Press Ctrl+C to stop current server
npm run dev
```

### 1.4 Test Email Sending

Create a test file: `web/app/api/test-email/route.ts`

```typescript
import { sendTemplateEmail } from '@/lib/email';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Replace with YOUR email address
    await sendTemplateEmail('your-email@gmail.com', 'paymentInitiated', {
      studentName: 'Test Student',
      planName: 'Plano Mensal',
      amount: 'R$ 160,00',
      lessonsIncluded: 8,
      expiresAt: new Date().toLocaleString('pt-BR'),
      qrCodeData: 'https://example.com',
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Check your email!' 
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
```

Then visit: `http://localhost:3000/api/test-email`

**Expected**: Email arrives in your inbox within seconds

**If not received**:
- Check spam folder
- Verify API key is correct
- Check dev server logs for errors
- Verify `.env.local` is in workspace root (not in `web/` folder)

---

## Step 2: Payment Provider Setup (2-3 hours)

Now set up PIX payments with Mercado Pago.

### 2.1 Create Mercado Pago Account

1. Go to https://www.mercadopago.com.br
2. Sign up or login with existing account
3. Go to your account settings
4. Find "Credenciales" (Credentials)
5. Copy your "Token de acceso" (Access Token)

### 2.2 Install Payment SDK

```bash
cd web
npm install mercadopago
```

### 2.3 Update .env.local

Add these lines:

```env
MERCADO_PAGO_ACCESS_TOKEN=APP_USR_YOUR_TOKEN_HERE
MERCADO_PAGO_WEBHOOK_SECRET=test_webhook_secret_for_sandbox
```

Replace with your actual token.

### 2.4 Update Payment Library

Edit `web/lib/pix.ts` - replace the placeholder `createPixTransaction` function:

```typescript
import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN || '',
});

export async function createPixTransaction(params: {
  amount: number;
  description: string;
  orderId: string;
  expirationSeconds: number;
}): Promise<{
  transactionId: string;
  qrCode: string;
  qrCodeUrl: string;
  expiresAt: Date;
}> {
  try {
    const payment = new Payment(client);
    
    // Create QR for PIX
    const result = await payment.create({
      body: {
        additional_info: {
          items: [{
            id: params.orderId,
            title: params.description,
            unit_price: params.amount,
            quantity: 1,
          }],
        },
        description: params.description,
        external_reference: params.orderId,
        items: [{
          id: params.orderId,
          title: params.description,
          unit_price: params.amount,
          quantity: 1,
        }],
        payer: {
          email: 'customer@example.com',
        },
        payment_method_id: 'pix',
        transaction_amount: params.amount,
      },
    });

    const expiresAt = new Date(
      Date.now() + params.expirationSeconds * 1000
    );

    return {
      transactionId: result.id?.toString() || params.orderId,
      qrCode: result.point_of_interaction?.transaction_data?.qr_code || '',
      qrCodeUrl: result.point_of_interaction?.transaction_data?.qr_code_url || '',
      expiresAt,
    };
  } catch (error) {
    console.error('PIX transaction creation failed:', error);
    throw error;
  }
}
```

### 2.5 Set Webhook URL

In Mercado Pago dashboard:
1. Go to Settings → Webhooks
2. Add new webhook
3. URL: `https://your-domain.com/api/payment/webhook`
4. For localhost testing, use ngrok:
   ```bash
   ngrok http 3000
   ```
   Use the ngrok URL instead

### 2.6 Test Payment Flow

1. Visit http://localhost:3000/pagamento
2. Select a payment plan
3. QR code should display
4. Check console logs for PIX transaction details
5. In Mercado Pago sandbox, simulate payment confirmation

**If QR doesn't show**:
- Check console for errors
- Verify API token is correct
- Check that Mercado Pago SDK is installed
- Look at Network tab in DevTools

---

## Step 3: Complete Flow Test

Once both email and payment are working:

### 3.1 Student Payment Flow

```
1. Login as student
2. Visit /pagamento
3. Select plan → QR code displays
4. Email arrives: "paymentInitiated" with QR
5. Simulate payment in sandbox
6. Status updates → Student enrolled
7. Email arrives: "paymentConfirmed"
8. Check teacher dashboard → new student shows
9. StudentProfile.lessonBalance updated
```

### 3.2 Teacher Receives Notifications

```
1. Teacher checks dashboard
2. New student appears in student list
3. Email received: "studentEnrolled"
4. Earnings dashboard updates
```

### 3.3 Verify Database

Open Prisma Studio:
```bash
npx prisma studio
```

Check:
- ClassPurchase: status should be "completed"
- Class: students array includes the new student
- StudentProfile: lessonBalance updated
- User: emails are correct

---

## Troubleshooting

### Email Not Sending

**Problem**: GET /api/test-email returns error

**Solutions**:
1. Check `.env.local` exists in workspace root
2. Verify API key format: `SG.xxxx...` (starts with SG.)
3. Restart dev server after changing .env
4. Check SendGrid dashboard → API Keys (is it active?)
5. Look at dev server console for error message

### Payment QR Not Generating

**Problem**: /pagamento shows nothing or error

**Solutions**:
1. Check Mercado Pago token is correct
2. Verify mercadopago SDK is installed: `npm list mercadopago`
3. Check dev server logs for API errors
4. Try in new incognito window
5. Verify you're logged in as a student (not teacher)

### Webhook Not Receiving

**Problem**: Payment is made but student not enrolled

**Solutions**:
1. Check webhook URL in Mercado Pago dashboard
2. For localhost: use ngrok URL, not localhost:3000
3. Check webhook logs in Mercado Pago dashboard
4. Verify /api/payment/webhook returns 200 status
5. Check firewall isn't blocking webhooks

### Can't Login / Auth Issues

**Solutions**:
1. Check DATABASE_URL in .env
2. Verify NextAuth is configured
3. Check you have a user with role "student" or "teacher"
4. Clear browser cookies and try again

---

## Production Checklist

Before going live:

- [ ] Email provider account created
- [ ] SendGrid API key working (test email sent)
- [ ] Payment provider account created  
- [ ] Mercado Pago token configured and working
- [ ] Full payment flow works end-to-end
- [ ] Emails sending in payment flow
- [ ] Teacher dashboard shows correct data
- [ ] Database backups configured
- [ ] Error monitoring set up (Sentry/etc)
- [ ] Email provider verified domain
- [ ] Payment provider webhook verified
- [ ] `.env.local` values copied to production

---

## Timeline

- **Email setup**: 30 minutes
- **Payment provider signup**: 15 minutes
- **Payment SDK integration**: 1 hour
- **Testing & debugging**: 1-2 hours
- **Total**: 2-3 hours for complete working system

---

## Next Steps After Setup

Once emails and payments are working:

1. **Add More Email Triggers**
   - Class reminders (24h before)
   - Report completions
   - Teacher payouts

2. **Build More Teacher Pages**
   - Class scheduling
   - Attendance tracking
   - Report writing

3. **Optimize & Scale**
   - Email queue system
   - Payment webhook retry logic
   - Analytics dashboard

4. **Deploy to Production**
   - Set up Vercel/Netlify
   - Configure production env vars
   - Test in production environment

---

## Need Help?

If something doesn't work:

1. Check the detailed guides:
   - `EMAIL_SETUP_GUIDE.md`
   - `PIX_IMPLEMENTATION_GUIDE.md`
   - `INTEGRATION_GUIDE.md`

2. Look at code comments in:
   - `web/lib/email.ts`
   - `web/lib/pix.ts`
   - `web/app/api/payment/webhook/route.ts`

3. Check console logs:
   - Dev server: Terminal output
   - Browser: F12 → Console
   - Network: F12 → Network tab

4. Verify configuration:
   - `.env.local` exists in workspace root
   - Environment variables loaded (restart server)
   - API keys are correct format
   - Database connected

---

## Success!

When you see:
1. ✅ QR code displays for payment
2. ✅ Email received with QR link
3. ✅ Payment completed in sandbox
4. ✅ Student automatically enrolled
5. ✅ Teacher dashboard updated
6. ✅ Confirmation email received

...you have a fully working payment system! 🎉

Go celebrate, then continue with the optional features in the next section of this guide.

