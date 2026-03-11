import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  
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

    // Get all reports to calculate evolution
    const reports = await prisma.classReport.findMany({
      where: {
        class: {
          students: {
            some: { id: user.id },
          },
        },
      },
      include: {
        class: true,
      },
      orderBy: { createdAt: "asc" },
    });

    // Get evaluations for these classes
    const classIds = reports.map((r) => r.classId);
    const structures = await prisma.structureEvaluation.findMany({
      where: { classId: { in: classIds } },
    });
    const modelings = await prisma.modelingEvaluation.findMany({
      where: { classId: { in: classIds } },
    });
    const expressions = await prisma.expressionEvaluation.findMany({
      where: { classId: { in: classIds } },
    });

    // Calculate structure grades
    const structureGrades = structures.map((s) => s.finalGrade || 0);
    const averageStructure = structureGrades.length > 0
      ? (structureGrades.reduce((a, b) => a + b, 0) / structureGrades.length).toFixed(2)
      : "0";

    // Calculate modeling grades
    const modelingGrades = modelings.map((m) => m.finalGrade || 0);
    const averageModeling = modelingGrades.length > 0
      ? (modelingGrades.reduce((a, b) => a + b, 0) / modelingGrades.length).toFixed(2)
      : "0";

    // Calculate expression grades
    const expressionGrades = expressions.map((e) => e.finalGrade || 0);
    const averageExpression = expressionGrades.length > 0
      ? (expressionGrades.reduce((a, b) => a + b, 0) / expressionGrades.length).toFixed(2)
      : "0";

    // Calculate trends
    const getTrend = (values: number[]) => {
      if (values.length < 2) return 0;
      const first = values.slice(0, Math.floor(values.length / 2));
      const last = values.slice(Math.floor(values.length / 2));
      const avgFirst = first.reduce((a, b) => a + b, 0) / first.length;
      const avgLast = last.reduce((a, b) => a + b, 0) / last.length;
      return parseFloat((avgLast - avgFirst).toFixed(2));
    };

    return NextResponse.json({
      reportCount: reports.length,
      averageGrade: ((parseFloat(averageStructure) + parseFloat(averageModeling) + parseFloat(averageExpression)) / 3).toFixed(2),
      averageStructure,
      averageModeling,
      averageExpression,
      trends: {
        structure: getTrend(structureGrades),
        modeling: getTrend(modelingGrades),
        expression: getTrend(expressionGrades),
      },
      classesCompleted: reports.length,
      monthlyProgress: {
        abril: { focus: "Ressonância e projeção", progress: 65 },
        maio: { focus: "Performance e palco", progress: 45 },
        junho: { focus: "Consolidação técnica", progress: 20 },
      },
    });
  } catch (error) {
    console.error("Evolution error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
