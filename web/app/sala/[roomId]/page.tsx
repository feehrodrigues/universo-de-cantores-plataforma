"use client";

import { JitsiMeeting } from "@jitsi/react-sdk";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Mic2, Loader2, MessageCircle, Save, User, Target, Music, Heart, Dumbbell, CheckCircle } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";

interface ClassData {
  id: string;
  title: string;
  description: string | null;
  scheduledAt: string;
  students: Array<{
    id: string;
    name: string | null;
    email: string;
    studentProfile: {
      generalGoal: string | null;
      vocalHistory: string | null;
      vocalProfile: {
        avgStructureGrade: number;
        avgModelingGrade: number;
        avgExpressionGrade: number;
        overallGrade: number;
      } | null;
    } | null;
  }>;
  instructor: {
    id: string;
    name: string | null;
    email: string;
  };
  preBriefing: {
    vocalFocus: string | null;
    emotionalState: string | null;
    physicalState: string | null;
    musicChoice: string | null;
    specificGoals: string | null;
  } | null;
  report: {
    technicalAnalysis: string | null;
    studentObservations: string | null;
    homework: string | null;
    nextFocusAreas: string | null;
  } | null;
}

export default function ClassRoomPage() {
  const router = useRouter();
  const params = useParams();
  const { data: session, status } = useSession();
  
  const roomId = params.roomId as string;
  const [classData, setClassData] = useState<ClassData | null>(null);
  const [userRole, setUserRole] = useState<"instructor" | "student" | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  
  // Formulário de anotações do professor
  const [notes, setNotes] = useState({
    technicalAnalysis: "",
    studentObservations: "",
    homework: "",
    nextFocusAreas: ""
  });

  const fetchClassData = useCallback(async () => {
    try {
      const res = await fetch(`/api/sala/${roomId}`);
      if (res.ok) {
        const data = await res.json();
        setClassData(data.class);
        setUserRole(data.role);
        if (data.class?.report) {
          setNotes({
            technicalAnalysis: data.class.report.technicalAnalysis || "",
            studentObservations: data.class.report.studentObservations || "",
            homework: data.class.report.homework || "",
            nextFocusAreas: data.class.report.nextFocusAreas || ""
          });
        }
      }
    } catch (error) {
      console.error("Erro ao carregar dados da aula:", error);
    } finally {
      setLoading(false);
    }
  }, [roomId]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchClassData();
    }
  }, [status, router, fetchClassData]);

  const saveNotes = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch(`/api/sala/${roomId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(notes)
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
    } finally {
      setSaving(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
        <Loader2 size={40} className="animate-spin text-purple-500 mb-4" />
        <p className="text-slate-400 font-bold tracking-widest uppercase text-xs">Preparando Estúdio...</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  const displayName = session?.user?.name || "Tripulante";
  const userEmail = session?.user?.email || "";
  const student = classData?.students?.[0];
  const briefing = classData?.preBriefing;

  return (
    <div className="h-screen w-screen bg-[#0F172A] relative overflow-hidden flex flex-col">
      
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]"></div>
      </div>

      <header className="relative z-10 px-6 py-4 flex justify-between items-center bg-slate-900/50 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-white/50 hover:text-white transition-colors flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
            <ArrowLeft size={16} /> Sair da Sala
          </Link>
          <div className="h-6 w-px bg-white/10 mx-2"></div>
          <div className="flex items-center gap-3 text-white font-black">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center shadow-md"><Mic2 size={16}/></div>
            <span className="tracking-tight text-sm">{classData?.title || "Estúdio Virtual"}</span>
          </div>
        </div>
        {student && (
          <div className="flex items-center gap-2 text-white/70 text-xs">
            <User size={14} />
            <span>{student.name || student.email}</span>
          </div>
        )}
      </header>

      <main className="flex-1 relative z-0 grid grid-cols-1 lg:grid-cols-4 overflow-hidden">
        
        {/* Coluna Esquerda (Vídeo) */}
        <div className="lg:col-span-3 h-full">
          <JitsiMeeting
            domain="meet.jit.si"
            roomName={roomId}
            configOverwrite={{
              startWithAudioMuted: true,
              disableModeratorIndicator: true,
              startScreenSharing: true,
              prejoinPageEnabled: false,
            }}
            interfaceConfigOverwrite={{
              TOOLBAR_BUTTONS: [
                'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
                'fodeviceselection', 'hangup', 'chat', 'settings', 'tileview'
              ],
            }}
            userInfo={{
              displayName: displayName,
              email: userEmail
            }}
            getIFrameRef={(iframeRef) => {
              iframeRef.style.height = "100%";
              iframeRef.style.width = "100%";
            }}
          />
        </div>

        {/* Coluna Direita (Briefing + Anotações) */}
        <aside className="bg-black/70 backdrop-blur-lg text-white lg:border-l border-white/10 relative overflow-y-auto">
          <div className="p-6 lg:p-6 space-y-6">
            
            {/* Briefing do Aluno */}
            <div>
              <h3 className="text-sm font-extrabold text-purple-300 uppercase tracking-widest mb-4 flex items-center gap-3">
                <MessageCircle size={16} className="text-purple-400" /> Briefing do Aluno
              </h3>
              
              {briefing ? (
                <div className="space-y-3">
                  {briefing.vocalFocus && (
                    <div className="bg-white/5 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-purple-300 text-xs font-bold mb-1">
                        <Target size={12} /> Foco Vocal
                      </div>
                      <p className="text-sm text-white/80">{briefing.vocalFocus}</p>
                    </div>
                  )}
                  
                  {briefing.musicChoice && (
                    <div className="bg-white/5 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-pink-300 text-xs font-bold mb-1">
                        <Music size={12} /> Música Escolhida
                      </div>
                      <p className="text-sm text-white/80">{briefing.musicChoice}</p>
                    </div>
                  )}
                  
                  {briefing.emotionalState && (
                    <div className="bg-white/5 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-cyan-300 text-xs font-bold mb-1">
                        <Heart size={12} /> Estado Emocional
                      </div>
                      <p className="text-sm text-white/80">{briefing.emotionalState}</p>
                    </div>
                  )}
                  
                  {briefing.physicalState && (
                    <div className="bg-white/5 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-green-300 text-xs font-bold mb-1">
                        <Dumbbell size={12} /> Estado Físico
                      </div>
                      <p className="text-sm text-white/80">{briefing.physicalState}</p>
                    </div>
                  )}
                  
                  {briefing.specificGoals && (
                    <div className="bg-white/5 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-yellow-300 text-xs font-bold mb-1">
                        <Target size={12} /> Objetivos Específicos
                      </div>
                      <p className="text-sm text-white/80">{briefing.specificGoals}</p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-white/50 italic">
                  {userRole === "instructor" 
                    ? "O aluno ainda não preencheu o briefing." 
                    : "Preencha seu briefing antes da aula no dashboard."}
                </p>
              )}
            </div>

            {/* Perfil Vocal (apenas para instrutor) */}
            {userRole === "instructor" && student?.studentProfile?.vocalProfile && (
              <div>
                <h3 className="text-sm font-extrabold text-cyan-300 uppercase tracking-widest mb-4">
                  Perfil Vocal
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white/5 rounded-lg p-2 text-center">
                    <p className="text-xs text-white/50">Estrutura</p>
                    <p className="text-lg font-bold text-cyan-400">
                      {student.studentProfile.vocalProfile.avgStructureGrade.toFixed(1)}
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-2 text-center">
                    <p className="text-xs text-white/50">Modelagem</p>
                    <p className="text-lg font-bold text-pink-400">
                      {student.studentProfile.vocalProfile.avgModelingGrade.toFixed(1)}
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-2 text-center">
                    <p className="text-xs text-white/50">Expressão</p>
                    <p className="text-lg font-bold text-yellow-400">
                      {student.studentProfile.vocalProfile.avgExpressionGrade.toFixed(1)}
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-2 text-center">
                    <p className="text-xs text-white/50">Geral</p>
                    <p className="text-lg font-bold text-purple-400">
                      {student.studentProfile.vocalProfile.overallGrade.toFixed(1)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Anotações do Professor */}
            {userRole === "instructor" && (
              <div>
                <h3 className="text-sm font-extrabold text-green-300 uppercase tracking-widest mb-4">
                  Anotações da Aula
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-white/50 block mb-1">Análise Técnica</label>
                    <textarea 
                      value={notes.technicalAnalysis}
                      onChange={(e) => setNotes({...notes, technicalAnalysis: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-white resize-none focus:outline-none focus:border-purple-500"
                      rows={2}
                      placeholder="Observações técnicas..."
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/50 block mb-1">Observações do Aluno</label>
                    <textarea 
                      value={notes.studentObservations}
                      onChange={(e) => setNotes({...notes, studentObservations: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-white resize-none focus:outline-none focus:border-purple-500"
                      rows={2}
                      placeholder="Como o aluno se saiu..."
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/50 block mb-1">Lição de Casa</label>
                    <textarea 
                      value={notes.homework}
                      onChange={(e) => setNotes({...notes, homework: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-white resize-none focus:outline-none focus:border-purple-500"
                      rows={2}
                      placeholder="Exercícios para praticar..."
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/50 block mb-1">Próximos Focos</label>
                    <textarea 
                      value={notes.nextFocusAreas}
                      onChange={(e) => setNotes({...notes, nextFocusAreas: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-white resize-none focus:outline-none focus:border-purple-500"
                      rows={2}
                      placeholder="O que trabalhar na próxima aula..."
                    />
                  </div>
                  <button
                    onClick={saveNotes}
                    disabled={saving}
                    className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    {saving ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : saved ? (
                      <>
                        <CheckCircle size={16} />
                        Salvo!
                      </>
                    ) : (
                      <>
                        <Save size={16} />
                        Salvar Anotações
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

          </div>
        </aside>
      </main>
    </div>
  );
}