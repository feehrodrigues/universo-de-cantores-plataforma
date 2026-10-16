/**
 * Email Service (Brevo REST)
 * Handles transactional email templates and sending via Brevo API
 */

// Email templates
export const emailTemplates = {
  // Password Reset
  passwordReset: (data: {
    userName: string;
    resetLink: string;
    expiresIn: string;
  }) => ({
    subject: `🔐 Redefinição de Senha - Universo de Cantores`,
    text: `
Olá ${data.userName}!

Você solicitou a redefinição da sua senha.

Clique no link abaixo para criar uma nova senha:
${data.resetLink}

Este link expira em ${data.expiresIn}.

Se você não solicitou esta alteração, ignore este email.

Universo de Cantores
    `,
    html: `
<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
  <div style="background: linear-gradient(135deg, #7732A6 0%, #5B21B6 100%); padding: 40px 30px; text-align: center; border-radius: 16px 16px 0 0;">
    <h1 style="color: #ffffff; margin: 0; font-size: 28px;">🔐 Redefinição de Senha</h1>
  </div>
  
  <div style="padding: 40px 30px;">
    <p style="font-size: 16px; color: #374151;">Olá <strong>${data.userName}</strong>!</p>
    <p style="font-size: 16px; color: #374151;">Você solicitou a redefinição da sua senha no Universo de Cantores.</p>
    
    <div style="text-align: center; margin: 32px 0;">
      <a href="${data.resetLink}" style="display: inline-block; background: linear-gradient(135deg, #7732A6 0%, #5B21B6 100%); color: #ffffff; padding: 16px 40px; font-size: 16px; font-weight: bold; text-decoration: none; border-radius: 50px; box-shadow: 0 4px 15px rgba(119, 50, 166, 0.3);">
        Redefinir Minha Senha
      </a>
    </div>
    
    <p style="font-size: 14px; color: #6B7280; text-align: center;">
      Este link expira em <strong>${data.expiresIn}</strong>.
    </p>
    
    <div style="background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 16px; margin: 24px 0; border-radius: 8px;">
      <p style="font-size: 14px; color: #92400E; margin: 0;">
        ⚠️ Se você não solicitou esta alteração, ignore este email. Sua senha permanecerá a mesma.
      </p>
    </div>
  </div>
  
  <div style="background: #F3F4F6; padding: 24px 30px; text-align: center; border-radius: 0 0 16px 16px;">
    <p style="font-size: 12px; color: #9CA3AF; margin: 0;">
      Universo de Cantores © ${new Date().getFullYear()}
    </p>
  </div>
</div>
    `,
  }),

  // Payment Confirmations
  paymentInitiated: (data: {
    studentName: string;
    planName: string;
    amount: string;
    deadline: string;
  }) => ({
    subject: `💳 Pagamento PIX - ${data.planName}`,
    text: `
Olá ${data.studentName}!

Seu pagamento foi iniciado.

Plano: ${data.planName}
Valor: ${data.amount}
Vence em: ${data.deadline}

Escaneie o código PIX com seu banco para pagar.

Obrigado!
    `,
    html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h1 style="color: #667eea;">Pagamento Iniciado</h1>
  <p>Olá ${data.studentName}!</p>
  
  <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <p><strong>Plano:</strong> ${data.planName}</p>
    <p style="font-size: 24px; color: #667eea;"><strong>${data.amount}</strong></p>
    <p><strong>Vence em:</strong> ${data.deadline}</p>
  </div>
  
  <p>Escaneie o código PIX com seu banco para pagar.</p>
  <p style="color: #666; margin-top: 30px; font-size: 12px;">
    Universidade de Cantores © 2026
  </p>
</div>
    `,
  }),

  paymentConfirmed: (data: {
    studentName: string;
    planName: string;
    amount: string;
    lessonsCredit: number;
  }) => ({
    subject: `✅ Pagamento Confirmado - ${data.planName}`,
    text: `
Olá ${data.studentName}!

Seu pagamento foi confirmado com sucesso!

Plano: ${data.planName}
Valor: ${data.amount}
Crédito de Aulas: ${data.lessonsCredit}

Você já pode acessar suas aulas no dashboard.

Obrigado!
    `,
    html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h1 style="color: #10b981;">✅ Pagamento Confirmado!</h1>
  <p>Olá ${data.studentName}!</p>
  
  <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <p><strong>Plano:</strong> ${data.planName}</p>
    <p><strong>Valor:</strong> ${data.amount}</p>
    <p style="font-size: 18px; color: #10b981;"><strong>Crédito de ${data.lessonsCredit} aulas</strong></p>
  </div>
  
  <p>Você já pode acessar suas aulas no <a href="https://universodecantores.com/dashboard" style="color: #667eea;">dashboard</a>.</p>
  <p style="color: #666; margin-top: 30px; font-size: 12px;">
    Universidade de Cantores © 2026
  </p>
</div>
    `,
  }),

  // Class Notifications
  classReminder: (data: {
    studentName: string;
    instructorName: string;
    classDate: string;
    classTime: string;
    classLink?: string;
  }) => ({
    subject: `⏰ Lembrete: Aula com ${data.instructorName}`,
    text: `
Olá ${data.studentName}!

Você tem uma aula amanhã!

Professor/a: ${data.instructorName}
Data: ${data.classDate}
Horário: ${data.classTime}

${data.classLink ? `Link da aula: ${data.classLink}` : ''}

Até lá!
    `,
    html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h1 style="color: #f59e0b;">⏰ Lembrete de Aula</h1>
  <p>Olá ${data.studentName}!</p>
  
  <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <p><strong>Professor/a:</strong> ${data.instructorName}</p>
    <p><strong>Data:</strong> ${data.classDate}</p>
    <p><strong>Horário:</strong> ${data.classTime}</p>
  </div>
  
  ${data.classLink ? `<p><a href="${data.classLink}" style="background: #667eea; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none;">Entrar na Aula</a></p>` : ''}
  
  <p style="color: #666; margin-top: 30px; font-size: 12px;">
    Universidade de Cantores © 2026
  </p>
</div>
    `,
  }),

  reportAvailable: (data: {
    studentName: string;
    reportUrl?: string;
  }) => ({
    subject: '📊 Seu Relatório de Aula Está Pronto',
    text: `
Olá ${data.studentName}!

Seu relatório de aula foi concluído e está pronto para visualizar.

${data.reportUrl ? `Acesse aqui: ${data.reportUrl}` : 'Acesse seu dashboard para visualizar.'}

Obrigado!
    `,
    html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h1 style="color: #8b5cf6;">📊 Relatório Pronto</h1>
  <p>Olá ${data.studentName}!</p>
  
  <p>Seu relatório de aula foi concluído e está pronto para visualizar.</p>
  
  <div style="background: #ede9fe; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
    ${data.reportUrl ? `<a href="${data.reportUrl}" style="background: #8b5cf6; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none;">Ver Relatório</a>` : '<p>Acesse seu dashboard para visualizar.</p>'}
  </div>
  
  <p style="color: #666; margin-top: 30px; font-size: 12px;">
    Universidade de Cantores © 2026
  </p>
</div>
    `,
  }),

  studentEnrolled: (data: {
    teacherName: string;
    studentName: string;
    className: string;
    classDate: string;
  }) => ({
    subject: `👤 Novo Aluno: ${data.studentName}`,
    text: `
Olá ${data.teacherName}!

Você tem um novo aluno!

Aluno: ${data.studentName}
Aula: ${data.className}
Data: ${data.classDate}

Bem-vindo ao seu novo student!
    `,
    html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h1 style="color: #06b6d4;">👤 Novo Aluno!</h1>
  <p>Olá ${data.teacherName}!</p>
  
  <div style="background: #ecf0f1; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <p><strong>Aluno:</strong> ${data.studentName}</p>
    <p><strong>Aula:</strong> ${data.className}</p>
    <p><strong>Data:</strong> ${data.classDate}</p>
  </div>
  
  <p style="color: #666; margin-top: 30px; font-size: 12px;">
    Universidade de Cantores © 2026
  </p>
</div>
    `,
  }),

  paymentReceived: (data: {
    teacherName: string;
    amount: string;
    period: string;
  }) => ({
    subject: `💰 Comissão Recebida - ${data.period}`,
    text: `
Olá ${data.teacherName}!

Sua comissão foi creditada!

Período: ${data.period}
Valor: ${data.amount}

Obrigado por fazer parte da nossa plataforma!
    `,
    html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h1 style="color: #10b981;">💰 Comissão Creditada</h1>
  <p>Olá ${data.teacherName}!</p>
  
  <div style="background: #d1fae5; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <p><strong>Período:</strong> ${data.period}</p>
    <p style="font-size: 24px; color: #10b981;"><strong>${data.amount}</strong></p>
  </div>
  
  <p>Obrigado por fazer parte da nossa plataforma!</p>
  <p style="color: #666; margin-top: 30px; font-size: 12px;">
    Universidade de Cantores © 2026
  </p>
</div>
    `,
  }),
};

