"use client";

import { useUser } from "@clerk/nextjs";
import { UserProfile } from "@clerk/nextjs";
import Header from "@/app/components/Header";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PerfilPage() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#7732A6] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link 
              href="/dashboard" 
              className="inline-flex items-center gap-2 text-[var(--foreground-muted)] hover:text-[#7732A6] transition-colors mb-4"
            >
              <ArrowLeft size={20} />
              Voltar ao Painel
            </Link>
            <h1 className="text-3xl font-bold text-[var(--foreground)]" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
              Minha Conta
            </h1>
            <p className="text-[var(--foreground-muted)] mt-2">
              Gerencie suas informações pessoais e preferências
            </p>
          </div>

          {/* Clerk UserProfile Component */}
          <div className="clerk-profile-container">
            <UserProfile 
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl shadow-xl",
                  navbar: "bg-[var(--background-secondary)] rounded-2xl",
                  navbarButton: "text-[var(--foreground)] hover:bg-[#7732A6]/10",
                  navbarButtonIcon: "text-[#7732A6]",
                  pageScrollBox: "p-6",
                  formButtonPrimary: "bg-gradient-to-r from-[#7732A6] to-[#9747FF] hover:from-[#8B44BA] hover:to-[#A85AFF]",
                  formFieldInput: "bg-[var(--input-bg)] border-[var(--input-border)] rounded-xl",
                  formFieldLabel: "text-[var(--foreground-muted)]",
                  headerTitle: "text-[var(--foreground)]",
                  headerSubtitle: "text-[var(--foreground-muted)]",
                  profileSectionTitle: "text-[var(--foreground)]",
                  profileSectionContent: "text-[var(--foreground-muted)]",
                },
                variables: {
                  colorPrimary: "#7732A6",
                  colorText: "var(--foreground)",
                  colorTextSecondary: "var(--foreground-muted)",
                  borderRadius: "1rem",
                },
              }}
              routing="path"
              path="/perfil"
            />
          </div>
        </div>
      </main>
    </>
  );
}
