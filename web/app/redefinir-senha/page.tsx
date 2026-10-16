"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Lock, Loader2, CheckCircle, AlertCircle, Eye, EyeOff } from "lucide-react";

function RedefinirSenhaContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setError("Link inválido ou expirado. Solicite um novo link de recuperação.");
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erro ao redefinir senha.");
      } else {
        setSuccess(true);
        setTimeout(() => router.push("/login"), 3000);
      }
    } catch (err) {
      setError("Ocorreu um erro. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[var(--card-bg)] backdrop-blur-xl p-10 rounded-3xl shadow-xl border border-[var(--card-border)] text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="text-red-600" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-[var(--foreground)] mb-4" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
            Link inválido
          </h1>
          <p className="text-[var(--foreground-muted)] mb-6">
            Este link de recuperação é inválido ou já expirou.
          </p>
          <Link 
            href="/esqueci-senha"
            className="inline-flex items-center gap-2 bg-[#7732A6] text-white font-bold py-3 px-6 rounded-xl hover:opacity-90 transition-colors"
          >
            Solicitar novo link
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[var(--card-bg)] backdrop-blur-xl p-10 rounded-3xl shadow-xl border border-[var(--card-border)] text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-green-600" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-[var(--foreground)] mb-4" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
            Senha redefinida!
          </h1>
          <p className="text-[var(--foreground-muted)] mb-6">
            Sua senha foi alterada com sucesso. Você será redirecionado para o login...
          </p>
          <div className="flex items-center justify-center gap-2 text-[#7732A6]">
            <Loader2 size={20} className="animate-spin" />
            <span>Redirecionando...</span>
          </div>
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
            Criar nova senha
          </h1>
          <p className="text-sm text-[var(--foreground-muted)] mt-2">
            Digite sua nova senha abaixo.
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
              Nova senha
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7732A6]" size={20} />
              <input 
                required 
                type={showPassword ? "text" : "password"}
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full pl-12 pr-12 py-4 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-2xl focus:ring-2 focus:ring-[#7732A6]/20 focus:border-[#7732A6] outline-none transition-all text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] font-medium" 
                placeholder="Mínimo 6 caracteres"
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)] hover:text-[#7732A6] transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[var(--foreground-muted)] uppercase tracking-wider mb-2">
              Confirmar senha
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7732A6]" size={20} />
              <input 
                required 
                type={showPassword ? "text" : "password"}
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                className="w-full pl-12 pr-4 py-4 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-2xl focus:ring-2 focus:ring-[#7732A6]/20 focus:border-[#7732A6] outline-none transition-all text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] font-medium" 
                placeholder="Repita a senha"
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
                <Loader2 size={20} className="animate-spin" /> Salvando...
              </>
            ) : (
              "Redefinir senha"
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

export default function RedefinirSenhaPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-[#7732A6]" size={40} />
      </div>
    }>
      <RedefinirSenhaContent />
    </Suspense>
  );
}
