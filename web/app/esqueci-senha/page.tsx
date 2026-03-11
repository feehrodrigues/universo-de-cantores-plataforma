"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Mail, Loader2, CheckCircle, AlertCircle } from "lucide-react";

export default function EsqueciSenhaPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erro ao enviar email de recuperação.");
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError("Ocorreu um erro. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[var(--card-bg)] backdrop-blur-xl p-10 rounded-3xl shadow-xl border border-[var(--card-border)] text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-green-600" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-[var(--foreground)] mb-4" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
            Email enviado!
          </h1>
          <p className="text-[var(--foreground-muted)] mb-6">
            Se existe uma conta com o email <strong>{email}</strong>, você receberá um link para redefinir sua senha.
          </p>
          <p className="text-sm text-[var(--foreground-muted)] mb-8">
            Verifique sua caixa de entrada e também a pasta de spam.
          </p>
          <Link 
            href="/login"
            className="inline-flex items-center gap-2 text-[#7732A6] font-bold hover:opacity-80 transition-colors"
          >
            <ArrowLeft size={18} /> Voltar ao login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[var(--card-bg)] backdrop-blur-xl p-10 rounded-3xl shadow-xl border border-[var(--card-border)]">
        
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
            Esqueceu a senha?
          </h1>
          <p className="text-sm text-[var(--foreground-muted)] mt-2">
            Digite seu e-mail e enviaremos um link para redefinir sua senha.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-medium">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-[var(--foreground-muted)] uppercase tracking-wider mb-2">
              E-mail
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7732A6]" size={20} />
              <input 
                required 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full pl-12 pr-4 py-4 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-2xl focus:ring-2 focus:ring-[#7732A6]/20 focus:border-[#7732A6] outline-none transition-all text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] font-medium" 
                placeholder="voce@email.com" 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-[#7732A6] to-[#5B21B6] hover:from-[#5B21B6] hover:to-[#7732A6] text-white font-bold py-4 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#7732A6]/25 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin" /> Enviando...
              </>
            ) : (
              "Enviar link de recuperação"
            )}
          </button>
        </form>

        <p className="text-center text-sm text-[var(--foreground-muted)] mt-8">
          <Link href="/login" className="inline-flex items-center gap-2 text-[#7732A6] font-bold hover:opacity-80 transition-colors">
            <ArrowLeft size={16} /> Voltar ao login
          </Link>
        </p>
      </div>
    </div>
  );
}
