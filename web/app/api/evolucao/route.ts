import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const period = searchParams.get("period") || "6m"; // 1m, 3m, 6m, 1y, all
    const studentId = searchParams.get("studentId"); // Opcional - para professor ver aluno específico

    // Calcular data inicial baseado no período
    const now = new Date();
    let startDate: Date;
    
    switch (period) {
      case "1m":
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case "3m":
        startDate = new Date(now.setMonth(now.getMonth() - 3));
        break;
      case "6m":
        startDate = new Date(now.setMonth(now.getMonth() - 6));
        break;
      case "1y":
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        startDate = new Date(0); // Desde o início
    }

    // Buscar o usuário
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        adminProfile: true,
        studentProfile: true
      }
    });

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    const isAdmin = user.adminProfile !== null;
    const targetUserId = isAdmin && studentId ? studentId : user.id;

    // Buscar o perfil do estudante
    const studentProfile = await prisma.studentProfile.findUnique({
      where: { userId: targetUserId }
    });

    if (!studentProfile) {
      return NextResponse.json({ 
        error: "Perfil de estudante não encontrado",
        evaluations: [],
        summary: null
      });
    }

    // Buscar avaliações de estrutura
    const structureEvals = await prisma.structureEvaluation.findMany({
      where: {
        studentProfileId: studentProfile.id,
        createdAt: { gte: startDate }
      },
      include: {
        class: {
          select: { scheduledAt: true, title: true }
        }
      },
      orderBy: { createdAt: "asc" }
    });

    // Buscar avaliações de modelagem
    const modelingEvals = await prisma.modelingEvaluation.findMany({
      where: {
        studentProfileId: studentProfile.id,
        createdAt: { gte: startDate }
      },
      include: {
        class: {
          select: { scheduledAt: true, title: true }
        }
      },
      orderBy: { createdAt: "asc" }
    });

    // Buscar avaliações de expressão
    const expressionEvals = await prisma.expressionEvaluation.findMany({
      where: {
        studentProfileId: studentProfile.id,
        createdAt: { gte: startDate }
      },
      include: {
        class: {
          select: { scheduledAt: true, title: true }
        }
      },
      orderBy: { createdAt: "asc" }
    });

    // Combinar e formatar os dados para o gráfico
    const allDates = new Set<string>();
    
    structureEvals.forEach(e => allDates.add(e.class.scheduledAt.toISOString().split('T')[0]));
    modelingEvals.forEach(e => allDates.add(e.class.scheduledAt.toISOString().split('T')[0]));
    expressionEvals.forEach(e => allDates.add(e.class.scheduledAt.toISOString().split('T')[0]));

    const sortedDates = Array.from(allDates).sort();

    // Criar dados do gráfico
    const chartData = sortedDates.map(date => {
      const structureEval = structureEvals.find(e => 
        e.class.scheduledAt.toISOString().split('T')[0] === date
      );
      const modelingEval = modelingEvals.find(e => 
        e.class.scheduledAt.toISOString().split('T')[0] === date
      );
      const expressionEval = expressionEvals.find(e => 
        e.class.scheduledAt.toISOString().split('T')[0] === date
      );

      return {
        date,
        dateFormatted: new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
        estrutura: structureEval?.finalGrade || null,
        modelagem: modelingEval?.finalGrade || null,
        expressao: expressionEval?.finalGrade || null,
        // Detalhes de estrutura
        suporteRespiratorio: structureEval?.breathSupport || null,
        fechamentoGlotico: structureEval?.glotticClosure || null,
        registrosVocais: structureEval?.vocalRegisters || null,
        estabilidadeLaringea: structureEval?.laryngealStability || null,
        // Detalhes de modelagem
        ajusteTratVocal: modelingEval?.vocalTractAdjust || null,
        eficienciaFonteFilterro: modelingEval?.sourceFilterEff || null,
        diccao: modelingEval?.diction || null,
        timbre: modelingEval?.timbre || null,
        // Detalhes de expressão
        interpretacao: expressionEval?.interpretation || null,
        selecaoRepertorio: expressionEval?.repertoireSelection || null,
        coerenciaArtistica: expressionEval?.artisticCoherence || null,
      };
    });

    // Calcular comparações de período
    const halfIndex = Math.floor(chartData.length / 2);
    const firstHalf = chartData.slice(0, halfIndex);
    const secondHalf = chartData.slice(halfIndex);

    const calcAverage = (data: typeof chartData, key: 'estrutura' | 'modelagem' | 'expressao') => {
      const values = data.map(d => d[key]).filter((v): v is number => v !== null);
      return values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
    };

    const comparison = {
      estrutura: {
        anterior: calcAverage(firstHalf, 'estrutura'),
        atual: calcAverage(secondHalf, 'estrutura'),
        variacao: calcAverage(secondHalf, 'estrutura') - calcAverage(firstHalf, 'estrutura')
      },
      modelagem: {
        anterior: calcAverage(firstHalf, 'modelagem'),
        atual: calcAverage(secondHalf, 'modelagem'),
        variacao: calcAverage(secondHalf, 'modelagem') - calcAverage(firstHalf, 'modelagem')
      },
      expressao: {
        anterior: calcAverage(firstHalf, 'expressao'),
        atual: calcAverage(secondHalf, 'expressao'),
        variacao: calcAverage(secondHalf, 'expressao') - calcAverage(firstHalf, 'expressao')
      }
    };

    // Buscar perfil vocal atual
    const vocalProfile = await prisma.vocalProfile.findUnique({
      where: { studentProfileId: studentProfile.id }
    });

    return NextResponse.json({
      chartData,
      comparison,
      currentProfile: vocalProfile,
      totalClasses: chartData.length,
      period
    });

  } catch (error) {
    console.error("Erro ao buscar evolução:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
