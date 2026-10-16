"use client";

import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";
import { TrendingUp, TrendingDown, Minus, Calendar, ChevronDown, Eye, EyeOff, Loader2 } from "lucide-react";

interface ChartDataPoint {
  date: string;
  dateFormatted: string;
  estrutura: number | null;
  modelagem: number | null;
  expressao: number | null;
  // Detalhes
  suporteRespiratorio?: number | null;
  fechamentoGlotico?: number | null;
  registrosVocais?: number | null;
  estabilidadeLaringea?: number | null;
  ajusteTratVocal?: number | null;
  eficienciaFonteFilterro?: number | null;
  diccao?: number | null;
  timbre?: number | null;
  interpretacao?: number | null;
  selecaoRepertorio?: number | null;
  coerenciaArtistica?: number | null;
}

interface Comparison {
  estrutura: { anterior: number; atual: number; variacao: number };
  modelagem: { anterior: number; atual: number; variacao: number };
  expressao: { anterior: number; atual: number; variacao: number };
}

interface EvolucaoData {
  chartData: ChartDataPoint[];
  comparison: Comparison;
  currentProfile: {
    avgStructureGrade: number;
    avgModelingGrade: number;
    avgExpressionGrade: number;
    overallGrade: number;
    totalClassesTaken: number;
  } | null;
  totalClasses: number;
  period: string;
}

const PERIODS = [
  { value: "1m", label: "Último mês" },
  { value: "3m", label: "3 meses" },
  { value: "6m", label: "6 meses" },
  { value: "1y", label: "1 ano" },
  { value: "all", label: "Todo período" },
];

const COLORS = {
  estrutura: "#7732A6",
  modelagem: "#06b6d4",
  expressao: "#F252BA",
};

