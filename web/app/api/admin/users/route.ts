import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST: Promover usuário a admin ou teacher
export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    
    // Verificar se o usuário logado é admin
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: "Acesso negado. Apenas administradores podem promover usuários." },
        { status: 403 }
      );
    }

    const { userId, role } = await req.json();

    if (!userId || !role) {
      return NextResponse.json(
        { error: "userId e role são obrigatórios" },
        { status: 400 }
      );
    }

    if (!['admin', 'teacher', 'student'].includes(role)) {
      return NextResponse.json(
        { error: "Role inválido. Use: admin, teacher ou student" },
        { status: 400 }
      );
    }

    // Verificar se o usuário existe
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { adminProfile: true }
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    if (role === 'student') {
      // Remover perfil de admin se existir
      if (user.adminProfile) {
        await prisma.adminProfile.delete({
          where: { userId }
        });
      }
    } else {
      // Criar ou atualizar perfil de admin
      await prisma.adminProfile.upsert({
        where: { userId },
        update: { role },
        create: { userId, role }
      });
    }

    return NextResponse.json({ 
      success: true, 
      message: `Usuário ${user.name || user.email} agora é ${role}` 
    });

  } catch (error) {
    console.error("Erro ao promover usuário:", error);
    return NextResponse.json(
      { error: "Erro ao processar requisição" },
      { status: 500 }
    );
  }
}

// GET: Listar todos os usuários com suas roles
export async function GET(req: Request) {
  try {
    const session = await getAuthSession();
    
    // Verificar se o usuário logado é admin
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: "Acesso negado" },
        { status: 403 }
      );
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
        adminProfile: {
          select: { role: true }
        },
        studentProfile: {
          select: { id: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const formattedUsers = users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      createdAt: user.createdAt,
      role: user.adminProfile?.role || 'student',
      hasStudentProfile: !!user.studentProfile
    }));

    return NextResponse.json({ users: formattedUsers });

  } catch (error) {
    console.error("Erro ao listar usuários:", error);
    return NextResponse.json(
      { error: "Erro ao processar requisição" },
      { status: 500 }
    );
  }
}
