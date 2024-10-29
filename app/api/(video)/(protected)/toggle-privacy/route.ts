import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();
    const req = await request.json();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const video = await prisma.video.findUnique({
      where: {
        id: req.videoId,
      },
    });

    if (!video || video.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updatedVideo = await prisma.video.update({
      where: { id: req.videoId },
      data: { isPublic: req.isPublic },
    });

    return NextResponse.json(updatedVideo, { status: 200 });
  } catch (error) {
    console.error("Error toggling privacy:", error);
    return NextResponse.json(
      { error: "Error toggling privacy" },
      { status: 500 }
    );
  } finally {
    prisma.$disconnect();
  }
}
