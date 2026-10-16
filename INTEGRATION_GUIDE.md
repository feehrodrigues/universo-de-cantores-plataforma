# Complete Payment & Email Integration Guide

This document explains how the payment system, email notifications, and teacher dashboard all work together in your application.

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    STUDENT PAYMENT FLOW                     │
└─────────────────────────────────────────────────────────────┘

1. Student visits /pagamento
   ↓
2. Selects payment plan
   ↓
3. POST /api/student/payment/initiate
   ├─ Creates ClassPurchase record
   ├─ Generates PIX QR code
   └─ SENDS: "paymentInitiated" email
   ↓
4. Shows PixPaymentComponent with QR
   ├─ QR displayed on screen
   ├─ Student scans with their bank app
   └─ Polls /api/student/payment/status every 5s
   ↓
5. Student completes payment in bank app
   ↓
6. Payment provider sends webhook to /api/payment/webhook
   ├─ Verifies webhook signature
   ├─ Updates ClassPurchase status → "completed"
   ├─ Enrolls student in class
   ├─ Updates StudentProfile.lessonBalance
   └─ SENDS: "paymentConfirmed" email to student
          & "studentEnrolled" email to teacher
   ↓
7. Student's payment polling detects status change
   ↓
8. PixPaymentComponent shows success
   └─ Redirects to /dashboard

┌─────────────────────────────────────────────────────────────┐
│                    TEACHER DASHBOARD FLOW                   │
└─────────────────────────────────────────────────────────────┘

1. Teacher visits /teacher/dashboard
   ├─ Shows metrics: students, classes, pending reports
   ├─ Shows upcoming classes
   └─ Shows classes needing reports
   ↓
2. Teacher visits /teacher/students
   ├─ Fetches from /api/teacher/students
   └─ Shows all students with lesson balance
   ↓
3. Teacher visits /teacher/earnings
   ├─ Fetches from /api/teacher/earnings
   └─ Shows commission breakdown by month
   ↓
4. Teacher completes class evaluation
   ├─ Creates evaluation records
   └─ SENDS: "reportAvailable" email to student
   ↓
5. Teacher gets paid commission
   └─ SENDS: "paymentReceived" email with amount
```

## Database Schema Relationships

```
User (authenticated user)
├─ 1:1 → StudentProfile (if student)
├─ 1:M → ClassPurchase (payments made)
├─ 1:M → Class (if teacher, as instructor)
├─ M:M → Class (as student enrolled)
└─ 1:M → Evaluation (evaluations created)

PaymentPlan (pricing tiers)
├─ M:1 → ClassPurchase
├─ fields: name, price, lessonsIncluded, validityDays

ClassPurchase (payment transactions)
├─ M:1 → User
├─ M:1 → PaymentPlan
├─ M:1 → Class (optional)
├─ fields: paymentStatus, amount, pixQrCode, paymentDeadline
└─ triggers: payment webhook integration

Class (vocal lessons)
├─ M:1 → User (instructor)
├─ M:M → User (students enrolled)
├─ fields: title, description, scheduledAt, status
└─ 1:M → Evaluation (class evaluations)

