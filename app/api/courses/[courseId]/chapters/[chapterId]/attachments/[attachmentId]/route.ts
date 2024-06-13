import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { routeErrorHandler } from "@/core/error/error-hander";
import { MainAuthService } from "@/core/business/auth/main-service";
import { authMainService } from "@/core/business/auth";
import { ApiError } from "@/core/error/api-error";

export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string, chapterId: string; attachmentId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const courseOwner = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId: userId
      }
    });

    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const chapter = await db.chapter.findUnique({
      where: {
        id: params.chapterId,
        courseId: params.courseId
      }
    })

    if(!chapter) {
      return new NextResponse("Chapter not found", { status: 404 });
    }

    const attachment = await db.attachment.delete({
      where: {
        chapterId: params.courseId,
        id: params.attachmentId,
      }
    });

    return NextResponse.json(attachment);
  } catch (error) {
    console.log("ATTACHMENT_ID", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export const PATCH = routeErrorHandler(async (
  req: Request,
  { params }: { params: { courseId: string, chapterId: string; attachmentId: string } }
) => {
  const { userId } = await authMainService.getAuthContext({});

  if (!userId) {
    throw new ApiError({
      statusCode: 401,
      message: "Unauthorized",
    })
  }

  const courseOwner = await db.course.findUnique({
    where: {
      id: params.courseId,
      userId: userId
    }
  });

  if (!courseOwner) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const chapter = await db.chapter.findUnique({
    where: {
      id: params.chapterId,
      courseId: params.courseId
    }
  })

  if(!chapter) {
    return new NextResponse("Chapter not found", { status: 404 });
  }

  const { name } = await req.json();
  await db.attachment.update({
    where: {
      chapterId: params.chapterId,
      id: params.attachmentId,
    },
    data: {
      name
    }
  });

  return NextResponse.json({ success: true });
})