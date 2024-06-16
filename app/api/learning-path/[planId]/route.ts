import { authMainService } from "@/core/business/auth";
import { ApiError } from "@/core/error/api-error";
import { routeErrorHandler } from "@/core/error/error-hander";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = routeErrorHandler(async (req: NextRequest, { params }: { params: { planId: string } }) => {
  const { userId } = await authMainService.getAuthContext({});
  if(!userId) {
    throw new ApiError({
      message: "Unauthorized",
      statusCode: 401
    })
  }

  await db.$transaction([
    db.learningPlan.delete({
      where: {
        id: params.planId,
        userId
      }
    }),
    db.learningPlanStep.deleteMany({
      where: {
        learningPlanId: params.planId
      }
    }),
    db.learningPlanStepCourse.deleteMany({
      where: {
        learningPlanStep: {
          learningPlanId: params.planId
        }
      }
    })
  ])

  return NextResponse.json({ success: true });

})