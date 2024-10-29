import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export const dynamic = "force-dynamic";
const prisma = new PrismaClient();

export async function GET() {
  try {
    const videos = await prisma.video.findMany({
      where: {
        isPublic: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(videos);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Error fetching videos",
      },
      { status: 500 }
    );
  } finally {
    prisma.$disconnect();
  }
}
