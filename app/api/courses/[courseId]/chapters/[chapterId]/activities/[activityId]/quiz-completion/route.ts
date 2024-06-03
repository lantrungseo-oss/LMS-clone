import { authMainService } from "@/core/business/auth";
import { ApiError } from "@/core/error/api-error";
import { routeErrorHandler } from "@/core/error/error-hander";
import { db } from "@/lib/db";
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

    const { isCompleted, quizData } = await req.json();

    const updatedData = await db.userProgress.upsert({
      where: {
        userId_activityId: {
          userId,
          activityId: params.activityId
        }
      },
      create: {
        userId,
        activityId: params.activityId,
        completedAt: isCompleted ? new Date() : null,
        quizAttemptData: quizData
      },
      update: {
        completedAt: isCompleted ? new Date() : null,
        quizAttemptData: quizData
      }
    })
    
    return NextResponse.json(updatedData);
  }
)