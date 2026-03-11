"use client";

import { useState, useEffect } from "react";
import { 
  FileText, User, Calendar, Save, Loader2, CheckCircle, 
  ChevronDown, ChevronUp, Star, AlertCircle, Music
} from "lucide-react";
import { EME_STRUCTURE } from "@/app/lib/eme-config";

interface Student {
  id: string;
  name: string;
  email: string;
}

interface ClassInfo {
  id: string;
  title: string;
  scheduledAt: string;
  user: { name: string; email: string };
}

interface EvaluationData {
  [itemId: string]: number; // 0-10 grade
}

interface TeacherReportFormProps {
  classId?: string;
  onSuccess?: () => void;
  onClose?: () => void;
}

const DIMENSIONS = [
  { key: "ES", label: "Estrutura", color: "#7732A6", icon: "🏗️" },
  { key: "MO", label: "Modelagem", color: "#06b6d4", icon: "🎭" },
  { key: "EX", label: "Expressão", color: "#F252BA", icon: "✨" },
];

export default function TeacherReportForm({ classId, onSuccess, onClose }: TeacherReportFormProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedClass, setSelectedClass] = useState(classId || "");
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Notas para cada item
  const [evaluations, setEvaluations] = useState<EvaluationData>({});
  
  // Observações gerais
  const [generalNotes, setGeneralNotes] = useState("");
  const [exercisesDone, setExercisesDone] = useState("");
  const [homework, setHomework] = useState("");
  
  // Controle de seções expandidas
  const [expandedDimensions, setExpandedDimensions] = useState<string[]>(["ES"]);
  const [expandedTopics, setExpandedTopics] = useState<string[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedStudent) {
      fetchClassesForStudent(selectedStudent);
    }
  }, [selectedStudent]);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/students");
      if (res.ok) {
        const data = await res.json();
        setStudents(data.students || []);
      }
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setLoadingData(false);
    }
  };

  const fetchClassesForStudent = async (studentId: string) => {
    try {
      const res = await fetch(`/api/classes?studentId=${studentId}&status=completed`);
      if (res.ok) {
        const data = await res.json();
        setClasses(data.classes || []);
      }
    } catch (error) {
      console.error("Erro ao buscar aulas:", error);
    }
  };

  const toggleDimension = (dimKey: string) => {
    setExpandedDimensions(prev => 
      prev.includes(dimKey) 
        ? prev.filter(k => k !== dimKey) 
        : [...prev, dimKey]
    );
  };

  const toggleTopic = (topicKey: string) => {
    setExpandedTopics(prev => 
      prev.includes(topicKey) 
        ? prev.filter(k => k !== topicKey) 
        : [...prev, topicKey]
    );
  };

  const setGrade = (itemId: string, grade: number) => {
    setEvaluations(prev => ({
      ...prev,
      [itemId]: grade
    }));
  };

  const getAverageForDimension = (dimKey: string) => {
    const dimension = EME_STRUCTURE[dimKey];
    if (!dimension) return 0;

    const grades: number[] = [];
    
    Object.values(dimension.topics).forEach(topic => {
      Object.values(topic.subtopics).forEach(subtopic => {
        subtopic.items.forEach(item => {
          if (evaluations[item.id] !== undefined) {
            grades.push(evaluations[item.id]);
          }
        });
      });
    });

    if (grades.length === 0) return 0;
    return grades.reduce((a, b) => a + b, 0) / grades.length;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedStudent) {
      setError("Selecione um aluno");
      return;
    }

    // Verificar se há pelo menos algumas avaliações
    const totalEvaluations = Object.keys(evaluations).length;
    if (totalEvaluations < 5) {
      setError("Avalie pelo menos 5 itens antes de salvar");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/reports/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: selectedStudent,
          classId: selectedClass || null,
          evaluations,
          generalNotes,
          exercisesDone,
          homework,
          averages: {
            structure: getAverageForDimension("ES"),
            modeling: getAverageForDimension("MO"),
            expression: getAverageForDimension("EX"),
          },
        }),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          onSuccess?.();
          onClose?.();
        }, 1500);
      } else {
        const data = await res.json();
        setError(data.error || "Erro ao salvar relatório");
      }
    } catch (error) {
      setError("Erro ao salvar relatório");
    } finally {
      setLoading(false);
    }
  };

  const GradeSelector = ({ itemId, currentGrade }: { itemId: string; currentGrade?: number }) => {
    const grades = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    
    return (
      <div className="flex gap-1 flex-wrap">
        {grades.map(grade => (
          <button
            key={grade}
            type="button"
            onClick={() => setGrade(itemId, grade)}
            className={`w-7 h-7 rounded-full text-xs font-bold transition-all ${
              currentGrade === grade 
                ? "bg-[#7732A6] text-white scale-110" 
                : "bg-[var(--background-secondary)] text-[var(--foreground-muted)] hover:bg-[var(--card-border)]"
            }`}
          >
            {grade}
          </button>
        ))}
      </div>
    );
  };

  if (success) {
    return (
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-6 md:p-8">
        <div className="flex flex-col items-center justify-center py-10">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="text-green-600" size={32} />
          </div>
          <h3 className="text-lg font-bold text-[var(--foreground)]">Relatório Salvo!</h3>
          <p className="text-sm text-[var(--foreground-muted)]">As avaliações foram registradas.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-[var(--foreground)] flex items-center gap-2" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
          <FileText size={24} className="text-[#7732A6]" />
          Relatório de Aula
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Selecionar Aluno */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-[var(--foreground)] mb-2">
              <User size={16} className="inline mr-2" />
              Aluno
            </label>
            {loadingData ? (
              <div className="flex items-center gap-2 text-[var(--foreground-muted)]">
                <Loader2 size={16} className="animate-spin" />
                Carregando...
              </div>
            ) : (
              <select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
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

          <div>
            <label className="block text-sm font-bold text-[var(--foreground)] mb-2">
              <Calendar size={16} className="inline mr-2" />
              Aula (opcional)
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full bg-[var(--background-secondary)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[#7732A6]"
            >
              <option value="">Avaliação geral</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title} - {new Date(c.scheduledAt).toLocaleDateString("pt-BR")}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Médias por dimensão */}
        <div className="grid grid-cols-3 gap-3">
          {DIMENSIONS.map(dim => (
            <div 
              key={dim.key} 
              className="bg-[var(--background-secondary)] rounded-xl p-4 text-center"
              style={{ borderTop: `3px solid ${dim.color}` }}
            >
              <span className="text-2xl">{dim.icon}</span>
              <p className="text-xs text-[var(--foreground-muted)] mt-1">{dim.label}</p>
              <p className="text-2xl font-bold" style={{ color: dim.color }}>
                {getAverageForDimension(dim.key).toFixed(1)}
              </p>
            </div>
          ))}
        </div>

        {/* Avaliações por dimensão */}
        <div className="space-y-4">
          {DIMENSIONS.map(dim => {
            const dimension = EME_STRUCTURE[dim.key];
            const isExpanded = expandedDimensions.includes(dim.key);
            
            return (
              <div key={dim.key} className="border border-[var(--card-border)] rounded-2xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleDimension(dim.key)}
                  className="w-full flex items-center justify-between p-4 bg-[var(--background-secondary)] hover:bg-opacity-80"
                  style={{ borderLeft: `4px solid ${dim.color}` }}
                >
                  <span className="font-bold text-[var(--foreground)] flex items-center gap-2">
                    <span>{dim.icon}</span>
                    {dim.label}
                  </span>
                  {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>

                {isExpanded && (
                  <div className="p-4 space-y-4">
                    {Object.entries(dimension.topics).map(([topicKey, topic]) => {
                      const fullTopicKey = `${dim.key}-${topicKey}`;
                      const isTopicExpanded = expandedTopics.includes(fullTopicKey);
                      
                      return (
                        <div key={topicKey} className="border-l-2 border-[var(--card-border)] pl-4">
                          <button
                            type="button"
                            onClick={() => toggleTopic(fullTopicKey)}
                            className="w-full flex items-center justify-between py-2 text-left"
                          >
                            <span className="font-medium text-[var(--foreground)]">
                              {topicKey}. {topic.label}
                            </span>
                            {isTopicExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </button>

                          {isTopicExpanded && (
                            <div className="space-y-3 py-2">
                              {Object.entries(topic.subtopics).map(([subtopicKey, subtopic]) => (
                                <div key={subtopicKey} className="space-y-2">
                                  <p className="text-sm font-medium text-[var(--foreground-muted)]">
                                    {subtopicKey} {subtopic.label}
                                  </p>
                                  
                                  {subtopic.items.map(item => (
                                    <div key={item.id} className="flex flex-col sm:flex-row sm:items-center gap-2 bg-[var(--background-secondary)] rounded-xl p-3">
                                      <span className="text-sm text-[var(--foreground)] flex-1">
                                        {item.label}
                                      </span>
                                      <GradeSelector 
                                        itemId={item.id} 
                                        currentGrade={evaluations[item.id]} 
                                      />
                                    </div>
                                  ))}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Campos de texto */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-[var(--foreground)] mb-2">
              <Music size={16} className="inline mr-2" />
              Exercícios Realizados
            </label>
            <textarea
              value={exercisesDone}
              onChange={(e) => setExercisesDone(e.target.value)}
              rows={3}
              className="w-full bg-[var(--background-secondary)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[#7732A6] resize-none"
              placeholder="Ex: Escalas em 5ª, exercícios de respiração..."
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-[var(--foreground)] mb-2">
              <Star size={16} className="inline mr-2" />
              Para Casa (Homework)
            </label>
            <textarea
              value={homework}
              onChange={(e) => setHomework(e.target.value)}
              rows={3}
              className="w-full bg-[var(--background-secondary)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[#7732A6] resize-none"
              placeholder="Tarefas para o aluno praticar até a próxima aula..."
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-[var(--foreground)] mb-2">
              <AlertCircle size={16} className="inline mr-2" />
              Observações Gerais
            </label>
            <textarea
              value={generalNotes}
              onChange={(e) => setGeneralNotes(e.target.value)}
              rows={4}
              className="w-full bg-[var(--background-secondary)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[#7732A6] resize-none"
              placeholder="Anotações, pontos de atenção, progresso..."
            />
          </div>
        </div>

        {/* Erro */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-red-700 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Botão */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-[#7732A6] to-[#5B21B6] hover:opacity-90 text-white font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <>
              <Save size={20} />
              Salvar Relatório
            </>
          )}
        </button>
      </form>
    </div>
  );
}
