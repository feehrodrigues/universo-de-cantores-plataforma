import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// cria ou lista aulas
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { instructorId, studentId, scheduledAt, title, description, classType, duration, paymentPlanId } = body;

    if (!instructorId || !scheduledAt) {
      return NextResponse.json({ error: "instructorId ou scheduledAt ausente" }, { status: 400 });
    }

    const data: any = {
      instructor: { connect: { id: instructorId } },
      scheduledAt: new Date(scheduledAt),
    };
    if (title) data.title = title;
    if (description) data.description = description;
    if (classType) data.classType = classType;
    if (duration) data.duration = duration;
    if (studentId) data.students = { connect: { id: studentId } };
    if (paymentPlanId) data.paymentStatus = "pending";

    const newClass = await prisma.class.create({ data });
    return NextResponse.json(newClass);
  } catch (error) {
    console.error("Erro na criação de aula:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function GET() {
  // retorna todas as aulas (futuras e passadas)
  try {
    const classes = await prisma.class.findMany({
      include: { instructor: true, students: true }
    });
    return NextResponse.json(classes);
  } catch (error) {
    console.error("Erro ao listar aulas:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}