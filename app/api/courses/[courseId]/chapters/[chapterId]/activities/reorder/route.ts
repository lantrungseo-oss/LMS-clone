import { mainActivityService } from "@/core/business/activity";
import { authMainService } from "@/core/business/auth";
import { ApiError } from "@/core/error/api-error";
import { routeErrorHandler } from "@/core/error/error-hander";
import { NextResponse } from "next/server";

export const PUT = routeErrorHandler(async (
  req: Request,
  { params }: { params: { courseId: string; chapterId: string; } }
) => {
  const { userId } = await authMainService.getAuthContext({});
  const data = await req.json();

  if (!userId) {
    throw new ApiError({
      statusCode: 401,
      message: "Unauthorized",
    })
  }

  const res = await mainActivityService.reOrderActivities({
    userId,
    courseId: params.courseId,
    chapterId: params.chapterId,
    ...data,
  })
  
  return NextResponse.json(res);
})