"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2, UserPlus } from "lucide-react";

type Student = {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
};

export default function ScheduleClassForm({ students }: { students: Student[] }) {
  const router = useRouter();
  const [selectedUserId, setSelectedUserId] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [classGoal, setClassGoal] = useState("");
  const [briefing, setBriefing] = useState(""); // NOVO
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setIsSuccess(false);

    const response = await fetch("/api/classes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        userId: selectedUserId,
        scheduledAt, 
        classGoal,
        briefing // Envia também o briefing
      }),
    });

    if (response.ok) {
      setIsSuccess(true);
      setSelectedUserId("");
      setScheduledAt("");
      setClassGoal("");
      setBriefing(""); // Limpa o briefing
      router.refresh();
      setTimeout(() => setIsLoading(false), 4000);
    } else {
      alert("Erro ao agendar.");
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {isSuccess && (
        <div className="bg-green-50 text-green-700 p-4 rounded-2xl flex items-center gap-3 font-medium border border-green-100">
          <CheckCircle2 size={24} className="text-green-500" /> 
          Aula agendada e feed do aluno atualizado!
        </div>
      )}

      <div className="relative">
        <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-3 ml-1">Selecionar Aluno</label>
        <select 
          value={selectedUserId}
          onChange={(e) => setSelectedUserId(e.target.value)}
          required
          className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 outline-none transition-all text-slate-800 font-bold appearance-none shadow-sm"
        >
          <option value="" disabled>Escolha um nome na lista...</option>
          {students.map(student => (
            <option key={student.id} value={student.id}>
              {student.name} ({student.role === 'USER' ? 'Novo' : 'Aluno'})
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-3 ml-1">Data e Horário</label>
          <input 
            type="datetime-local"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
            required
            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 outline-none transition-all text-slate-800 font-bold shadow-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-3 ml-1">Foco Principal</label>
          <input 
            type="text"
            value={classGoal}
            onChange={(e) => setClassGoal(e.target.value)}
            required
            placeholder="Ex: Estabilidade TA/CT"
            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 outline-none transition-all text-slate-800 font-bold shadow-sm"
          />
        </div>
      </div>

      {/* Novo campo de Briefing */}
      <div>
        <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-3 ml-1">Briefing (Anotações)</label>
        <textarea
          value={briefing}
          onChange={(e) => setBriefing(e.target.value)}
          rows={3}
          placeholder="Ex: Aluno quer trabalhar agudos e tem dificuldade com projeção"
          className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 outline-none transition-all text-slate-800 font-bold shadow-sm"
        />
      </div>

      <button 
        type="submit" 
        disabled={isLoading}
        className="w-full bg-slate-900 hover:bg-black text-white font-extrabold py-5 px-4 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-slate-200 hover:-translate-y-1 disabled:opacity-50"
      >
        {isLoading ? <Loader2 size={24} className="animate-spin" /> : <><UserPlus size={20}/> Confirmar Agendamento</>}
      </button>
    </form>
  );
}