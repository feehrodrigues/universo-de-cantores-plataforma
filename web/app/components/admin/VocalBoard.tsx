"use client";

import { useState } from "react";
import { EME_STRUCTURE, EmeDimension, EmeTopic, EmeSubTopic } from "../../lib/eme-config";
import { Activity, ChevronRight, Save, Info, Sparkles } from "lucide-react";

export default function VocalBoard({ onSave }: { onSave: (scores: Record<string, number>) => void }) {
  const [scores, setScores] = useState<Record<string, number>>({});
  const [activeTab, setActiveTab] = useState<keyof typeof EME_STRUCTURE>("ES");

  const handleScoreChange = (id: string, value: number) => {
    setScores(prev => ({ ...prev, [id]: value }));
  };

  const currentDimension = EME_STRUCTURE[activeTab];

  return (
    <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden flex flex-col h-[80vh]">
      
      {/* HEADER DE NAVEGAÇÃO DARK */}
      <div className="flex bg-slate-900 p-2 gap-2">
        {(Object.keys(EME_STRUCTURE) as Array<keyof typeof EME_STRUCTURE>).map((key) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex-1 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.25em] transition-all ${
              activeTab === key 
                ? "bg-white text-slate-900 shadow-xl scale-[0.98]" 
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            {EME_STRUCTURE[key].label}
          </button>
        ))}
      </div>

      {/* ÁREA DE SCROLL DOS PARÂMETROS */}
      <div className="flex-1 overflow-y-auto p-8 lg:p-12 space-y-16 custom-scrollbar">
        {Object.entries(currentDimension.topics).map(([id, topic]) => (
          <div key={id} className="animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="flex items-center gap-4 mb-10">
                <span className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-lg">
                    {id}
                </span>
                <h3 className="text-3xl font-black text-slate-900 tracking-tighter italic">
                    {topic.label}
                </h3>
            </div>

            <div className="grid grid-cols-1 gap-8 ml-4">
              {Object.entries(topic.subtopics).map(([subId, sub]) => (
                <div key={subId} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm relative group hover:border-purple-300 transition-all">
                  <div className="flex justify-between items-center mb-8">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3">
                        <ChevronRight size={16} className="text-purple-500" />
                        {subId} {sub.label}
                    </h4>
                    {sub.inheritsFrom && (
                        <div className="flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-1 rounded-full border border-blue-100">
                            <Info size={12} />
                            <span className="text-[9px] font-black uppercase tracking-widest">Herança: {sub.inheritsFrom}</span>
                        </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
                    {sub.items.map((item) => (
                      <div key={item.id} className="space-y-4">
                        <div className="flex justify-between items-end">
                          <span className="text-sm font-black text-slate-700 leading-none">{item.label}</span>
                          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100 shadow-inner">
                            <span className="text-[10px] font-black text-slate-400">NOTA</span>
                            <span className="text-sm font-black text-purple-600">{scores[item.id] || 1}</span>
                          </div>
                        </div>
                        <div className="relative flex items-center">
                            <input 
                            type="range" min="1" max="10" 
                            value={scores[item.id] || 1}
                            onChange={(e) => handleScoreChange(item.id, parseInt(e.target.value))}
                            className="w-full h-2 bg-slate-100 rounded-full appearance-none cursor-pointer accent-purple-600 focus:ring-4 focus:ring-purple-500/10" 
                            />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* FOOTER DE AÇÕES COM FEEDBACK DE PROGRESSO */}
      <div className="p-10 bg-slate-900 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-6">
            <div className="text-center">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Parâmetros</p>
                <p className="text-2xl font-black text-white">{Object.keys(scores).length}</p>
            </div>
            <div className="h-10 w-px bg-white/10"></div>
            <div className="text-center">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Consistência</p>
                <div className="flex items-center gap-1 text-purple-400">
                    <Sparkles size={14} />
                    <p className="text-xs font-black uppercase">Excelente</p>
                </div>
            </div>
        </div>
        
        <button 
          onClick={() => onSave(scores)}
          className="w-full md:w-auto bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black py-5 px-16 rounded-2xl shadow-[0_20px_50px_rgba(124,58,237,0.3)] transition-all hover:-translate-y-1 active:scale-95 text-xs uppercase tracking-widest"
        >
          PUBLICAR DIAGNÓSTICO E.M.E
        </button>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>
    </div>
  );
}