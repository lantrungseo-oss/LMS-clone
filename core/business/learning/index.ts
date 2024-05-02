import { mainCourseAdapter } from "@/core/adapters/course";
import { LearningMainService } from "./main-service";
import { mainChapterAdapter } from "@/core/adapters/chapter";
import { mainActivityAdapter } from "@/core/adapters/activity";
import { authMainService } from '@/core/business/auth'
import { mainPurchaseAdapter } from "@/core/adapters/purchase";

export const learningMainService = new LearningMainService(
  mainCourseAdapter,
  mainChapterAdapter,
  mainActivityAdapter,
  mainPurchaseAdapter,
  authMainService
)