Evaluation (student progress assessments)
├─ M:1 → User (student evaluated)
├─ M:1 → Class (for which class)
├─ fields: structure, modeling, expression, comments
└─ indicates: class report is complete
```

## API Endpoints Reference

### Student Payment APIs

**POST /api/student/payment/initiate**
- **Purpose**: Start payment process
- **Auth**: Required (session)
- **Request**: `{ paymentPlanId: string, classId?: string }`
- **Response**: 
  ```json
  {
    "purchase": {
      "id": "uuid",
      "amount": 160.00,
      "deadline": "2024-01-15T12:30:00Z",
      "expiresAt": "2024-01-15T12:40:00Z"
    },
    "pix": {
      "transactionId": "PAY-...",
      "qrCode": "url-encoded-qr-data",
      "expiresAt": "2024-01-15T12:40:00Z"
    }
  }
  ```
- **Triggers**: `paymentInitiated` email

**GET /api/student/payment/status**
- **Purpose**: Check payment status
- **Auth**: Required (session)
- **Query**: `?purchaseId=uuid`
- **Response**: 
  ```json
  {
    "id": "uuid",
    "status": "completed|pending|failed|expired",
    "amount": 160.00,
    "lessonsRemaining": 8,
    "deadline": "2024-01-15T12:30:00Z"
  }
  ```

### Payment Webhook API

**POST /api/payment/webhook**
- **Purpose**: Receive payment confirmations from provider
- **Auth**: Webhook signature verification
- **Payload**: Provider-specific (see payment provider docs)
- **Side Effects**:
  - Updates ClassPurchase.paymentStatus
  - Enrolls student in Class
  - Updates StudentProfile.lessonBalance
  - Sends `paymentConfirmed` email to student
  - Sends `studentEnrolled` email to teacher

### Teacher APIs

**GET /api/teacher/students**
- **Purpose**: Get all students for this teacher
- **Auth**: Required (teacher)
- **Response**: 
  ```json
  {
    "students": [
      {
        "id": "uuid",
        "name": "João Silva",
        "email": "joao@example.com",
        "classCount": 5,
        "lessonBalance": 3
      }
    ],
    "stats": {
      "totalStudents": 15,
      "totalClasses": 42,
      "completedClasses": 40
    }
  }
  ```

**GET /api/teacher/earnings**
- **Purpose**: Get commission earnings breakdown
- **Auth**: Required (teacher)
- **Response**: 
  ```json
  {
    "currentMonth": {
      "revenue": 560.00,
      "classCount": 8,
      "month": "January 2024"
    },
    "lastMonth": {
      "revenue": 420.00,
      "classCount": 6,
      "month": "December 2023"
    },
    "totals": {
      "lifetimeEarnings": 5600.00,
      "totalClasses": 80,
      "averagePerClass": 70.00,
      "commissionRate": 70
    },
    "monthlyBreakdown": [
      { "month": "January 2024", "revenue": 560.00, "classCount": 8 }
    ]
  }
  ```

## Environment Configuration

### Required Variables (Root `.env.local`)

```env
# Email Service (see EMAIL_SETUP_GUIDE.md)
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=SG.your_key_here

# Payment Provider (see PIX_IMPLEMENTATION_GUIDE.md)
MERCADO_PAGO_ACCESS_TOKEN=APP_USR_your_token
MERCADO_PAGO_WEBHOOK_SECRET=your_webhook_secret

# Database
DATABASE_URL=postgresql://user:password@host/database

# NextAuth
NEXTAUTH_SECRET=your_random_secret_here
NEXTAUTH_URL=http://localhost:3000
```

### Optional Variables

```env
# Email (for non-SendGrid providers)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=username
SMTP_PASS=password
SMTP_FROM_EMAIL=noreply@example.com
SMTP_FROM_NAME="Universo de Cantores"

