import Mux from "@mux/mux-node";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { authMainService } from "@/core/business/auth";
import { ApiError } from "@/core/error/api-error";
import { mainActivityService } from "@/core/business/activity";
import { routeErrorHandler } from "@/core/error/error-hander";


export const POST = routeErrorHandler(
  async (
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

    const res = await mainActivityService.createActivity({
      userId,
      courseId: params.courseId,
      chapterId: params.chapterId,
      ...data,
    })
    
    return NextResponse.json(res);
  }
)