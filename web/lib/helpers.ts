import { urlFor } from "./sanity";

// Função que extrai o ID do YouTube
export const getYoutubeId = (url: string) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

// Função que decide qual imagem mostrar
export const getKitImage = (kit: any) => {
  // 1. Prioridade: Se você subiu imagem no Sanity, usa ela.
  if (kit.coverImage) {
    return urlFor(kit.coverImage).width(500).url();
  }
  
  // 2. Fallback: Se não tem imagem, tenta pegar do primeiro vídeo do YouTube
  if (kit.voices && kit.voices.length > 0 && kit.voices[0].youtubeUrl) {
    const videoId = getYoutubeId(kit.voices[0].youtubeUrl);
    if (videoId) {
      return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    }
  }

  // 3. Se não tiver nada, retorna uma imagem cinza ou placeholder (opcional)
  return null;
}