import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Rotas públicas (não precisam de login)
const isPublicRoute = createRouteMatcher([
  "/",
  "/login(.*)",
  "/cadastro(.*)",
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
  // Se for rota pública, deixa passar direto
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // Se for rota protegida, o Clerk resolve sozinho:
  // - Não logado → manda pro login automaticamente
  // - Logado → deixa entrar
  await auth.protect();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};