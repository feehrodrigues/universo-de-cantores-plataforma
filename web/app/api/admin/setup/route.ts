import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST: Setup inicial - promover usuário atual a admin se não existir nenhum admin
export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Você precisa estar logado" },
        { status: 401 }
      );
    }

    // Buscar o usuário atual
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { adminProfile: true }
    });

    if (!currentUser) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    // Verificar se já é admin
    if (currentUser.adminProfile?.role === 'admin') {
      return NextResponse.json(
        { message: "Você já é administrador!", isAdmin: true },
        { status: 200 }
      );
    }

    // Verificar se já existe algum admin no sistema
    const existingAdmin = await prisma.adminProfile.findFirst({
      where: { role: 'admin' }
    });

    if (existingAdmin) {
      return NextResponse.json(
        { error: "Já existe um administrador no sistema. Peça para ele promover você." },
        { status: 403 }
      );
    }

    // Criar o perfil de admin para o usuário atual
    await prisma.adminProfile.upsert({
      where: { userId: currentUser.id },
      update: { role: 'admin' },
      create: { userId: currentUser.id, role: 'admin' }
    });

    return NextResponse.json({ 
      success: true, 
      message: "Parabéns! Você agora é administrador do sistema.",
      isAdmin: true
    });

  } catch (error) {
    console.error("Erro no setup:", error);
    return NextResponse.json(
      { error: "Erro ao processar requisição" },
      { status: 500 }
    );
  }
}

// GET: Verificar status do setup
export async function GET(req: Request) {
  try {
    const session = await getAuthSession();
    
    // Verificar se já existe algum admin no sistema
    const existingAdmin = await prisma.adminProfile.findFirst({
      where: { role: 'admin' },
      include: { user: { select: { email: true, name: true } } }
    });

    if (existingAdmin) {
      return NextResponse.json({ 
        hasAdmin: true, 
        message: "Sistema já configurado",
        adminEmail: existingAdmin.user.email
      });
    }

    return NextResponse.json({ 
      hasAdmin: false, 
      message: "Nenhum administrador configurado. O primeiro usuário logado pode se tornar admin.",
      canSetup: !!session?.user
    });

  } catch (error) {
    console.error("Erro ao verificar setup:", error);
    return NextResponse.json(
      { error: "Erro ao processar requisição" },
      { status: 500 }
    );
  }
}
