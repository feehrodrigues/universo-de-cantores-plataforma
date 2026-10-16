import { NextRequest, NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await getAuthSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Verificar se é professor pela session
    if (session.user.role !== "teacher" && session.user.role !== "admin") {
      return NextResponse.json({ error: "Apenas professores podem criar relatórios" }, { status: 403 });
    }

    const body = await request.json();
    const {
      studentId,
      classId,
      evaluations,
      generalNotes,
      exercisesDone,
      homework,
      averages,
    } = body;

    // Validações
    if (!studentId) {
      return NextResponse.json({ error: "Selecione um aluno" }, { status: 400 });
    }

    // Buscar ou criar StudentProfile
    let studentProfile = await prisma.studentProfile.findUnique({
      where: { userId: studentId },
    });

    if (!studentProfile) {
      studentProfile = await prisma.studentProfile.create({
        data: { userId: studentId },
      });
    }

    // Se tiver classId, criar relatório vinculado à aula
    let classReport = null;
    let structureEval = null;
    let modelingEval = null;
    let expressionEval = null;

    // Processar avaliações por dimensão
    const structureItems: Record<string, number> = {};
    const modelingItems: Record<string, number> = {};
    const expressionItems: Record<string, number> = {};

    Object.entries(evaluations as Record<string, number>).forEach(([itemId, grade]) => {
      if (itemId.startsWith("ES-")) {
        structureItems[itemId] = grade;
      } else if (itemId.startsWith("MO-")) {
        modelingItems[itemId] = grade;
      } else if (itemId.startsWith("EX-")) {
        expressionItems[itemId] = grade;
      }
    });

    // Se tiver aula específica, criar avaliações vinculadas
    if (classId) {
      // Verificar se aula existe
      const classExists = await prisma.class.findUnique({
        where: { id: classId },
      });

      if (classExists) {
        // Criar relatório da aula (se não existir)
        classReport = await prisma.classReport.upsert({
          where: { classId },
          create: {
            classId,
            userId: studentId,
            technicalAnalysis: JSON.stringify(evaluations),
            studentObservations: generalNotes,
            homework,
            nextFocusAreas: exercisesDone,
            completedAt: new Date(),
          },
          update: {
            technicalAnalysis: JSON.stringify(evaluations),
            studentObservations: generalNotes,
            homework,
            nextFocusAreas: exercisesDone,
            completedAt: new Date(),
          },
        });

        // Criar avaliação de estrutura
        if (Object.keys(structureItems).length > 0) {
          structureEval = await prisma.structureEvaluation.create({
            data: {
              classId,
              studentProfileId: studentProfile.id,
              breathSupport: structureItems["ES-1.1.1.1"] || structureItems["ES-1.2"] || null,
              glotticClosure: structureItems["ES-2.1.1.1"] || structureItems["ES-2.1.1.4"] || null,
              vocalRegisters: structureItems["ES-3.1.1"] || structureItems["ES-3.1.2"] || null,
              laryngealStability: structureItems["ES-4.1.1.1"] || structureItems["ES-4.1.1.2"] || null,
              compensationReduction: structureItems["ES-5.1"] || structureItems["ES-5.2"] || null,
              finalGrade: averages?.structure || 0,
              notes: JSON.stringify(structureItems),
            },
          });
        }

        // Criar avaliação de modelagem
        if (Object.keys(modelingItems).length > 0) {
          modelingEval = await prisma.modelingEvaluation.create({
            data: {
              classId,
              studentProfileId: studentProfile.id,
              vocalTractAdjust: modelingItems["MO-1.1"] || modelingItems["MO-1.2.1.1"] || null,
              sourceFilterEff: modelingItems["MO-2.1"] || modelingItems["MO-2.3"] || null,
              diction: modelingItems["MO-3.1.1"] || modelingItems["MO-3.1.2"] || null,
              timbre: modelingItems["MO-4.1"] || modelingItems["MO-4.2"] || null,
              finalGrade: averages?.modeling || 0,
              notes: JSON.stringify(modelingItems),
            },
          });
        }

        // Criar avaliação de expressão
        if (Object.keys(expressionItems).length > 0) {
          expressionEval = await prisma.expressionEvaluation.create({
            data: {
              classId,
              studentProfileId: studentProfile.id,
              interpretation: expressionItems["EX-1.1.1"] || expressionItems["EX-1.1.4.1"] || null,
              repertoireSelection: expressionItems["EX-1.1.3"] || null,
              artisticCoherence: expressionItems["EX-3.1.1"] || expressionItems["EX-3.1.2"] || null,
              finalGrade: averages?.expression || 0,
              notes: JSON.stringify(expressionItems),
            },
          });
        }
      }
    }

    // Atualizar VocalProfile com médias
    await prisma.vocalProfile.upsert({
      where: { studentProfileId: studentProfile.id },
      create: {
        studentProfileId: studentProfile.id,
        avgStructureGrade: averages?.structure || 0,
        avgModelingGrade: averages?.modeling || 0,
        avgExpressionGrade: averages?.expression || 0,
        overallGrade: ((averages?.structure || 0) + (averages?.modeling || 0) + (averages?.expression || 0)) / 3,
        lastClassDate: new Date(),
        totalClassesTaken: 1,
      },
      update: {
        avgStructureGrade: averages?.structure || 0,
        avgModelingGrade: averages?.modeling || 0,
        avgExpressionGrade: averages?.expression || 0,
        overallGrade: ((averages?.structure || 0) + (averages?.modeling || 0) + (averages?.expression || 0)) / 3,
        lastClassDate: new Date(),
        totalClassesTaken: { increment: 1 },
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: "Relatório salvo com sucesso",
      data: {
        classReport,
        structureEval,
        modelingEval,
        expressionEval,
      }
    });

  } catch (error) {
    console.error("Erro ao criar relatório:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
