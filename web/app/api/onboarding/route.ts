import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    const body = await request.json();
    const { voicePart, experience, goals } = body;

    const email = user.emailAddresses[0]?.emailAddress;
    if (!email) {
      return NextResponse.json({ error: "Email não encontrado" }, { status: 400 });
    }

    // Buscar ou criar usuário no Prisma
    let dbUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          id: userId,
          email,
          name: user.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : "Usuário",
          image: user.imageUrl,
        },
      });
    }

    // Criar ou atualizar StudentProfile com os dados de onboarding
    // Salvamos tudo em generalGoal como JSON para simplicidade
    const onboardingData = JSON.stringify({ voicePart, experience, goals, completedAt: new Date() });

    const existingProfile = await prisma.studentProfile.findUnique({
      where: { userId: dbUser.id },
    });

    if (existingProfile) {
      await prisma.studentProfile.update({
        where: { userId: dbUser.id },
        data: {
          generalGoal: onboardingData,
          vocalHistory: `Naipe: ${voicePart}, Experiência: ${experience}`,
        },
      });
    } else {
      await prisma.studentProfile.create({
        data: {
          userId: dbUser.id,
          generalGoal: onboardingData,
          vocalHistory: `Naipe: ${voicePart}, Experiência: ${experience}`,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro no onboarding:", error);
    return NextResponse.json(
      { error: "Erro ao salvar dados do onboarding" },
      { status: 500 }
    );
  }
}
