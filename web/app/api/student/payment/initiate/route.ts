import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { sendTemplateEmail } from '@/lib/email';
import {
  generatePixTransactionId,
  createPixTransaction,
  calculatePixDeadline,
  formatBRL,
} from '@/lib/pix';

interface PaymentRequest {
  paymentPlanId: string;
  classId?: string;
}

/**
 * POST /api/student/payment/initiate
 * Creates a ClassPurchase and generates a PIX QR code
 */
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { studentProfile: true },
    });

    if (!user?.studentProfile) {
      return NextResponse.json(
        { error: 'Student profile not found' },
        { status: 404 }
      );
    }

    const body: PaymentRequest = await req.json();
    const { paymentPlanId, classId } = body;

    if (!paymentPlanId) {
      return NextResponse.json(
        { error: 'paymentPlanId required' },
        { status: 400 }
      );
    }

    // Get the payment plan details
    const plan = await prisma.paymentPlan.findUnique({
      where: { id: paymentPlanId },
    });

    if (!plan) {
      return NextResponse.json(
        { error: 'Payment plan not found' },
        { status: 404 }
      );
    }

    // Create ClassPurchase record
    const paymentDeadline = calculatePixDeadline(60); // 1 hour to pay
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + plan.validityDays);

    const purchase = await prisma.classPurchase.create({
      data: {
        userId: user.id,
        paymentPlanId,
        paymentDeadline,
        expiresAt: expiryDate,
        lessonsRemaining: plan.lessonsIncluded,
        paymentStatus: 'pending',
        ...(classId && { classId }),
      },
      include: {
        paymentPlan: true,
      },
    });

    // Generate PIX transaction
    const transactionId = generatePixTransactionId();
    const pixTransaction = await createPixTransaction({
      amount: plan.price,
      description: `${plan.name} - Universo de Cantores`,
      recipientKey: process.env.PIX_KEY || '', // Should be configured in env
      recipientName: 'Universo de Cantores',
      orderId: purchase.id,
      expirationSeconds: 3600,
    });

    // Update purchase with PIX info
    const updatedPurchase = await prisma.classPurchase.update({
      where: { id: purchase.id },
      data: {
        pixQrCode: pixTransaction.qrCode,
      },
      include: {
        paymentPlan: true,
      },
    });

    // Send payment initiated email
    try {
      await sendTemplateEmail(user.email, 'paymentInitiated', {
        studentName: user.name || 'Aluno',
        planName: plan.name,
        amount: formatBRL(plan.price),
        lessonsIncluded: plan.lessonsIncluded,
        expiresAt: paymentDeadline.toLocaleString('pt-BR'),
        qrCodeData: pixTransaction.qrCode,
      });
    } catch (emailError) {
      // Log but don't fail the payment if email sending fails
      console.error('Failed to send payment initiated email:', emailError);
    }

    return NextResponse.json({
      success: true,
      purchase: {
        id: updatedPurchase.id,
        amount: plan.price,
        amountFormatted: formatBRL(plan.price),
        plan: {
          name: plan.name,
          lessons: plan.lessonsIncluded,
          duration: plan.duration,
        },
        deadline: paymentDeadline.toISOString(),
        expiresAt: expiryDate.toISOString(),
      },
      pix: {
        transactionId: pixTransaction.transactionId,
        qrCode: pixTransaction.qrCode,
        qrCodeUrl: pixTransaction.qrCodeUrl,
        expiresAt: pixTransaction.expiresAt,
      },
    });
  } catch (error) {
    console.error('Payment initiation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
