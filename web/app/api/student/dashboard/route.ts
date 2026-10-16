import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getAuthSession();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { studentProfile: true },
    });

    if (!user?.studentProfile) {
      return NextResponse.json({ error: "Student profile not found" }, { status: 404 });
    }

    // Get class purchases
    const purchases = await prisma.classPurchase.findMany({
      where: { userId: user.id },
      include: { paymentPlan: true },
    });

    // Calculate lessons remaining
    const lessonsRemaining = purchases.reduce((acc, p) => acc + (p.lessonsRemaining || 0), 0);
    const totalLessons = purchases.reduce((acc, p) => acc + (p.paymentPlan.lessonsIncluded || 0), 0);

    // Get next class
    const nextClass = await prisma.class.findFirst({
      where: {
        students: {
          some: { id: user.id },
        },
        scheduledAt: {
          gte: new Date(),
        },
      },
      orderBy: { scheduledAt: "asc" },
      include: {
        instructor: true,
      },
    });

    // Get completed classes this month
    const completedClasses = await prisma.class.count({
      where: {
        students: {
          some: { id: user.id },
        },
        report: {
          isNot: null,
        },
      },
    });

    // Get latest vocal evaluation for real vocal level
    const lastEvaluation = await prisma.structureEvaluation.findFirst({
      where: { studentProfileId: user.studentProfile.id },
      orderBy: { createdAt: 'desc' }
    });

    const vocalLevel = lastEvaluation?.finalGrade
      ? `${lastEvaluation.finalGrade.toFixed(1)}`
      : "Avaliação Pendente";

    return NextResponse.json({
      lessonsRemaining,
      totalLessons,
      nextClass,
      completedClasses,
      vocalLevel,
      studentProfile: {
        name: user.name || "Estudante",
        goal: user.studentProfile.overallGoal || user.studentProfile.generalGoal,
      },
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
