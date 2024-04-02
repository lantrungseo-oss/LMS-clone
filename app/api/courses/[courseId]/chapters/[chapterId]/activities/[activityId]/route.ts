import { mainActivityService } from "@/core/business/activity";
import { authMainService } from "@/core/business/auth";
import { ApiError } from "@/core/error/api-error";
import { routeErrorHandler } from "@/core/error/error-hander";
import { NextResponse } from "next/server";


export const PATCH = routeErrorHandler(
  async (
    req: Request,
    { params }: { params: { courseId: string; chapterId: string; activityId: string; } }
  ) => {
    const { userId } = await authMainService.getAuthContext({});

    if (!userId) {
      throw new ApiError({
        statusCode: 401,
        message: "Unauthorized",
      })
    }

    const data: any = await req.json();

    const res = await mainActivityService.editActivity({
      activityId: params.activityId,
      userId,
      courseId: params.courseId,
      chapterId: params.chapterId,
      data
    })
    
    return NextResponse.json(res);
  }
)

export const DELETE = routeErrorHandler(
  async (
    req: Request,
    { params }: { params: { courseId: string; chapterId: string; activityId: string; } }
  ) => {
    const { userId } = await authMainService.getAuthContext({});

    if (!userId) {
      throw new ApiError({
        statusCode: 401,
        message: "Unauthorized",
      })
    }

    const res = await mainActivityService.deleteActivity({
      activityId: params.activityId,
      userId,
      courseId: params.courseId,
      chapterId: params.chapterId,
    })
    
    return NextResponse.json(res);
  }
)