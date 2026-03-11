"use client";

import { useState } from "react";
import { Download, FileSpreadsheet, Loader2, Calendar, Filter } from "lucide-react";
import { saveAs } from "file-saver";

interface ClassData {
  id: string;
  title: string;
  scheduledAt: string;
  duration: number;
  student: {
    name: string;
    email: string;
  };
  paymentStatus: string;
  classType: string;
}

interface ExportClassesProps {
  classes: ClassData[];
  teacherName?: string;
}

export default function ExportClasses({ classes, teacherName = "Professor" }: ExportClassesProps) {
  const [loading, setLoading] = useState(false);
  const [exportType, setExportType] = useState<"excel" | "pdf">("excel");
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10),
    end: new Date().toISOString().slice(0, 10),
  });

  const filteredClasses = classes.filter(c => {
    const classDate = new Date(c.scheduledAt);
    const start = new Date(dateRange.start);
    const end = new Date(dateRange.end);
    return classDate >= start && classDate <= end;
  });

  const exportToExcel = async () => {
    setLoading(true);
    try {
      const XLSX = await import("xlsx");
      
      // Preparar dados
      const data = filteredClasses.map(c => ({
        "Data": new Date(c.scheduledAt).toLocaleDateString("pt-BR"),
        "Horário": new Date(c.scheduledAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
        "Aluno": c.student?.name || "N/A",
        "Email": c.student?.email || "N/A",
        "Título": c.title,
        "Duração (min)": c.duration,
        "Tipo": c.classType === "online" ? "Online" : "Presencial",
        "Pagamento": c.paymentStatus === "paid" ? "Pago" : "Pendente",
      }));

      // Criar workbook
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Aulas");
      
      // Ajustar largura das colunas
      ws["!cols"] = [
        { wch: 12 }, // Data
        { wch: 10 }, // Horário
        { wch: 25 }, // Aluno
        { wch: 30 }, // Email
        { wch: 20 }, // Título
        { wch: 15 }, // Duração
        { wch: 12 }, // Tipo
        { wch: 12 }, // Pagamento
      ];

      // Adicionar resumo
      const summary = [
        { "Resumo": "Total de Aulas", "Valor": filteredClasses.length },
        { "Resumo": "Aulas Pagas", "Valor": filteredClasses.filter(c => c.paymentStatus === "paid").length },
        { "Resumo": "Aulas Pendentes", "Valor": filteredClasses.filter(c => c.paymentStatus !== "paid").length },
        { "Resumo": "Total Horas", "Valor": (filteredClasses.reduce((acc, c) => acc + c.duration, 0) / 60).toFixed(1) },
        { "Resumo": "Período", "Valor": `${new Date(dateRange.start).toLocaleDateString("pt-BR")} a ${new Date(dateRange.end).toLocaleDateString("pt-BR")}` },
      ];
      
      const wsSummary = XLSX.utils.json_to_sheet(summary);
      XLSX.utils.book_append_sheet(wb, wsSummary, "Resumo");

      // Exportar
      const fileName = `aulas_${teacherName.replace(/\s/g, "_")}_${dateRange.start}_${dateRange.end}.xlsx`;
      XLSX.writeFile(wb, fileName);

    } catch (error) {
      console.error("Erro ao exportar Excel:", error);
      alert("Erro ao exportar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const exportToPDF = async () => {
    setLoading(true);
    try {
      // Criar HTML para impressão
      const totalHours = (filteredClasses.reduce((acc, c) => acc + c.duration, 0) / 60).toFixed(1);
      const paidCount = filteredClasses.filter(c => c.paymentStatus === "paid").length;
      const pendingCount = filteredClasses.filter(c => c.paymentStatus !== "paid").length;

      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Relatório de Aulas - ${teacherName}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #7732A6; margin-bottom: 5px; }
            .period { color: #666; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
            th { background: #7732A6; color: white; }
            tr:nth-child(even) { background: #f9f9f9; }
            .summary { display: flex; gap: 20px; margin: 20px 0; }
            .summary-card { background: #f0f0f0; padding: 15px; border-radius: 8px; flex: 1; text-align: center; }
            .summary-card h3 { margin: 0; font-size: 24px; color: #7732A6; }
            .summary-card p { margin: 5px 0 0; color: #666; }
            .paid { color: green; }
            .pending { color: orange; }
            @media print {
              body { padding: 0; }
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <h1>Relatório de Aulas</h1>
          <p class="period">Professor: ${teacherName}</p>
          <p class="period">Período: ${new Date(dateRange.start).toLocaleDateString("pt-BR")} a ${new Date(dateRange.end).toLocaleDateString("pt-BR")}</p>
          
          <div class="summary">
            <div class="summary-card">
              <h3>${filteredClasses.length}</h3>
              <p>Total de Aulas</p>
            </div>
            <div class="summary-card">
              <h3>${totalHours}h</h3>
              <p>Total de Horas</p>
            </div>
            <div class="summary-card">
              <h3 class="paid">${paidCount}</h3>
              <p>Aulas Pagas</p>
            </div>
            <div class="summary-card">
              <h3 class="pending">${pendingCount}</h3>
              <p>Pendentes</p>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Data</th>
                <th>Horário</th>
                <th>Aluno</th>
                <th>Duração</th>
                <th>Tipo</th>
                <th>Pagamento</th>
              </tr>
            </thead>
            <tbody>
              ${filteredClasses.map(c => `
                <tr>
                  <td>${new Date(c.scheduledAt).toLocaleDateString("pt-BR")}</td>
                  <td>${new Date(c.scheduledAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</td>
                  <td>${c.student?.name || "N/A"}</td>
                  <td>${c.duration} min</td>
                  <td>${c.classType === "online" ? "Online" : "Presencial"}</td>
                  <td class="${c.paymentStatus === "paid" ? "paid" : "pending"}">${c.paymentStatus === "paid" ? "Pago" : "Pendente"}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>

          <p style="margin-top: 30px; text-align: center; color: #999; font-size: 12px;">
            Gerado em ${new Date().toLocaleString("pt-BR")} - Universo de Cantores
          </p>
        </body>
        </html>
      `;

      // Abrir nova janela para impressão/PDF
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(html);
        printWindow.document.close();
        setTimeout(() => {
          printWindow.print();
        }, 500);
      }

    } catch (error) {
      console.error("Erro ao exportar PDF:", error);
      alert("Erro ao exportar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    if (exportType === "excel") {
      exportToExcel();
    } else {
      exportToPDF();
    }
  };

  return (
    <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-6">
      <h3 className="text-lg font-bold text-[var(--foreground)] mb-4 flex items-center gap-2">
        <Download size={20} className="text-[#7732A6]" />
        Exportar Aulas
      </h3>

      <div className="space-y-4">
        {/* Filtro de data */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-[var(--foreground-muted)] mb-1">
              <Calendar size={12} className="inline mr-1" />
              Data Início
            </label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="w-full bg-[var(--background-secondary)] border border-[var(--card-border)] rounded-xl px-3 py-2 text-sm text-[var(--foreground)]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--foreground-muted)] mb-1">
              <Calendar size={12} className="inline mr-1" />
              Data Fim
            </label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="w-full bg-[var(--background-secondary)] border border-[var(--card-border)] rounded-xl px-3 py-2 text-sm text-[var(--foreground)]"
            />
          </div>
        </div>

        {/* Preview */}
        <div className="bg-[var(--background-secondary)] rounded-xl p-4">
          <div className="flex items-center gap-2 text-sm text-[var(--foreground-muted)] mb-2">
            <Filter size={14} />
            Aulas no período selecionado
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div>
              <p className="text-2xl font-bold text-[#7732A6]">{filteredClasses.length}</p>
              <p className="text-xs text-[var(--foreground-muted)]">Total</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">
                {filteredClasses.filter(c => c.paymentStatus === "paid").length}
              </p>
              <p className="text-xs text-[var(--foreground-muted)]">Pagas</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-500">
                {filteredClasses.filter(c => c.paymentStatus !== "paid").length}
              </p>
              <p className="text-xs text-[var(--foreground-muted)]">Pendentes</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-[#06b6d4]">
                {(filteredClasses.reduce((acc, c) => acc + c.duration, 0) / 60).toFixed(1)}h
              </p>
              <p className="text-xs text-[var(--foreground-muted)]">Horas</p>
            </div>
          </div>
        </div>

        {/* Tipo de exportação */}
        <div className="flex gap-2">
          <button
            onClick={() => setExportType("excel")}
            className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
              exportType === "excel"
                ? "bg-green-600 text-white"
                : "bg-[var(--background-secondary)] text-[var(--foreground-muted)]"
            }`}
          >
            <FileSpreadsheet size={16} />
            Excel
          </button>
          <button
            onClick={() => setExportType("pdf")}
            className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
              exportType === "pdf"
                ? "bg-red-600 text-white"
                : "bg-[var(--background-secondary)] text-[var(--foreground-muted)]"
            }`}
          >
            <Download size={16} />
            PDF
          </button>
        </div>

        {/* Botão exportar */}
        <button
          onClick={handleExport}
          disabled={loading || filteredClasses.length === 0}
          className="w-full bg-gradient-to-r from-[#7732A6] to-[#5B21B6] hover:opacity-90 text-white font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <>
              <Download size={20} />
              Exportar {exportType === "excel" ? "Excel" : "PDF"}
            </>
          )}
        </button>

        {filteredClasses.length === 0 && (
          <p className="text-center text-sm text-[var(--foreground-muted)]">
            Nenhuma aula no período selecionado
          </p>
        )}
      </div>
    </div>
  );
}
