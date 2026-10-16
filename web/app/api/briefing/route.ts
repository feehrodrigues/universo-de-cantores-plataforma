import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthSession } from "@/lib/auth";

export async function GET(req: Request) {
  const session = await getAuthSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const classId = url.searchParams.get("classId");
  if (!classId) {
    return NextResponse.json({ error: "Missing classId" }, { status: 400 });
  }

  const briefing = await prisma.preClassBriefing.findUnique({
    where: { classId },
  });

  return NextResponse.json(briefing);
}

export async function POST(req: Request) {
  const session = await getAuthSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { classId, vocalFocus, emotionalState, physicalState, musicChoice, specificGoals } = await req.json();
    if (!classId) {
      return NextResponse.json({ error: "classId é obrigatório" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const briefing = await prisma.preClassBriefing.upsert({
      where: { classId },
      update: {
        vocalFocus,
        emotionalState,
        physicalState,
        musicChoice,
        specificGoals,
        completedAt: new Date(),
      },
      create: {
        class: { connect: { id: classId } },
        user: { connect: { id: user.id } },
        vocalFocus,
        emotionalState,
        physicalState,
        musicChoice,
        specificGoals,
        completedAt: new Date(),
      },
    });

    return NextResponse.json(briefing);
  } catch (error) {
    console.error("Erro ao salvar briefing:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}