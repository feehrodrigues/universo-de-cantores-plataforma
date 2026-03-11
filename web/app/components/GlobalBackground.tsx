'use client';

/**
 * GlobalBackground - Fundo consistente para todo o site
 * 
 * DESIGN: Gradiente elegante e SUTIL com orbs roxo/ciano + vinheta branca
 */
export default function GlobalBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Fundo base sólido */}
      <div className="absolute inset-0 bg-[var(--background)]" />
      
      {/* Orbs animados - Roxo e Ciano, separados para não sobrepor */}
      <div 
        className="absolute top-[30%] left-[15%] w-[350px] h-[350px] rounded-full 
                   blur-[120px] opacity-[0.025] animate-pulse-glow
                   bg-[#7732A6]"
      />
      <div 
        className="absolute top-[30%] right-[15%] w-[400px] h-[400px] rounded-full 
                   blur-[130px] opacity-[0.02] animate-pulse-glow
                   bg-[#72F2F2]"
        style={{ animationDelay: '2s' }}
      />
      
      {/* Vinheta branca nas bordas */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 70% 60% at 50% 50%, transparent 0%, var(--background) 100%)'
        }}
      />
    </div>
  );
}
