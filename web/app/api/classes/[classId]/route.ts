import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PATCH /api/classes/[classId]
// Permite atribuir professor e agendar aula pendente
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ classId: string }> }
) {
  try {
    const { classId } = await params;
    const { instructorId, scheduledAt, title, description, classType, duration } = await req.json();
    const data: any = {};
    if (instructorId) data.instructor = { connect: { id: instructorId } };
    if (scheduledAt) data.scheduledAt = new Date(scheduledAt);
    if (title) data.title = title;
    if (description) data.description = description;
    if (classType) data.classType = classType;
    if (duration) data.duration = duration;
    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "Nenhum dado para atualizar" }, { status: 400 });
    }
    const updated = await prisma.class.update({
      where: { id: classId },
      data,
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Erro ao atribuir/agendar aula:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}