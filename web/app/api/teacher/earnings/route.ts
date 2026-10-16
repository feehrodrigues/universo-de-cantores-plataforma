import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/teacher/earnings
 * Get earnings and commission data for an instructor
 */
export async function GET() {
  try {
    const session = await getAuthSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const instructor = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!instructor) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const now = new Date();
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    // Get completed classes this month
    const thisMonthClasses = await prisma.class.findMany({
      where: {
        instructorId: instructor.id,
        scheduledAt: {
          gte: currentMonth,
          lt: new Date(now.getFullYear(), now.getMonth() + 1, 1),
        },
        report: {
          isNot: null,
        },
      },
      include: {
        students: true,
        purchase: {
          include: {
            paymentPlan: true,
          },
        },
      },
    });

    const lastMonthClasses = await prisma.class.findMany({
      where: {
        instructorId: instructor.id,
        scheduledAt: {
          gte: lastMonth,
          lt: currentMonth,
        },
        report: {
          isNot: null,
        },
      },
      include: {
        purchase: {
          include: {
            paymentPlan: true,
          },
        },
      },
    });

    // Calculate earnings
    // Assuming instructor gets 70% of each class/plan value
    const INSTRUCTOR_COMMISSION_RATE = 0.7;

    const thisMonthRevenue = thisMonthClasses.reduce((sum, classItem) => {
      const amount = classItem.purchase?.paymentPlan.price || 0;
      return sum + amount * INSTRUCTOR_COMMISSION_RATE;
    }, 0);

    const lastMonthRevenue = lastMonthClasses.reduce((sum, classItem) => {
      const amount = classItem.purchase?.paymentPlan.price || 0;
      return sum + amount * INSTRUCTOR_COMMISSION_RATE;
    }, 0);

    // Calculate monthly breakdown
    const monthlyData = [];
    for (let i = 11; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);

      const monthClasses = await prisma.class.findMany({
        where: {
          instructorId: instructor.id,
          scheduledAt: {
            gte: monthDate,
            lt: nextMonth,
          },
          report: {
            isNot: null,
          },
        },
        include: {
          purchase: {
            include: {
              paymentPlan: true,
            },
          },
        },
      });

      const revenue = monthClasses.reduce((sum, classItem) => {
        const amount = classItem.purchase?.paymentPlan.price || 0;
        return sum + amount * INSTRUCTOR_COMMISSION_RATE;
      }, 0);

      monthlyData.push({
        month: monthDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }),
        revenue,
        classCount: monthClasses.length,
      });
    }

    // Total stats
    const totalClasses = await prisma.class.count({
      where: {
        instructorId: instructor.id,
        report: {
          isNot: null,
        },
      },
    });

    const totalRevenue = monthlyData.reduce((sum, data) => sum + data.revenue, 0);

    return NextResponse.json({
      currentMonth: {
        classes: thisMonthClasses.length,
        revenue: thisMonthRevenue,
        revenueFormatted: new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format(thisMonthRevenue),
      },
      lastMonth: {
        classes: lastMonthClasses.length,
        revenue: lastMonthRevenue,
        revenueFormatted: new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format(lastMonthRevenue),
      },
      totals: {
        classes: totalClasses,
        revenue: totalRevenue,
        revenueFormatted: new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format(totalRevenue),
        averagePerClass: totalClasses > 0 ? totalRevenue / totalClasses : 0,
      },
      monthlyBreakdown: monthlyData,
      commissionRate: INSTRUCTOR_COMMISSION_RATE * 100,
    });
  } catch (error) {
    console.error('Teacher earnings error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
