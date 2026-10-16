# Email Service Setup Guide

Your application now has a complete email notification system with templates for all user scenarios. This guide explains how to configure email delivery.

## Overview

The email service (`lib/email.ts`) supports multiple SMTP providers:
- **SendGrid** (recommended - easiest setup)
- **Gmail** (using app passwords)
- **Mailgun** (reliable transactional email)
- **Generic SMTP** (any provider: Brevo, Zoho, etc.)

## Email Templates

The system automatically sends emails for:

1. **paymentInitiated** - When student starts payment process
   - Variables: studentName, planName, amount, lessonsIncluded, expiresAt, qrCodeData

2. **paymentConfirmed** - When payment is received
   - Variables: studentName, planName, amount, lessonsCredit

3. **classReminder** - Before an upcoming class
   - Variables: studentName, className, classDate, classTime

4. **reportAvailable** - When teacher completes evaluation
   - Variables: studentName, reportUrl

5. **studentEnrolled** - Notification to teacher of new enrollment
   - Variables: teacherName, studentName, className, classDate

6. **paymentReceived** - Commission payment notification to teacher
   - Variables: teacherName, amount, period

## Setup Instructions

### Option 1: SendGrid (Recommended)

**Easiest and most reliable for Brazil.**

1. Create a free account at [sendgrid.com](https://sendgrid.com)
2. Verify your sender email (or use a SendGrid domain)
3. Get your API key from Settings → API Keys
4. Create `.env.local` in the workspace root:

```env
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=SG.your_api_key_here
SENDGRID_FROM_EMAIL=noreply@universodecantores.com
SENDGRID_FROM_NAME="Universo de Cantores"
```

### Option 2: Gmail

1. Enable 2-factor authentication on your Gmail account
2. Generate an app password: [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
3. Copy the 16-character password
4. Create `.env.local`:

```env
EMAIL_PROVIDER=gmail
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your_16_char_app_password
SMTP_FROM_EMAIL=your-email@gmail.com
SMTP_FROM_NAME="Universo de Cantores"
```

### Option 3: Mailgun

1. Create account at [mailgun.com](https://mailgun.com)
2. Verify your domain or use the Mailgun sandbox
3. Get API credentials from Domain Settings
4. Create `.env.local`:

```env
EMAIL_PROVIDER=mailgun
MAILGUN_API_KEY=your_api_key
MAILGUN_DOMAIN=your-domain.mailgun.org
MAILGUN_FROM_EMAIL=noreply@your-domain.mailgun.org
MAILGUN_FROM_NAME="Universo de Cantores"
```

### Option 4: Generic SMTP

Works with Brevo, Zoho Mail, custom SMTP servers:

```env
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-username
SMTP_PASS=your-password
SMTP_FROM_EMAIL=sender@example.com
SMTP_FROM_NAME="Universo de Cantores"
```

## Configuration File Locations

After setup, your `.env.local` should look like:

```
# Email Configuration
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=SG.xxxxx

# PIX Payment Configuration (see PIX_IMPLEMENTATION_GUIDE.md)
MERCADO_PAGO_ACCESS_TOKEN=YOUR_TOKEN
MERCADO_PAGO_WEBHOOK_SECRET=YOUR_SECRET

# NextAuth
NEXTAUTH_SECRET=your-secret-here

# Database
DATABASE_URL=postgresql://...
```

## Testing Email Sending

### Quick Test Script

Create `test-email.js` in the root:

```javascript
const { sendTemplateEmail } = require('./web/lib/email');

async function test() {
  try {
    const result = await sendTemplateEmail('your-email@example.com', 'paymentInitiated', {
      studentName: 'João Silva',
      planName: 'Plano Mensal',
      amount: 'R$ 160,00',
      lessonsIncluded: 8,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000).toLocaleString('pt-BR'),
      qrCodeData: 'https://example.com/qr',
    });
    console.log('Email sent:', result);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

test();
```

Then run:
```bash
node test-email.js
```

**Note**: This requires setting up build configuration. See "Testing via API Route" below instead.

### Testing via API Route

1. Visit: `http://localhost:3000/api/test-email` (after creating the route below)
2. Check your email inbox

Create `web/app/api/test-email/route.ts`:

```typescript
import { sendTemplateEmail } from '@/lib/email';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Replace with your test email
    await sendTemplateEmail('your-email@example.com', 'paymentInitiated', {
      studentName: 'Teste de Email',
      planName: 'Plano Mensal',
      amount: 'R$ 160,00',
      lessonsIncluded: 8,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000).toLocaleString('pt-BR'),
      qrCodeData: 'https://example.com/qr',
    });

    return NextResponse.json({ success: true, message: 'Email sent!' });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
```

Then visit `http://localhost:3000/api/test-email` to test.

## Troubleshooting

### "SMTP Authentication Error"
- Double-check your SMTP credentials
- For Gmail: Confirm app password (not regular password)
- For SendGrid: Verify API key format (should start with `SG.`)

### "ECONNREFUSED" or "Connection Timeout"
- Verify SMTP_HOST is correct
- Check SMTP_PORT (usually 587 for TLS, 465 for SSL)
- Ensure firewall allows outbound SMTP connections

### "ENOTFOUND" Error
- Check .env.local is in correct location (workspace root)
- Restart dev server: `npm run dev`
- Verify environment variable is loaded: Check terminal output

### Email Not Being Sent in Production
- Verify same .env variables are set in production environment (Vercel/Netlify settings)
- Check email logs in your provider's dashboard
- Verify sender email is verified/configured in provider

## Email Template Customization

Edit templates in `lib/email.ts`:

```typescript
const templates: Record<string, EmailTemplate> = {
  paymentInitiated: {
    subject: 'seu novo assunto aqui',
    html: `<p>seu html aqui</p>`,
    text: 'texto simples aqui',
  },
  // ... outros templates
};
```

## Integration Points

Emails are automatically sent at these points:

1. **Payment Flow**
   - `app/api/student/payment/initiate/route.ts` → `paymentInitiated`
   - `app/api/payment/webhook/route.ts` → `paymentConfirmed` + `studentEnrolled`

2. **Class Management** (to be integrated)
   - Before class → `classReminder`
   - After completion → `reportAvailable`

3. **Teacher Notifications** (to be integrated)
   - Student enrollment → `studentEnrolled`
   - Commission payout → `paymentReceived`

## Best Practices

1. **Use a dedicated email account** - Avoid using personal email to reduce spam issues
2. **Monitor email delivery** - Check provider dashboard for bounces/complaints
3. **Test with development addresses first** - Before enabling for all users
4. **Set up DKIM/SPF** - Improves deliverability (provider documentation)
5. **Handle bounces** - Monitor and remove invalid email addresses

## Next Steps

1. Choose your email provider and follow the appropriate setup section above
2. Add environment variables to `.env.local`
3. Test using the API route method
4. Verify in your email inbox
5. Payment system will automatically send emails when students make payments
6. See [PIX_IMPLEMENTATION_GUIDE.md](./PIX_IMPLEMENTATION_GUIDE.md) to complete payment integration

For more info on the email service implementation, see the [lib/email.ts](./web/lib/email.ts) file.