# PIX Configuration
PIX_KEY=your-pix-key@bank.com.br
PIX_WEBHOOK_URL=https://your-domain.com/api/payment/webhook
```

## Email Templates

All templates are in `web/lib/email.ts`. Each template includes HTML and plain text versions.

### Available Templates

1. **paymentInitiated** - Sent when student starts PIX payment
2. **paymentConfirmed** - Sent when payment is received
3. **classReminder** - Sent before upcoming class
4. **reportAvailable** - Sent when evaluation is complete
5. **studentEnrolled** - Sent to teacher about new student
6. **paymentReceived** - Sent to teacher about commission

### Customizing Templates

Edit `web/lib/email.ts`:

```typescript
const templates: Record<string, EmailTemplate> = {
  paymentInitiated: {
    subject: 'Seu Pagamento via PIX - Universo de Cantores',
    html: `<h1>Olá {{studentName}}</h1>...`,
    text: 'Olá {{studentName}}...',
  },
  // ... more templates
};
```

Then use:
```typescript
await sendTemplateEmail(email, 'paymentInitiated', {
  studentName: 'João',
  planName: 'Plano Mensal',
  // ... more variables
});
```

## Implementation Checklist

### Phase 1: Email Setup ✅
- [x] Email library created with templates
- [x] Multiple provider support configured
- [ ] Email provider credentials configured (.env.local)
- [ ] Test email sending via test route

### Phase 2: Payment Provider Integration 🟡
- [x] PIX framework and utilities
- [x] Payment initiation endpoint
- [x] Webhook endpoint ready
- [x] Email integration in payment flow
- [ ] Integrate with actual payment provider SDK
- [ ] Webhook signature verification implemented
- [ ] Test PIX flow end-to-end

### Phase 3: Teacher Dashboard ✅
- [x] Dashboard page with metrics
- [x] Students management page
- [x] Earnings dashboard with charts
- [x] Students API with stats
- [x] Earnings API with commission calculation

### Phase 4: Complete Teacher Features 🟡
- [ ] Student detail page (/teacher/students/[id])
- [ ] Class management page (/teacher/classes)
- [ ] Class detail page with evaluation form
- [ ] Class scheduling interface
- [ ] Report writing interface
- [ ] Class calendar view

### Phase 5: Notifications Integration 🟡
- [x] Email service created
- [ ] Class reminder emails (24h before)
- [ ] Report available notifications
- [ ] Commission payment notifications
- [ ] Student enrollment notifications (done in webhook)

## Testing the System

### Test 1: Email Provider
1. Configure email provider (SendGrid/Gmail/etc)
2. Visit `/api/test-email` (after creating test route)
3. Check inbox for test email

### Test 2: Payment Flow
1. Start dev server: `npm run dev`
2. Visit `/pagamento` (authenticated)
3. Select a payment plan
4. QR code should display
5. Check logs for payment request
6. Check student's email for `paymentInitiated` email

### Test 3: Teacher Dashboard
1. Login as teacher
2. Visit `/teacher/dashboard` - should see metrics
3. Visit `/teacher/students` - should see students list
4. Visit `/teacher/earnings` - should see commission breakdown

### Test 4: Webhook (with payment provider sandbox)
1. Set up payment provider sandbox account
2. Configure webhook URL in provider dashboard
3. Simulate payment in sandbox
4. Check that webhook was received
5. Verify student was enrolled and email sent

## Performance Considerations

### Database Queries
- Student list: 1 query for classes + n queries per student (use batch)
- Earnings: Single query with month filtering + commission math
- Payment status: Direct lookup by ID

### Email Sending
- Emails are sent synchronously during requests
- Consider queue (Bull/RabbitMQ) for high volume
- Implement retry logic for failed sends

### PIX QR Codes
- Generated dynamically (not cached)
- Valid for 30 minutes by default
- Can be made shorter for production (10-15 min)

## Troubleshooting

### Email Not Sending
1. Check `.env.local` exists in workspace root
2. Verify `EMAIL_PROVIDER` value
3. Check provider credentials (API key, SMTP password)
4. Look at console logs for error messages
5. Check email provider logs/dashboard

### Payment Webhook Not Received
1. Verify webhook URL configured in provider dashboard
2. Test webhook delivery in provider sandbox
3. Check that endpoint returns 200 status
4. Use ngrok/similar for testing on localhost

### Student Not Enrolled After Payment
1. Verify webhook signature verification is correct
2. Check webhook payload structure matches parsePaymentStatus()
3. Ensure classId is included in ClassPurchase
4. Check database for ClassPurchase and Class records

### Teacher Dashboard Shows No Data
1. Verify teacher user has `role: 'teacher'`
2. Check database for Class records with instructorId
3. Verify Class.students relationship is populated
4. Check API response in Network tab

## Next Steps

1. **Configure Email Provider**
   - Follow EMAIL_SETUP_GUIDE.md
   - Test email sending

2. **Integrate Payment Provider**
   - Install payment provider SDK
   - Update lib/pix.ts
   - Test PIX flow

3. **Scale for Production**
   - Enable email queue system
   - Implement webhook retry logic
   - Add monitoring/alerting
   - Rate limit payment endpoints

4. **Add Missing Features**
   - Student detail pages
   - Class scheduling UI
   - Report evaluation forms
   - Calendar integration

## File Reference

Key files for this system:

- `web/lib/email.ts` - Email service with templates
- `web/lib/pix.ts` - PIX utilities
- `web/app/api/student/payment/initiate/route.ts` - Payment initiation
- `web/app/api/student/payment/status/route.ts` - Payment status check
- `web/app/api/payment/webhook/route.ts` - Payment confirmation webhook
- `web/app/teacher/dashboard/page.tsx` - Teacher main dashboard
- `web/app/teacher/students/page.tsx` - Student management
- `web/app/teacher/earnings/page.tsx` - Commission dashboard
- `web/app/api/teacher/students/route.ts` - Student data API
- `web/app/api/teacher/earnings/route.ts` - Earnings data API

## Support

For issues:
1. Check console logs: `npm run dev` output
2. Check network requests: Browser DevTools → Network
3. Check database: Verify records exist with Prisma Studio: `npx prisma studio`
4. Check email provider logs: SendGrid/Mailgun/etc dashboard

