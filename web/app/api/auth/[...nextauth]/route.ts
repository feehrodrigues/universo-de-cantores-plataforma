import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { PrismaAdapter } from "@auth/prisma-adapter";
import type { Adapter } from "next-auth/adapters";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma) as Adapter,
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({ 
          where: { email: credentials.email },
          include: { adminProfile: true }
        });
        if (!user || !user.password) throw new Error("Usuário não encontrado.");
        
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) throw new Error("Senha incorreta.");

        // Retorna o usuário com role para satisfazer tipagem do next-auth
        const role = (user.adminProfile?.role || "student") as "admin" | "teacher" | "student";
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },

  callbacks: {
    async jwt({ token, user, trigger }) {
      // Define o ID do usuário no token
      if (user) {
        token.id = user.id;
      }
      
      // Sempre buscar o role mais atualizado do banco de dados
      // Isso garante que mudanças de role sejam refletidas imediatamente
      if (token.id) {
        const adminProfile = await prisma.adminProfile.findUnique({
          where: { userId: token.id as string },
        });
        token.role = (adminProfile ? adminProfile.role : "student") as "admin" | "teacher" | "student";
      }
      
      return token;
    },
    async session({ session, token }) {
      // Passamos os dados do token (com a 'role') para a sessão do navegador
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };