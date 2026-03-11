import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { classId, userId, technicalAnalysis, studentObservations, homework, nextFocusAreas,
      structure, modeling, expression } = body;

    if (!classId || !userId) {
      return NextResponse.json({ error: "Dados insuficientes" }, { status: 400 });
    }

    const report = await prisma.classReport.create({
      data: {
        class: { connect: { id: classId } },
        user: { connect: { id: userId } },
        technicalAnalysis,
        studentObservations,
        homework,
        nextFocusAreas,
        completedAt: new Date(),
      },
    });

    // avaliações E.M.E. opcionais
    if (structure) {
      await prisma.structureEvaluation.create({ data: { ...structure, classId, studentProfileId: structure.studentProfileId } });
    }
    if (modeling) {
      await prisma.modelingEvaluation.create({ data: { ...modeling, classId, studentProfileId: modeling.studentProfileId } });
    }
    if (expression) {
      await prisma.expressionEvaluation.create({ data: { ...expression, classId, studentProfileId: expression.studentProfileId } });
    }

    // marca a aula como concluída
    await prisma.class.update({
      where: { id: classId },
      data: { paymentStatus: 'completed' }
    });

    return NextResponse.json(report);
  } catch (error) {
    console.error("Erro ao salvar relatório:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}