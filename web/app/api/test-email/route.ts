import { sendTemplateEmail } from '@/lib/email';
import { NextResponse } from 'next/server';

/**
 * GET /api/test-email
 * Test email sending with Brevo
 * 
 * Usage: Visit http://localhost:3000/api/test-email in your browser
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const testEmail = searchParams.get('email') || 'seu-email@gmail.com';

    console.log(`Testing email to: ${testEmail}`);

    // Send a test payment initiated email
    const success = await sendTemplateEmail(testEmail, 'paymentInitiated', {
      studentName: 'Teste de Email',
      planName: 'Plano Mensal',
      amount: 'R$ 160,00',
      deadline: new Date(Date.now() + 10 * 60 * 1000).toLocaleString('pt-BR'),
    });

    if (success) {
      return NextResponse.json({
        success: true,
        message: `✅ Email enviado com sucesso para ${testEmail}!`,
        instructions: 'Verifique seu email (inclusive pasta de SPAM)',
        testConfig: {
          provider: process.env.EMAIL_PROVIDER,
          fromEmail: process.env.BREVO_FROM_EMAIL,
          fromName: process.env.BREVO_FROM_NAME,
        },
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: 'Falha ao enviar email. Verifique os logs do servidor.',
          debug: {
            provider: process.env.EMAIL_PROVIDER,
            hasApiKey: !!process.env.BREVO_API_KEY,
            senderEmail: process.env.BREVO_SENDER_EMAIL,
            apiEndpoint: 'https://api.brevo.com/v3/smtp/email (REST API)',
          },
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Test email error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
