import { authMainService } from "@/core/business/auth";
import { recommendLearningPath } from "@/core/business/learning-path/recommendation";
import { ApiError } from "@/core/error/api-error";
import { routeErrorHandler } from "@/core/error/error-hander";
import { NextRequest, NextResponse } from "next/server";

export const POST = routeErrorHandler(async (req: NextRequest) => {
  const { userId } = await authMainService.getAuthContext({});
  if(!userId) {
    throw new ApiError({
      message: "Unauthorized",
      statusCode: 401
    })
  }

  const { userQuery } = await req.json();

  const result = await recommendLearningPath(userQuery);

  return NextResponse.json(result);
})