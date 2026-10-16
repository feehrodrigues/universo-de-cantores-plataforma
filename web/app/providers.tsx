"use client";

export function Providers({ children }: { children: React.ReactNode }) {
  // ClerkProvider já está no layout.tsx envolvendo tudo
  // Este componente existe para adicionar outros providers client-side se necessário
  return <>{children}</>;
}