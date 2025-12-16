"use client"; // Isso avisa ao Next que aqui tem interatividade (botões)

import { useState } from "react";
import { PlayCircle } from "lucide-react";

// Função simples para pegar o ID do video do Youtube da URL completa
const getYoutubeId = (url: string) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

export default function VideoPlayer({ voices }: { voices: any[] }) {
  // O estado começa selecionando a primeira voz da lista (geralmente Soprano ou Todos)
  const [selectedVoice, setSelectedVoice] = useState(voices[0]);

  return (
    <div className="flex flex-col gap-6">
      
      {/* 1. TELA DO VÍDEO (ASPECT RATIO 16/9) */}
      <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl relative group">
        {selectedVoice?.youtubeUrl ? (
          <iframe
            src={`https://www.youtube.com/embed/${getYoutubeId(selectedVoice.youtubeUrl)}`}
            title="YouTube video player"
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="flex items-center justify-center h-full text-white">
            Vídeo não disponível
          </div>
        )}
      </div>

      {/* 2. SELETOR DE VOZES (BOTÕES) */}
      <div className="flex flex-wrap gap-3 justify-center md:justify-start">
        {voices.map((voz, index) => (
          <button
            key={index}
            onClick={() => setSelectedVoice(voz)}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm uppercase tracking-wider transition-all transform hover:-translate-y-1
              ${selectedVoice.voiceName === voz.voiceName 
                ? "bg-purple-600 text-white shadow-lg ring-4 ring-purple-200" 
                : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"}
            `}
          >
            <PlayCircle size={18} />
            {voz.voiceType || "Voz"} {/* Usa voiceType que definimos no Sanity */}
          </button>
        ))}
      </div>
    </div>
  );
}