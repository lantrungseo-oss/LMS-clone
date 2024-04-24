import { mainCourseAdapter } from "@/core/adapters/course";
import { LearningMainService } from "./main-service";

export const learningMainService = new LearningMainService(
  mainCourseAdapter
)