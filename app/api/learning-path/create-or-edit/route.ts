import { authMainService } from "@/core/business/auth";
import { createLearningPath } from "@/core/business/learning-path/manager";
import { ApiError } from "@/core/error/api-error";
import { routeErrorHandler } from "@/core/error/error-hander";
import { NextRequest, NextResponse } from "next/server";

export const POST = routeErrorHandler(async (req: NextRequest, res: NextResponse) => {
  const { userId } = await authMainService.getAuthContext({});
  if(!userId) {
    throw new ApiError({
      message: "Unauthorized",
      statusCode: 401
    })
  }

  const { title, steps } = await req.json();

  const result = await createLearningPath({ title, userId, steps });

  return NextResponse.json(result);
})