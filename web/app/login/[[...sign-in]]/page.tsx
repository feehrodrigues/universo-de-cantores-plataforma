"use client";

import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* 
        AJUSTE 1: Mudei "p-10" para "p-6 sm:p-10" para dar espaço no celular e não esmagar o Clerk. 
        Adicionei "flex flex-col items-center" para forçar tudo ao centro.
      */}
      <div className="max-w-md w-full flex flex-col items-center bg-[var(--card-bg)] backdrop-blur-xl p-6 sm:p-10 rounded-3xl shadow-xl border border-[var(--card-border)] relative z-10 overflow-hidden">
        
        {/* Logo */}
        <div className="text-center w-full mb-8">
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
            Bem-vindo de volta
          </h1>
          <p className="text-sm text-[var(--foreground-muted)] mt-2">
            Acesse sua conta para continuar sua jornada vocal
          </p>
        </div>

        {/* Clerk SignIn Component */}
        {/* AJUSTE 2: Garantindo que a div do Clerk ocupe 100% e centralize seu conteúdo */}
        <div className="w-full flex justify-center items-center">
          <SignIn 
            appearance={{
              elements: {
                // AJUSTE 3: Forçamos o rootBox e o card a não ultrapassarem a tela (max-w-full)
                rootBox: "w-full flex justify-center",
                card: "bg-transparent shadow-none p-0 w-full max-w-full",
                
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
                
                // Identity preview
                identityPreviewEditButton: "text-[#7732A6] hover:text-[#9747FF]",
              },
              layout: {
                socialButtonsPlacement: "top",
                socialButtonsVariant: "blockButton",
              },
              variables: {
            
                colorBackground: "transparent",
                colorInputText: "var(--foreground)",
                borderRadius: "1rem",
                fontFamily: "inherit",
              },
            }}
            routing="path"
            path="/login"
            signUpUrl="/cadastro"
            forceRedirectUrl="/dashboard"
          />
        </div>

        {/* Link para cadastro */}
        <div className="mt-8 text-center w-full">
          <p className="text-[var(--foreground-muted)] text-sm">
            Ainda não tem conta?{" "}
            <Link href="/cadastro" className="text-[#7732A6] hover:text-[#9747FF] font-semibold transition-colors">
              Cadastre-se grátis
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
