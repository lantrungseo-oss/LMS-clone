import { authMainService } from "@/core/business/auth";
import { learningMainService } from "@/core/business/learning";
import { ApiError } from "@/core/error/api-error";
import { routeErrorHandler } from "@/core/error/error-hander";
import { NextResponse } from "next/server";


export const POST = routeErrorHandler(
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

    const { isCompleted } = await req.json();

    const res = await learningMainService.updateLearningCompletionStatus(params.activityId, userId, isCompleted);
    
    return NextResponse.json(res);
  }
)