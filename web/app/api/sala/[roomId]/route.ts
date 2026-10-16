import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    const session = await getAuthSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const resolvedParams = await params;
    const roomId = resolvedParams.roomId;

    // Buscar a aula pelo jitsiRoomId
    const classData = await prisma.class.findFirst({
      where: { jitsiRoomId: roomId },
      include: {
        students: {
          select: {
            id: true,
            name: true,
            email: true,
            studentProfile: {
              select: {
                generalGoal: true,
                vocalHistory: true,
                vocalProfile: {
                  select: {
                    avgStructureGrade: true,
                    avgModelingGrade: true,
                    avgExpressionGrade: true,
                    overallGrade: true,
                  }
                }
              }
            }
          }
        },
        instructor: {
          select: { id: true, name: true, email: true }
        },
        preBriefing: true,
        report: true,
      }
    });

    if (!classData) {
      return NextResponse.json({ error: "Aula não encontrada" }, { status: 404 });
    }

    // Verificar se o usuário é o instrutor ou aluno da aula
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    });

    const isInstructor = classData.instructorId === user?.id;
    const isStudent = classData.students.some((s: { id: string }) => s.id === user?.id);

    if (!isInstructor && !isStudent) {
      return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
    }

    return NextResponse.json({
      class: classData,
      role: isInstructor ? "instructor" : "student"
    });

  } catch (error) {
    console.error("Erro ao buscar dados da sala:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

// POST - Salvar anotações do professor durante a aula
export async function POST(
  req: Request,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    const session = await getAuthSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const resolvedParams = await params;
    const roomId = resolvedParams.roomId;
    const body = await req.json();

    const classData = await prisma.class.findFirst({
      where: { jitsiRoomId: roomId },
      select: { id: true, instructorId: true }
    });

    if (!classData) {
      return NextResponse.json({ error: "Aula não encontrada" }, { status: 404 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    });

    if (classData.instructorId !== user?.id) {
      return NextResponse.json({ error: "Apenas o professor pode salvar relatório" }, { status: 403 });
    }

    // Atualizar ou criar o relatório da aula
    const report = await prisma.classReport.upsert({
      where: { classId: classData.id },
      update: {
        technicalAnalysis: body.technicalAnalysis,
        studentObservations: body.studentObservations,
        homework: body.homework,
        nextFocusAreas: body.nextFocusAreas,
        updatedAt: new Date(),
      },
      create: {
        classId: classData.id,
        userId: user.id,
        technicalAnalysis: body.technicalAnalysis,
        studentObservations: body.studentObservations,
        homework: body.homework,
        nextFocusAreas: body.nextFocusAreas,
      }
    });

    return NextResponse.json({ success: true, report });

  } catch (error) {
    console.error("Erro ao salvar relatório:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
