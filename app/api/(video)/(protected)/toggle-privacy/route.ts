import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";
import { error } from "console";

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

    if (updatedVideo.isPublic !== req.isPublic) {
      return NextResponse.json(
        { error: "Can't toggle privacy" },
        { status: 500 }
      );
    }

    return NextResponse.json({ status: 200 });
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
