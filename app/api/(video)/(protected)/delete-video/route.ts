import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { log } from "console";

const prisma = new PrismaClient();

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function DELETE(request: NextRequest) {
  try {
    const { userId } = auth();
    const { public_id, videoId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!public_id) {
      return NextResponse.json({ error: "Missing public_id" }, { status: 400 });
    }

    if (
      !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      return NextResponse.json(
        { error: "Cloudinary credentials not found" },
        { status: 500 }
      );
    }

    const video = await prisma.video.findUnique({
      where: {
        id: videoId,
      },
    });

    if (!video || video.userId !== userId) {
      return NextResponse.json(
        { error: "Forbidden or video not found" },
        { status: 403 }
      );
    }

    await cloudinary.api.delete_resources(public_id, {
      type: "upload",
      resource_type: "video",
    });

    const response = await prisma.video.delete({
      where: {
        id: videoId,
      },
    });

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.log("Error uploading video :", error);
    return NextResponse.json(
      { error: "Error uploading video" },
      { status: 500 }
    );
  }
}
