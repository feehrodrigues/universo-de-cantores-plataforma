"use client";

import { useState, useEffect } from "react";
import { 
  Plus, FileText, Download, X, Calendar, 
  Book, Users, Clock, Loader2
} from "lucide-react";
import CreateClassForm from "@/app/components/teacher/CreateClassForm";
import TeacherReportForm from "@/app/components/teacher/TeacherReportForm";
import ExportClasses from "@/app/components/teacher/ExportClasses";

interface ClassData {
  id: string;
  title: string;
  scheduledAt: string;
  duration: number;
  paymentStatus: string;
  classType: string;
  student: {
    name: string;
    email: string;
  };
}

type ModalType = "createClass" | "report" | "export" | null;

export default function TeacherActions() {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [loading, setLoading] = useState(false);
  const [teacherName, setTeacherName] = useState("Professor");

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/teacher/classes");
      if (res.ok) {
        const data = await res.json();
        setClasses(data.classes || []);
        if (data.teacherName) setTeacherName(data.teacherName);
      }
    } catch (error) {
      console.error("Erro ao buscar aulas:", error);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setActiveModal(null);
    fetchClasses(); // Recarregar após fechar
  };

  return (
    <>
      {/* Botões de Ação */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => setActiveModal("createClass")}
          className="bg-gradient-to-r from-[#7732A6] to-[#5B21B6] text-white rounded-2xl p-5 hover:opacity-90 transition-all flex flex-col items-start"
        >
          <div className="p-2 bg-white/20 rounded-xl mb-3">
            <Plus size={24} />
          </div>
          <p className="font-bold">Criar Aula</p>
          <p className="text-xs opacity-80">Agendar ou registrar retroativamente</p>
        </button>

        <button
          onClick={() => setActiveModal("report")}
          className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-5 hover:shadow-lg transition-all flex flex-col items-start"
        >
          <div className="p-2 bg-cyan-100 dark:bg-cyan-900/30 rounded-xl mb-3">
            <FileText size={24} className="text-cyan-600" />
          </div>
          <p className="font-bold text-[var(--foreground)]">Criar Relatório</p>
          <p className="text-xs text-[var(--foreground-muted)]">Avaliação EME completa</p>
        </button>

        <button
          onClick={() => setActiveModal("export")}
          className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-5 hover:shadow-lg transition-all flex flex-col items-start"
        >
          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-xl mb-3">
            <Download size={24} className="text-green-600" />
          </div>
          <p className="font-bold text-[var(--foreground)]">Exportar</p>
          <p className="text-xs text-[var(--foreground-muted)]">PDF ou Excel para prestação de contas</p>
        </button>
      </div>

      {/* Modal */}
      {activeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[var(--background)] rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto my-8">
            {activeModal === "createClass" && (
              <CreateClassForm 
                onSuccess={closeModal} 
                onClose={closeModal} 
              />
            )}
            {activeModal === "report" && (
              <TeacherReportForm 
                onSuccess={closeModal} 
                onClose={closeModal} 
              />
            )}
            {activeModal === "export" && (
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-[var(--foreground)]" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
                    Exportar Aulas
                  </h2>
                  <button onClick={closeModal} className="text-[var(--foreground-muted)] hover:text-[var(--foreground)]">
                    <X size={24} />
                  </button>
                </div>
                {loading ? (
                  <div className="flex items-center justify-center py-10">
                    <Loader2 size={32} className="animate-spin text-[#7732A6]" />
                  </div>
                ) : (
                  <ExportClasses classes={classes} teacherName={teacherName} />
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
