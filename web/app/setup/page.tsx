"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SetupPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [setupStatus, setSetupStatus] = useState<{
    hasAdmin: boolean;
    message: string;
    canSetup?: boolean;
    adminEmail?: string;
  } | null>(null);
  const [result, setResult] = useState<{ success?: boolean; error?: string; message?: string } | null>(null);

  useEffect(() => {
    checkSetupStatus();
  }, []);

  async function checkSetupStatus() {
    try {
      const res = await fetch('/api/admin/setup');
      const data = await res.json();
      setSetupStatus(data);
    } catch (error) {
      console.error('Erro ao verificar status:', error);
    }
  }

  async function handleSetup() {
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/admin/setup', {
        method: 'POST',
      });
      const data = await res.json();
      
      if (res.ok) {
        setResult({ success: true, message: data.message });
        // Aguardar 2 segundos e redirecionar para admin
        setTimeout(() => {
          router.push('/admin');
        }, 2000);
      } else {
        setResult({ error: data.error });
      }
    } catch (error) {
      setResult({ error: 'Erro ao processar requisição' });
    } finally {
      setLoading(false);
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 to-purple-700">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 to-purple-700 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-purple-700 mb-2">
            🎵 Universo de Cantores
          </h1>
          <h2 className="text-xl text-gray-600">Setup do Sistema</h2>
        </div>

        {!session ? (
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Você precisa estar logado para configurar o sistema.
            </p>
            <a 
              href="/login" 
              className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition"
            >
              Fazer Login
            </a>
          </div>
        ) : setupStatus?.hasAdmin ? (
          <div className="text-center">
            <div className="bg-green-100 text-green-800 p-4 rounded-lg mb-4">
              <p className="font-semibold">✅ Sistema já configurado!</p>
              <p className="text-sm mt-2">
                Admin: {setupStatus.adminEmail}
              </p>
            </div>
            <a 
              href="/admin" 
              className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition"
            >
              Ir para Admin
            </a>
          </div>
        ) : (
          <div className="text-center">
            <div className="bg-blue-100 text-blue-800 p-4 rounded-lg mb-4">
              <p className="font-semibold">🔧 Configuração Inicial</p>
              <p className="text-sm mt-2">
                Nenhum administrador foi configurado ainda. 
                Você será o primeiro administrador do sistema.
              </p>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg mb-4 text-left">
              <p className="text-sm text-gray-600">Logado como:</p>
              <p className="font-semibold text-gray-800">{session.user?.name || session.user?.email}</p>
              <p className="text-sm text-gray-500">{session.user?.email}</p>
            </div>

            {result?.success && (
              <div className="bg-green-100 text-green-800 p-4 rounded-lg mb-4">
                <p>✅ {result.message}</p>
                <p className="text-sm mt-2">Redirecionando para o painel admin...</p>
              </div>
            )}

            {result?.error && (
              <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-4">
                <p>❌ {result.error}</p>
              </div>
            )}

            <button
              onClick={handleSetup}
              disabled={loading || result?.success}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-600 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              {loading ? 'Configurando...' : 'Tornar-me Administrador'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
