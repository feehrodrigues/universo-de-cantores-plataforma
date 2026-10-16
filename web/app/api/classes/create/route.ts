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
      return NextResponse.json({ error: "Apenas professores podem criar aulas" }, { status: 403 });
    }

    // Buscar o usuário para pegar o ID
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
    });

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    const body = await request.json();
    const {
      studentId,
      title,
      description,
      scheduledAt,
      duration,
      classType,
      paymentStatus,
      isRetroactive,
    } = body;

    // Validações
    if (!studentId) {
      return NextResponse.json({ error: "Selecione um aluno" }, { status: 400 });
    }

    if (!scheduledAt) {
      return NextResponse.json({ error: "Selecione data e hora" }, { status: 400 });
    }

    // Verificar se o aluno existe
    const student = await prisma.user.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      return NextResponse.json({ error: "Aluno não encontrado" }, { status: 404 });
    }

    const scheduledDate = new Date(scheduledAt);
    const now = new Date();

    // Se não for retroativo, verificar se a data está no futuro
    if (!isRetroactive && scheduledDate < now) {
      return NextResponse.json({ 
        error: "Data deve estar no futuro. Para aulas passadas, marque como retroativa." 
      }, { status: 400 });
    }

    // Criar a aula usando o modelo Class
    const classData = await prisma.class.create({
      data: {
        instructorId: user.id,
        title: title || "Aula de Canto",
        description,
        scheduledAt: scheduledDate,
        duration: duration || 60,
        classType: classType || "online",
        paymentStatus: paymentStatus || "pending",
        // Conectar o aluno
        students: {
          connect: { id: studentId }
        }
      },
      include: {
        students: {
          select: {
            name: true,
            email: true,
          },
        },
        instructor: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json({ 
      success: true, 
      class: classData,
      message: isRetroactive 
        ? "Aula retroativa registrada com sucesso" 
        : "Aula agendada com sucesso"
    });

  } catch (error) {
    console.error("Erro ao criar aula:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
