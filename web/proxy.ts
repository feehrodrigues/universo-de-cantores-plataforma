import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Rotas públicas (não precisam de autenticação)
const isPublicRoute = createRouteMatcher([
  "/",
  "/login(.*)",
  "/cadastro(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/kits(.*)",
  "/cantatas(.*)",
  "/musica(.*)",
  "/blog(.*)",
  "/sobre(.*)",
  "/busca(.*)",
  "/apoie(.*)",
  "/esqueci-senha(.*)",
  "/redefinir-senha(.*)",
  "/setup(.*)",
  "/onboarding(.*)",
  "/api/webhooks(.*)",
  "/api/public(.*)",
  "/api/auth(.*)",
  "/api/admin/setup(.*)",
  "/api/comments(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  try {
    // Rotas públicas - permitir acesso imediatamente
    if (isPublicRoute(req)) {
      return NextResponse.next();
    }
    
    const { userId } = await auth();
    
    // Se não está logado, redirecionar para login
    if (!userId) {
      const signInUrl = new URL("/login", req.url);
      signInUrl.searchParams.set("redirect_url", req.url);
      return NextResponse.redirect(signInUrl);
    }
    
    // Usuário logado - permitir acesso
    // A verificação de role é feita dentro de cada página (mais seguro)
    return NextResponse.next();
  } catch (error) {
    // Em caso de erro, permite acesso a rotas públicas
    if (isPublicRoute(req)) {
      return NextResponse.next();
    }
    // Para outras rotas, redireciona para login
    console.error("Middleware error:", error);
    return NextResponse.redirect(new URL("/login", req.url));
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
