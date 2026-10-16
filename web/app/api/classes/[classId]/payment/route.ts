import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, { params }: { params: Promise<{ classId: string }> }) {
  const { classId } = await params;
  const { paymentStatus, purchaseId } = await req.json();
  const data: any = {};
  if (paymentStatus) data.paymentStatus = paymentStatus;
  if (purchaseId) data.purchase = { connect: { id: purchaseId } };
  const updated = await prisma.class.update({
    where: { id: classId },
    data,
  });
  return NextResponse.json(updated);
}