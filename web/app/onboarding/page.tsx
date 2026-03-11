"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Music, Mic, Users, Heart, ArrowRight, Sparkles, CheckCircle } from "lucide-react";

const voiceOptions = [
  { value: "soprano", label: "Soprano", color: "#F252BA", description: "Voz feminina mais aguda" },
  { value: "contralto", label: "Contralto", color: "#7732A6", description: "Voz feminina mais grave" },
  { value: "tenor", label: "Tenor", color: "#06b6d4", description: "Voz masculina mais aguda" },
  { value: "baixo", label: "Baixo", color: "#22c55e", description: "Voz masculina mais grave" },
  { value: "nao_sei", label: "Não sei ainda", color: "#9ca3af", description: "Vou descobrir!" },
];

const experienceOptions = [
  { value: "iniciante", label: "Iniciante", icon: Sparkles, description: "Estou começando agora" },
  { value: "intermediario", label: "Intermediário", icon: Music, description: "Já canto há algum tempo" },
  { value: "avancado", label: "Avançado", icon: Mic, description: "Tenho experiência sólida" },
];

const goalOptions = [
  { value: "coral", label: "Cantar em coral", icon: Users },
  { value: "solo", label: "Cantar solo", icon: Mic },
  { value: "louvor", label: "Ministério de louvor", icon: Heart },
  { value: "tecnica", label: "Melhorar técnica", icon: Music },
  { value: "diversao", label: "Por diversão", icon: Sparkles },
];

export default function OnboardingPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [answers, setAnswers] = useState({
    voicePart: "",
    experience: "",
    goals: [] as string[],
  });

  const handleGoalToggle = (goal: string) => {
    setAnswers(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }));
  };

  const handleSubmit = async () => {
    if (!user) return;
    
    setIsSubmitting(true);
    
    try {
      // Salvar no metadata do Clerk
      await user.update({
        unsafeMetadata: {
          onboardingComplete: true,
          voicePart: answers.voicePart,
          experience: answers.experience,
          goals: answers.goals,
        },
      });
      
      // Também salvar no banco de dados via API
      await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answers),
      });
      
      router.push("/dashboard");
    } catch (error) {
      console.error("Erro ao salvar onboarding:", error);
      // Mesmo com erro, redirecionar para dashboard
      router.push("/dashboard");
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#7732A6] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-[var(--card-bg)] backdrop-blur-xl p-10 rounded-3xl shadow-xl border border-[var(--card-border)]">
        
        {/* Progress Bar */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div 
              key={s}
              className={`h-2 flex-1 rounded-full transition-all duration-500 ${
                s <= step 
                  ? "bg-gradient-to-r from-[#7732A6] to-[#F252BA]" 
                  : "bg-[var(--card-border)]"
              }`}
            />
          ))}
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <Image 
              src="/logo.png" 
              alt="Universo de Cantores" 
              fill 
              className="object-contain rounded-xl"
            />
          </div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
            {step === 1 && "Qual é a sua voz?"}
            {step === 2 && "Seu nível de experiência"}
            {step === 3 && "Seus objetivos"}
          </h1>
          <p className="text-sm text-[var(--foreground-muted)] mt-2">
            {step === 1 && "Selecione seu naipe vocal"}
            {step === 2 && "Isso nos ajuda a personalizar sua experiência"}
            {step === 3 && "O que você busca no canto? (pode escolher vários)"}
          </p>
        </div>

        {/* Step 1 - Voice Part */}
        {step === 1 && (
          <div className="space-y-3">
            {voiceOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setAnswers(prev => ({ ...prev, voicePart: option.value }))}
                className={`w-full p-4 rounded-2xl border-2 transition-all duration-300 flex items-center justify-between ${
                  answers.voicePart === option.value
                    ? "border-[#7732A6] bg-[#7732A6]/10"
                    : "border-[var(--card-border)] hover:border-[#7732A6]/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: option.color }}
                  />
                  <div className="text-left">
                    <p className="font-semibold text-[var(--foreground)]">{option.label}</p>
                    <p className="text-xs text-[var(--foreground-muted)]">{option.description}</p>
                  </div>
                </div>
                {answers.voicePart === option.value && (
                  <CheckCircle className="text-[#7732A6]" size={24} />
                )}
              </button>
            ))}
          </div>
        )}

        {/* Step 2 - Experience */}
        {step === 2 && (
          <div className="space-y-3">
            {experienceOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.value}
                  onClick={() => setAnswers(prev => ({ ...prev, experience: option.value }))}
                  className={`w-full p-4 rounded-2xl border-2 transition-all duration-300 flex items-center justify-between ${
                    answers.experience === option.value
                      ? "border-[#06b6d4] bg-[#06b6d4]/10"
                      : "border-[var(--card-border)] hover:border-[#06b6d4]/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="text-[#06b6d4]" size={24} />
                    <div className="text-left">
                      <p className="font-semibold text-[var(--foreground)]">{option.label}</p>
                      <p className="text-xs text-[var(--foreground-muted)]">{option.description}</p>
                    </div>
                  </div>
                  {answers.experience === option.value && (
                    <CheckCircle className="text-[#06b6d4]" size={24} />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Step 3 - Goals */}
        {step === 3 && (
          <div className="space-y-3">
            {goalOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = answers.goals.includes(option.value);
              return (
                <button
                  key={option.value}
                  onClick={() => handleGoalToggle(option.value)}
                  className={`w-full p-4 rounded-2xl border-2 transition-all duration-300 flex items-center justify-between ${
                    isSelected
                      ? "border-[#F252BA] bg-[#F252BA]/10"
                      : "border-[var(--card-border)] hover:border-[#F252BA]/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="text-[#F252BA]" size={24} />
                    <p className="font-semibold text-[var(--foreground)]">{option.label}</p>
                  </div>
                  {isSelected && (
                    <CheckCircle className="text-[#F252BA]" size={24} />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-3 mt-8">
          {step > 1 && (
            <button
              onClick={() => setStep(prev => prev - 1)}
              className="flex-1 py-4 px-6 rounded-2xl border border-[var(--card-border)] text-[var(--foreground)] font-semibold hover:bg-[var(--card-hover)] transition-all"
            >
              Voltar
            </button>
          )}
          
          {step < 3 ? (
            <button
              onClick={() => setStep(prev => prev + 1)}
              disabled={
                (step === 1 && !answers.voicePart) ||
                (step === 2 && !answers.experience)
              }
              className="flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-[#7732A6] to-[#9747FF] text-white font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              Continuar <ArrowRight size={20} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={answers.goals.length === 0 || isSubmitting}
              className="flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-[#F252BA] to-[#7732A6] text-white font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                  Salvando...
                </>
              ) : (
                <>
                  Começar <Sparkles size={20} />
                </>
              )}
            </button>
          )}
        </div>

        {/* Skip */}
        <button
          onClick={() => router.push("/dashboard")}
          className="w-full mt-4 text-sm text-[var(--foreground-muted)] hover:text-[#7732A6] transition-colors"
        >
          Pular por enquanto
        </button>
      </div>
    </div>
  );
}
