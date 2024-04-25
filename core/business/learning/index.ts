import { mainCourseAdapter } from "@/core/adapters/course";
import { LearningMainService } from "./main-service";
import { mainChapterAdapter } from "@/core/adapters/chapter";
import { mainActivityAdapter } from "@/core/adapters/activity";

export const learningMainService = new LearningMainService(
  mainCourseAdapter,
  mainChapterAdapter,
  mainActivityAdapter
)