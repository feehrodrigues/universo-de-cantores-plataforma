import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "./prisma";

export interface AuthSession {
  userId: string;
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    role: "admin" | "teacher" | "student";
  };
}

// Cache simples em memória para reduzir chamadas ao banco
const sessionCache = new Map<string, { session: AuthSession; timestamp: number }>();
const CACHE_TTL = 60 * 1000; // 1 minuto

/**
 * Obtém a sessão do usuário autenticado via Clerk
 * Usa cache em memória e evita chamadas desnecessárias à API do Clerk
 */
export async function getAuthSession(): Promise<AuthSession | null> {
  try {
    // auth() é leve - usa apenas o JWT token local
    const { userId, sessionClaims } = await auth();
    
    if (!userId) {
      return null;
    }

    // Verificar cache primeiro
    const cached = sessionCache.get(userId);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.session;
    }

    // Tentar buscar do banco primeiro (mais rápido que Clerk API)
    let dbUser = await prisma.user.findFirst({
      where: { 
        OR: [
          { id: userId },
          { email: (sessionClaims as any)?.email }
        ]
      },
      include: { adminProfile: true },
    });

    // Se não existe no banco, precisamos do Clerk para criar/buscar
    if (!dbUser) {
      // currentUser() faz chamada à API - usar com moderação
      const clerkUser = await currentUser();
      if (!clerkUser) {
        return null;
      }

      const email = clerkUser.emailAddresses[0]?.emailAddress;
      if (!email) {
        return null;
      }

      // Primeiro verificar se já existe pelo email
      const existingByEmail = await prisma.user.findUnique({
        where: { email },
        include: { adminProfile: true },
      });

      if (existingByEmail) {
        // Usuário já existe - usar ele (mesmo que o ID seja diferente)
        dbUser = existingByEmail;
      } else {
        // Criar novo usuário
        dbUser = await prisma.user.create({
          data: {
            id: userId,
            email,
            name: clerkUser.firstName 
              ? `${clerkUser.firstName} ${clerkUser.lastName || ""}`.trim() 
              : "Usuário",
            image: clerkUser.imageUrl,
          },
          include: { adminProfile: true },
        });
      }
    }

    // Determinar o role do usuário pelo banco de dados
    let role: "admin" | "teacher" | "student" = "student";
    
    if (dbUser.adminProfile) {
      role = dbUser.adminProfile.role as "admin" | "teacher" | "student";
    }

    const session: AuthSession = {
      userId: dbUser.id,
      user: {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        image: dbUser.image,
        role,
      },
    };

    // Salvar no cache
    sessionCache.set(userId, { session, timestamp: Date.now() });

    return session;
  } catch (error) {
    // Silenciar erros de rate limit em desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('Too Many Requests')) {
        console.warn("Clerk rate limit - aguarde alguns segundos");
        return null;
      }
    }
    console.error("Error getting auth session:", error);
    return null;
  }
}

/**
 * Verifica se o usuário tem uma role específica
 */
export async function requireRole(
  allowedRoles: ("admin" | "teacher" | "student")[]
): Promise<AuthSession | null> {
  const session = await getAuthSession();
  
  if (!session) {
    return null;
  }

  if (!allowedRoles.includes(session.user.role)) {
    return null;
  }

  return session;
}

/**
 * Obtém apenas o userId do Clerk (mais leve, sem consulta ao banco)
 */
export async function getClerkUserId(): Promise<string | null> {
  const { userId } = await auth();
  return userId;
}
