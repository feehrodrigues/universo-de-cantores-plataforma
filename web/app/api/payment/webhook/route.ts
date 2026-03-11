import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendTemplateEmail } from '@/lib/email';
import crypto from 'crypto';

/**
 * POST /api/payment/webhook
 * Receives payment notifications from payment provider (Mercado Pago, Pagar.me, etc.)
 * 
 * This endpoint handles payment status updates from your payment gateway
 * Configuration varies by provider - see payment provider documentation
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Verify webhook signature (implementation depends on payment provider)
    // This is a placeholder - adjust based on your payment provider's requirements
    const signature = req.headers.get('x-signature');
    if (signature) {
      const isValid = verifyWebhookSignature(body, signature);
      if (!isValid) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }

    // Extract payment info from provider's payload
    // This payload structure varies by payment provider
    const purchaseId = body.purchaseId || body.orderId || body.reference;
    const status = parsePaymentStatus(body.status);
    const paidDate = body.paidDate || body.created_at || new Date();

    if (!purchaseId) {
      console.error('No purchase ID in webhook:', body);
      return NextResponse.json(
        { error: 'Missing purchase ID' },
        { status: 400 }
      );
    }

    // Find and update the purchase
    const purchase = await prisma.classPurchase.findUnique({
      where: { id: purchaseId },
      include: {
        user: true,
        paymentPlan: true,
        class: {
          include: {
            students: true,
            instructor: true,
          },
        },
      },
    });

    if (!purchase) {
      console.error('Purchase not found:', purchaseId);
      return NextResponse.json(
        { error: 'Purchase not found' },
        { status: 404 }
      );
    }

    // Update purchase status
    const updatedPurchase = await prisma.classPurchase.update({
      where: { id: purchaseId },
      data: {
        paymentStatus: status,
        ...(status === 'completed' && { paymentDate: new Date(paidDate) }),
      },
    });

    // If payment completed, enroll student in class
    if (status === 'completed' && purchase.classId) {
      await prisma.class.update({
        where: { id: purchase.classId },
        data: {
          students: {
            connect: { id: purchase.userId },
          },
        },
      });
    }

    // Trigger post-payment actions (send emails, update profile, etc.)
    if (status === 'completed') {
      await handlePaymentCompleted(purchase);
    }

    return NextResponse.json({
      success: true,
      purchaseId,
      status,
      message: `Payment ${status} for purchase ${purchaseId}`,
    });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Verify webhook signature from payment provider
 * Implementation depends on your payment provider
 */
function verifyWebhookSignature(payload: any, signature: string): boolean {
  try {
    // This is provider-specific
    // Example for Mercado Pago:
    // const webhook_secret = process.env.MERCADO_PAGO_WEBHOOK_SECRET;
    // const hash = crypto
    //   .createHmac('sha256', webhook_secret!)
    //   .update(JSON.stringify(payload))
    //   .digest('hex');
    // return hash === signature;

    // For now, just accept all (implement your provider's verification)
    return true;
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}

/**
 * Parse payment status from provider's status field
 * Maps various provider statuses to our internal status
 */
function parsePaymentStatus(
  providerStatus: string
): 'pending' | 'completed' | 'failed' | 'expired' {
  const statusMap: Record<string, 'pending' | 'completed' | 'failed' | 'expired'> = {
    // Mercado Pago
    'approved': 'completed',
    'pending': 'pending',
    'rejected': 'failed',
    'cancelled': 'failed',
    'refunded': 'failed',
    'charged_back': 'failed',
    'in_process': 'pending',
    'in_mediation': 'pending',

    // Pagar.me / Generic
    'paid': 'completed',
    'waiting_payment': 'pending',
    'failed': 'failed',
    'processing': 'pending',
    'completed': 'completed',
  };

  return statusMap[providerStatus.toLowerCase()] || 'pending';
}

/**
 * Handle post-payment actions
 * - Update student profile
 * - Send notification emails
 * - Create student enrollment records
 */
async function handlePaymentCompleted(purchase: any): Promise<void> {
  try {
    // Update student profile with lessons
    if (purchase.user?.studentProfile) {
      const currentBalance = purchase.user.studentProfile.lessonBalance || 0;
      const newBalance = currentBalance + purchase.lessonsRemaining;

      await prisma.studentProfile.update({
        where: { id: purchase.user.studentProfile.id },
        data: {
          lessonBalance: newBalance,
          totalClassesBought: (purchase.user.studentProfile.totalClassesBought || 0) + 1,
        },
      });
    }

    // Send payment confirmation email to student
    if (purchase.user?.email) {
      const amountFormatted = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(purchase.paymentPlan.price);

      await sendTemplateEmail(purchase.user.email, 'paymentConfirmed', {
        studentName: purchase.user.name || 'Aluno',
        planName: purchase.paymentPlan.name,
        amount: amountFormatted,
        lessonsCredit: purchase.lessonsRemaining,
      });
    }

    // Send notification to instructor if class was purchased
    if (purchase.class?.instructor?.email) {
      await sendTemplateEmail(purchase.class.instructor.email, 'studentEnrolled', {
        teacherName: purchase.class.instructor.name || 'Professor',
        studentName: purchase.user.name || 'Novo aluno',
        className: purchase.class.title || 'Aula',
        classDate: new Date(purchase.class.scheduledAt).toLocaleDateString('pt-BR'),
      });
    }

    console.log(`Payment completed for purchase ${purchase.id}`);
  } catch (error) {
    console.error('Error handling payment completion:', error);
    // Don't throw - webhook should still return success
  }
}
