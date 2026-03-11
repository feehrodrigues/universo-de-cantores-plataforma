"use client";

import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";

export default function CadastroPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="max-w-md w-full bg-[var(--card-bg)] backdrop-blur-xl p-10 rounded-3xl shadow-xl border border-[var(--card-border)] relative z-10">
        
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <div className="relative w-20 h-20 mx-auto mb-4">
              <Image 
                src="/logo.png" 
                alt="Universo de Cantores" 
                fill 
                className="object-contain rounded-2xl shadow-lg"
              />
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-[var(--foreground)]" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
            Comece sua jornada
          </h1>
          <p className="text-sm text-[var(--foreground-muted)] mt-2">
            Crie sua conta e desbloqueie seu potencial vocal
          </p>
        </div>

        {/* Clerk SignUp Component */}
        <div className="clerk-container">
          <SignUp 
            appearance={{
              elements: {
                // Container principal
                rootBox: "w-full",
                card: "bg-transparent shadow-none p-0",
                
                // Header do Clerk (escondemos porque já temos o nosso)
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                
                // Form
                formButtonPrimary: 
                  "bg-gradient-to-r from-[#7732A6] to-[#9747FF] hover:from-[#8B44BA] hover:to-[#A85AFF] text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl w-full",
                formFieldInput: 
                  "w-full px-4 py-4 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-2xl focus:ring-2 focus:ring-[#7732A6]/20 focus:border-[#7732A6] outline-none transition-all text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] font-medium",
                formFieldLabel: 
                  "text-xs font-bold text-[var(--foreground-muted)] uppercase tracking-wider mb-2",
                
                // Social buttons
                socialButtonsBlockButton: 
                  "flex items-center justify-center gap-3 w-full py-4 px-6 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl hover:bg-[var(--card-hover)] transition-all duration-300 font-medium text-[var(--foreground)]",
                socialButtonsBlockButtonText: "font-medium",
                
                // Divider
                dividerLine: "bg-[var(--card-border)]",
                dividerText: "text-[var(--foreground-muted)] text-sm",
                
                // Footer links
                footerActionLink: "text-[#7732A6] hover:text-[#9747FF] font-medium transition-colors",
                footerActionText: "text-[var(--foreground-muted)]",
                
                // Alerts
                alert: "rounded-2xl",
                alertText: "text-sm",
              },
              layout: {
                socialButtonsPlacement: "top",
                socialButtonsVariant: "blockButton",
              },
              variables: {
                colorPrimary: "#7732A6",
                colorText: "var(--foreground)",
                colorTextSecondary: "var(--foreground-muted)",
                colorBackground: "transparent",
                colorInputBackground: "var(--input-bg)",
                colorInputText: "var(--foreground)",
                borderRadius: "1rem",
                fontFamily: "inherit",
              },
            }}
            routing="path"
            path="/cadastro"
            signInUrl="/login"
            forceRedirectUrl="/onboarding"
          />
        </div>

        {/* Link para login */}
        <div className="mt-8 text-center">
          <p className="text-[var(--foreground-muted)] text-sm">
            Já tem uma conta?{" "}
            <Link href="/login" className="text-[#7732A6] hover:text-[#9747FF] font-semibold transition-colors">
              Entrar
            </Link>
          </p>
        </div>

        {/* Benefícios */}
        <div className="mt-8 pt-8 border-t border-[var(--card-border)]">
          <p className="text-xs text-center text-[var(--foreground-muted)] mb-4">
            Ao se cadastrar você terá acesso a:
          </p>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2 text-[var(--foreground-muted)]">
              <span className="text-[#7732A6]">✓</span> Kits de Ensaio
            </div>
            <div className="flex items-center gap-2 text-[var(--foreground-muted)]">
              <span className="text-[#06b6d4]">✓</span> Técnica Vocal
            </div>
            <div className="flex items-center gap-2 text-[var(--foreground-muted)]">
              <span className="text-[#F252BA]">✓</span> Cantatas
            </div>
            <div className="flex items-center gap-2 text-[var(--foreground-muted)]">
              <span className="text-[#7732A6]">✓</span> Evolução EME
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
