import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ classId: string }> }
) {
  try {
    const session = await getAuthSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const resolvedParams = await params;
    const classId = resolvedParams.classId;

    // Buscar relatório completo
    const report = await prisma.classReport.findUnique({
      where: { classId },
      include: {
        class: {
          include: {
            students: {
              select: { name: true, email: true }
            },
            instructor: {
              select: { name: true }
            }
          }
        },
        user: {
          select: { name: true }
        }
      }
    });

    if (!report) {
      return NextResponse.json({ error: "Relatório não encontrado" }, { status: 404 });
    }

    // Buscar avaliações
    const structure = await prisma.structureEvaluation.findFirst({ where: { classId } });
    const modeling = await prisma.modelingEvaluation.findFirst({ where: { classId } });
    const expression = await prisma.expressionEvaluation.findFirst({ where: { classId } });

    const studentName = report.class.students[0]?.name || "Aluno";
    const instructorName = report.class.instructor?.name || "Professor";
    const classDate = new Date(report.class.scheduledAt).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });

    // Gerar HTML do relatório para converter em PDF no client
    const htmlContent = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Relatório de Aula - ${studentName}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Comfortaa:wght@700&display=swap');
    
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
      font-family: 'Montserrat', sans-serif;
      background: #f8fafc;
      color: #1e293b;
      line-height: 1.6;
    }
    
    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 40px;
    }
    
    .header {
      background: linear-gradient(135deg, #7732A6 0%, #F252BA 100%);
      color: white;
      padding: 40px;
      border-radius: 24px;
      margin-bottom: 32px;
    }
    
    .header h1 {
      font-family: 'Comfortaa', cursive;
      font-size: 28px;
      margin-bottom: 8px;
    }
    
    .header .subtitle {
      opacity: 0.9;
      font-size: 14px;
    }
    
    .header .meta {
      display: flex;
      gap: 24px;
      margin-top: 24px;
      font-size: 13px;
    }
    
    .header .meta-item {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .scores {
      display: flex;
      gap: 16px;
      margin-bottom: 32px;
    }
    
    .score-card {
      flex: 1;
      background: white;
      border-radius: 16px;
      padding: 24px;
      text-align: center;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
    }
    
    .score-card .label {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #64748b;
      margin-bottom: 8px;
    }
    
    .score-card .value {
      font-size: 32px;
      font-weight: 800;
    }
    
    .score-card.structure .value { color: #7732A6; }
    .score-card.modeling .value { color: #06b6d4; }
    .score-card.expression .value { color: #F252BA; }
    
    .section {
      background: white;
      border-radius: 16px;
      padding: 32px;
      margin-bottom: 24px;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
    }
    
    .section h2 {
      font-family: 'Comfortaa', cursive;
      font-size: 18px;
      color: #7732A6;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .section h2::before {
      content: '';
      width: 4px;
      height: 24px;
      background: linear-gradient(180deg, #7732A6, #F252BA);
      border-radius: 2px;
    }
    
    .section p {
      color: #475569;
      white-space: pre-line;
    }
    
    .action-section {
      background: linear-gradient(135deg, #7732A6 0%, #4f46e5 100%);
      color: white;
      border-radius: 16px;
      padding: 32px;
      margin-bottom: 24px;
    }
    
    .action-section h2 {
      font-family: 'Comfortaa', cursive;
      font-size: 18px;
      margin-bottom: 16px;
    }
    
    .action-section p {
      color: rgba(255,255,255,0.9);
      background: rgba(255,255,255,0.1);
      padding: 20px;
      border-radius: 12px;
      white-space: pre-line;
    }
    
    .footer {
      text-align: center;
      padding: 24px;
      color: #94a3b8;
      font-size: 12px;
    }
    
    .footer .logo {
      font-family: 'Comfortaa', cursive;
      font-weight: 700;
      color: #7732A6;
      font-size: 16px;
      margin-bottom: 8px;
    }
    
    @media print {
      body { background: white; }
      .container { padding: 20px; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Relatório de Evolução Vocal</h1>
      <p class="subtitle">Análise detalhada do progresso na aula</p>
      <div class="meta">
        <div class="meta-item">
          <span>👤</span>
          <span><strong>Aluno:</strong> ${studentName}</span>
        </div>
        <div class="meta-item">
          <span>🎤</span>
          <span><strong>Professor:</strong> ${instructorName}</span>
        </div>
        <div class="meta-item">
          <span>📅</span>
          <span>${classDate}</span>
        </div>
      </div>
    </div>
    
    <div class="scores">
      <div class="score-card structure">
        <p class="label">Estrutura</p>
        <p class="value">${structure?.finalGrade?.toFixed(1) || '—'}</p>
      </div>
      <div class="score-card modeling">
        <p class="label">Modelagem</p>
        <p class="value">${modeling?.finalGrade?.toFixed(1) || '—'}</p>
      </div>
      <div class="score-card expression">
        <p class="label">Expressão</p>
        <p class="value">${expression?.finalGrade?.toFixed(1) || '—'}</p>
      </div>
    </div>
    
    <div class="section">
      <h2>Análise Técnica</h2>
      <p>${report.technicalAnalysis || 'Sem análise técnica registrada.'}</p>
    </div>
    
    <div class="section">
      <h2>Observações do Aluno</h2>
      <p>${report.studentObservations || 'Sem observações registradas.'}</p>
    </div>
    
    <div class="section">
      <h2>Lição de Casa</h2>
      <p>${report.homework || 'Sem lição de casa definida.'}</p>
    </div>
    
    <div class="action-section">
      <h2>🎯 Plano de Ação para a Próxima Aula</h2>
      <p>${report.nextFocusAreas || 'Sem plano de ação definido.'}</p>
    </div>
    
    <div class="footer">
      <p class="logo">🎤 Universo de Cantores</p>
      <p>Este relatório foi gerado automaticamente pelo sistema.<br>www.universodecantores.com.br</p>
    </div>
  </div>
</body>
</html>`;

    return new NextResponse(htmlContent, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      }
    });

  } catch (error) {
    console.error("Erro ao gerar relatório:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
