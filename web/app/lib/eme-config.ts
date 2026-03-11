// lib/eme-config.ts

export interface EmeItem {
  id: string;
  label: string;
}

export interface EmeSubTopic {
  label: string;
  items: EmeItem[];
  inheritsFrom?: string;
}

export interface EmeTopic {
  label: string;
  subtopics: Record<string, EmeSubTopic>;
}

export interface EmeDimension {
  label: string;
  topics: Record<string, EmeTopic>;
}

export const EME_STRUCTURE: Record<string, EmeDimension> = {
  ES: {
    label: "Estrutura",
    topics: {
      "1": {
        label: "Suporte Respiratório",
        subtopics: {
          "1.1": { 
            label: "Apoio e Postura", 
            items: [
              { id: "ES-1.1.1.1", label: "Esterno Alto" },
              { id: "ES-1.1.1.2", label: "Ombro Relaxado" },
              { id: "ES-1.1.1.3", label: "Nuca Ajustada" },
              { id: "ES-1.1.2", label: "Inspiração Intercostal" },
              { id: "ES-1.1.3.1.1", label: "Floating (Sensação de Apneia)" }
            ] 
          },
          "1.2": { label: "Contra-Apoio", items: [{ id: "ES-1.2", label: "Controle de Contra-Apoio" }] }
        }
      },
      "2": {
        label: "Fechamento / Adução",
        subtopics: {
          "2.1": { 
            label: "Equilíbrio Glótico", 
            items: [
              { id: "ES-2.1.1.1", label: "Ataque Semissuave" },
              { id: "ES-2.1.1.4", label: "Fechamento Neutro" },
              { id: "ES-2.1.1.5", label: "Fechamento Firme" },
              { id: "ES-2.2", label: "Binômio Fonte-Fluxo" }
            ] 
          }
        }
      },
      "3": {
        label: "Registros Vocais",
        subtopics: {
          "3.1": { 
            label: "Equilíbrio TA/CT", 
            items: [
              { id: "ES-3.1.1", label: "Tensão/Relaxamento TA" },
              { id: "ES-3.1.2", label: "Troca de Registros" },
              { id: "ES-3.1.4.1", label: "Estabilidade Médio Denso" },
              { id: "ES-3.1.4.2", label: "Estabilidade Médio Tênue" },
              { id: "ES-3.1.5.1", label: "Controle de Passagem" }
            ] 
          },
          "3.2": { label: "Registro Tênue", items: [{ id: "ES-3.2", label: "Eficiência e Estabilidade" }] },
          "3.3": { label: "Registro Denso", items: [{ id: "ES-3.3", label: "Eficiência e Estabilidade" }] }
        }
      },
      "4": {
        label: "Estabilidade Laríngea",
        subtopics: {
          "4.1": { 
            label: "M. Esternotireoideo", 
            items: [
              { id: "ES-4.1.1.1", label: "Manutenção do Abaixamento" },
              { id: "ES-4.1.1.2", label: "Capacidade de Abaixamento" }
            ] 
          }
        }
      },
      "5": {
        label: "Redução de Compensações",
        subtopics: {
          "5.1": { 
            label: "Músculos Extrínsecos", 
            items: [
              { id: "ES-5.1", label: "Sem tensão de língua" },
              { id: "ES-5.2", label: "Sem tensão de pescoço" },
              { id: "ES-5.3.1", label: "Sem tensão maxilar" },
              { id: "ES-3.1.1.1", label: "Sem bruxismo" }
            ] 
          }
        }
      }
    }
  },
  MO: {
    label: "Modelagem",
    topics: {
      "1": {
        label: "Ajuste do Trato Vocal",
        subtopics: {
          "1.1": { label: "Laringofaringe", inheritsFrom: "ES-4", items: [{ id: "MO-1.1", label: "Ajuste Acústico" }] },
          "1.2": { label: "Orofaringe", items: [
            { id: "MO-1.2.1.1", label: "Meia Cobertura" },
            { id: "MO-1.2.1.2", label: "Cobertura" },
            { id: "MO-1.2.1.3", label: "Controle Palato Mole" }
          ]},
          "1.3": { label: "Nasofaringe", items: [{ id: "MO-1.3.1", label: "Elevação Velar" }] },
          "1.4": { label: "Cavidade Oral", items: [
            { id: "MO-1.4.1", label: "Posição da Língua" },
            { id: "MO-1.4.2", label: "Abertura da Boca" },
            { id: "MO-1.4.3", label: "Espaço Alveolar" }
          ]},
          "1.5": { label: "Cavidade Nasal", items: [
            { id: "MO-1.5.1", label: "Estágio M" },
            { id: "MO-1.5.2", label: "Estágio N" }
          ]}
        }
      },
      "2": {
        label: "Eficiência Fonte-Filtro",
        subtopics: {
          "2.1": { label: "Interação Supraglótica", items: [
            { id: "MO-2.1", label: "Adequação de Pressão" },
            { id: "MO-2.3", label: "Ajuste Fino Filtro" },
            { id: "MO-2.4", label: "Ajuste Fino Fonte" }
          ]}
        }
      },
      "3": {
        label: "Dicção",
        subtopics: {
          "3.1": { label: "Articulação", items: [
            { id: "MO-3.1.1", label: "Articulação Vogais" },
            { id: "MO-3.1.2", label: "Precisão Consoantes" }
          ]}
        }
      },
      "4": {
        label: "Timbre",
        subtopics: {
          "4.1": { label: "Equilíbrio", items: [
            { id: "MO-4.1", label: "Chiaroscuro" },
            { id: "MO-4.2", label: "Consistência Timbrística" }
          ]}
        }
      }
    }
  },
  EX: {
    label: "Expressão",
    topics: {
      "1": {
        label: "Interpretação",
        subtopics: {
          "1.1": { label: "Intenção e Arte", items: [
            { id: "EX-1.1.1", label: "Identidade Artística" },
            { id: "EX-1.1.3", label: "Momento Anterior" },
            { id: "EX-1.1.4.1", label: "Intensidade" },
            { id: "EX-1.1.4.3", label: "Musicalidade / Agógica" }
          ]}
        }
      },
      "3": {
        label: "Coerência e Estética",
        subtopics: {
          "3.1": { label: "Consistência", items: [
            { id: "EX-3.1.1", label: "Consistência Musical" },
            { id: "EX-3.1.2", label: "Consistência Vocal" },
            { id: "EX-3.1.3", label: "Consistência Estilística" }
          ]}
        }
      }
    }
  }
};