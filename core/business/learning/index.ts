import { mainCourseAdapter } from "@/core/adapters/course";
import { LearningMainService } from "./main-service";
import { mainChapterAdapter } from "@/core/adapters/chapter";
import { mainActivityAdapter } from "@/core/adapters/activity";
import { authMainService } from '@/core/business/auth'
import { mainPurchaseAdapter } from "@/core/adapters/purchase";
import { CourseAccessGuard } from "./access-guard";
import { mainUserProgressRepo } from "@/core/adapters/user-progress";

const courseAccessGuard = new CourseAccessGuard(
  mainCourseAdapter,
  mainPurchaseAdapter,
  authMainService
)

export const learningMainService = new LearningMainService(
  mainCourseAdapter,
  mainChapterAdapter,
  mainActivityAdapter,
  courseAccessGuard,
  mainUserProgressRepo,
)