// Send email via Brevo API
async function sendViaBrevoAPI(
  to: string,
  subject: string,
  html: string,
  text?: string
): Promise<boolean> {
  try {
    const apiKey = process.env.BREVO_API_KEY;
    const senderEmail = process.env.BREVO_SENDER_EMAIL || 'noreply@universodecantores.com.br';
    const senderName = process.env.BREVO_FROM_NAME || 'Universo de Cantores';

    if (!apiKey) {
      console.error('BREVO_API_KEY not configured');
      return false;
    }

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: {
          name: senderName,
          email: senderEmail,
        },
        to: [
          {
            email: to,
            name: to.split('@')[0],
          },
        ],
        subject: subject,
        htmlContent: html,
        textContent: text || subject,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => null);
      console.error('Brevo API error:', error);
      return false;
    }

    console.log(`Email sent via Brevo API to ${to}: ${subject}`);
    return true;
  } catch (error) {
    console.error(`Failed to send email via Brevo API:`, error);
    return false;
  }
}

/**
 * Send email (chooses provider)
 */
export async function sendEmail(
  to: string,
  subject: string,
  html: string,
  text?: string
): Promise<boolean> {
  try {
    const provider = process.env.EMAIL_PROVIDER || 'brevo';

    if (provider === 'brevo') {
      return await sendViaBrevoAPI(to, subject, html, text);
    }

    // Other providers not implemented here; fallback to Brevo
    console.warn(`Email provider ${provider} not implemented; falling back to Brevo`);
    return await sendViaBrevoAPI(to, subject, html, text);
  } catch (error) {
    console.error(`Failed to send email to ${to}:`, error);
    return false;
  }
}

/**
 * Send templated email
 */
export async function sendTemplateEmail(
  to: string,
  templateName: keyof typeof emailTemplates,
  data: any
): Promise<boolean> {
  try {
    const template = emailTemplates[templateName];
    if (!template) {
      console.error(`Template not found: ${templateName}`);
      return false;
    }

    const email = template(data);
    return sendEmail(to, email.subject, email.html, email.text);
  } catch (error) {
    console.error(`Failed to send template email:`, error);
    return false;
  }
}

/**
 * Queue email for later sending
 * Useful for avoiding delays in request/response cycle
 */
export async function queueEmail(
  to: string,
  subject: string,
  html: string
): Promise<void> {
  // In production, this would queue to a job queue like Redis/Bull
  // For now, send immediately
  // TODO: Implement job queue for async email sending
  await sendEmail(to, subject, html);
}
