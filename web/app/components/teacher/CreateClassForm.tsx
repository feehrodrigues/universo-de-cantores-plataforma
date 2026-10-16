"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, User, Plus, X, Loader2, CheckCircle, Video, FileText } from "lucide-react";

interface Student {
  id: string;
  name: string;
  email: string;
}

interface CreateClassFormProps {
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function CreateClassForm({ onSuccess, onClose }: CreateClassFormProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    studentId: "",
    title: "Aula de Canto",
    description: "",
    scheduledAt: "",
    duration: 60,
    classType: "online",
    paymentStatus: "pending",
    isRetroactive: false, // Para aulas que já aconteceram
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await fetch("/api/students");
      if (res.ok) {
        const data = await res.json();
        setStudents(data.students || []);
      }
    } catch (error) {
      console.error("Erro ao buscar alunos:", error);
    } finally {
      setLoadingStudents(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/classes/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          onSuccess?.();
          onClose?.();
        }, 1500);
      } else {
        const data = await res.json();
        setError(data.error || "Erro ao criar aula");
      }
    } catch (error) {
      setError("Erro ao criar aula");
    } finally {
      setLoading(false);
    }
  };

  // Calcular data mínima (hoje) e máxima (3 meses no futuro)
  const today = new Date().toISOString().slice(0, 16);
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);
  const maxDateStr = maxDate.toISOString().slice(0, 16);

  // Para aulas retroativas, permitir datas no passado
  const minDate = formData.isRetroactive 
    ? new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString().slice(0, 16)
    : today;

  return (
    <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-[var(--foreground)] flex items-center gap-2" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
          <Plus size={24} className="text-[#7732A6]" />
          Criar Nova Aula
        </h2>
        {onClose && (
          <button onClick={onClose} className="text-[var(--foreground-muted)] hover:text-[var(--foreground)]">
            <X size={24} />
          </button>
        )}
      </div>

      {success ? (
        <div className="flex flex-col items-center justify-center py-10">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="text-green-600" size={32} />
          </div>
          <h3 className="text-lg font-bold text-[var(--foreground)]">Aula Criada com Sucesso!</h3>
          <p className="text-sm text-[var(--foreground-muted)]">O aluno será notificado.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Toggle aula retroativa */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isRetroactive}
              onChange={(e) => setFormData({ ...formData, isRetroactive: e.target.checked })}
              className="w-5 h-5 rounded border-gray-300 text-[#7732A6] focus:ring-[#7732A6]"
            />
            <span className="text-sm font-medium text-[var(--foreground)]">
              Registrar aula já realizada (retroativo)
            </span>
          </label>

          {/* Selecionar Aluno */}
          <div>
            <label className="block text-sm font-bold text-[var(--foreground)] mb-2">
              <User size={16} className="inline mr-2" />
              Aluno
            </label>
            {loadingStudents ? (
              <div className="flex items-center gap-2 text-[var(--foreground-muted)]">
                <Loader2 size={16} className="animate-spin" />
                Carregando alunos...
              </div>
            ) : (
              <select
                value={formData.studentId}
                onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                required
                className="w-full bg-[var(--background-secondary)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[#7732A6]"
              >
                <option value="">Selecione um aluno</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name || student.email}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Título */}
          <div>
            <label className="block text-sm font-bold text-[var(--foreground)] mb-2">
              <FileText size={16} className="inline mr-2" />
              Título da Aula
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="w-full bg-[var(--background-secondary)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[#7732A6]"
              placeholder="Ex: Aula de Técnica Vocal"
            />
          </div>

          {/* Data e Hora */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-[var(--foreground)] mb-2">
                <Calendar size={16} className="inline mr-2" />
                Data e Hora
              </label>
              <input
                type="datetime-local"
                value={formData.scheduledAt}
                onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                required
                min={minDate}
                max={formData.isRetroactive ? today : maxDateStr}
                className="w-full bg-[var(--background-secondary)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[#7732A6]"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[var(--foreground)] mb-2">
                <Clock size={16} className="inline mr-2" />
                Duração (minutos)
              </label>
              <select
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                className="w-full bg-[var(--background-secondary)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[#7732A6]"
              >
                <option value={30}>30 minutos</option>
                <option value={45}>45 minutos</option>
                <option value={60}>60 minutos</option>
                <option value={90}>90 minutos</option>
              </select>
            </div>
          </div>

          {/* Tipo e Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-[var(--foreground)] mb-2">
                <Video size={16} className="inline mr-2" />
                Tipo
              </label>
              <select
                value={formData.classType}
                onChange={(e) => setFormData({ ...formData, classType: e.target.value })}
                className="w-full bg-[var(--background-secondary)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[#7732A6]"
              >
                <option value="online">Online</option>
                <option value="presencial">Presencial</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-[var(--foreground)] mb-2">
                Status do Pagamento
              </label>
              <select
                value={formData.paymentStatus}
                onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
                className="w-full bg-[var(--background-secondary)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[#7732A6]"
              >
                <option value="pending">Pendente</option>
                <option value="paid">Pago</option>
              </select>
            </div>
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-bold text-[var(--foreground)] mb-2">
              Observações (opcional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full bg-[var(--background-secondary)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[#7732A6] resize-none"
              placeholder="Anotações sobre a aula..."
            />
          </div>

          {/* Erro */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-red-700 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Botões */}
          <div className="flex gap-3">
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-[var(--background-secondary)] hover:bg-[var(--card-border)] text-[var(--foreground)] font-bold py-3 px-6 rounded-xl transition-colors"
              >
                Cancelar
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-[#7732A6] to-[#5B21B6] hover:opacity-90 text-white font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  <Plus size={20} />
                  Criar Aula
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
