import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const { type, title, content, imageRightsConsent, lgpdConsent } = body;

    if (!type || !title || !content) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    });

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    // Verificar se já existe um contrato deste tipo assinado
    const existingContract = await prisma.contract.findFirst({
      where: {
        userId: user.id,
        type: type,
        signedAt: { not: null }
      }
    });

    if (existingContract) {
      return NextResponse.json({ error: "Contrato já assinado" }, { status: 400 });
    }

    // Criar o contrato assinado
    const contract = await prisma.contract.create({
      data: {
        userId: user.id,
        type,
        title,
        content,
        signedAt: new Date(),
        imageRightsConsent: imageRightsConsent || false,
        lgpdConsent: lgpdConsent || false
      }
    });

    return NextResponse.json({ 
      success: true, 
      contract: {
        id: contract.id,
        type: contract.type,
        title: contract.title,
        signedAt: contract.signedAt
      }
    });

  } catch (error) {
    console.error("Erro ao assinar contrato:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
