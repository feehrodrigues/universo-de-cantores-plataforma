import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getAuthSession();
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { studentProfile: true },
    });

    if (!user?.studentProfile) {
      return NextResponse.json({ error: "Student profile not found" }, { status: 404 });
    }

    const classes = await prisma.class.findMany({
      where: {
        students: {
          some: { id: user.id },
        },
      },
      orderBy: { scheduledAt: "desc" },
      include: {
        instructor: true,
        report: true,
      },
    });

    return NextResponse.json(classes);
  } catch (error) {
    console.error("Classes error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
