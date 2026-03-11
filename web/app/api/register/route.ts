import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, experience, goals } = body;

    // 1. Verificar se o e-mail já existe
    const userExists = await prisma.user.findUnique({
      where: { email },
    });

    if (userExists) {
      return NextResponse.json(
        { error: "Este e-mail já está cadastrado. Tente fazer login." },
        { status: 400 }
      );
    }

    // 2. Criptografar a senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Criar o Usuário E o Perfil de Aluno ao mesmo tempo (Transação)
    // Aqui a gente converte o Array de goals em uma string para salvar no banco de texto
    const goalsString = Array.isArray(goals) ? goals.join(", ") : goals;

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        // Cria automaticamente o perfil de aluno vinculado
        studentProfile: {
          create: {
            vocalHistory: experience,
            generalGoal: goalsString,
            overallGoal: goalsString,
          }
        }
      },
    });

    return NextResponse.json({ 
      success: true, 
      user: { id: user.id, name: user.name, email: user.email } 
    });

  } catch (error) {
    console.error("Erro no registro:", error);
    return NextResponse.json(
      { error: "Erro ao criar conta. Tente novamente." },
      { status: 500 }
    );
  }
}