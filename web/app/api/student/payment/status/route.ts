import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/student/payment/status?purchaseId=xxx
 * Check the status of a PIX payment
 */
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const purchaseId = searchParams.get('purchaseId');

    if (!purchaseId) {
      return NextResponse.json(
        { error: 'purchaseId required' },
        { status: 400 }
      );
    }

    const purchase = await prisma.classPurchase.findUnique({
      where: { id: purchaseId },
      include: {
        paymentPlan: true,
      },
    });

    if (!purchase) {
      return NextResponse.json(
        { error: 'Purchase not found' },
        { status: 404 }
      );
    }

    // Verify the purchase belongs to current user
    if (purchase.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Check if payment deadline has passed
    const now = new Date();
    const isExpired = now > purchase.paymentDeadline;

    return NextResponse.json({
      id: purchase.id,
      status: isExpired && purchase.paymentStatus === 'pending' ? 'expired' : purchase.paymentStatus,
      amount: purchase.paymentPlan.price,
      lessonsRemaining: purchase.lessonsRemaining,
      deadline: purchase.paymentDeadline.toISOString(),
      expiresAt: purchase.expiresAt.toISOString(),
      paidAt: purchase.paymentDate?.toISOString() || null,
      plan: {
        name: purchase.paymentPlan.name,
        lessons: purchase.paymentPlan.lessonsIncluded,
      },
    });
  } catch (error) {
    console.error('Payment status check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
