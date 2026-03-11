import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Verificar role pela session
    const userRole = (session.user as any).role;
    if (userRole !== "teacher" && userRole !== "admin") {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }

    // Buscar usuário para pegar ID
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
    });

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    // Buscar aulas do professor
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");
    const studentId = searchParams.get("studentId");

    const whereClause: any = {};

    // Se for professor, filtrar apenas suas aulas
    if (userRole === "teacher") {
      whereClause.instructorId = user.id;
    }

    if (status) {
      if (status === "completed") {
        whereClause.scheduledAt = { lt: new Date() };
      } else if (status === "upcoming") {
        whereClause.scheduledAt = { gte: new Date() };
      }
    }

    if (studentId) {
      whereClause.students = { some: { id: studentId } };
    }

    const classes = await prisma.class.findMany({
      where: whereClause,
      include: {
        students: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        instructor: {
          select: {
            name: true,
          },
        },
        report: true,
      },
      orderBy: { scheduledAt: "desc" },
      take: 100,
    });

    // Transformar para formato esperado pelo componente
    const formattedClasses = classes.map((c: any) => ({
      id: c.id,
      title: c.title,
      scheduledAt: c.scheduledAt.toISOString(),
      duration: c.duration,
      paymentStatus: c.paymentStatus,
      classType: c.classType,
      student: c.students[0] || { name: "N/A", email: "" },
      hasReport: !!c.report,
    }));

    return NextResponse.json({ 
      classes: formattedClasses,
      teacherName: user.name || "Professor",
    });

  } catch (error) {
    console.error("Erro ao buscar aulas:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
