import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // Pegar o secret do webhook
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    // Webhook não configurado - isso é OK, não é obrigatório
    console.log("Clerk webhook not configured - skipping");
    return NextResponse.json({ message: "Webhook not configured" }, { status: 200 });
  }

  // Pegar os headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // Se não tem headers, retornar erro
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json({ error: "Missing svix headers" }, { status: 400 });
  }

  // Pegar o body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Criar instância do Svix
  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return NextResponse.json({ error: "Error verifying webhook" }, { status: 400 });
  }

  // Processar eventos
  const eventType = evt.type;

  if (eventType === "user.created") {
    const { id, email_addresses, first_name, last_name, image_url, unsafe_metadata } = evt.data;
    
    const email = email_addresses[0]?.email_address;
    if (!email) {
      return NextResponse.json({ error: "No email found" }, { status: 400 });
    }

    // Criar usuário no Prisma
    try {
      // Verificar se já existe
      const existingUser = await prisma.user.findUnique({ where: { email } });
      
      if (!existingUser) {
        await prisma.user.create({
          data: {
            id: id,
            email: email,
            name: first_name ? `${first_name} ${last_name || ""}`.trim() : "Usuário",
            image: image_url,
          },
        });
        
        // Criar perfil de estudante básico
        const onboardingData = unsafe_metadata as any;
        await prisma.studentProfile.create({
          data: {
            userId: id,
            generalGoal: onboardingData?.voicePart 
              ? JSON.stringify({ voicePart: onboardingData.voicePart, experience: onboardingData.experience, goals: onboardingData.goals })
              : null,
            vocalHistory: onboardingData?.voicePart 
              ? `Naipe: ${onboardingData.voicePart}, Experiência: ${onboardingData.experience || 'não informado'}`
              : null,
          },
        });

        console.log(`User created: ${email}`);
      }
    } catch (error) {
      console.error("Error creating user:", error);
      // Se já existe, não é erro crítico
    }
  }

  if (eventType === "user.updated") {
    const { id, email_addresses, first_name, last_name, image_url, unsafe_metadata } = evt.data;
    
    const email = email_addresses[0]?.email_address;
    
    try {
      await prisma.user.update({
        where: { id: id },
        data: {
          email: email,
          name: first_name ? `${first_name} ${last_name || ""}`.trim() : undefined,
          image: image_url,
        },
      });

      // Atualizar perfil se tiver dados de onboarding
      const onboardingData = unsafe_metadata as any;
      if (onboardingData && onboardingData.onboardingComplete) {
        await prisma.studentProfile.upsert({
          where: { userId: id },
          update: {
            generalGoal: JSON.stringify({ 
              voicePart: onboardingData.voicePart, 
              experience: onboardingData.experience, 
              goals: onboardingData.goals 
            }),
            vocalHistory: `Naipe: ${onboardingData.voicePart}, Experiência: ${onboardingData.experience}`,
          },
          create: {
            userId: id,
            generalGoal: JSON.stringify({ 
              voicePart: onboardingData.voicePart, 
              experience: onboardingData.experience, 
              goals: onboardingData.goals 
            }),
            vocalHistory: `Naipe: ${onboardingData.voicePart}, Experiência: ${onboardingData.experience}`,
          },
        });
      }

      console.log(`User updated: ${email}`);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  }

  if (eventType === "user.deleted") {
    const { id } = evt.data;
    
    try {
      // Prisma vai deletar em cascata (StudentProfile, etc)
      await prisma.user.delete({
        where: { id: id },
      });
      console.log(`User deleted: ${id}`);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  }

  return NextResponse.json({ success: true });
}