export default function EvolucaoVocalChart({ studentId }: { studentId?: string }) {
  const [data, setData] = useState<EvolucaoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("6m");
  const [showDetails, setShowDetails] = useState(false);
  const [chartType, setChartType] = useState<"line" | "area" | "radar">("line");
  const [visibleLines, setVisibleLines] = useState({
    estrutura: true,
    modelagem: true,
    expressao: true,
  });

  useEffect(() => {
    fetchData();
  }, [period, studentId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ period });
      if (studentId) params.append("studentId", studentId);
      
      const res = await fetch(`/api/evolucao?${params}`);
      if (res.ok) {
        const result = await res.json();
        setData(result);
      }
    } catch (error) {
      console.error("Erro ao carregar evolução:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleLine = (key: keyof typeof visibleLines) => {
    setVisibleLines(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const renderVariation = (value: number) => {
    if (value > 0) {
      return (
        <span className="flex items-center gap-1 text-green-600">
          <TrendingUp size={14} />
          +{value.toFixed(1)}
        </span>
      );
    } else if (value < 0) {
      return (
        <span className="flex items-center gap-1 text-red-500">
          <TrendingDown size={14} />
          {value.toFixed(1)}
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 text-gray-500">
        <Minus size={14} />
        0
      </span>
    );
  };

  if (loading) {
    return (
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-8">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-[#7732A6]" size={40} />
        </div>
      </div>
    );
  }

  if (!data || data.chartData.length === 0) {
    return (
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-8">
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp size={32} className="text-[#7732A6]" />
          </div>
          <h3 className="text-xl font-bold text-[var(--foreground)] mb-2" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
            Sua Evolução Começará em Breve
          </h3>
          <p className="text-[var(--foreground-muted)] max-w-md mx-auto">
            Após suas primeiras aulas com avaliação, você verá aqui um gráfico completo da sua evolução vocal ao longo do tempo.
          </p>
        </div>
      </div>
    );
  }

  // Preparar dados para o radar chart
  const radarData = data.currentProfile ? [
    { subject: "Estrutura", value: data.currentProfile.avgStructureGrade, fullMark: 10 },
    { subject: "Modelagem", value: data.currentProfile.avgModelingGrade, fullMark: 10 },
    { subject: "Expressão", value: data.currentProfile.avgExpressionGrade, fullMark: 10 },
  ] : [];

  return (
    <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-[var(--foreground)] flex items-center gap-2" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
            <TrendingUp size={24} className="text-[#7732A6]" />
            Evolução Vocal
          </h2>
          <p className="text-sm text-[var(--foreground-muted)]">
            {data.totalClasses} aulas avaliadas no período
          </p>
        </div>

        {/* Controles */}
        <div className="flex flex-wrap gap-2">
          {/* Período */}
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="bg-[var(--background-secondary)] border border-[var(--card-border)] rounded-lg px-3 py-2 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[#7732A6]"
          >
            {PERIODS.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>

          {/* Tipo de gráfico */}
          <div className="flex bg-[var(--background-secondary)] rounded-lg overflow-hidden border border-[var(--card-border)]">
            {(["line", "area", "radar"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setChartType(type)}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  chartType === type
                    ? "bg-[#7732A6] text-white"
                    : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                }`}
              >
                {type === "line" ? "Linha" : type === "area" ? "Área" : "Radar"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Comparação de Períodos */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { key: "estrutura", label: "Estrutura", color: COLORS.estrutura },
          { key: "modelagem", label: "Modelagem", color: COLORS.modelagem },
          { key: "expressao", label: "Expressão", color: COLORS.expressao },
        ].map(({ key, label, color }) => {
          const comp = data.comparison[key as keyof Comparison];
          return (
            <button
              key={key}
              onClick={() => toggleLine(key as keyof typeof visibleLines)}
              className={`p-4 rounded-xl border transition-all ${
                visibleLines[key as keyof typeof visibleLines]
                  ? "border-2"
                  : "border-[var(--card-border)] opacity-50"
              }`}
              style={{ borderColor: visibleLines[key as keyof typeof visibleLines] ? color : undefined }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[var(--foreground-muted)] uppercase">{label}</span>
                {visibleLines[key as keyof typeof visibleLines] ? (
                  <Eye size={14} className="text-[var(--foreground-muted)]" />
                ) : (
                  <EyeOff size={14} className="text-[var(--foreground-muted)]" />
                )}
              </div>
              <p className="text-2xl font-bold" style={{ color }}>
                {comp.atual.toFixed(1)}
              </p>
              <div className="text-xs mt-1">
                {renderVariation(comp.variacao)}
              </div>
            </button>
          );
        })}
      </div>

      {/* Gráfico */}
      <div className="h-[300px] md:h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "radar" ? (
            <RadarChart data={radarData}>
              <PolarGrid stroke="var(--card-border)" />
              <PolarAngleAxis 
                dataKey="subject" 
                tick={{ fill: 'var(--foreground)', fontSize: 12 }}
              />
              <PolarRadiusAxis 
                angle={90} 
                domain={[0, 10]} 
                tick={{ fill: 'var(--foreground-muted)', fontSize: 10 }}
              />
              <Radar
                name="Nota Atual"
                dataKey="value"
                stroke="#7732A6"
                fill="#7732A6"
                fillOpacity={0.5}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--card-bg)',
                  border: '1px solid var(--card-border)',
                  borderRadius: '8px',
                }}
              />
            </RadarChart>
          ) : chartType === "area" ? (
            <AreaChart data={data.chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--card-border)" />
              <XAxis 
                dataKey="dateFormatted" 
                tick={{ fill: 'var(--foreground-muted)', fontSize: 11 }}
                axisLine={{ stroke: 'var(--card-border)' }}
              />
              <YAxis 
                domain={[0, 10]} 
                tick={{ fill: 'var(--foreground-muted)', fontSize: 11 }}
                axisLine={{ stroke: 'var(--card-border)' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--card-bg)',
                  border: '1px solid var(--card-border)',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: 'var(--foreground)' }}
              />
              <Legend />
              {visibleLines.estrutura && (
                <Area
                  type="monotone"
                  dataKey="estrutura"
                  name="Estrutura"
                  stroke={COLORS.estrutura}
                  fill={COLORS.estrutura}
                  fillOpacity={0.3}
                  strokeWidth={2}
                  connectNulls
                />
              )}
              {visibleLines.modelagem && (
                <Area
                  type="monotone"
                  dataKey="modelagem"
                  name="Modelagem"
                  stroke={COLORS.modelagem}
                  fill={COLORS.modelagem}
                  fillOpacity={0.3}
                  strokeWidth={2}
                  connectNulls
                />
              )}
              {visibleLines.expressao && (
                <Area
                  type="monotone"
                  dataKey="expressao"
                  name="Expressão"
                  stroke={COLORS.expressao}
                  fill={COLORS.expressao}
                  fillOpacity={0.3}
                  strokeWidth={2}
                  connectNulls
                />
              )}
            </AreaChart>
          ) : (
            <LineChart data={data.chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--card-border)" />
              <XAxis 
                dataKey="dateFormatted" 
                tick={{ fill: 'var(--foreground-muted)', fontSize: 11 }}
                axisLine={{ stroke: 'var(--card-border)' }}
              />
              <YAxis 
                domain={[0, 10]} 
                tick={{ fill: 'var(--foreground-muted)', fontSize: 11 }}
                axisLine={{ stroke: 'var(--card-border)' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--card-bg)',
                  border: '1px solid var(--card-border)',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: 'var(--foreground)' }}
              />
              <Legend />
              {visibleLines.estrutura && (
                <Line
                  type="monotone"
                  dataKey="estrutura"
                  name="Estrutura"
                  stroke={COLORS.estrutura}
                  strokeWidth={3}
                  dot={{ fill: COLORS.estrutura, strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                  connectNulls
                />
              )}
              {visibleLines.modelagem && (
                <Line
                  type="monotone"
                  dataKey="modelagem"
                  name="Modelagem"
                  stroke={COLORS.modelagem}
                  strokeWidth={3}
                  dot={{ fill: COLORS.modelagem, strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                  connectNulls
                />
              )}
              {visibleLines.expressao && (
                <Line
                  type="monotone"
                  dataKey="expressao"
                  name="Expressão"
                  stroke={COLORS.expressao}
                  strokeWidth={3}
                  dot={{ fill: COLORS.expressao, strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                  connectNulls
                />
              )}
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Toggle para detalhes técnicos */}
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="mt-6 flex items-center gap-2 text-sm font-bold text-[#7732A6] hover:text-[#F252BA] transition-colors"
      >
        <ChevronDown size={16} className={`transition-transform ${showDetails ? "rotate-180" : ""}`} />
        {showDetails ? "Ocultar detalhes técnicos" : "Ver detalhes técnicos por aula"}
      </button>

      {/* Detalhes Técnicos */}
      {showDetails && (
        <div className="mt-6 space-y-4">
          <h3 className="font-bold text-[var(--foreground)]">Histórico Detalhado</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--card-border)]">
                  <th className="text-left py-3 px-2 text-[var(--foreground-muted)] font-bold">Data</th>
                  <th className="text-center py-3 px-2 text-[#7732A6] font-bold">Estrutura</th>
                  <th className="text-center py-3 px-2 text-cyan-500 font-bold">Modelagem</th>
                  <th className="text-center py-3 px-2 text-[#F252BA] font-bold">Expressão</th>
                </tr>
              </thead>
              <tbody>
                {data.chartData.map((row, idx) => (
                  <tr key={row.date} className="border-b border-[var(--card-border)]/50 hover:bg-[var(--background-secondary)]">
                    <td className="py-3 px-2 text-[var(--foreground)]">{row.dateFormatted}</td>
                    <td className="py-3 px-2 text-center">
                      <span className="font-bold text-[#7732A6]">
                        {row.estrutura?.toFixed(1) || "—"}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-center">
                      <span className="font-bold text-cyan-500">
                        {row.modelagem?.toFixed(1) || "—"}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-center">
                      <span className="font-bold text-[#F252BA]">
                        {row.expressao?.toFixed(1) || "—"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
