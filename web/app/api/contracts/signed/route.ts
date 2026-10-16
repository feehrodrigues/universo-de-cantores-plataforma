import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getAuthSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    });

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    const contracts = await prisma.contract.findMany({
      where: { 
        userId: user.id,
        signedAt: { not: null }
      },
      select: {
        id: true,
        type: true,
        title: true,
        signedAt: true,
        imageRightsConsent: true,
        lgpdConsent: true
      },
      orderBy: { signedAt: "desc" }
    });

    return NextResponse.json({ contracts });

  } catch (error) {
    console.error("Erro ao buscar contratos:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
